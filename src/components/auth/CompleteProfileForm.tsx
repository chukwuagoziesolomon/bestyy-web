import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth-forms.css';

const CompleteProfileForm: React.FC = () => {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { completeProfile, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await completeProfile({
        phone: formData.phone,
        address: formData.address,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile completion error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-paper">
        <h1 className="form-title">Complete Your Profile</h1>
        
        <p className="form-subtitle">
          Please provide some additional information to complete your registration.
        </p>

        {error && (
          <p className="error-text">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email"
              value={user?.email || ''}
              disabled
            />
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              className="form-input"
              placeholder="+2348000000000"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              inputMode="tel"
              pattern="^[+]?[0-9]{10,15}$"
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-input"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? <div className="loading-spinner" /> : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileForm;
