import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showError } from '../toast';
import '../styles/ProfileSelection.css';

interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  vendor_info?: {
    id: number;
    business_name: string;
    is_verified: boolean;
    business_category: string;
  };
  courier_info?: {
    id: number;
    is_verified: boolean;
    is_available: boolean;
    vehicle_type: string;
  };
}

const ProfileSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectProfile, loading } = useAuth();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  useEffect(() => {
    // Get profiles from navigation state or session storage
    const stateProfiles = location.state?.profiles;
    const sessionProfiles = sessionStorage.getItem('temp_profiles');
    
    if (stateProfiles) {
      setProfiles(stateProfiles);
    } else if (sessionProfiles) {
      setProfiles(JSON.parse(sessionProfiles));
    } else {
      // No profiles found, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  const handleProfileSelect = async (profileId: number) => {
    setSelectedProfileId(profileId);
    
    // Get credentials from session storage
    const tempCredentials = sessionStorage.getItem('temp_credentials');
    
    if (!tempCredentials) {
      showError('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const { email, password } = JSON.parse(tempCredentials);
      await selectProfile(email, password, profileId);
      // Navigation will be handled by selectProfile
    } catch (error: any) {
      showError(error.response?.data?.error || 'Failed to select profile');
      setSelectedProfileId(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'vendor':
        return '🏪';
      case 'courier':
        return '🚚';
      case 'user':
        return '👤';
      default:
        return '👤';
    }
  };

  const getRoleName = (profile: Profile) => {
    const role = profile.role.toLowerCase();
    
    if (role === 'vendor' && profile.vendor_info) {
      return profile.vendor_info.business_name;
    }
    
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleDescription = (profile: Profile) => {
    const role = profile.role.toLowerCase();
    
    if (role === 'vendor' && profile.vendor_info) {
      return `${profile.vendor_info.business_category}${profile.vendor_info.is_verified ? ' • Verified' : ''}`;
    }
    
    if (role === 'courier' && profile.courier_info) {
      return `${profile.courier_info.vehicle_type}${profile.courier_info.is_verified ? ' • Verified' : ''}`;
    }
    
    return `${profile.first_name} ${profile.last_name}`;
  };

  if (!profiles.length) {
    return (
      <div className="profile-selection-page">
        <div className="profile-selection-loading">
          <div className="loading-spinner"></div>
          <p>Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-selection-page">
      <div className="profile-selection-container">
        <div className="profile-selection-header">
          <img src="/logo.png" alt="Bestyy Logo" className="profile-selection-logo" />
          <h1>Welcome Back!</h1>
          <p>You have multiple profiles. Choose one to continue.</p>
        </div>

        <div className="profile-cards">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`profile-card ${selectedProfileId === profile.id ? 'loading' : ''}`}
              onClick={() => !loading && handleProfileSelect(profile.id)}
            >
              <div className="profile-card-icon">{getRoleIcon(profile.role)}</div>
              <div className="profile-card-content">
                <h3 className="profile-card-title">{getRoleName(profile)}</h3>
                <p className="profile-card-role">{profile.role.toUpperCase()}</p>
                <p className="profile-card-description">{getRoleDescription(profile)}</p>
              </div>
              {selectedProfileId === profile.id && loading ? (
                <div className="profile-card-spinner">
                  <div className="mini-spinner"></div>
                </div>
              ) : (
                <div className="profile-card-arrow">→</div>
              )}
            </div>
          ))}
        </div>

        <button 
          className="profile-selection-back"
          onClick={() => {
            sessionStorage.removeItem('temp_credentials');
            sessionStorage.removeItem('temp_profiles');
            navigate('/login');
          }}
          disabled={loading}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ProfileSelectionPage;
