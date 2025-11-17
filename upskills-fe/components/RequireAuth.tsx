import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import useToastStore from '../store/toastStore';

interface RequireAuthProps {
  children: React.ReactNode;
  message?: string;
}

/**
 * Middleware component that requires authentication for actions like course purchase
 * Shows a toast message and redirects to signin if user is not authenticated
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ children, message }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const toast = useToastStore();

  if (isLoading) {
    return null; // Don't show anything while checking auth
  }

  if (!isAuthenticated) {
    const defaultMessage = message || 'Please sign in to continue';
    toast.error(defaultMessage);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;






