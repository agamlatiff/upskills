import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { EyeIcon, EyeOffIcon } from '../../components/Icons';
import apiClient from '../../utils/api';

const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  password_confirmation: z.string(),
  token: z.string().min(1, { message: "Token is required." }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match.",
  path: ["password_confirmation"],
});

type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
type FormErrors = z.inferFormattedError<typeof ResetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState<ResetPasswordData>({
    email: '',
    password: '',
    password_confirmation: '',
    token: token,
  });
  const [errors, setErrors] = useState<FormErrors | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof ResetPasswordData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (token) {
      setFormData(prev => ({ ...prev, token }));
    }
  }, [token]);

  const validateForm = (data: ResetPasswordData) => {
    const result = ResetPasswordSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.format());
      return false;
    }
    setErrors(null);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    if (touched[name as keyof ResetPasswordData]) {
      validateForm(newFormData);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as { name: keyof ResetPasswordData };
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage('');
    setApiErrors({});
    setIsSubmitting(true);

    setTouched({
      email: true,
      password: true,
      password_confirmation: true,
    });

    const isValid = validateForm(formData);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.post('/reset-password', {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        token: formData.token,
      });

      setSubmitMessage(response.data.message || 'Password reset successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/signin', { replace: true });
      }, 2000);
    } catch (error: any) {
      if (error.errors) {
        setApiErrors(error.errors);
      } else {
        setSubmitMessage(error.message || 'Failed to reset password. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const emailError = touched.email && errors?.email?._errors[0];
  const passwordError = touched.password && errors?.password?._errors[0];
  const confirmPasswordError = touched.password_confirmation && errors?.password_confirmation?._errors[0];

  return (
    <main className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white">Reset Password</h1>
            <p className="mt-4 text-lg text-slate-400">
              Enter your new password below.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jane.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                    emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                  }`}
                  required
                  aria-invalid={!!emailError}
                />
                {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
                {apiErrors.email && apiErrors.email.map((err, idx) => (
                  <p key={idx} className="mt-1 text-xs text-red-400">{err}</p>
                ))}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      passwordError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                    }`}
                    required
                    aria-invalid={!!passwordError}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {passwordError && <p className="mt-2 text-xs text-red-400">{passwordError}</p>}
                {apiErrors.password && apiErrors.password.map((err, idx) => (
                  <p key={idx} className="mt-2 text-xs text-red-400">{err}</p>
                ))}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      confirmPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                    }`}
                    required
                    aria-invalid={!!confirmPasswordError}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPasswordError && <p className="mt-2 text-xs text-red-400">{confirmPasswordError}</p>}
              </div>

              {submitMessage && (
                <div
                  className={`p-4 text-center text-sm rounded-lg ${
                    submitMessage.includes('successfully')
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Remember your password?{' '}
            <Link to="/signin" className="font-semibold text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;

