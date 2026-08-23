import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { LogIn, Users, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { sendLoginLog } from '../utils/loginLog';
import { ensurePublicProject } from '../utils/publicProjectHelper';
import { getGlobalProjectId } from '../utils/installationConfig';

// ─── Replace these with your actual App IDs ───────────────────────────────────
const GOOGLE_CLIENT_ID = '';   // e.g. '123456789-abc.apps.googleusercontent.com'
const FACEBOOK_APP_ID  = '';   // e.g. '1234567890123456'
// ──────────────────────────────────────────────────────────────────────────────

const API_BASE = 'https://api242.onrender.com';

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

interface SocialUserInfo {
  email: string;
  firstname: string;
  lastname: string;
  displayname: string;
  socialId: string;
  provider: 'google' | 'facebook';
}

interface ApiUser {
  _id?: string;
  userid?: number;
  useridstring?: string;
  username?: string;
  email?: string;
  role?: string;
  publicprojectid?: string;
  [key: string]: any;
}

function decodeJwtPayload(token: string): Record<string, any> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.async = true; s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function checkAndRegisterSocialUser(info: SocialUserInfo): Promise<ApiUser> {
  // 1 — look up existing user by email
  try {
    const listRes = await fetch(`${API_BASE}/`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (listRes.ok) {
      const text = await listRes.text();
      if (!text.trimStart().startsWith('<')) {
        const users: ApiUser[] = JSON.parse(text);
        const existing = users.find(u => u.email === info.email);
        if (existing) {
          console.log('✅ Social user found in API:', existing.username);
          return existing;
        }
      }
    }
  } catch {
    console.log('ℹ️ Could not reach user list — proceeding to signup');
  }

  // 2 — register new account via /auth/signup
  const baseUsername = info.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  const signupPayload = {
    username:      baseUsername,
    email:         info.email,
    firstname:     info.firstname,
    lastname:      info.lastname,
    fullname:      info.displayname,
    displayname:   info.displayname,
    password:      `${info.provider}_${info.socialId}`,
    plainpassword: `${info.provider}_${info.socialId}`,
    role:          'user',
    provider:      info.provider,
    socialid:      info.socialId,
  };

  const signupRes = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signupPayload),
    signal: AbortSignal.timeout(10000),
  });

  if (!signupRes.ok) {
    const errText = await signupRes.text().catch(() => '');
    throw new Error(`Registration failed (${signupRes.status})${errText ? ': ' + errText : ''}`);
  }

  const newUser: ApiUser = await signupRes.json();
  console.log('✅ New social user registered:', newUser.username);
  return newUser;
}

