import React, { useState } from 'react';
import './UserLogin.css';
import { signupUser } from './api';
import { showError, showSuccess } from './toast';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (!formData.confirmPassword.trim()) {
      setError('Please confirm your password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await signupUser({
        user: {
          username: formData.email.split('@')[0], // Use email prefix as username
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword, // Add confirm_password field
          first_name: firstName,
          last_name: lastName,
        },
        phone: formData.phone
      });
      
      // Reset form on successful submission
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      navigate('/user/dashboard'); // Redirect to user dashboard after sign up
    } catch (err: any) {
      let message = 'Sign up failed. Please try again.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="user-login__logo">
          <img src="/logo.png" alt="Bestie Logo" />
        </div>
        <h1 className="user-login__heading">Sign up to Besties</h1>
        <p className="user-login__subheading">Create your bestie Courier Account</p>
        
        <form onSubmit={handleSubmit} className="user-login__form" autoComplete="on">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              autoComplete="name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">PHONE</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="000-0000-000"
              value={formData.phone}
              onChange={handleInputChange}
              required
              autoComplete="tel"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="johndoe@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '24px',
            textAlign: 'center',
            color: '#666666',
            fontSize: '14px',
            lineHeight: '1.5',
            maxWidth: '356.2px',
            margin: '24px auto 0',
            padding: '0 16px'
          }}>
            By registering, you agree to our{' '}
            <a href="#" style={{ 
              color: '#10B981', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}>
              Terms of use
            </a>{' '}
            and{' '}
            <a href="#" style={{ 
              color: '#10B981', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}>
              Privacy Policy
            </a>
          </div>
          
          <button
            type="submit"
            className="user-login__button"
            disabled={isLoading}
            style={{ 
              background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)',
              marginTop: '24px'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Next'}
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          color: '#666666',
          fontSize: '14px'
        }}>
          Already have an account?{' '}
          <a 
            href="/login" 
            style={{ 
              color: '#10B981', 
              textDecoration: 'none', 
              fontWeight: '600' 
            }}
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 