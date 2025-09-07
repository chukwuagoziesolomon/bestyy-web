import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/login' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.some(role => 
    user.role.toLowerCase() === role.toLowerCase()
  );

  if (!hasRequiredRole) {
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

  // User has required role, render the component
  return <>{children}</>;
};

export default RoleBasedRoute;
