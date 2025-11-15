import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
    setToken,
    clearError,
    checkAuth,
  } = useAuthStore();

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated) {
      checkAuth();
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
    setToken,
    clearError,
    checkAuth,
  };
};

export default useAuth;

