import { useState, useEffect } from 'react';
import { LogIn, AlertCircle, Loader, Eye, EyeOff, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { loadGuestConfiguration } from '../utils/guestConfig';
import { sendLoginLog } from '../utils/loginLog';
import { ensurePublicProject } from '../utils/publicProjectHelper';
import { getGlobalProjectId } from '../utils/installationConfig';

interface User {
  _id?: string;
  id?: number;
  userid: number;
  useridstring: string;
  username: string;
  password: string;
  plainpassword: string;
  firstname?: string;
  lastname?: string;
  fullname?: string;
  displayname?: string;
  email?: string;
  created_at?: string;
  defaultinstanceid?: string;
  defaultshardid?: string;
  role?: string;
  publicprojectid?: string;
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localOnly, setLocalOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    if (savedLoginStatus && JSON.parse(savedLoginStatus)) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if ((username === 'john' && password === 'john') || (username === 'portia' && password === 'portia')) {
        console.log('✅ User authenticated via hardcoded credentials:', username);
        
        const hardcodedUser = {
          _id: username === 'john' ? 'local_user_001' : 'local_user_002',
          userid: username === 'john' ? 1 : 2,
          useridstring: username === 'john' ? 'USR001' : 'USR002',
          username: username,
          email: username === 'john' ? 'john@example.com' : 'portia@example.com',
          role: 'superuser',
          firstname: username === 'john' ? 'John' : 'Portia',
          lastname: username === 'john' ? 'Doe' : 'Smith',
          fullname: username === 'john' ? 'John Doe' : 'Portia Smith',
          displayname: username === 'john' ? 'John Doe' : 'Portia Smith'
        };
        
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.removeItem('isGuestMode');
        localStorage.setItem('currentUser', JSON.stringify({
          _id: hardcodedUser._id,
          mongoid: hardcodedUser._id,
          uid: hardcodedUser.userid,
          username: hardcodedUser.username,
          email: hardcodedUser.email,
          role: hardcodedUser.role,
          publicprojectid: getGlobalProjectId()
        }));
        
        await sendLoginLog(hardcodedUser.userid, `User ${hardcodedUser.username} logged in (hardcoded)`);
        await ensurePublicProject({
          userid: hardcodedUser.userid,
          username: hardcodedUser.username,
          mongoid: hardcodedUser._id,
          email: hardcodedUser.email
        });

        window.dispatchEvent(new Event('loginStatusChanged'));
        setIsLoggedIn(true);
        setTimeout(() => { navigate('/'); }, 500);
        setLoading(false);
        return;
      }

      console.log('Step 1: Checking local users database...');
      let localAuthSuccess = false;
      
      try {
        const localResponse = await fetch('/data/users.json', {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        console.log('Local users.json response:', localResponse.status);

        if (localResponse.ok) {
          const contentType = localResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn('⚠️ Local users.json returned HTML instead of JSON, skipping');
            throw new Error('Not JSON');
          }
          const localUsers: User[] = await localResponse.json();
          console.log('✓ Local users loaded:', localUsers.length, 'users');
          
          const localUser = localUsers.find(
            (u) => u.username === username && u.plainpassword === password
          );
          
          if (localUser) {
            console.log('✅ User authenticated from local database:', localUser.username);
            const isGuest = localUser.role === 'guest';
            
            localStorage.setItem('isLoggedIn', JSON.stringify(true));
            if (isGuest) {
              localStorage.setItem('isGuestMode', JSON.stringify(true));
            } else {
              localStorage.removeItem('isGuestMode');
            }
            
            localStorage.setItem('currentUser', JSON.stringify({
              _id: localUser._id,
              mongoid: localUser._id,
              uid: localUser.userid,
              username: localUser.username,
              email: localUser.email,
              role: localUser.role,
              publicprojectid: (localUser as any).publicprojectid || getGlobalProjectId()
            }));
            
            await sendLoginLog(localUser.userid, `User ${localUser.username} logged in (local JSON)`);

            if (!isGuest) {
              await ensurePublicProject({
                userid: localUser.userid,
                username: localUser.username,
                mongoid: localUser._id || '',
                email: localUser.email || '',
                projectid: (localUser as any).publicprojectid || undefined
              });
            }

            if (isGuest) {
              await loadGuestConfiguration();
            }

            window.dispatchEvent(new Event('loginStatusChanged'));
            setIsLoggedIn(true);
            localAuthSuccess = true;
            setTimeout(() => { navigate('/'); }, 500);
            setLoading(false);
            return;
          } else {
            console.log('❌ User not found in local database');
          }
        } else {
          console.warn('⚠️ Local users.json returned status:', localResponse.status);
        }
      } catch (localError: any) {
        console.log('ℹ️ Local users.json not available, will try API or hardcoded users');
      }

      if (localAuthSuccess) return;

      if (localOnly) {
        setError('❌ Invalid username or password.\n\n💡 Local login accepts:\n• john/john\n• portia/portia\n• guest/guest');
        setLoading(false);
        return;
      }

      console.log('Step 2: Trying API authentication...');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch('https://api242.onrender.com/', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('✓ API server responded with status:', response.status);

        if (!response.ok) throw new Error(`API returned status ${response.status}`);

        const users: User[] = await response.json();
        console.log('✓ API users fetched successfully:', users.length);

        const user = users.find(
          (u) => u.username === username && u.plainpassword === password
        );

        if (user) {
          console.log('✅ User authenticated from API');
          
          localStorage.setItem('isLoggedIn', JSON.stringify(true));
          localStorage.removeItem('isGuestMode');
          localStorage.setItem('currentUser', JSON.stringify({
            _id: user._id,
            mongoid: user._id,
            uid: user.userid,
            username: user.username,
            email: user.email,
            role: user.role,
            publicprojectid: user.publicprojectid || getGlobalProjectId()
          }));
          
          await sendLoginLog(user.userid, `User ${user.username} logged in (API)`);
          await ensurePublicProject({
            userid: user.userid,
            username: user.username,
            mongoid: user._id || '',
            email: user.email || '',
            projectid: (user as any).publicprojectid || undefined
          });

          window.dispatchEvent(new Event('loginStatusChanged'));
          setIsLoggedIn(true);
          setTimeout(() => { navigate('/'); }, 500);
        } else {
          setError('❌ Invalid username or password.\n\n💡 Try: john/john, portia/portia, or guest/guest');
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        console.log('ℹ️ API server not available:', fetchError.name || fetchError.message);

        if (fetchError.name === 'AbortError') {
          setError('⏱️ API server timeout (may be sleeping on Render free tier).\n\n💡 Use hardcoded credentials:\n• john/john (superuser)\n• portia/portia (superuser)\n• guest/guest (demo mode)');
          return;
        }

        if (fetchError.message === 'Failed to fetch' || fetchError instanceof TypeError) {
          setError('🌐 API server unavailable.\n\n💡 Use hardcoded credentials:\n• john/john (superuser)\n• portia/portia (superuser)\n• guest/guest (demo mode)');
          return;
        }

        throw fetchError;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Invalid username')) {
        console.log('ℹ️ Login error:', err.message);
      }
      setError(err.message || 'Unable to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isGuestMode');
    window.dispatchEvent(new Event('loginStatusChanged'));
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (isLoggedIn) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return (
      <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt] flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">You are currently logged in</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-1">Logged in as:</p>
              <p className="font-semibold text-green-800 text-lg">{currentUser.username || 'User'}</p>
              {currentUser.email && (
                <p className="text-sm text-gray-600 mt-1">{currentUser.email}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt] flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#4CBB17] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">API Login</h1>
            <p className="text-gray-600">Access Fusion Project Manager 2026.7.18</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none mb-4">
            <div
              className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200 flex-shrink-0"
              style={{ backgroundColor: localOnly ? '#4CBB17' : '#D1D5DB' }}
            >
              <div
                className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                style={{ transform: localOnly ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </div>
            <input
              type="checkbox"
              checked={localOnly}
              onChange={(e) => setLocalOnly(e.target.checked)}
              className="sr-only"
            />
            <span className="text-sm text-gray-700">
              Local login only <span className="text-gray-400">(hardcoded users, no API call)</span>
            </span>
          </label>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader className="w-5 h-5 animate-spin" />Authenticating...</>
            ) : (
              <><LogIn className="w-5 h-5" />Login</>
            )}
          </button>

          <div className="mt-3">
            <button
              onClick={() => { setUsername('guest'); setPassword('guest'); setTimeout(() => handleLogin(), 100); }}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              Continue as Guest (Demo Mode)
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link to="/register" className="text-[#4CBB17] hover:text-[#3DA013] font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>💡 Hardcoded Test Users (Always Work):</strong><br />
              <code className="bg-blue-100 px-1.5 py-0.5 rounded">john/john</code> or <code className="bg-blue-100 px-1.5 py-0.5 rounded">portia/portia</code> (superuser)<br />
              <code className="bg-blue-100 px-1.5 py-0.5 rounded">guest/guest</code> (demo mode)
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              <strong>Authentication Flow:</strong><br />
              Hardcoded users → Local JSON → API fallback<br />
              <span className="text-xs opacity-75">API may be sleeping (Render free tier)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
