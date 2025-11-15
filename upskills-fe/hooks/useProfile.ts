import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { User } from '../types/api';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: User } | User>('/profile');
      // Handle both wrapped and unwrapped responses
      const data = (response.data as any)?.data || response.data;
      setProfile(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User> & { photo?: File }) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      
      // Only append fields that are provided
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.email !== undefined) formData.append('email', data.email);
      if (data.occupation !== undefined) formData.append('occupation', data.occupation);
      if (data.photo) formData.append('photo', data.photo);

      const response = await apiClient.patch<{ message: string; user: User } | { data: { message: string; user: User } }>(
        '/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Handle both wrapped and unwrapped responses
      const responseData = (response.data as any)?.data || response.data;
      const updatedUser = responseData.user || responseData;
      setProfile(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, password: string, passwordConfirmation: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put('/password', {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete('/profile', {
        data: { password },
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete account';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
    deleteAccount,
  };
};

export default useProfile;

