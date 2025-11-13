import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Eye, EyeOff, Save, X } from 'lucide-react';
import { fetchUserProfile, updateUserProfile } from '../api';
import { useImageUpload } from '../hooks/useImageUpload';
import { showSuccess, showError } from '../toast';
import VerificationBadge from '../components/VerificationBadge';

const DesktopCourierProfile: React.FC = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Image upload hook
  const { uploadImage, isUploading: isUploadingImage } = useImageUpload({
    onSuccess: (file) => {
      // Create object URL for display
      if (file instanceof File) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewPicture(objectUrl);
      }
      showSuccess('Profile image uploaded successfully!');
    },
    onError: (error) => {
      showError(`Image upload failed: ${error}`);
    }
  });
  const [error, setError] = useState<string | null>(null);
  
  // Vendor profile fields - enhanced to match mobile version
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phoneNumber: '',
    businessAddress: '',
    businessCategory: '',
    businessDescription: '',
    deliveryRadius: '',
    serviceAreas: '',
    openingHours: '08:00',
    closingHours: '22:00',
    cacNumber: '',
    vehicleType: 'Motorcycle',
    verificationStatus: 'pending'
  });
  
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get token function
  const getToken = () => {
    return localStorage.getItem('access_token') || 
           localStorage.getItem('vendor_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('auth_token');
  };

  // Fetch profile data from API and localStorage
  const fetchProfileData = async () => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      try {
        const apiProfile = await fetchUserProfile(token);
        console.log('API Profile data:', apiProfile);
        
        if (apiProfile) {
          setFormData({
            businessName: apiProfile.business_name || apiProfile.businessName || '',
            email: apiProfile.email || '',
            phoneNumber: apiProfile.phone || apiProfile.phone_number || '',
            businessAddress: apiProfile.business_address || apiProfile.businessAddress || '',
            businessCategory: apiProfile.business_category || apiProfile.businessCategory || '',
            businessDescription: apiProfile.business_description || apiProfile.businessDescription || '',
            deliveryRadius: apiProfile.delivery_radius || apiProfile.deliveryRadius || '',
            serviceAreas: apiProfile.service_areas || apiProfile.serviceAreas || '',
            openingHours: apiProfile.opening_hours || apiProfile.openingHours || '08:00',
            closingHours: apiProfile.closing_hours || apiProfile.closingHours || '22:00',
            cacNumber: apiProfile.cac_number || apiProfile.cacNumber || '',
            vehicleType: apiProfile.vehicle_type || apiProfile.vehicleType || 'Motorcycle',
            verificationStatus: apiProfile.verification_status || apiProfile.verificationStatus || 'pending'
          });
          
          if (apiProfile.logo || apiProfile.businessLogo || apiProfile.profile_image) {
            setProfilePicture(apiProfile.logo || apiProfile.businessLogo || apiProfile.profile_image);
          }
        }
      } catch (apiError) {
        console.log('API fetch failed, falling back to localStorage:', apiError);
        
        // Fallback to localStorage if API fails
        populateFromLocalStorage();
      }
      
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Populate from localStorage (fallback)
  const populateFromLocalStorage = () => {
    try {
      // Get vendor data from localStorage
      const vendorProfile = localStorage.getItem('vendor_profile');
      const signupData = localStorage.getItem('pending_vendor_data');
      
      let vendorInfo = null;
      let signupInfo = null;
      
      // Parse vendor profile if it exists
      if (vendorProfile) {
        try {
          vendorInfo = JSON.parse(vendorProfile);
          console.log('Found vendor profile in localStorage:', vendorInfo);
        } catch (e) {
          console.log('Error parsing vendor profile:', e);
        }
      }
      
      // Parse signup data if it exists
      if (signupData) {
        try {
          signupInfo = JSON.parse(signupData);
          console.log('Found vendor signup data in localStorage:', signupInfo);
        } catch (e) {
          console.log('Error parsing vendor signup data:', e);
        }
      }
      
      // Populate form data - prioritize stored profile, then signup data
      if (vendorInfo) {
        setFormData({
          businessName: vendorInfo.business_name || vendorInfo.businessName || '',
          email: vendorInfo.email || '',
          phoneNumber: vendorInfo.phone || vendorInfo.phone_number || '',
          businessAddress: vendorInfo.business_address || vendorInfo.businessAddress || '',
          businessCategory: vendorInfo.business_category || vendorInfo.businessCategory || '',
          businessDescription: vendorInfo.business_description || vendorInfo.businessDescription || '',
          deliveryRadius: vendorInfo.delivery_radius || vendorInfo.deliveryRadius || '',
          serviceAreas: vendorInfo.service_areas || vendorInfo.serviceAreas || '',
          openingHours: vendorInfo.opening_hours || vendorInfo.openingHours || '08:00',
          closingHours: vendorInfo.closing_hours || vendorInfo.closingHours || '22:00',
          cacNumber: vendorInfo.cac_number || vendorInfo.cacNumber || '',
          vehicleType: vendorInfo.vehicle_type || vendorInfo.vehicleType || 'Motorcycle',
          verificationStatus: vendorInfo.verification_status || vendorInfo.verificationStatus || 'pending'
        });
        
        if (vendorInfo.logo || vendorInfo.businessLogo) {
          setProfilePicture(vendorInfo.logo || vendorInfo.businessLogo);
        }
      } else if (signupInfo) {
        setFormData({
          businessName: signupInfo.business_name || signupInfo.businessName || '',
          email: signupInfo.email || '',
          phoneNumber: signupInfo.phone || signupInfo.phone_number || '',
          businessAddress: signupInfo.business_address || signupInfo.businessAddress || '',
          businessCategory: signupInfo.business_category || signupInfo.businessCategory || '',
          businessDescription: signupInfo.business_description || signupInfo.businessDescription || '',
          deliveryRadius: signupInfo.delivery_radius || signupInfo.deliveryRadius || '',
          serviceAreas: signupInfo.service_areas || signupInfo.serviceAreas || '',
          openingHours: signupInfo.opening_hours || signupInfo.openingHours || '08:00',
          closingHours: signupInfo.closing_hours || signupInfo.closingHours || '22:00',
          cacNumber: signupInfo.cac_number || signupInfo.cacNumber || '',
          vehicleType: signupInfo.vehicle_type || signupInfo.vehicleType || 'Motorcycle',
          verificationStatus: signupInfo.verification_status || signupInfo.verificationStatus || 'pending'
        });
        
        if (signupInfo.logo || signupInfo.businessLogo) {
          setProfilePicture(signupInfo.logo || signupInfo.businessLogo);
        }
      }
      
      // Also check for individual localStorage items as fallback
      const storedFirstName = localStorage.getItem('first_name') || localStorage.getItem('user_first_name');
      const storedLastName = localStorage.getItem('last_name') || localStorage.getItem('user_last_name');
      const storedEmail = localStorage.getItem('email') || localStorage.getItem('user_email');
      const storedPhone = localStorage.getItem('phone_number') || localStorage.getItem('user_phone') || localStorage.getItem('phone');
      const storedProfileImage = localStorage.getItem('profile_image') || localStorage.getItem('user_profile_image');
      
      // Update form data with individual items if not already set
      if (storedEmail && !formData.email) {
        setFormData(prev => ({ ...prev, email: storedEmail }));
      }
      if (storedPhone && !formData.phoneNumber) {
        setFormData(prev => ({ ...prev, phoneNumber: storedPhone }));
      }
      if (storedFirstName && storedLastName && !formData.businessName) {
        setFormData(prev => ({ ...prev, businessName: `${storedFirstName} ${storedLastName}` }));
      }
      if (storedProfileImage && !profilePicture) {
        setProfilePicture(storedProfileImage);
      }
      
      console.log('Profile data populated from localStorage');
    } catch (error) {
      console.error('Error populating profile data from localStorage:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show loading state
      setPreviewPicture('uploading...');
      
      // Upload to Cloudinary
      const imageUrl = await uploadImage(file, 'profile-image');
      
      if (!imageUrl) {
        // Reset to original if upload failed
        setPreviewPicture(profilePicture);
      }
    }
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Prepare profile data for API
      const profileData = {
        business_name: formData.businessName,
        email: formData.email,
        phone: formData.phoneNumber,
        business_address: formData.businessAddress,
        business_category: formData.businessCategory,
        business_description: formData.businessDescription,
        delivery_radius: formData.deliveryRadius,
        service_areas: formData.serviceAreas,
        opening_hours: formData.openingHours,
        closing_hours: formData.closingHours,
        cac_number: formData.cacNumber,
        vehicle_type: formData.vehicleType
      };
      
      // Update profile via API
      const response = await updateUserProfile(token, profileData);
      console.log('Profile updated successfully:', response);
      
      // Update localStorage with new data
      const updatedProfile = {
        ...profileData,
        logo: previewPicture || profilePicture,
        verification_status: formData.verificationStatus
      };
      localStorage.setItem('vendor_profile', JSON.stringify(updatedProfile));
      
      // Update profile picture if changed
      if (previewPicture) {
        setProfilePicture(previewPicture);
        setPreviewPicture(null);
      }
      
      setEditMode(false);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPreviewPicture(null);
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '32px',
          color: '#fff',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            Profile Settings
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            margin: 0
          }}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Content */}
        <div style={{ padding: '32px' }}>
          {/* Loading State */}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              Loading profile data...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Profile Content - only show when not loading */}
          {!loading && (
            <>
              {/* Profile Picture Section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
                paddingBottom: '32px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ position: 'relative', marginRight: '24px' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '4px solid #e5e7eb'
                  }}>
                    {previewPicture || profilePicture ? (
                      <img
                        src={previewPicture || profilePicture || ''}
                        alt="Profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        fontSize: '48px',
                        color: '#9ca3af'
                      }}>
                        👤
                      </div>
                    )}
                  </div>
                  {editMode && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Camera size={18} />
                    </button>
                  )}
                </div>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: '#1f2937'
                  }}>
                    {formData.businessName || 'Your Business Name'}
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0 0 16px 0'
                  }}>
                    {formData.email || 'your.email@example.com'}
                  </p>
                  <VerificationBadge 
                    status={formData.verificationStatus as 'verified' | 'pending' | 'rejected' | 'under_review'} 
                    size="medium"
                  />
                </div>
              </div>

              {/* Profile Form */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Business Information */}
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                    color: '#1f2937'
                  }}>
                    Business Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        disabled={!editMode}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!editMode}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        disabled={!editMode}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Business Address
                      </label>
                      <textarea
                        value={formData.businessAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                        disabled={!editMode}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Business Category
                      </label>
                      <select
                        value={formData.businessCategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessCategory: e.target.value }))}
                        disabled={!editMode}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280'
                        }}
                      >
                        <option value="">Select Category</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Business Description
                      </label>
                      <textarea
                        value={formData.businessDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                        disabled={!editMode}
                        rows={3}
                        placeholder="Describe your business..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        CAC Number
                      </label>
                      <input
                        type="text"
                        value={formData.cacNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, cacNumber: e.target.value }))}
                        disabled={!editMode}
                        placeholder="e.g., RC123456789"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                    color: '#1f2937'
                  }}>
                    Delivery Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Vehicle Type
                      </label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                        disabled={!editMode}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280'
                        }}
                      >
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Car">Car</option>
                        <option value="Walking">Walking</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Delivery Radius (km)
                      </label>
                      <input
                        type="number"
                        value={formData.deliveryRadius}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryRadius: e.target.value }))}
                        disabled={!editMode}
                        placeholder="e.g., 5"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Service Areas
                      </label>
                      <textarea
                        value={formData.serviceAreas}
                        onChange={(e) => setFormData(prev => ({ ...prev, serviceAreas: e.target.value }))}
                        disabled={!editMode}
                        rows={3}
                        placeholder="e.g., Victoria Island, Lekki, Ikoyi"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px',
                          background: editMode ? '#fff' : '#f9fafb',
                          color: editMode ? '#1f2937' : '#6b7280',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '6px'
                        }}>
                          Opening Time
                        </label>
                        <input
                          type="time"
                          value={formData.openingHours}
                          onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
                          disabled={!editMode}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '16px',
                            background: editMode ? '#fff' : '#f9fafb',
                            color: editMode ? '#1f2937' : '#6b7280'
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '6px'
                        }}>
                          Closing Time
                        </label>
                        <input
                          type="time"
                          value={formData.closingHours}
                          onChange={(e) => setFormData(prev => ({ ...prev, closingHours: e.target.value }))}
                          disabled={!editMode}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '16px',
                            background: editMode ? '#fff' : '#f9fafb',
                            color: editMode ? '#1f2937' : '#6b7280'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                {editMode ? (
                  <>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: '12px 24px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        background: '#fff',
                        color: '#374151',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        background: saving ? '#9ca3af' : '#10b981',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: saving ? 0.7 : 1
                      }}
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      background: '#10b981',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        disabled={isUploadingImage}
      />
    </div>
  );
};

export default DesktopCourierProfile;



