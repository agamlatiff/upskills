import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';
import { EyeIcon, EyeOffIcon, XIcon, UserCircleIcon } from '../../components/Icons';
import { getProfilePhotoUrl } from '../../utils/imageUrl';
import { z } from 'zod';

const ProfileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  occupation: z.string().min(1, 'Occupation is required').optional(),
}).refine((data) => {
  // At least one field must be provided
  return data.name !== undefined || data.email !== undefined || data.occupation !== undefined;
}, {
  message: 'At least one field must be provided',
});

const PasswordUpdateSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, loading, error, updateProfile, updatePassword, deleteAccount } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile update state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    occupation: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password update state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string | string[] }>({});
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Initialize profile data when profile loads
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        occupation: profile.occupation || '',
      });
      if (profile.photo) {
        setProfilePhotoPreview(getProfilePhotoUrl(profile.photo));
      }
    }
  }, [profile]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileErrors({});
    setIsUpdatingProfile(true);

    try {
      // Only validate if there are changes
      const hasChanges = profilePhoto || 
        profileData.name !== profile?.name || 
        profileData.email !== profile?.email || 
        profileData.occupation !== profile?.occupation;
      
      if (!hasChanges) {
        setProfileErrors({ general: 'No changes detected' });
        setIsUpdatingProfile(false);
        return;
      }

      // Build update data with only changed fields
      const updateData: any = {};
      if (profilePhoto) updateData.photo = profilePhoto;
      
      // Only include fields that have actually changed and are not empty
      if (profileData.name !== profile?.name && profileData.name.trim() !== '') {
        updateData.name = profileData.name.trim();
      }
      if (profileData.email !== profile?.email && profileData.email.trim() !== '') {
        updateData.email = profileData.email.trim();
      }
      if (profileData.occupation !== profile?.occupation && profileData.occupation !== '') {
        updateData.occupation = profileData.occupation;
      }

      // Validate only the fields being updated
      if (Object.keys(updateData).length > 0) {
        const fieldsToValidate: any = {};
        if (updateData.name !== undefined) fieldsToValidate.name = updateData.name;
        if (updateData.email !== undefined) fieldsToValidate.email = updateData.email;
        if (updateData.occupation !== undefined) fieldsToValidate.occupation = updateData.occupation;

        if (Object.keys(fieldsToValidate).length > 0) {
          const partialSchema = z.object({
            name: z.string().min(1, 'Name is required').optional(),
            email: z.string().email('Invalid email address').optional(),
            occupation: z.string().min(1, 'Occupation is required').optional(),
          });
          partialSchema.parse(fieldsToValidate);
        }
      }

      await updateProfile(updateData);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      if (err.errors) {
        // Zod validation errors
        const formattedErrors: { [key: string]: string } = {};
        err.errors.forEach((error: any) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setProfileErrors(formattedErrors);
      } else if (err.response?.data?.errors) {
        // Laravel validation errors
        const formattedErrors: { [key: string]: string } = {};
        Object.keys(err.response.data.errors).forEach((key) => {
          formattedErrors[key] = Array.isArray(err.response.data.errors[key])
            ? err.response.data.errors[key][0]
            : err.response.data.errors[key];
        });
        setProfileErrors(formattedErrors);
      } else {
        setProfileErrors({ general: err.message || err.response?.data?.message || 'Failed to update profile' });
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordErrors({});
    setIsUpdatingPassword(true);

    try {
      const validated = PasswordUpdateSchema.parse(passwordData);
      await updatePassword(
        validated.current_password,
        validated.password,
        validated.password_confirmation
      );
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err: any) {
      if (err.errors) {
        // Zod validation errors
        const formattedErrors: { [key: string]: string } = {};
        err.errors.forEach((error: any) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setPasswordErrors(formattedErrors);
      } else if (err.response?.data?.errors) {
        // Laravel validation errors
        const formattedErrors: { [key: string]: string } = {};
        Object.keys(err.response.data.errors).forEach((key) => {
          formattedErrors[key] = Array.isArray(err.response.data.errors[key])
            ? err.response.data.errors[key][0]
            : err.response.data.errors[key];
        });
        setPasswordErrors(formattedErrors);
      } else {
        setPasswordErrors({ general: err.message || err.response?.data?.message || 'Failed to update password' });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm account deletion');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError('');

    try {
      await deleteAccount(deletePassword);
      await logout();
      navigate('/');
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete account');
      setIsDeletingAccount(false);
    }
  };

  if (loading && !profile) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-500 mx-auto"
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
              <p className="mt-4 text-slate-400">Loading profile...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
            <p className="text-red-400 mb-6">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-white mb-2">Profile Settings</h1>
            <p className="text-lg text-slate-400">Manage your account information and preferences.</p>
          </div>

          {/* Update Profile Information */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    {profilePhotoPreview ? (
                      <div className="relative">
                        <img
                          src={profilePhotoPreview}
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover border-2 border-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePhoto(null);
                            setProfilePhotoPreview(profile?.photo ? getProfilePhotoUrl(profile.photo) : null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute -top-1 -right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-slate-700 flex items-center justify-center">
                        <UserCircleIcon className="h-12 w-12 text-slate-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-block px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 cursor-pointer transition-colors"
                    >
                      {profilePhotoPreview ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 2MB</p>
                  </div>
                </div>
                {profileErrors.photo && (
                  <p className="mt-1 text-xs text-red-400">{profileErrors.photo}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                    profileErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                  }`}
                />
                {profileErrors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {Array.isArray(profileErrors.name) ? profileErrors.name[0] : profileErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                    profileErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                  }`}
                />
                {profileErrors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {Array.isArray(profileErrors.email) ? profileErrors.email[0] : profileErrors.email}
                  </p>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-slate-300 mb-2">
                  Occupation
                </label>
                <select
                  id="occupation"
                  name="occupation"
                  value={profileData.occupation}
                  onChange={handleProfileChange}
                  className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 ${
                    profileErrors.occupation ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select your occupation</option>
                  <option value="Student">Student</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Other">Other</option>
                </select>
                {profileErrors.occupation && (
                  <p className="mt-1 text-xs text-red-400">
                    {Array.isArray(profileErrors.occupation) ? profileErrors.occupation[0] : profileErrors.occupation}
                  </p>
                )}
              </div>

              {profileSuccess && (
                <div className="p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg">
                  {profileSuccess}
                </div>
              )}

              {profileErrors.general && (
                <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                  {profileErrors.general}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Update Password */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Update Password</h2>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="current_password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      passwordErrors.current_password ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showCurrentPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {passwordErrors.current_password && (
                  <p className="mt-1 text-xs text-red-400">
                    {Array.isArray(passwordErrors.current_password) ? passwordErrors.current_password[0] : passwordErrors.current_password}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      passwordErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {passwordErrors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {Array.isArray(passwordErrors.password) ? passwordErrors.password[0] : passwordErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={passwordData.password_confirmation}
                    onChange={handlePasswordChange}
                    className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                      passwordErrors.password_confirmation ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPasswordConfirmation ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {passwordErrors.password_confirmation && (
                  <p className="mt-1 text-xs text-red-400">
                    {Array.isArray(passwordErrors.password_confirmation) ? passwordErrors.password_confirmation[0] : passwordErrors.password_confirmation}
                  </p>
                )}
              </div>

              {passwordSuccess && (
                <div className="p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg">
                  {passwordSuccess}
                </div>
              )}

              {passwordErrors.general && (
                <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
                  {passwordErrors.general}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Delete Account */}
          <div className="bg-slate-800 border border-red-500/50 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Delete Account</h2>
            <p className="text-slate-400 mb-6">
              Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-white mb-4">Confirm Account Deletion</h3>
                  <p className="text-slate-400 mb-6">
                    This action cannot be undone. Please enter your password to confirm you want to permanently delete your account.
                  </p>

                  <div className="mb-6">
                    <label htmlFor="delete_password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showDeletePassword ? 'text' : 'password'}
                        id="delete_password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                      >
                        {showDeletePassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {deleteError && (
                      <p className="mt-1 text-xs text-red-400">{deleteError}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeletePassword('');
                        setDeleteError('');
                      }}
                      className="flex-1 px-4 py-2.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const ProfileWithProtection: React.FC = () => (
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
);

export default ProfileWithProtection;