export function SocialLoginPage() {
  const navigate = useNavigate();
  const [error, setError]     = useState('');
  const [status, setStatus]   = useState('');
  const [loading, setLoading] = useState<'google' | 'facebook' | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('isLoggedIn');
    if (saved && JSON.parse(saved)) setIsLoggedIn(true);
  }, []);

  // ── shared post-auth session setup ──────────────────────────────────────────
  const finaliseLogin = useCallback(async (user: ApiUser, provider: 'google' | 'facebook') => {
    const userid   = user.userid ?? 0;
    const username = user.username ?? user.email?.split('@')[0] ?? 'user';
    const mongoid  = user._id ?? '';

    localStorage.setItem('isLoggedIn',   JSON.stringify(true));
    localStorage.removeItem('isGuestMode');
    localStorage.setItem('currentUser', JSON.stringify({
      _id:             mongoid,
      mongoid,
      uid:             userid,
      username,
      email:           user.email ?? '',
      role:            user.role ?? 'user',
      publicprojectid: user.publicprojectid ?? getGlobalProjectId(),
      provider,
    }));

    await sendLoginLog(userid, `User ${username} logged in via ${provider}`);
    await ensurePublicProject({
      userid,
      username,
      mongoid,
      email: user.email ?? '',
      projectid: user.publicprojectid,
    });

    window.dispatchEvent(new Event('loginStatusChanged'));
    setSuccess(true);
    setTimeout(() => navigate('/'), 800);
  }, [navigate]);

  // ── Google ──────────────────────────────────────────────────────────────────
  const handleGoogleLogin = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google login is not yet configured.\nAdd your GOOGLE_CLIENT_ID in SocialLoginPage.tsx.');
      return;
    }
    setError(''); setStatus('Loading Google Sign-In…'); setLoading('google');
    try {
      await loadScript('https://accounts.google.com/gsi/client');

      await new Promise<void>((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id:              GOOGLE_CLIENT_ID,
          use_fedcm_for_prompt:   false,
          callback: async (response: { credential: string }) => {
            try {
              const payload = decodeJwtPayload(response.credential);
              setStatus('Checking account…');
              const info: SocialUserInfo = {
                email:       payload.email        ?? '',
                firstname:   payload.given_name   ?? '',
                lastname:    payload.family_name  ?? '',
                displayname: payload.name         ?? '',
                socialId:    payload.sub          ?? '',
                provider:    'google',
              };
              const user = await checkAndRegisterSocialUser(info);
              await finaliseLogin(user, 'google');
              resolve();
            } catch (err: any) {
              reject(err);
            }
          },
        });
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error('Google sign-in was dismissed or blocked. Try allowing pop-ups.'));
          }
        });
      });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(null);
      setStatus('');
    }
  }, [finaliseLogin]);

  // ── Facebook ─────────────────────────────────────────────────────────────────
  const handleFacebookLogin = useCallback(async () => {
    if (!FACEBOOK_APP_ID) {
      setError('Facebook login is not yet configured.\nAdd your FACEBOOK_APP_ID in SocialLoginPage.tsx.');
      return;
    }
    setError(''); setStatus('Loading Facebook…'); setLoading('facebook');
    try {
      await new Promise<void>((resolve, reject) => {
        window.fbAsyncInit = () => {
          window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: true, version: 'v18.0' });
          window.FB.login((authResponse: any) => {
            if (!authResponse?.authResponse) { reject(new Error('Facebook login cancelled.')); return; }
            setStatus('Fetching profile…');
            window.FB.api('/me', { fields: 'id,name,email,first_name,last_name' }, async (fbUser: any) => {
              try {
                const info: SocialUserInfo = {
                  email:       fbUser.email        ?? '',
                  firstname:   fbUser.first_name   ?? '',
                  lastname:    fbUser.last_name    ?? '',
                  displayname: fbUser.name         ?? '',
                  socialId:    fbUser.id           ?? '',
                  provider:    'facebook',
                };
                setStatus('Checking account…');
                const user = await checkAndRegisterSocialUser(info);
                await finaliseLogin(user, 'facebook');
                resolve();
              } catch (err: any) { reject(err); }
            });
          }, { scope: 'email,public_profile' });
        };
        loadScript('https://connect.facebook.net/en_US/sdk.js').catch(reject);
      });
    } catch (err: any) {
      setError(err.message || 'Facebook sign-in failed.');
    } finally {
      setLoading(null);
      setStatus('');
    }
  }, [finaliseLogin]);

  // ── Already logged in ───────────────────────────────────────────────────────
  if (isLoggedIn) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return (
      <div className="flex-1 bg-gray-50 p-12 overflow-auto flex items-center justify-center">
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
              {currentUser.email && <p className="text-sm text-gray-600 mt-1">{currentUser.email}</p>}
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors font-semibold mb-3"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.setItem('isLoggedIn', JSON.stringify(false));
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isGuestMode');
                window.dispatchEvent(new Event('loginStatusChanged'));
                setIsLoggedIn(false);
              }}
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

          {/* Header — matches LoginPage */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#4CBB17] rounded-full flex items-center justify-center mx-auto mb-4">
              {success
                ? <CheckCircle className="w-8 h-8 text-white" />
                : <Users className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
            <p className="text-gray-600">Access Fusion Project Manager 2026.7.18</p>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 font-medium">Signed in! Redirecting…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Status */}
          {status && !error && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <Loader className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
              <p className="text-sm text-blue-800">{status}</p>
            </div>
          )}

          {/* Unconfigured notice */}
          {!GOOGLE_CLIENT_ID && !FACEBOOK_APP_ID && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 leading-relaxed text-center">
                Social App IDs not yet configured. Add them in{' '}
                <code className="bg-amber-100 px-1 rounded">SocialLoginPage.tsx</code>.
              </p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={!!loading || success}
              className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'google' ? (
                <Loader className="w-5 h-5 animate-spin text-gray-500" />
              ) : (
                <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              {loading === 'google' ? 'Signing in…' : 'Continue with Google'}
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookLogin}
              disabled={!!loading || success}
              className="w-full px-6 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1666d9] transition-colors font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'facebook' ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              )}
              {loading === 'facebook' ? 'Signing in…' : 'Continue with Facebook'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* API Login link */}
          <Link
            to="/api-login"
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            API Login
          </Link>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link to="/register" className="text-[#4CBB17] hover:text-[#3DA013] font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              <strong>Social Login Flow:</strong><br />
              OAuth provider → Check API → Auto-register if new<br />
              <span className="text-xs opacity-75">Accounts are shared across login methods</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
