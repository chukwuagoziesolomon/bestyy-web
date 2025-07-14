import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // On success, redirect to user dashboard
      navigate('/user/dashboard');
    }, 1200);
  };

  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="logo-blackbox">
          <img src="/plainlogo.png" alt="Logo" className="logo-img" />
        </div>
        <h2 className="user-login__heading">Sign up to Besties</h2>
        <h3 className="user-login__subheading">Your Gateway to your WhatsApp Ai <br/> bestie</h3>
        <form onSubmit={handleSubmit}>
          <label className="user-login__label" htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" className="user-login__input" placeholder="john" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          <label className="user-login__label" htmlFor="email">Email Address</label>
          <input type="email" id="email" className="user-login__input" placeholder="johndoe@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="user-login__label" htmlFor="password">Password</label>
          <div className="user-login__password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="user-login__input"
              placeholder="***********"
              style={{ paddingRight: '2.5rem' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
                // Eye-off SVG
                <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.09-5.18 5.66-6.53M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/></svg>
              ) : (
                // Eye SVG
                <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <label className="user-login__label" htmlFor="phone">Phone</label>
          <input type="tel" id="phone" className="user-login__input" placeholder="000-0000-000" value={phone} onChange={e => setPhone(e.target.value)} required />
          <div style={{ fontSize: '0.95rem', color: '#222', margin: '0.5rem 0 1.2rem 0', textAlign: 'left', width: '100%' }}>
            By registering, you agree to our <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Terms of use</a> and <a href="#" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Privacy Policies</a>
          </div>
          <button className="user-login__main-btn" style={{ marginTop: 0 }} type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Create an Account'}</button>
        </form>
        <div className="user-login__divider" style={{ margin: '0.7rem 0 0.7rem 0' }}></div>
        <div style={{ textAlign: 'center', color: '#888', fontWeight: 500, marginBottom: '1.2rem' }}>OR</div>
        <div className="signup-social-row">
          <button className="signup-social-btn" aria-label="Sign up with WhatsApp">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#25D366"/>
              <path d="M23.47 19.37c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.06-2.54-.28-.68-.57-.59-.77-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.54.17.23 2.42 3.7 5.87 5.04.82.32 1.46.51 1.96.65.82.26 1.57.22 2.16.13.66-.1 2.01-.82 2.3-1.61.28-.79.28-1.47.2-1.61-.08-.14-.31-.23-.65-.4z" fill="white"/>
            </svg>
          </button>
          <button className="signup-social-btn" aria-label="Sign up with Google">
            <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M21.805 10.023h-9.18v3.955h5.273c-.227 1.18-1.36 3.463-5.273 3.463-3.17 0-5.755-2.626-5.755-5.855s2.585-5.855 5.755-5.855c1.805 0 3.02.77 3.715 1.43l2.54-2.47C17.09 3.67 15.18 2.7 12.805 2.7 7.98 2.7 4 6.68 4 11.505s3.98 8.805 8.805 8.805c5.08 0 8.44-3.57 8.44-8.6 0-.58-.06-1.02-.14-1.387z"/><path fill="#34A853" d="M12.625 21.31c2.43 0 4.47-.8 5.96-2.18l-2.84-2.32c-.79.53-1.8.85-3.12.85-2.4 0-4.43-1.62-5.15-3.8H4.5v2.39A8.805 8.805 0 0 0 12.625 21.31z"/><path fill="#FBBC05" d="M7.475 13.86a5.29 5.29 0 0 1 0-3.36V8.11H4.5a8.805 8.805 0 0 0 0 7.78l2.975-2.03z"/><path fill="#EA4335" d="M12.625 7.08c1.32 0 2.5.45 3.43 1.34l2.57-2.57C17.09 3.67 15.18 2.7 12.805 2.7c-3.17 0-5.755 2.626-5.755 5.855 0 .92.16 1.8.45 2.6l2.975-2.03c.53-1.6 2.01-2.7 3.145-2.7z"/></g></svg>
          </button>
          <button className="signup-social-btn" aria-label="Sign up with Apple">
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