import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../toast';
import { updateUserProfile } from '../api';
import './Profile.css';

interface ProfileData {
  email: string;
  fullName: string;
  phone: string;
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
}

const Profile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    email: '',
    fullName: '',
    phone: '',
    businessName: '',
    businessCategory: '',
    businessAddress: ''
  });

  useEffect(() => {
    // Check for prefill data in location state
    const prefillData = (location.state as any)?.prefillData;
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        ...prefillData
      }));
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Call update profile API
      // await updateUserProfile(token, formData);
      showSuccess('Profile updated successfully');
      navigate('/dashboard');
    } catch (err: any) {
      showError(err?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Complete Your Profile</h2>
        <p>Please review and complete your profile information</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {formData.businessName && (
            <>
              <div className="form-group">
                <label>Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Business Category</label>
                <input
                  type="text"
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Business Address</label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
