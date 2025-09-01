import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/common.css';

interface ProtectedRouteProps {
  roles?: string[];
  requireProfileComplete?: boolean;
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles = [],
  requireProfileComplete = true,
  redirectTo = '/login',
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Set a small delay to prevent flash of content
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking auth
  if (loading || isChecking) {
    return (
      <div className="centered-container">
        <div className="loading-spinner-container" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check if profile needs to be completed
  if (requireProfileComplete && !user.profile_complete) {
    // Don't redirect if already on the complete profile page to avoid loops
    if (location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" state={{ from: location }} replace />;
    }
  }

  // Use React.Fragment to avoid extra div in the DOM
  return <React.Fragment>{children || <Outlet />}</React.Fragment>;
};

export default React.memo(ProtectedRoute);
