import React, { useState } from 'react';
import './UserLogin.css';
import { loginUser } from './api';
import { showSuccess, showError, showApiError } from './toast';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      const roles = data?.roles || [];
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      if (data?.first_name) {
        localStorage.setItem('first_name', data.first_name);
      }
      if (roles.length === 1) {
        let dashboardRoute = '/user/dashboard';
        if (roles[0] === 'vendor') dashboardRoute = '/vendor/dashboard';
        else if (roles[0] === 'courier') dashboardRoute = '/courier/dashboard';
        showSuccess(data?.message || 'Login successful!');
        window.location.href = dashboardRoute;
      } else if (roles.length > 1) {
        showSuccess(data?.message || 'Login successful!');
        navigate('/select-role', { state: { roles } });
      } else {
        showError('No roles assigned to this account.');
      }
    } catch (err: any) {
      showApiError(err, 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="logo-blackbox">
          <img src="/plainlogo.png" alt="Logo" className="logo-img" />
        </div>
        <h2 className="user-login__heading">Welcome to Besties</h2>
        <h3 className="user-login__subheading">Your Gateway to your WhatsApp Ai <br/>  bestie</h3>
        <form onSubmit={handleSubmit}>
          <label className="user-login__label" htmlFor="email">Email</label>
          <input type="email" id="email" className="user-login__input" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="user-login__label" htmlFor="password">Password</label>
          <input type="password" id="password" className="user-login__input" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="user-login__main-btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
        </form>
        <div className="user-login__divider"></div>
        <div className="user-login__signup-prompt">
          Don’t have an account? <a href="/role-selection" className="user-login__signup-link">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin; 