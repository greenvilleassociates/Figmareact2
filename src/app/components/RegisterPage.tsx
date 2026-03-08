import { useState } from 'react';
import { UserPlus, AlertCircle, Loader, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    plainpassword: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    email: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.plainpassword || !formData.email) {
      setError('Username, password, and email are required');
      return false;
    }

    if (formData.plainpassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.plainpassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate userid and useridstring
      const userid = Math.floor(Math.random() * 1000000);
      const useridstring = `user${userid}`;
      
      // Prepare registration data
      const registrationData = {
        userid: userid,
        useridstring: useridstring,
        username: formData.username,
        plainpassword: formData.plainpassword,
        firstname: formData.firstname || '',
        lastname: formData.lastname || '',
        fullname: `${formData.firstname} ${formData.lastname}`.trim() || formData.username,
        displayname: formData.username,
        email: formData.email,
        role: formData.role,
        defaultinstanceid: '242',
        defaultshardid: '1'
      };

      // POST to API
      const response = await fetch('https://api242.onrender.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      console.log("Registration Response", response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to register user');
      }

      const newUser = await response.json();
      console.log("New User Created", newUser);

      setSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Unable to register. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  if (success) {
    return (
      <div className="flex-1 bg-gray-50 p-12 overflow-auto max-[999px]:text-[9pt] flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
              <p className="text-gray-600">Your account has been created successfully.</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-1">Username:</p>
              <p className="font-semibold text-green-800 text-lg">{formData.username}</p>
              <p className="text-sm text-gray-600 mt-2">Redirecting to login page...</p>
            </div>
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Register</h1>
            <p className="text-gray-600">Create your Fusion Project Manager account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Choose a username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="plainpassword"
                  value={formData.plainpassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                  disabled={loading}
                  required
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full px-6 py-3 bg-[#4CBB17] text-white rounded-lg hover:bg-[#3DA013] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#4CBB17] hover:text-[#3DA013] font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Registration data is posted to the API at<br />
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">https://api242.onrender.com/users</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
