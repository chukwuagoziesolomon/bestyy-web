import React from 'react';
import './UserLogin.css';

const UserLogin = () => (
  <div className="user-login__bg">
    <div className="user-login__card">
      <div className="logo-blackbox">
        <img src="/plainlogo.png" alt="Logo" className="logo-img" />
      </div>
      <h2 className="user-login__heading">Welcome to Besties</h2>
      <h3 className="user-login__subheading">Your Gateway to your WhatsApp Ai <br/>  bestie</h3>
      <button className="user-login__social user-login__social--apple">
        <span className="user-login__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.665 13.547c-.02-2.045 1.67-3.018 1.744-3.064-0.951-1.39-2.43-1.582-2.953-1.601-1.257-.127-2.453.732-3.09.732-.637 0-1.62-.714-2.67-.694-1.373.02-2.646.797-3.353 2.027-1.432 2.482-.366 6.156 1.025 8.17.678.98 1.484 2.08 2.544 2.04 1.025-.04 1.41-.658 2.646-.658 1.236 0 1.573.658 2.67.638 1.11-.02 1.81-.998 2.484-1.98.784-1.14 1.11-2.24 1.13-2.3-.025-.012-2.17-.832-2.19-3.3zm-2.07-6.06c.567-.687.951-1.64.847-2.587-.82.033-1.81.545-2.4 1.23-.527.61-.99 1.59-.816 2.527.863.067 1.76-.44 2.37-1.17z"/></svg>
        </span>
        Log in with Apple
      </button>
      <button className="user-login__social user-login__social--google">
        <span className="user-login__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M21.805 10.023h-9.18v3.955h5.273c-.227 1.18-1.36 3.463-5.273 3.463-3.17 0-5.755-2.626-5.755-5.855s2.585-5.855 5.755-5.855c1.805 0 3.02.77 3.715 1.43l2.54-2.47C17.09 3.67 15.18 2.7 12.805 2.7 7.98 2.7 4 6.68 4 11.505s3.98 8.805 8.805 8.805c5.08 0 8.44-3.57 8.44-8.6 0-.58-.06-1.02-.14-1.387z"/><path fill="#34A853" d="M12.625 21.31c2.43 0 4.47-.8 5.96-2.18l-2.84-2.32c-.79.53-1.8.85-3.12.85-2.4 0-4.43-1.62-5.15-3.8H4.5v2.39A8.805 8.805 0 0 0 12.625 21.31z"/><path fill="#FBBC05" d="M7.475 13.86a5.29 5.29 0 0 1 0-3.36V8.11H4.5a8.805 8.805 0 0 0 0 7.78l2.975-2.03z"/><path fill="#EA4335" d="M12.625 7.08c1.32 0 2.5.45 3.43 1.34l2.57-2.57C17.09 3.67 15.18 2.7 12.805 2.7c-3.17 0-5.755 2.626-5.755 5.855 0 .92.16 1.8.45 2.6l2.975-2.03c.53-1.6 2.01-2.7 3.145-2.7z"/></g></svg>
        </span>
        Log in with Google
      </button>
      <div className="user-login__divider"></div>
      <label className="user-login__label" htmlFor="email">Email</label>
      <input type="email" id="email" className="user-login__input" placeholder="Enter your email" />
      <button className="user-login__email-btn">Log in with Email...</button>
      <button className="user-login__main-btn">Log in</button>
    </div>
    {/* Move the sign-up prompt outside the card, below it */}
    <div className="user-login__signup-prompt">
      Don’t have an account? <a href="/signup" className="user-login__signup-link">Sign up</a>
    </div>
  </div>
);

export default UserLogin; 