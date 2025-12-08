import React, { useState, useEffect } from 'react';
import './UserLogin.css';
import './styles/loading-spinner.css';
import { showError, showInfo } from './toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PremiumLoadingAnimation from './components/PremiumLoadingAnimation';

interface UserLoginProps {
  isSignUp?: boolean;
}

const UserLogin: React.FC<UserLoginProps> = ({ isSignUp = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Check if user was redirected due to session expiration or token expiration
  useEffect(() => {
    const sessionExpired = searchParams.get('session_expired');
    if (sessionExpired === 'true') {
      showInfo('Your session has expired. Please log in again.');
    }
    
    // Check for auth redirect message from token manager
    const authMessage = sessionStorage.getItem('auth_redirect_message');
    if (authMessage) {
      showInfo(authMessage);
      sessionStorage.removeItem('auth_redirect_message');
    }
  }, [searchParams]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Use the AuthContext login function which handles all the logic
      await login(email, password);
      
      // The AuthContext will handle the redirect based on profile completion
      // and role-based routing
      
    } catch (error: any) {
      showError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading animation while logging in
  if (isLoading) {
    return (
      <div className="user-login__bg">
        <div className="user-login__card" style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
          <PremiumLoadingAnimation message="Signing in..." />
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
            {isLoading ? (
              <div className="logo-loading-container">
                <div className="logo-loading-spinner">
                  <img src="/logo.png" alt="Bestyy Logo" />
                </div>
                <div className="logo-loading-text">Logging in...</div>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="user-login__signup">
          Don't have an account? <a href="/role-selection" className="signup-link" style={{
            display: 'inline-block', 
            marginLeft: '0.5rem',
            color: '#10b981',
            fontWeight: '700',
            fontSize: '1.15rem',
            textDecoration: 'none',
            borderBottom: '2px solid #10b981',
            paddingBottom: '2px',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#059669';
            e.currentTarget.style.borderBottomColor = '#059669';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#10b981';
            e.currentTarget.style.borderBottomColor = '#10b981';
          }}
          >Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default UserLogin; 