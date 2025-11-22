import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/common.css';
import PremiumLoadingAnimation from '../PremiumLoadingAnimation';

interface ProtectedRouteProps {
  roles?: string[];
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles = [],
  redirectTo = '/',
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
    return <PremiumLoadingAnimation message="Loading..." />;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    let redirectPath = '/user/dashboard';
    
    switch (user.role.toLowerCase()) {
      case 'vendor':
        redirectPath = '/vendor/dashboard';
        break;
      case 'courier':
        redirectPath = '/courier/dashboard';
        break;
      case 'admin':
        redirectPath = '/admin/dashboard';
        break;
      default:
        redirectPath = '/user/dashboard';
    }
    
    return <Navigate to={redirectPath} replace />;
  }



  // Use React.Fragment to avoid extra div in the DOM
  return <React.Fragment>{children || <Outlet />}</React.Fragment>;
};

export default React.memo(ProtectedRoute);
