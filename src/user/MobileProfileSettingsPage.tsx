import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Camera, Save } from 'lucide-react';
import HamburgerMenu from '../components/HamburgerMenu';
import { useResponsive } from '../hooks/useResponsive';
import { fetchUserProfile, updateUserProfile } from '../api';
import { showError, showSuccess } from '../toast';

const MobileProfileSettingsPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    language: 'English',
    email: '',
    emailNotifications: true,
    pushNotifications: true,
    profilePicture: null as string | null,
    previewPicture: null as string | null
  });

  useEffect(() => {
    // First, try to populate from localStorage vendor_profile
    const savedVendor = localStorage.getItem('vendor_profile');
    if (savedVendor) {
      try {
        const vendor = JSON.parse(savedVendor);
        setFormData(prev => ({
          ...prev,
          fullName: vendor.business_name || '',
          nickName: vendor.user?.first_name || '',
          email: vendor.user?.email || '',
          profilePicture: vendor.logo || null
        }));
      } catch (e) {
        // Ignore parse errors and proceed to fetch from backend
      }
    }

    async function getProfile() {
      setLoading(true);
      try {
        if (token) {
          const data = await fetchUserProfile(token);
          setProfile(data || null);
          setFormData(prev => ({
            ...prev,
            fullName: data?.full_name || prev.fullName,
            nickName: data?.nick_name || prev.nickName,
            language: data?.language || 'English',
            email: data?.email || prev.email,
            emailNotifications: !!data?.email_notifications,
            pushNotifications: !!data?.push_notifications,
            profilePicture: data?.profile_picture || prev.profilePicture
          }));
        }
      } catch (err: any) {
        console.error('Could not fetch profile:', err);
        // Don't show error toast on mobile, just use localStorage data
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [token]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          previewPicture: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!token) {
      showError('No authentication token found');
      return;
    }

    setSaving(true);
    try {
      const profileData = {
        full_name: formData.fullName,
        nick_name: formData.nickName,
        language: formData.language.toLowerCase(),
        email: formData.email,
        email_notifications: formData.emailNotifications,
        push_notifications: formData.pushNotifications,
        profile_picture: formData.previewPicture !== null ? formData.previewPicture : formData.profilePicture,
      };
      
      await updateUserProfile(token, profileData);
      setProfile((prev: any) => ({ ...prev, ...profileData }));
      setFormData(prev => ({
        ...prev,
        profilePicture: profileData.profile_picture,
        previewPicture: null
      }));
      
      showSuccess('Profile updated successfully!');
    } catch (error: any) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const displayPicture = formData.previewPicture || formData.profilePicture;
  const displayName = formData.nickName || formData.fullName || 'User';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: isTablet ? '768px' : '414px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeft size={24} color="#333" />
        </button>
        <HamburgerMenu size={24} color="#333" />
      </div>

      {loading ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '16px'
        }}>
          Loading profile...
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          {/* Profile Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ position: 'relative' }}>
              {displayPicture ? (
                <img 
                  src={displayPicture} 
                  alt="Profile" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    objectFit: 'cover' 
                  }} 
                />
              ) : (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {displayName[0]}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Edit2 size={12} color="white" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePictureChange}
              />
            </div>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                margin: '0 0 4px 0'
              }}>
                {displayName}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                {formData.email}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ marginBottom: '32px' }}>
            {/* Full Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Your First Name"
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Nick Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Nick Name
              </label>
              <input
                type="text"
                value={formData.nickName}
                onChange={(e) => handleInputChange('nickName', e.target.value)}
                placeholder="Your First Name"
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Language */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@gmail.com"
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 20px 0'
            }}>
              Notifications
            </h3>

            {/* Email Notifications */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '24px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ flex: 1, marginRight: '16px' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  Email Notifications
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  Receive updates about your Order/Bookings via email
                </div>
              </div>
              <div
                onClick={() => handleInputChange('emailNotifications', !formData.emailNotifications)}
                style={{
                  width: '48px',
                  height: '28px',
                  backgroundColor: formData.emailNotifications ? '#10b981' : '#e5e7eb',
                  borderRadius: '14px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: formData.emailNotifications ? '22px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }} />
              </div>
            </div>

            {/* Push Notifications */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '32px'
            }}>
              <div style={{ flex: 1, marginRight: '16px' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  Push Notification
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  Get notified when order is delivered
                </div>
              </div>
              <div
                onClick={() => handleInputChange('pushNotifications', !formData.pushNotifications)}
                style={{
                  width: '48px',
                  height: '28px',
                  backgroundColor: formData.pushNotifications ? '#10b981' : '#e5e7eb',
                  borderRadius: '14px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: formData.pushNotifications ? '22px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }} />
              </div>
            </div>
          </div>

          {/* Privacy & Security Section */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 20px 0'
            }}>
              Privacy & Security
            </h3>

            {/* Change Password */}
            <div style={{
              padding: '16px 0',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333'
              }}>
                Change Password
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div style={{
              padding: '16px 0',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333'
              }}>
                Two-Factor Authentication
              </div>
              <span style={{
                backgroundColor: '#fbbf24',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                Recommended
              </span>
            </div>

            {/* Download my Data */}
            <div style={{
              padding: '16px 0'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333'
              }}>
                Download my Data
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: saving ? '#9ca3af' : '#10b981',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <Save size={20} />
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileProfileSettingsPage;
