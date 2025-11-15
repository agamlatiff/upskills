import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../utils/api';
import { CheckCircleIcon, EnvelopeIcon } from '../../components/Icons';
import ProtectedRoute from '../../components/ProtectedRoute';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, checkAuth } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');

  const id = searchParams.get('id');
  const hash = searchParams.get('hash');

  useEffect(() => {
    // If URL has verification parameters, verify the email
    if (id && hash) {
      handleVerifyEmail(id, hash);
    }
  }, [id, hash]);

  const handleVerifyEmail = async (userId: string, hash: string) => {
    setIsVerifying(true);
    setVerificationStatus('verifying');
    
    try {
      // Include all query parameters (signature, expires) for signed URL validation
      const signature = searchParams.get('signature');
      const expires = searchParams.get('expires');
      let url = `/verify-email/${userId}/${hash}`;
      if (signature && expires) {
        url += `?signature=${signature}&expires=${expires}`;
      }
      
      const response = await apiClient.get(url);
      setVerificationStatus('verified');
      setResendMessage(response.data.message || 'Email verified successfully!');
      
      // Update user data with verified status
      if (response.data.user) {
        await checkAuth();
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard?verified=1', { replace: true });
      }, 2000);
    } catch (error: any) {
      setVerificationStatus('error');
      setResendMessage(error.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');
    
    try {
      const response = await apiClient.post('/email/verification-notification');
      setResendMessage(response.data.message || 'Verification link sent! Please check your email.');
    } catch (error: any) {
      setResendMessage(error.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/signin', { replace: true });
  };

  // Check if email is already verified
  const isEmailVerified = user?.email_verified_at !== null && user?.email_verified_at !== undefined;

  if (isVerifying) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-slate-400">Verifying your email...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (verificationStatus === 'verified') {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 border border-green-500/50 rounded-2xl p-8 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
              <p className="text-slate-400 mb-6">{resendMessage}</p>
              <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isEmailVerified) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Email Already Verified</h2>
              <p className="text-slate-400 mb-6">Your email address has already been verified.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <div className="text-center mb-6">
              <EnvelopeIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
              <p className="text-slate-400 text-sm">
                Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
              </p>
            </div>

            {resendMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                resendMessage.includes('sent') || resendMessage.includes('verified')
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                <p className="text-sm">{resendMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
              >
                Log Out
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 text-center">
                Verification email sent to: <span className="text-slate-400 font-medium">{user?.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const VerifyEmailWithProtection: React.FC = () => (
  <ProtectedRoute>
    <VerifyEmail />
  </ProtectedRoute>
);

export default VerifyEmailWithProtection;

