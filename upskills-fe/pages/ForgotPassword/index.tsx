import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import apiClient from '../../utils/api';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;
type FormErrors = z.inferFormattedError<typeof ForgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof ForgotPasswordData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string[] }>({});

  const validateForm = (data: ForgotPasswordData) => {
    const result = ForgotPasswordSchema.safeParse(data);
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
    
    if (touched[name as keyof ForgotPasswordData]) {
      validateForm(newFormData);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target as { name: keyof ForgotPasswordData };
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage('');
    setApiErrors({});
    setIsSubmitting(true);

    setTouched({ email: true });

    const isValid = validateForm(formData);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.post('/forgot-password', {
        email: formData.email,
      });

      setSubmitMessage(response.data.message || 'Password reset link has been sent to your email.');
    } catch (error: any) {
      if (error.errors) {
        setApiErrors(error.errors);
      } else {
        setSubmitMessage(error.message || 'Failed to send password reset link. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailError = touched.email && errors?.email?._errors[0];

  return (
    <main className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white">Forgot Password?</h1>
            <p className="mt-4 text-lg text-slate-400">
              No worries! Enter your email address and we'll send you a link to reset your password.
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

              {submitMessage && (
                <div
                  className={`p-4 text-center text-sm rounded-lg ${
                    submitMessage.includes('sent')
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
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
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

export default ForgotPassword;

