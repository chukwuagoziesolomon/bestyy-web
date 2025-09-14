import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit, Save, X, Home, List, Utensils, Layers } from 'lucide-react';
import VendorHeader from '../components/VendorHeader';
import VerificationBadge from '../components/VerificationBadge';
import VendorBottomNavigation from '../components/VendorBottomNavigation';
import VerificationStatus from '../components/VerificationStatus';
import VerificationStatusBadge from '../components/VerificationStatusBadge';
import VerificationNotificationPopup from '../components/VerificationNotificationPopup';
import { websocketService, VerificationNotificationData } from '../services/websocketService';

const MobileVendorProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    businessName: localStorage.getItem('businessName') || 'Business Name',
    email: localStorage.getItem('vendorEmail') || 'vendor@example.com',
    phone: localStorage.getItem('vendorPhone') || '+234 000 000 0000',
    address: localStorage.getItem('vendorAddress') || 'Business Address',
    description: localStorage.getItem('vendorDescription') || 'Business Description',
    logo: localStorage.getItem('businessLogo') || null,
    verificationStatus: localStorage.getItem('vendorVerificationStatus') || 'pending'
  });

  const [tempData, setTempData] = useState(profileData);
  
  // WebSocket notification state
  const [notification, setNotification] = useState<VerificationNotificationData | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setProfileData(tempData);
    
    // Save to localStorage
    localStorage.setItem('businessName', tempData.businessName);
    localStorage.setItem('vendorEmail', tempData.email);
    localStorage.setItem('vendorPhone', tempData.phone);
    localStorage.setItem('vendorAddress', tempData.address);
    localStorage.setItem('vendorDescription', tempData.description);
    if (tempData.logo) {
      localStorage.setItem('businessLogo', tempData.logo);
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTempData(prev => ({
          ...prev,
          logo: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Setup WebSocket notifications
  useEffect(() => {
    setupWebSocketNotifications();
    
    // Cleanup WebSocket on unmount
    return () => {
      websocketService.disconnectAll();
    };
  }, []);

  const setupWebSocketNotifications = () => {
    // Set up notification callback
    websocketService.setVerificationNotificationCallback((data: VerificationNotificationData) => {
      setNotification(data);
      setShowNotification(true);
    });

    // Connect to vendor WebSocket
    websocketService.connectVendorWebSocket();
  };

  // Handle notification actions
  const handleViewStatus = () => {
    setShowNotification(false);
    // Scroll to verification status section
    const verificationSection = document.querySelector('.verification-status');
    if (verificationSection) {
      verificationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResubmit = () => {
    setShowNotification(false);
    // Navigate to application form or show resubmit modal
    console.log('Resubmit application');
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    setNotification(null);
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader title="Profile" />
      
      <div style={{ padding: '16px' }}>
        {/* Profile Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          {/* Profile Image */}
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              {tempData.logo ? (
                <img
                  src={tempData.logo}
                  alt="Business Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Camera size={40} color="#9ca3af" />
              )}
            </div>
            
            {isEditing && (
              <label style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Camera size={16} color="white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            {isEditing ? (
              <input
                type="text"
                value={tempData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'center',
                  background: '#f9fafb'
                }}
              />
            ) : (
              profileData.businessName
            )}
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 12px 0'
          }}>
            {isEditing ? (
              <input
                type="email"
                value={tempData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  textAlign: 'center',
                  background: '#f9fafb'
                }}
              />
            ) : (
              profileData.email
            )}
          </p>

          {/* Verification Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <VerificationStatusBadge 
              userType="vendor" 
              size="medium"
              onClick={() => {
                const verificationSection = document.querySelector('.verification-status');
                if (verificationSection) {
                  verificationSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>

        {/* Verification Status Section */}
        <VerificationStatus 
          userType="vendor" 
          className="verification-status"
        />

        {/* Profile Details */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Business Information
            </h3>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#10b981',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Edit size={16} />
                Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Phone */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    background: '#f9fafb'
                  }}
                />
              ) : (
                <p style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  margin: 0,
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  {profileData.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Business Address
              </label>
              {isEditing ? (
                <textarea
                  value={tempData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    background: '#f9fafb',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <p style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  margin: 0,
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  lineHeight: '1.5'
                }}>
                  {profileData.address}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Business Description
              </label>
              {isEditing ? (
                <textarea
                  value={tempData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    background: '#f9fafb',
                    resize: 'vertical'
                  }}
                />
              ) : (
                <p style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  margin: 0,
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  lineHeight: '1.5'
                }}>
                  {profileData.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Account Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/vendor/settings/password')}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              Change Password
            </button>
            
            <button
              onClick={() => navigate('/vendor/settings/notifications')}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              Notification Settings
            </button>
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Handle account deletion
                  console.log('Account deletion requested');
                }
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #ef4444',
                background: 'white',
                color: '#ef4444',
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/dashboard" />

      {/* WebSocket Notification Popup */}
      {showNotification && notification && (
        <VerificationNotificationPopup
          notification={notification}
          onClose={handleCloseNotification}
          onViewStatus={handleViewStatus}
          onResubmit={handleResubmit}
        />
      )}
    </div>
  );
};

export default MobileVendorProfile;
