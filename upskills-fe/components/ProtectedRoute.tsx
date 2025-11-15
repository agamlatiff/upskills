import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requireRole && user) {
    const userRoles = user.roles || [];
    const hasRequiredRole = userRoles.includes(requireRole);
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

