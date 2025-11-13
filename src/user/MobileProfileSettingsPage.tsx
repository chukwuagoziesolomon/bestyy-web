import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Camera, Save } from 'lucide-react';
import MobileHeader from '../components/MobileHeader';
import { useResponsive } from '../hooks/useResponsive';
import { useImageUpload } from '../hooks/useImageUpload';
import { fetchUserProfile, updateUserProfile, fetchVendorProfile, updateVendorProfile, fetchCourierProfile, updateCourierProfile } from '../api';

import { showError, showSuccess } from '../toast';

const MobileProfileSettingsPage: React.FC = () => {
  const { isTablet } = useResponsive();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Image upload hook for profile pictures
  const { uploadImage: uploadProfileImage, isUploading: isUploadingImage, error: imageUploadError, clearError: clearImageError } = useImageUpload({
    onSuccess: (file) => {
      if (file instanceof File) {
        const objectUrl = URL.createObjectURL(file);
        setFormData(prev => ({
          ...prev,
          profilePicture: objectUrl,
          previewPicture: objectUrl
        }));
      }
      showSuccess('Profile picture uploaded successfully!');
    },
    onError: (error) => {
      showError(error);
    }
  });
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    language: 'English',
    email: '',
    phone: '',
    emailNotifications: true,
    pushNotifications: true,
    profilePicture: null as string | null,
    previewPicture: null as string | null
  });

  // Get user role from localStorage
  const getUserRole = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.role || 'user';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Check if vendor_profile exists (indicates vendor/courier)
    const vendorProfile = localStorage.getItem('vendor_profile');
    if (vendorProfile) {
      try {
        const vendorData = JSON.parse(vendorProfile);
        // Check if it's a courier profile
        if (vendorData.vehicle_type || vendorData.has_bike !== undefined) {
          return 'courier';
        }
        return 'vendor';
      } catch (e) {
        console.error('Error parsing vendor profile:', e);
      }
    }

    return 'user';
  };

  const userRole = getUserRole();
  const isVendor = userRole === 'vendor';
  const isCourier = userRole === 'courier';
  const isUser = userRole === 'user';

  // Smart data population function
  const populateFormFromAPI = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return populateFormFromLocalStorage(); // Fallback to localStorage
      }

      let profileData;
      if (isVendor) {
        profileData = await fetchVendorProfile(token);
      } else if (isCourier) {
        profileData = await fetchCourierProfile(token);
      } else {
        profileData = await fetchUserProfile(token);
      }

      setFormData(prev => ({
        ...prev,
        fullName: profileData.business_name || profileData.user?.first_name + ' ' + profileData.user?.last_name || profileData.first_name + ' ' + profileData.last_name || '',
        nickName: profileData.user?.first_name || profileData.first_name || '',
        email: profileData.user?.email || profileData.email || '',
        phone: profileData.phone || profileData.user?.phone || '',
        profilePicture: profileData.logo || profileData.profile_picture || null,
        language: profileData.language || 'English',
        emailNotifications: profileData.email_notifications || true,
        pushNotifications: profileData.push_notifications || true
      }));

      console.log('Profile fields populated from API data');
      return true;
    } catch (error) {
      console.error('Failed to load profile from API:', error);
      return populateFormFromLocalStorage(); // Fallback to localStorage
    }
  };

  const populateFormFromLocalStorage = () => {
    // 1. First priority: vendor_profile (most complete data)
    const savedVendor = localStorage.getItem('vendor_profile');
    if (savedVendor) {
      try {
        const vendor = JSON.parse(savedVendor);
        console.log('Loading vendor profile data:', vendor);

        setFormData(prev => ({
          ...prev,
          fullName: vendor.business_name || vendor.user?.full_name || '',
          nickName: vendor.user?.first_name || '',
          email: vendor.user?.email || vendor.email || '',
          profilePicture: vendor.logo || null
        }));

        console.log('Profile fields populated from vendor_profile data');
        return true; // Successfully populated
      } catch (e) {
        console.error('Error parsing vendor profile:', e);
      }
    }

    // 2. Second priority: user data (basic user info)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Loading user data:', user);

        setFormData(prev => ({
          ...prev,
          fullName: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '',
          nickName: user.first_name || '',
          email: user.email || ''
        }));

        console.log('Profile fields populated from user data');
        return true; // Successfully populated
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // 3. Third priority: pending_profile_data (fallback)
    const pendingData = localStorage.getItem('pending_profile_data');
    if (pendingData) {
      try {
        const pending = JSON.parse(pendingData);
        console.log('Loading pending profile data:', pending);

        setFormData(prev => ({
          ...prev,
          fullName: pending.fullName || pending.businessName || '',
          email: pending.email || '',
          phone: pending.phone || ''
        }));

        console.log('Profile fields populated from pending_profile_data');
        return true; // Successfully populated
      } catch (e) {
        console.error('Error parsing pending profile data:', e);
      }
    }

    return false; // No local data found
  };

  useEffect(() => {
    const loadProfile = async () => {
      const hasData = await populateFormFromAPI();
      setLoading(false);

      if (hasData) {
        console.log('Profile loaded successfully');
      } else {
        console.log('No profile data found, showing empty form');
      }
    };

    loadProfile();
  }, [populateFormFromAPI]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Upload to Cloudinary instead of just showing preview
      uploadProfileImage(file, 'profile-image');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let updateData;
      if (isVendor) {
        updateData = {
          business_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          first_name: formData.nickName,
          language: formData.language,
          email_notifications: formData.emailNotifications,
          push_notifications: formData.pushNotifications
        };
        await updateVendorProfile(token, updateData);
      } else if (isCourier) {
        updateData = {
          phone: formData.phone,
          email: formData.email,
          first_name: formData.nickName,
          language: formData.language,
          email_notifications: formData.emailNotifications,
          push_notifications: formData.pushNotifications
        };
        await updateCourierProfile(token, updateData);
      } else {
        updateData = {
          first_name: formData.nickName,
          last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
          phone: formData.phone,
          language: formData.language,
          email_notifications: formData.emailNotifications,
          push_notifications: formData.pushNotifications
        };
        await updateUserProfile(token, updateData);
      }

      // Update localStorage as backup
      const currentVendorProfile = JSON.parse(localStorage.getItem('vendor_profile') || '{}');
      const updatedVendorProfile = {
        ...currentVendorProfile,
        business_name: formData.fullName,
        user: {
          ...currentVendorProfile.user,
          email: formData.email,
          first_name: formData.nickName
        }
      };
      localStorage.setItem('vendor_profile', JSON.stringify(updatedVendorProfile));

      // Update local state - profilePicture is already updated by the upload hook
      setFormData(prev => ({
        ...prev,
        previewPicture: null
      }));

      showSuccess('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
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
             <MobileHeader 
         title="Profile Settings"
         subtitle="Manage your account and preferences"
         showBackButton={true}
         variant="default"
         profileImageSize="medium"
         showProfileImage={true}
       />

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
        <div style={{ 
          padding: '20px',
          marginTop: '8px'
        }}>
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
                disabled={isUploadingImage}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isUploadingImage ? '#9ca3af' : '#10b981',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isUploadingImage ? 'not-allowed' : 'pointer',
                  opacity: isUploadingImage ? 0.7 : 1
                }}
              >
                {isUploadingImage ? <div style={{ width: 8, height: 8, border: '1px solid white', borderTop: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> : <Edit2 size={12} color="white" />}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePictureChange}
                disabled={isUploadingImage}
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
            <div style={{ marginBottom: '20px' }}>
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

            {/* Phone */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#333',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Your phone number"
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

          {/* Save Changes Button - Moved up for better visibility */}
          <div style={{ 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '20px', 
            marginBottom: '32px',
            position: 'sticky',
            bottom: '20px',
            zIndex: 10
          }}>
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
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              <Save size={20} />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              textAlign: 'center',
              marginTop: '8px'
            }}>
              Save your profile changes to update your information
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
        </div>
      )}
    </div>
  );
};

export default MobileProfileSettingsPage;
