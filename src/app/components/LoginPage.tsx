import { useState, useEffect } from 'react';
import { LogIn, AlertCircle, Loader, Eye, EyeOff, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';

interface User {
  id: number;
  userid: number;
  useridstring: string;
  username: string;
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
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
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
      // Fetch users from the API
      const response = await fetch('https://api242.onrender.com/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users from the API');
      }

   
      const users: User[] = await response.json();
      console.log("Users:", users);
      // Find matching user
      const user = users.find(
        (u) => u.username === username && u.plainpassword === password
      );

      if (user) {
        // Successful login - save specific user fields
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('currentUser', JSON.stringify({
          uid: user.userid,
          username: user.username,
          email: user.email,
          role: user.role
        }));
        
        // Dispatch event for sidebar to update
        window.dispatchEvent(new Event('loginStatusChanged'));
        
        setIsLoggedIn(true);
        // Redirect to home page after successful login
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to authentication server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentProject');
    window.dispatchEvent(new Event('loginStatusChanged'));
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
            <p className="text-gray-600">Access Fusion Project Manager 26.02</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
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
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Login credentials are validated against the API at<br />
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">https://api242.onrender.com/users</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}