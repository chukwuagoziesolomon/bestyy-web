import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit, Save, X, Home, List, Utensils, Layers } from 'lucide-react';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';
import { fetchVendorProfile, updateVendorProfile, uploadVendorImages } from '../api';
import { showError, showSuccess } from '../toast';

const MobileVendorProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    business_name: localStorage.getItem('businessName') || 'Business Name',
    email: localStorage.getItem('vendorEmail') || 'vendor@example.com',
    phone: localStorage.getItem('vendorPhone') || '+234 000 000 0000',
    business_address: localStorage.getItem('vendorAddress') || 'Business Address',
    business_description: localStorage.getItem('vendorDescription') || 'Business Description',
    logo: localStorage.getItem('businessLogo') || null,
    verification_status: localStorage.getItem('vendorVerificationStatus') || 'pending',
    bank_name: '',
    bank_account_number: '',
    bank_code: ''
  });

  const [tempData, setTempData] = useState(profileData);
  

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const updateData = {
          business_name: tempData.business_name,
          phone: tempData.phone,
          business_address: tempData.business_address,
          business_description: tempData.business_description,
          logo: tempData.logo
        };
        await updateVendorProfile(token, updateData);
      }

      setProfileData(tempData);

      // Save to localStorage as backup
      localStorage.setItem('businessName', tempData.business_name);
      localStorage.setItem('vendorEmail', tempData.email);
      localStorage.setItem('vendorPhone', tempData.phone);
      localStorage.setItem('vendorAddress', tempData.business_address);
      localStorage.setItem('vendorDescription', tempData.business_description);
      if (tempData.logo) {
        localStorage.setItem('businessLogo', tempData.logo);
        // Also update vendor_profile in localStorage
        const existingVendorProfile = localStorage.getItem('vendor_profile');
        if (existingVendorProfile) {
          try {
            const vendorProfile = JSON.parse(existingVendorProfile);
            vendorProfile.logo = tempData.logo;
            vendorProfile.businessLogo = tempData.logo;
            vendorProfile.business_name = tempData.business_name;
            localStorage.setItem('vendor_profile', JSON.stringify(vendorProfile));
            console.log('📦 Updated vendor_profile on save');
          } catch (e) {
            console.error('❌ Failed to update vendor_profile:', e);
          }
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update vendor profile:', error);
      // Still update local state even if API fails
      setProfileData(tempData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          showError('Authentication required. Please log in again.');
          return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setTempData(prev => ({
            ...prev,
            logo: result
          }));
        };
        reader.readAsDataURL(file);

        // Upload logo immediately
        const response = await uploadVendorImages(token, { logo: file });
        
        // Handle the nested response structure
        const logoUrl = response.images?.logo || response.logo;
        console.log('✅ Mobile vendor logo updated:', logoUrl);
        
        // Update both profile data and temp data with the uploaded image URL
        const updatedData = {
          ...profileData,
          logo: logoUrl
        };
        
        setProfileData(updatedData);
        setTempData(updatedData);
        
        // Save to localStorage (businessLogo for backward compatibility)
        if (logoUrl) {
          localStorage.setItem('businessLogo', logoUrl);
          
          // Also update vendor_profile in localStorage so VendorHeader can access it
          const existingVendorProfile = localStorage.getItem('vendor_profile');
          if (existingVendorProfile) {
            try {
              const vendorProfile = JSON.parse(existingVendorProfile);
              vendorProfile.logo = logoUrl;
              vendorProfile.businessLogo = logoUrl; // Add both keys for compatibility
              localStorage.setItem('vendor_profile', JSON.stringify(vendorProfile));
              console.log('📦 Updated vendor_profile with logo:', logoUrl);
            } catch (e) {
              console.error('❌ Failed to update vendor_profile:', e);
            }
          }
        }
        
        showSuccess('Profile picture updated successfully!');

      } catch (error) {
        console.error('Error uploading logo:', error);
        showError(error instanceof Error ? error.message : 'Failed to upload logo');
      }
    }
  };

  // Component initialization
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const profileData = await fetchVendorProfile(token);
          console.log('Loaded vendor profile data:', profileData);
          
          // Save to localStorage vendor_profile for VendorHeader
          localStorage.setItem('vendor_profile', JSON.stringify({
            business_name: profileData.business_name,
            logo: profileData.logo,
            businessLogo: profileData.logo, // Add both for compatibility
            phone: profileData.phone,
            business_address: profileData.business_address,
            business_description: profileData.business_description,
            verification_status: profileData.verification_status
          }));
          
          setProfileData({
            business_name: profileData.business_name || 'Business Name',
            email: 'vendor@example.com', // Email not available in vendor profile endpoint
            phone: profileData.phone || '+234 000 000 0000',
            business_address: profileData.business_address || 'Business Address',
            business_description: profileData.business_description || 'Business Description',
            logo: profileData.logo || null,
            verification_status: profileData.verification_status || 'pending',
            bank_name: profileData.bank_name || '',
            bank_account_number: profileData.bank_account_number || '',
            bank_code: profileData.bank_code || ''
          });
          setTempData({
            business_name: profileData.business_name || 'Business Name',
            email: 'vendor@example.com', // Email not available in vendor profile endpoint
            phone: profileData.phone || '+234 000 000 0000',
            business_address: profileData.business_address || 'Business Address',
            business_description: profileData.business_description || 'Business Description',
            logo: profileData.logo || null,
            verification_status: profileData.verification_status || 'pending',
            bank_name: profileData.bank_name || '',
            bank_account_number: profileData.bank_account_number || '',
            bank_code: profileData.bank_code || ''
          });
        }
      } catch (error) {
        console.error('Failed to load vendor profile:', error);
        // Keep existing localStorage fallback
      }
    };

    loadProfile();
  }, []);


  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader showBusinessName={true} />
      
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
                value={tempData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'center',
                  background: '#f9fafb',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              profileData.business_name
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
                  background: '#f9fafb',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              profileData.email
            )}
          </p>

          {/* Verification UI removed */}
        </div>

        {/* Verification UI removed */}

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
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>📞</span>
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g., +234 000 000 0000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    background: '#f9fafb',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  {profileData.phone || 'Not provided'}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                Business Address
              </label>
              {isEditing ? (
                <textarea
                  value={tempData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  placeholder="e.g., Lagos, Nigeria"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    background: '#f9fafb',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  lineHeight: '1.5',
                  border: '1px solid #e5e7eb'
                }}>
                  {profileData.business_address || 'Not provided'}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>📝</span>
                Business Description
              </label>
              {isEditing ? (
                <textarea
                  value={tempData.business_description}
                  onChange={(e) => handleInputChange('business_description', e.target.value)}
                  placeholder="Describe your business..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    background: '#f9fafb',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  padding: '12px 16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  lineHeight: '1.5',
                  border: '1px solid #e5e7eb'
                }}>
                  {profileData.business_description || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '16px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>🏦</span>
            Bank Information
          </h3>
          
          <div style={{ 
            background: '#f0fdf4', 
            border: '1px solid #bbf7d0', 
            borderRadius: '8px', 
            padding: '12px', 
            marginBottom: '16px'
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#15803d', 
              margin: 0,
              lineHeight: 1.4
            }}>
              <strong>🔒 Secure & Verified</strong><br />
              Bank details are encrypted and verified. To update, use Bank Verification.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px',
                display: 'block'
              }}>
                Bank Name
              </label>
              <div style={{
                padding: '12px 16px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                color: profileData.bank_name ? '#1f2937' : '#9ca3af'
              }}>
                {profileData.bank_name || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '4px',
                display: 'block'
              }}>
                Account Number
              </label>
              <div style={{
                padding: '12px 16px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                color: profileData.bank_account_number ? '#1f2937' : '#9ca3af'
              }}>
                {profileData.bank_account_number ? `${'*'.repeat(6)}${profileData.bank_account_number.slice(-4)}` : 'Not provided'}
              </div>
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

    </div>
  );
};

export default MobileVendorProfile;
