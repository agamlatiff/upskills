import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import useToastStore from '../store/toastStore';

interface RequireSubscriptionProps {
  children: React.ReactNode;
  message?: string;
}

/**
 * Middleware component that requires an active subscription
 * Redirects to pricing page if user doesn't have an active subscription
 */
const RequireSubscription: React.FC<RequireSubscriptionProps> = ({ children, message }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const toast = useToastStore();

  if (isLoading) {
    return null; // Don't show anything while checking auth
  }

  if (!isAuthenticated) {
    toast.error('Please sign in to continue');
    return <Navigate to="/signin" replace />;
  }

  if (!user?.has_active_subscription) {
    const defaultMessage = message || 'You need an active subscription to access this content';
    toast.error(defaultMessage);
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};

export default RequireSubscription;


