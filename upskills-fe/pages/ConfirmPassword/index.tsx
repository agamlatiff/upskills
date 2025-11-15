import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../utils/api';
import { EyeIcon, EyeOffIcon, LockClosedIcon } from '../../components/Icons';
import ProtectedRoute from '../../components/ProtectedRoute';
import { z } from 'zod';

const ConfirmPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type ConfirmPasswordData = z.infer<typeof ConfirmPasswordSchema>;
type FormErrors = z.inferFormattedError<typeof ConfirmPasswordSchema>;

const ConfirmPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ConfirmPasswordData>({
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof ConfirmPasswordData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string[] }>({});

  const validateForm = (data: ConfirmPasswordData) => {
    const result = ConfirmPasswordSchema.safeParse(data);
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
    
    if (touched[name as keyof ConfirmPasswordData]) {
      validateForm(newFormData);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as { name: keyof ConfirmPasswordData };
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage('');
    setApiErrors({});
    setIsSubmitting(true);

    setTouched({ password: true });

    const isValid = validateForm(formData);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.post('/confirm-password', {
        password: formData.password,
      });

      setSubmitMessage(response.data.message || 'Password confirmed successfully!');
      
      // Get the intended URL from location state or default to dashboard
      const intended = (location.state as any)?.from?.pathname || '/dashboard';
      
      setTimeout(() => {
        navigate(intended, { replace: true });
      }, 1000);
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.response?.data?.errors) {
        setApiErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setSubmitMessage(error.response.data.message);
      } else {
        setSubmitMessage('Failed to confirm password. Please try again.');
      }
    }
  };

  const passwordError = touched.password && errors?.password?._errors[0];
  const apiPasswordError = apiErrors.password?.[0];

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <div className="text-center mb-6">
              <LockClosedIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Confirm Password</h1>
              <p className="text-slate-400 text-sm">
                This is a secure area of the application. Please confirm your password before continuing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      passwordError || apiPasswordError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-700 focus:ring-blue-500'
                    }`}
                    required
                    autoComplete="current-password"
                    aria-invalid={!!(passwordError || apiPasswordError)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-xs text-red-400">{passwordError}</p>
                )}
                {apiPasswordError && (
                  <p className="mt-1 text-xs text-red-400">{apiPasswordError}</p>
                )}
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-lg ${
                  submitMessage.includes('success') || submitMessage.includes('confirmed')
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  <p className="text-sm">{submitMessage}</p>
                </div>
              )}

              {Object.keys(apiErrors).length > 0 && !apiPasswordError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
                    {Object.entries(apiErrors).map(([field, messages]) =>
                      messages.map((message, idx) => (
                        <li key={`${field}-${idx}`}>{message}</li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

const ConfirmPasswordWithProtection: React.FC = () => (
  <ProtectedRoute>
    <ConfirmPassword />
  </ProtectedRoute>
);

export default ConfirmPasswordWithProtection;

