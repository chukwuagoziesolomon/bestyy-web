import React, { useState } from 'react';
import './UserLogin.css';
import { signupUser } from './api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
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
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
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
      await signupUser({
        user: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          first_name: formData.firstName,
          last_name: formData.lastName
        },
        phone: formData.phone
      });
      toast.success('Account created successfully! Welcome to Besties!');
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      });
    setTimeout(() => {
        navigate('/login/user');
      }, 1000);
    } catch (err: any) {
      let message = 'Sign up failed';
      if (err && err.message) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="logo-blackbox">
          <img src="/plainlogo.png" alt="Logo" className="logo-img" />
        </div>
        <h2 className="user-login__heading">Sign up to Besties</h2>
        <h3 className="user-login__subheading">Your Gateway to your WhatsApp Ai <br/> bestie</h3>
        {/* Remove all in-form error and success messages here */}
        <form onSubmit={handleSubmit} className="user-login__form" autoComplete="on">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
            autoComplete="username"
          />
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            autoComplete="given-name"
          />
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            autoComplete="family-name"
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="email"
          />
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Password"
              style={{ paddingRight: '2.5rem' }}
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? (
                <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.09-5.18 5.66-6.53M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              style={{ paddingRight: '2.5rem' }}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirmPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showConfirmPassword ? (
                <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.09-5.18 5.66-6.53M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            autoComplete="tel"
          />
          <div className="user-login__terms">
            By registering, you agree to our <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Terms of use</a> and <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Privacy Policies</a>
          </div>
          <button
            className="user-login__button"
            type="submit"
            disabled={isLoading}
            style={{ background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' }}
          >
            {isLoading ? 'Creating Account...' : 'Create an Account'}
          </button>
        </form>
        <div className="user-login__divider" style={{ margin: '0.7rem 0 0.7rem 0' }}></div>
        <div style={{ textAlign: 'center', color: '#888', fontWeight: 500, marginBottom: '1.2rem' }}>OR</div>
        <div className="user-login__social">
          <button className="signup-social-btn" aria-label="Sign up with WhatsApp">
            {/* WhatsApp SVG */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#25D366"/>
              <path d="M23.47 19.37c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.06-2.54-.28-.68-.57-.59-.77-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.54.17.23 2.42 3.7 5.87 5.04.82.32 1.46.51 1.96.65.82.26 1.57.22 2.16.13.66-.1 2.01-.82 2.3-1.61.28-.79.28-1.47.2-1.61-.08-.14-.31-.23-.65-.4z" fill="white"/>
            </svg>
          </button>
          <button className="signup-social-btn" aria-label="Sign up with Google">
            {/* Google SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M21.805 10.023h-9.18v3.955h5.273c-.227 1.18-1.36 3.463-5.273 3.463-3.17 0-5.755-2.626-5.755-5.855s2.585-5.855 5.755-5.855c1.805 0 3.02.77 3.715 1.43l2.54-2.47C17.09 3.67 15.18 2.7 12.805 2.7 7.98 2.7 4 6.68 4 11.505s3.98 8.805 8.805 8.805c5.08 0 8.44-3.57 8.44-8.6 0-.58-.06-1.02-.14-1.387z"/><path fill="#34A853" d="M12.625 21.31c2.43 0 4.47-.8 5.96-2.18l-2.84-2.32c-.79.53-1.8.85-3.12.85-2.4 0-4.43-1.62-5.15-3.8H4.5v2.39A8.805 8.805 0 0 0 12.625 21.31z"/><path fill="#FBBC05" d="M7.475 13.86a5.29 5.29 0 0 1 0-3.36V8.11H4.5a8.805 8.805 0 0 0 0 7.78l2.975-2.03z"/><path fill="#EA4335" d="M12.625 7.08c1.32 0 2.5.45 3.43 1.34l2.57-2.57C17.09 3.67 15.18 2.7 12.805 2.7c-3.17 0-5.755 2.626-5.755 5.855 0 .92.16 1.8.45 2.6l2.975-2.03c.53-1.6 2.01-2.7 3.145-2.7z"/></g></svg>
          </button>
          <button className="signup-social-btn" aria-label="Sign up with Apple">
            {/* Apple SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.665 13.547c-.02-2.045 1.67-3.018 1.744-3.064-0.951-1.39-2.43-1.582-2.953-1.601-1.257-.127-2.453.732-3.09.732-.637 0-1.62-.714-2.67-.694-1.373.02-2.646.797-3.353 2.027-1.432 2.482-.366 6.156 1.025 8.17.678.98 1.484 2.08 2.544 2.04 1.025-.04 1.41-.658 2.646-.658 1.236 0 1.573.658 2.67.638 1.11-.02 1.81-.998 2.484-1.98.784-1.14 1.11-2.24 1.13-2.3-.025-.012-2.17-.832-2.19-3.3zm-2.07-6.06c.567-.687.951-1.64.847-2.587-.82.033-1.81.545-2.4 1.23-.527.61-.99 1.59-.816 2.527.863.067 1.76-.44 2.37-1.17z"/></svg>
          </button>
        </div>
      </div>
      <div className="user-login__signup-prompt">
        Already have an account? <a href="/login/user" className="user-login__signup-link">Log in</a>
      </div>
    </div>
  );
};

export default SignUp; 