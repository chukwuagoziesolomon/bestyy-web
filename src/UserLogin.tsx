import React, { useState } from 'react';
import './UserLogin.css';
import { showSuccess, showError } from './toast';
import { useNavigate } from 'react-router-dom';
import { authService } from './api/auth';
import RoleSelector from './RoleSelector';

interface UserLoginProps {
  isSignUp?: boolean;
}

const UserLogin: React.FC<UserLoginProps> = ({ isSignUp = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (role: string) => {
    // Normalize the role name
    const normalizedRole = role.toLowerCase();
    
    // Store the role in localStorage
    localStorage.setItem('userRole', normalizedRole);
    
    // Determine the dashboard route based on role
    let dashboardRoute = '/user/dashboard'; // Default route
    
    if (normalizedRole === 'vendor') {
      dashboardRoute = '/vendor/dashboard';
    } else if (normalizedRole === 'courier' || normalizedRole === 'rider') {
      dashboardRoute = '/courier/dashboard';
    }
    
    // Force a full page reload to ensure all auth state is properly initialized
    showSuccess(`Logging in as ${normalizedRole}`);
    window.location.href = dashboardRoute;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUserEmail(email);
      
      // Check if user has multiple roles
      if (response.user.roles && response.user.roles.length > 1) {
        setAvailableRoles(response.user.roles);
        setUserToken(response.access);
        setShowRoleSelector(true);
      } else {
        // If single role, proceed directly
        const role = response.user.role || 'user';
        localStorage.setItem('userRole', role);
        handleRoleSelect(role);
      }
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showRoleSelector) {
    return (
      <div className="user-login__bg">
        <div className="user-login__card" style={{ maxWidth: '800px' }}>
          <div className="user-login__logo">
            <img src="/logo.png" alt="Bestyy Logo" />
          </div>
          <h1 className="user-login__title">Welcome back, {userEmail}</h1>
          <p className="user-login__subtitle">Select your role to continue</p>
          <RoleSelector 
            roles={availableRoles} 
            onRoleSelect={handleRoleSelect} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="user-login__logo">
          <img src="/logo.png" alt="Bestyy Logo" />
        </div>
        <h1 className="user-login__title">Welcome to Bestyy</h1>
        <p className="user-login__subtitle">Your Gateway to your WhatsApp AI bestie</p>

        <form className="user-login__form" onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget as HTMLFormElement);
          const email = String(formData.get('email') || '').trim();
          const password = String(formData.get('password') || '');
          
          if (!email || !password) {
            showError('Please enter both email and password');
            return;
          }
          
          await handleLogin(email, password);
        }}>
          <div className="user-login__form-group">
            <label htmlFor="email" className="user-login__label">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="Enter your email" 
              className="user-login__input" 
            />
          </div>
          <div className="user-login__form-group">
            <label htmlFor="password" className="user-login__label">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="Enter your password" 
              className="user-login__input" 
            />
          </div>
          <button 
            type="submit" 
            className="user-login__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="user-login__signup">
          Don't have an account? <a href="/role-selection">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default UserLogin; 