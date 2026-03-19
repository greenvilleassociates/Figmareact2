import { useState } from 'react';
import { UserPlus, Eye, Mail, User, Building2, MessageSquare, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

interface RegistrationForm {
  name: string;
  email: string;
  organization: string;
  projectId: string;
  reason: string;
}

export function VisitorRegisterPage() {
  const [formData, setFormData] = useState<RegistrationForm>({
    name: '',
    email: '',
    organization: '',
    projectId: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof RegistrationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.projectId || !formData.reason) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store in localStorage for now (would be API call in production)
      const registrationData = {
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      const existingRegistrations = localStorage.getItem('visitorRegistrations');
      const registrations = existingRegistrations ? JSON.parse(existingRegistrations) : [];
      registrations.push(registrationData);
      localStorage.setItem('visitorRegistrations', JSON.stringify(registrations));

      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          organization: '',
          projectId: '',
          reason: ''
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-12 py-6">
        <div className="flex items-center gap-4 mb-2">
          <Link 
            to="/"
            className="text-gray-600 hover:text-[#4CBB17] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Request Project Access</h1>
            <p className="text-gray-600">Register for visitor permissions to view a project</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-12">
        <div className="max-w-3xl mx-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">About Visitor Access</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Visitor access provides read-only permissions to view specific project information. 
                  After submitting your request:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                  <li>Project owners will receive your access request</li>
                  <li>You'll be notified via email when approved or denied</li>
                  <li>Approved visitors can view project details but cannot edit</li>
                  <li>Access can be revoked by the project owner at any time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#4CBB17] rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Registration Form</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </div>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Organization (Optional)
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  placeholder="Your company or institution"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent"
                />
              </div>

              {/* Project ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Project ID *
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.projectId}
                  onChange={(e) => handleChange('projectId', e.target.value)}
                  placeholder="8-digit project ID (e.g., 12345678)"
                  required
                  maxLength={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 8-digit project ID you want to access
                </p>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Reason for Access *
                  </div>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  placeholder="Please explain why you need access to this project..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CBB17] focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps project owners understand your request
                </p>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Registration Submitted Successfully!</p>
                    <p className="text-sm text-green-800">
                      The project owner will review your request and contact you via email.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Registration Failed</p>
                    <p className="text-sm text-red-800">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#4CBB17] hover:bg-[#3DA013] text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Submit Registration
                    </>
                  )}
                </button>
                <Link
                  to="/"
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </Link>
              </div>

              <p className="text-xs text-gray-500 text-center">
                * Required fields must be completed to submit your registration
              </p>
            </form>
          </div>

          {/* Additional Help */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-2">
              If you're having trouble finding the project ID or have questions about access levels, 
              please contact the project owner directly or reach out to support.
            </p>
            <p className="text-sm text-gray-600">
              Already have a Fusion Project Manager 26.02 account? 
              <Link to="/login" className="text-[#4CBB17] hover:underline ml-1">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}