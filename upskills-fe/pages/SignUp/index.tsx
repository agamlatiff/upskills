import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, XIcon, UserCircleIcon } from '../../components/Icons';
import { getPasswordStrength } from '../../utils/passwordStrength';
import { PasswordStrengthIndicator } from '../../components/PasswordStrengthIndicator';

// Zod schema constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
);

const SignUpSchema = z.object({
    profilePicture: z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional()
        .nullable(),
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(passwordValidation, {
        message: "Must contain an uppercase letter, a number, and a special character.",
      }),
    confirmPassword: z.string(),
    occupation: z.string().min(1, { message: "Please select an occupation." })
      .pipe(z.enum(['student', 'software-engineer', 'product-manager', 'ui-ux-designer', 'data-scientist', 'other'])),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the Terms of Service.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type SignUpData = z.input<typeof SignUpSchema>;
type FormErrors = z.inferFormattedError<typeof SignUpSchema>;

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<SignUpData>({
        profilePicture: null,
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        occupation: '',
        terms: false,
    });
    const [errors, setErrors] = useState<FormErrors | null>(null);
    const [touched, setTouched] = useState<Partial<Record<keyof SignUpData, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
    
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        }
    
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [isModalOpen, imagePreview]);


    const validateForm = (data: SignUpData) => {
        const result = SignUpSchema.safeParse(data);
        if (!result.success) {
            setErrors(result.error.format());
            return false;
        }
        setErrors(null);
        return true;
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileError(null);
        setTouched(prev => ({ ...prev, profilePicture: true }));

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setFileError('Max image size is 5MB.');
                setImagePreview(null);
                setFormData({ ...formData, profilePicture: null });
                e.target.value = '';
                return;
            }
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                setFileError('Only .jpg, .jpeg, .png and .webp formats are supported.');
                setImagePreview(null);
                setFormData({ ...formData, profilePicture: null });
                e.target.value = '';
                return;
            }
            
            const newFormData = { ...formData, profilePicture: file };
            setFormData(newFormData);
            setImagePreview(URL.createObjectURL(file));
            validateForm(newFormData);
        } else {
            setImagePreview(null);
            setFormData({ ...formData, profilePicture: null });
        }
    };
    
    const handleRemoveImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setFormData({ ...formData, profilePicture: null });
        
        const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        
        if (touched[name as keyof SignUpData]) {
            validateForm(newFormData);
        }
        
        if (name === 'password') {
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const newFormData = { ...formData, [name]: checked };
        setFormData(newFormData);
        if (touched.terms) {
            validateForm(newFormData);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target as { name: keyof SignUpData };
        setTouched(prev => ({ ...prev, [name]: true }));
        validateForm({ ...formData, [name]: e.target.value });
    };

    const handleCheckboxBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(prev => ({ ...prev, terms: true }));
        validateForm({ ...formData, terms: e.target.checked });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitMessage('');
        setIsSubmitting(true);

        setTouched({
            profilePicture: true, fullName: true, email: true, password: true, confirmPassword: true, occupation: true, terms: true
        });

        const isValid = validateForm(formData);
        if (!isValid) {
            setIsSubmitting(false);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log('Form submitted successfully:', formData);
        setSubmitMessage('Account created successfully! Welcome to Upskill.');
        setIsSubmitting(false);
    };
    
    const occupations = [
        { value: 'software-engineer', label: 'Software Engineer' },
        { value: 'student', label: 'Student' },
        { value: 'product-manager', label: 'Product Manager' },
        { value: 'ui-ux-designer', label: 'UI/UX Designer' },
        { value: 'data-scientist', label: 'Data Scientist' },
        { value: 'other', label: 'Other' },
    ];

    const getError = (fieldName: keyof SignUpData) => {
        return touched[fieldName] && errors?.[fieldName]?._errors[0];
    };
    
    const profilePictureError = getError('profilePicture');
    const fullNameError = getError('fullName');
    const emailError = getError('email');
    const occupationError = getError('occupation');
    const passwordError = getError('password');
    const confirmPasswordError = getError('confirmPassword');
    const termsError = getError('terms');

    return (
        <main className="py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-white">Create Your Account</h1>
                        <p className="mt-4 text-lg text-slate-400">Start your journey with Upskill today.</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Profile Picture (Optional)
                                </label>
                                <div className="mt-2 flex items-center gap-x-4">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile preview" className="h-20 w-20 rounded-full object-cover" />
                                    ) : (
                                        <UserCircleIcon className="h-20 w-20 text-slate-600" />
                                    )}
                                    <div className="flex flex-col gap-y-2 items-start">
                                        <input
                                            type="file"
                                            id="profilePicture"
                                            name="profilePicture"
                                            accept="image/png, image/jpeg, image/webp, image/jpg"
                                            onChange={handleFileChange}
                                            onBlur={() => setTouched(prev => ({...prev, profilePicture: true}))}
                                            className="sr-only"
                                        />
                                        <label
                                            htmlFor="profilePicture"
                                            className="cursor-pointer rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 shadow-sm ring-1 ring-inset ring-slate-700 hover:bg-slate-700"
                                        >
                                            <span>{imagePreview ? 'Change' : 'Upload photo'}</span>
                                        </label>
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="text-sm font-semibold text-red-400 hover:text-red-300"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {(fileError || profilePictureError) && <p className="mt-2 text-xs text-red-400">{fileError || profilePictureError}</p>}
                            </div>

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Jane Doe"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${fullNameError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'}`}
                                    required
                                    aria-invalid={!!fullNameError}
                                />
                                {fullNameError && <p className="mt-1 text-xs text-red-400">{fullNameError}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="jane.doe@example.com"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'}`}
                                    required
                                    aria-invalid={!!emailError}
                                />
                                {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
                            </div>
                             <div>
                                <label htmlFor="occupation" className="block text-sm font-medium text-slate-300 mb-2">
                                    Occupation
                                </label>
                                <select
                                    id="occupation"
                                    name="occupation"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue=""
                                    className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${occupationError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'}`}
                                    required
                                    aria-invalid={!!occupationError}
                                >
                                    <option value="" disabled>Select your occupation</option>
                                    {occupations.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                {occupationError && <p className="mt-1 text-xs text-red-400">{occupationError}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${passwordError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'}`}
                                        required
                                        aria-describedby="password-strength"
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
                                <div id="password-strength">
                                    <PasswordStrengthIndicator level={passwordStrength} />
                                </div>
                                {passwordError && <p className="mt-2 text-xs text-red-400">{passwordError}</p>}
                            </div>
                             <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full bg-brand-dark border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${confirmPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'}`}
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
                                {confirmPasswordError && <p className="mt-1 text-xs text-red-400">{confirmPasswordError}</p>}
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" name="terms" type="checkbox" onChange={handleCheckboxChange} onBlur={handleCheckboxBlur} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500" required />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-slate-400">
                                        I agree to the{' '}
                                        <button type="button" onClick={openModal} className="font-medium text-blue-400 hover:text-blue-300 underline">
                                            Terms of Service
                                        </button>
                                    </label>
                                    {termsError && <p className="mt-1 text-xs text-red-400">{termsError}</p>}
                                </div>
                            </div>
                            
                            {submitMessage && (
                                <div className="p-4 text-center text-sm rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
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
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                       'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/signin" className="font-semibold text-blue-400 hover:text-blue-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            
            {isModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="terms-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} aria-hidden="true"></div>
            
                    <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-xl z-10 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <h2 id="terms-modal-title" className="text-xl font-bold text-white">Terms of Service</h2>
                            <button onClick={closeModal} className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Close">
                                <XIcon className="h-6 w-6" />
                            </button>
                        </div>
            
                        <div className="p-6 overflow-y-auto space-y-4 text-slate-300">
                            <p className="font-semibold">Last Updated: {new Date().toLocaleDateString()}</p>
                            <p>
                                Welcome to Upskill! These Terms of Service ("Terms") govern your use of the Upskill website, courses, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                            </p>
                            <h3 className="text-lg font-bold text-white pt-2">1. Account Registration</h3>
                            <p>
                                To access most features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information. You are responsible for safeguarding your password and for all activities that occur under your account.
                            </p>
                            <h3 className="text-lg font-bold text-white pt-2">2. Use of Services</h3>
                            <p>
                                Upskill grants you a limited, non-exclusive, non-transferable, and revocable license to use the Services for your personal, non-commercial learning purposes. You agree not to use the Services for any unlawful purpose or in any way that interrupts, damages, or impairs the service.
                            </p>
                            <h3 className="text-lg font-bold text-white pt-2">3. Content and Intellectual Property</h3>
                            <p>
                                All content provided through the Services, including but not limited to course materials, videos, text, and graphics, is the property of Upskill or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, redistribute, or create derivative works from any content without our express written permission.
                            </p>
                            <h3 className="text-lg font-bold text-white pt-2">4. User Conduct</h3>
                            <p>
                                You agree not to post or transmit any material that is defamatory, offensive, or otherwise objectionable. You are solely responsible for your interactions with other users. We reserve the right, but have no obligation, to monitor disputes between you and other users.
                            </p>
                             <h3 className="text-lg font-bold text-white pt-2">5. Termination</h3>
                            <p>
                                We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms.
                            </p>
                        </div>
            
                        <div className="flex justify-end p-6 border-t border-slate-700 bg-slate-900/50 sticky bottom-0">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default SignUp;