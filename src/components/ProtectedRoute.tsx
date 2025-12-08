/**
 * Protected Route Component
 * Guards routes that require authentication
 * Automatically redirects to login if token is expired or invalid
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { validateAndRefreshToken, isAuthenticated } from '../utils/tokenManager';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // First check if we have basic authentication
        if (!isAuthenticated()) {
          console.log('❌ User not authenticated');
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Validate and refresh token if needed
        const valid = await validateAndRefreshToken();
        
        if (!valid) {
          console.log('❌ Token validation failed');
          setIsValid(false);
        } else {
          console.log('✅ Token validation successful');
          setIsValid(true);
        }
      } catch (error) {
        console.error('❌ Error validating authentication:', error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [location.pathname]);

  // Show loading state while validating
  if (loading || isValidating) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite',
          }}></div>
          <p style={{ fontSize: '16px', fontWeight: 500 }}>Verifying authentication...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not valid, redirect to login
  if (!isValid || !user) {
    console.log('🚪 Redirecting to login from protected route');
    // Store the attempted location so we can redirect back after login
    sessionStorage.setItem('redirect_after_login', location.pathname);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRole = user.role?.toLowerCase();
    
    if (!roles.some(role => role.toLowerCase() === userRole)) {
      console.log(`❌ User role '${userRole}' not authorized for this route (required: ${roles.join(', ')})`);
      
      // Redirect to appropriate dashboard based on user role
      switch (userRole) {
        case 'vendor':
          return <Navigate to="/vendor/dashboard" replace />;
        case 'courier':
          return <Navigate to="/courier/dashboard" replace />;
        case 'admin':
          return <Navigate to="/admin/dashboard" replace />;
        default:
          return <Navigate to="/user/dashboard" replace />;
      }
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
