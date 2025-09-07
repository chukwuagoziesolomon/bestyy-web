import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../toast';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import '../UserLogin.css';

const UserSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role: 'user' // Default role
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      showError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Register the user first
      await registerUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirm_password
      });

      // Use the new signup function with role-based redirection
      await signup(formData.email, formData.password, formData.role, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role
      });

      showSuccess('Registration successful! Welcome to your dashboard.');
    } catch (err: any) {
      showError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="user-login__logo">
          <img src="/logo.png" alt="Bestyy Logo" />
        </div>
        <h2 className="user-login__title">Create Your Account</h2>
        <p className="user-login__subtitle">Join Bestie today and enjoy seamless food ordering</p>
        
        <form onSubmit={handleSubmit} className="user-signup__form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: '#fff'
              }}
            >
              <option value="user">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="courier">Courier</option>
            </select>
            <small style={{ color: '#666', fontSize: '14px', marginTop: '4px', display: 'block' }}>
              {formData.role === 'vendor' && 'Vendors can sell food and manage their business'}
              {formData.role === 'courier' && 'Couriers can deliver orders and earn money'}
              {formData.role === 'user' && 'Customers can order food and track deliveries'}
            </small>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Create a password (min 8 characters)"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="user-signup__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <p className="user-signup__login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
