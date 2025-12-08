import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateAndRefreshToken, isAuthenticated } from '../../utils/tokenManager';
import '../../styles/common.css';
import PremiumLoadingAnimation from '../PremiumLoadingAnimation';

interface ProtectedRouteProps {
  roles?: string[];
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles = [],
  redirectTo = '/login',
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // First check basic authentication
        if (!isAuthenticated()) {
          console.log('❌ User not authenticated - no valid tokens');
          setIsValidToken(false);
          setIsChecking(false);
          return;
        }

        // Validate and refresh token if needed
        const valid = await validateAndRefreshToken();
        
        if (!valid) {
          console.log('❌ Token validation failed');
          setIsValidToken(false);
        } else {
          console.log('✅ Token validation successful');
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('❌ Error validating authentication:', error);
        setIsValidToken(false);
      } finally {
        setIsChecking(false);
      }
    };

    validateAuth();
  }, [location.pathname]);

  // Show loading state while checking auth
  if (loading || isChecking) {
    return <PremiumLoadingAnimation message="Verifying authentication..." />;
  }

  // If token is invalid or user is not authenticated, redirect to login
  if (!isValidToken || !user) {
    console.log('🚪 Redirecting to login - Invalid token or no user');
    // Store the attempted location for redirect after login
    sessionStorage.setItem('redirect_after_login', location.pathname);
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
