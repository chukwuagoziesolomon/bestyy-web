import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../toast';
import { Edit2, Camera, Building2, Bell, Shield, Clock, MapPin, Truck, User, Mail, Phone, CreditCard, LogOut } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { getUserMe, fetchUserProfile, updateUserProfile, fetchVendorProfile, updateVendorProfile, fetchCourierProfile, updateCourierProfile, uploadUserProfileImage, uploadVendorImages, uploadCourierImages, updateVendorBankDetails, fetchSupportedBanks } from '../api';

const ProfilePage = () => {

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  // Editable fields - expanded to include all vendor signup data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [bio, setBio] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [closingHours, setClosingHours] = useState('');
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  // Bank information states
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [supportedBanks, setSupportedBanks] = useState<any[]>([]);
  const [bankVerified, setBankVerified] = useState(false);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const [previewCoverPhoto, setPreviewCoverPhoto] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  

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
  const populateFormFromLocalStorage = () => {
    console.log('🔍 Checking localStorage for profile data...');
    
    // 1. First priority: vendor_profile (most complete data)
    const savedVendor = localStorage.getItem('vendor_profile');
    console.log('📦 vendor_profile found:', !!savedVendor);
    
    if (savedVendor) {
      try {
        const vendor = JSON.parse(savedVendor);
        console.log('✅ Loading vendor profile data:', vendor);

        // Populate all fields from signup data
        setFirstName(vendor.business_name || vendor.user?.first_name || '');
        setLastName(vendor.user?.last_name || '');
        setEmail(vendor.user?.email || vendor.email || '');
        setPhone(vendor.phone || '');
        setBusinessAddress(vendor.business_address || '');
        setBusinessCategory(vendor.business_category || '');
        setBusinessDescription(vendor.business_description || '');
        setBio(vendor.bio || '');
        setDeliveryRadius(vendor.delivery_radius || '');
        setServiceAreas(vendor.service_areas || '');
        setOpeningHours(vendor.opening_hours?.replace(':00', '') || '');
        setClosingHours(vendor.closing_hours?.replace(':00', '') || '');
        setOffersDelivery(vendor.offers_delivery || false);
        setProfilePicture(vendor.logo || null);
        setCoverPhoto(vendor.cover_photo || vendor.cover_image || null);

        console.log('✅ Profile fields populated from vendor_profile data');
        return true; // Successfully populated
      } catch (e) {
        console.error('❌ Error parsing vendor profile:', e);
      }
    }

    // 2. Second priority: user data (basic user info)
    const savedUser = localStorage.getItem('user');
    console.log('👤 user found:', !!savedUser);
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('✅ Loading user data:', user);

        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');

        console.log('✅ Profile fields populated from user data');
        return true; // Successfully populated
      } catch (e) {
        console.error('❌ Error parsing user data:', e);
      }
    }

    // 3. Third priority: pending_profile_data (fallback)
    const pendingData = localStorage.getItem('pending_profile_data');
    console.log('⏳ pending_profile_data found:', !!pendingData);
    
    if (pendingData) {
      try {
        const pending = JSON.parse(pendingData);
        console.log('✅ Loading pending profile data:', pending);

        setFirstName(pending.firstName || pending.businessName || '');
        setLastName(pending.lastName || '');
        setEmail(pending.email || '');
        setPhone(pending.phone || '');
        setBusinessAddress(pending.businessAddress || '');
        setBusinessCategory(pending.businessCategory || '');

        console.log('✅ Profile fields populated from pending_profile_data');
        return true; // Successfully populated
      } catch (e) {
        console.error('❌ Error parsing pending profile data:', e);
      }
    }

    console.log('❌ No local data found in any storage location');
    return false; // No local data found
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        if (token) {
          let apiProfileData;
          if (isVendor) {
            apiProfileData = await fetchVendorProfile(token);
          } else if (isCourier) {
            apiProfileData = await fetchCourierProfile(token);
          } else {
            // Fetch basic user info from /api/user/me/
            const userMe = await getUserMe(token);
            // Fetch full profile from /api/user/profile/
            apiProfileData = await fetchUserProfile(token);
            
            // Merge data from both endpoints
            apiProfileData = {
              ...apiProfileData,
              email: userMe.email || apiProfileData.email,
              username: userMe.username || apiProfileData.username,
              first_name: userMe.first_name || apiProfileData.first_name,
              last_name: userMe.last_name || apiProfileData.last_name,
              phone: userMe.phone || apiProfileData.phone,
            };
          }

          // Store API data
          setProfileData(apiProfileData);

          // Populate form fields from API response
          if (isVendor) {
            // Handle vendor profile data structure
            setFirstName(apiProfileData.business_name || '');
            setLastName('');
            setEmail(apiProfileData.email || ''); // May not be directly available in vendor endpoint
            setPhone(apiProfileData.phone || '');
            setBusinessAddress(apiProfileData.business_address || '');
            setBusinessCategory(apiProfileData.business_category || '');
            setBusinessDescription(apiProfileData.business_description || '');
            setBio(apiProfileData.business_description || ''); // Use description as bio
            setDeliveryRadius(apiProfileData.delivery_radius || '');
            setServiceAreas(apiProfileData.service_areas || '');
            setOpeningHours(apiProfileData.opening_hours?.replace(':00', '') || '');
            setClosingHours(apiProfileData.closing_hours?.replace(':00', '') || '');
            setOffersDelivery(apiProfileData.offers_delivery || false);
            setProfilePicture(apiProfileData.logo || null);
            setCoverPhoto(apiProfileData.cover_image || null);
            
            // Set bank information
            setBankAccountNumber(apiProfileData.bank_account_number || '');
            setBankAccountName(apiProfileData.bank_account_name || '');
            setBankName(apiProfileData.bank_name || '');
            setBankCode(apiProfileData.bank_code || '');
          } else if (isCourier) {
            // Handle courier profile data structure
            const firstName = apiProfileData.full_name?.split(' ')[0] || '';
            const lastName = apiProfileData.full_name?.split(' ').slice(1).join(' ') || '';
            const email = apiProfileData.email || '';
            const phone = apiProfileData.phone || '';
            const businessAddress = apiProfileData.business_address || '';
            const businessCategory = apiProfileData.business_category || '';
            const businessDescription = apiProfileData.business_description || '';
            const bio = apiProfileData.bio || '';
            const deliveryRadius = apiProfileData.delivery_radius || '';
            const serviceAreas = apiProfileData.service_areas || [];
            const openingHours = apiProfileData.opening_hours || '';
            const closingHours = apiProfileData.closing_hours || '';
            const offersDelivery = apiProfileData.offers_delivery || false;
            const profilePicture = apiProfileData.logo || apiProfileData.profile_picture || null;
            const coverPhoto = apiProfileData.cover_photo || apiProfileData.cover_image || null;

            // Update state variables
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setPhone(phone);
            setBusinessAddress(businessAddress);
            setBusinessCategory(businessCategory);
            setBusinessDescription(businessDescription);
            setBio(bio);
            setDeliveryRadius(deliveryRadius);
            setServiceAreas(Array.isArray(serviceAreas) ? serviceAreas.join(', ') : serviceAreas);
            setOpeningHours(openingHours);
            setClosingHours(closingHours);
            setOffersDelivery(offersDelivery);
            setProfilePicture(profilePicture);
            setCoverPhoto(coverPhoto);
          } else {
            // Handle user profile data structure - matching API response
            setFirstName(apiProfileData.first_name || '');
            setLastName(apiProfileData.last_name || '');
            setEmail(apiProfileData.email || '');
            setPhone(apiProfileData.phone || '');
            setProfilePicture(apiProfileData.profile_picture || null);
          }
          setSelectedLogoFile(null);
          setSelectedCoverFile(null);

        } else {
          // Fallback to localStorage if no token
          const hasLocalData = populateFormFromLocalStorage();
          setProfileData(true);
        }

        // Fetch supported banks for vendors
        if (isVendor) {
          try {
            const banksResponse = await fetchSupportedBanks(token);
            setSupportedBanks(banksResponse.banks || []);
          } catch (error) {
            console.error('Failed to fetch supported banks:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Fallback to localStorage
        const hasLocalData = populateFormFromLocalStorage();
        setProfileData(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isVendor, isCourier, isUser]);


  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedLogoFile(file);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPicture(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately based on user type
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          showError('Authentication required. Please log in again.');
          return;
        }

        setLoading(true);
        let response;

        if (isVendor) {
          response = await uploadVendorImages(token, { logo: file });
          // Handle the nested response structure
          const logoUrl = response.images?.logo || response.logo;
          setProfilePicture(logoUrl);
          console.log('✅ Vendor logo updated:', logoUrl);
          showSuccess('Profile picture updated successfully!');
        } else if (isCourier) {
          response = await uploadCourierImages(token, { profile_image: file });
          // Handle potential nested response structure
          const imageUrl = response.images?.profile_image || response.profile_image;
          setProfilePicture(imageUrl);
          console.log('✅ Courier profile image updated:', imageUrl);
          showSuccess('Profile picture updated successfully!');
        } else {
          response = await uploadUserProfileImage(token, file);
          // Handle potential nested response structure
          const imageUrl = response.images?.profile_image || response.profile_image;
          setProfilePicture(imageUrl);
          console.log('✅ User profile image updated:', imageUrl);
          showSuccess('Profile picture updated successfully!');
          // Save to localStorage so UserHeader/Sidebar reflect immediately
          if (imageUrl) {
            localStorage.setItem('profile_image', imageUrl);
            // Also update user object in localStorage if present
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              try {
                const userData = JSON.parse(savedUser);
                userData.profile_image = imageUrl;
                localStorage.setItem('user', JSON.stringify(userData));
              } catch (e) {}
            }
          }
        }

        // Clear preview and selected file
        setPreviewPicture(null);
        setSelectedLogoFile(null);

      } catch (error) {
        console.error('Error uploading profile picture:', error);
        showError(error instanceof Error ? error.message : 'Failed to upload profile picture');
        setPreviewPicture(null);
        setSelectedLogoFile(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedCoverFile(file);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCoverPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload cover photo immediately (only vendors and couriers can have cover photos)
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          showError('Authentication required. Please log in again.');
          return;
        }

        setLoading(true);
        let response;

        if (isVendor) {
          response = await uploadVendorImages(token, { cover_image: file });
          // Handle the nested response structure
          const coverUrl = response.images?.cover_image || response.cover_image;
          setCoverPhoto(coverUrl);
          console.log('✅ Vendor cover photo updated:', coverUrl);
          showSuccess('Cover photo updated successfully!');
        } else if (isCourier) {
          // Couriers might not have cover photos, but we can use the unified endpoint
          showError('Cover photos are not supported for courier profiles');
          return;
        } else {
          showError('Cover photos are only available for vendor accounts');
          return;
        }

        // Clear preview and selected file
        setPreviewCoverPhoto(null);
        setSelectedCoverFile(null);

      } catch (error) {
        console.error('Error uploading cover photo:', error);
        showError(error instanceof Error ? error.message : 'Failed to upload cover photo');
        setPreviewCoverPhoto(null);
        setSelectedCoverFile(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let updateData;
      let updatedProfile;
      let logoUrl: string = profilePicture || '';
      let coverPhotoUrl: string = coverPhoto || '';

      if (isVendor) {
        // Handle image uploads to Cloudinary first

        if (selectedLogoFile) {
          try {
            const { uploadMenuItemImage } = await import('../services/cloudinaryService');
            logoUrl = await uploadMenuItemImage(selectedLogoFile);
          } catch (error) {
            console.error('Failed to upload logo:', error);
            throw new Error('Failed to upload logo image');
          }
        }

        if (selectedCoverFile) {
          try {
            const { uploadMenuItemImage } = await import('../services/cloudinaryService');
            coverPhotoUrl = await uploadMenuItemImage(selectedCoverFile);
          } catch (error) {
            console.error('Failed to upload cover photo:', error);
            throw new Error('Failed to upload cover photo image');
          }
        }

        const toTime = (val: string) => {
          if (!val) return '';
          // If already HH:mm:ss, keep as is; if HH:mm, append :00
          return /^\d{2}:\d{2}:\d{2}$/.test(val) ? val : /\d{2}:\d{2}/.test(val) ? `${val}:00` : val;
        };

        updateData = {
          business_name: firstName + ' ' + lastName,
          business_category: businessCategory,
          business_description: businessDescription,
          bio: bio,
          logo: logoUrl,
          cover_image: coverPhotoUrl,
          cover_photo: coverPhotoUrl,
          phone: phone,
          business_address: businessAddress,
          delivery_radius: deliveryRadius,
          service_areas: serviceAreas,
          opening_hours: toTime(openingHours),
          closing_hours: toTime(closingHours),
          offers_delivery: offersDelivery
        };
        updatedProfile = await updateVendorProfile(token, updateData, { method: 'PATCH' });
      } else if (isCourier) {
        updateData = {
          full_name: firstName + ' ' + lastName,
          phone: phone,
          business_address: businessAddress,
          business_category: businessCategory,
          business_description: businessDescription,
          delivery_radius: deliveryRadius,
          service_areas: serviceAreas,
          opening_hours: openingHours ? `${openingHours}:00` : '',
          closing_hours: closingHours ? `${closingHours}:00` : '',
          offers_delivery: offersDelivery,
          profile_picture: previewPicture || profilePicture
        };
        updatedProfile = await updateCourierProfile(token, updateData);
      } else {
        updateData = {
          first_name: firstName,
          last_name: lastName,
          phone: phone
        };
        updatedProfile = await updateUserProfile(token, updateData);
      }

      // Update localStorage as backup
      const currentVendorProfile = JSON.parse(localStorage.getItem('vendor_profile') || '{}');
      const updatedVendorProfile = {
        ...currentVendorProfile,
        business_name: firstName + ' ' + lastName,
        phone: phone,
        business_address: businessAddress,
        business_category: businessCategory,
        business_description: businessDescription,
        bio: bio,
        delivery_radius: deliveryRadius,
        service_areas: serviceAreas,
        opening_hours: openingHours ? `${openingHours}:00` : '',
        closing_hours: closingHours ? `${closingHours}:00` : '',
        offers_delivery: offersDelivery,
        logo: logoUrl || profilePicture,
        cover_photo: coverPhotoUrl || coverPhoto,
        cover_image: coverPhotoUrl || coverPhoto,
        user: {
          ...currentVendorProfile.user,
          email: email,
          first_name: firstName,
          last_name: lastName,
          full_name: firstName + ' ' + lastName
        }
      };

      // Update state with uploaded URLs
      setProfilePicture(logoUrl || profilePicture);
      setCoverPhoto(coverPhotoUrl || coverPhoto);
      setPreviewPicture(null);
      setPreviewCoverPhoto(null);
      setSelectedLogoFile(null);
      setSelectedCoverFile(null);
      localStorage.setItem('vendor_profile', JSON.stringify(updatedVendorProfile));
      localStorage.setItem('vendor_profile', JSON.stringify(updatedVendorProfile));

      // Update local state
      setProfilePicture(previewPicture || profilePicture);
      setCoverPhoto(previewCoverPhoto || coverPhoto);
      setPreviewPicture(null);
      setPreviewCoverPhoto(null);
      setProfileData(updatedProfile);

      showSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      showError(error.message || 'Failed to update profile');
    }
  };

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111', maxWidth: 900, margin: '0 auto', padding: '16px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
      <h2 style={{ fontWeight: 700, fontSize: 'clamp(24px, 5vw, 32px)', marginBottom: 8 }}>Profile Settings</h2>
          <div style={{ color: '#888', fontSize: 'clamp(14px, 3vw, 17px)', marginBottom: 8 }}>Manage your Bestie Account and preferences</div>
        </div>
        <div style={{
          background: isVendor ? '#10b981' : isCourier ? '#f59e0b' : '#3b82f6',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          textTransform: 'capitalize'
        }}>
          {isVendor ? 'Business Owner' : isCourier ? 'Delivery Partner' : 'Customer'}
        </div>
      </div>
      
      {/* Removed verification and helper banners for a cleaner profile UI */}
      
      {loading ? (
        <div style={{ color: '#888', fontSize: 18 }}>Loading profile...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', fontSize: 18 }}>{error}</div>
      ) : profileData ? (
        <form onSubmit={handleSave} ref={formRef}>
          {/* Cover Photo Section */}
          {isVendor && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ position: 'relative', width: '100%', height: 200, background: '#f3f4f6', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                {previewCoverPhoto ? (
                  <img src={previewCoverPhoto} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : coverPhoto ? (
                  <img src={coverPhoto} alt="Cover Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: 'white' }}>
                      <Camera size={48} />
                      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 600 }}>Add Cover Photo</div>
                      <div style={{ fontSize: 14, opacity: 0.9 }}>Showcase your business</div>
                    </div>
                  </div>
                )}
                {editMode && (
                  <button
                    type="button"
                    onClick={() => coverPhotoInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'rgba(0,0,0,0.6)',
                      border: 'none',
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      color: 'white'
                    }}
                    aria-label="Change cover photo"
                  >
                    <Camera size={24} />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={coverPhotoInputRef}
                  style={{ display: 'none' }}
                  onChange={handleCoverPhotoChange}
                  disabled={!editMode}
                />
              </div>
            </div>
          )}
    
          {/* Profile Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                <div style={{ position: 'relative', width: 80, height: 80 }}>
                  {previewPicture ? (
                    <img src={previewPicture} alt="Profile Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : profilePicture ? (
                    <img src={profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#10b981' }}>{(firstName || 'U')[0]}</div>
                  )}
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      aria-label="Change profile picture"
                    >
                      <Camera size={18} color="#fff" />
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handlePictureChange}
                    disabled={!editMode}
                  />
                </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{firstName && lastName ? `${firstName} ${lastName}` : firstName || 'User'}</div>
              <div style={{ color: '#888', fontSize: 16 }}>{email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{ color: '#10b981', fontSize: 14, fontWeight: '600', textTransform: 'capitalize' }}>
                  {userRole === 'user' ? 'Customer' : userRole === 'vendor' ? 'Business Owner' : 'Delivery Partner'}
                </div>
                {/* Verification badge removed */}
              </div>
        </div>
            {!editMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button type="button" onClick={() => setEditMode(true)} style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit2 size={18} /> Edit
                </button>
                <button type="button" onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }} style={{ background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button type="button" onClick={() => setEditMode(false)} style={{ background: '#6b7280', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="button" onClick={() => formRef.current?.requestSubmit()} style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer' }}>
                  Save
            </button>
              </div>
            )}
      </div>
      {/* Profile Form */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: 32 }}>
        <div>
            <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#10b981" /> First Name
            </label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }} disabled={!editMode} />
        </div>
        <div>
            <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#10b981" /> Last Name
            </label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }} disabled={!editMode} />
        </div>
        <div>
            <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#10b981" /> Email
            </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }} disabled={!editMode} />
            </div>
        </div>

          {/* Business Information Section - Only for Vendors and Couriers */}
          {(isVendor || isCourier) && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building2 size={24} color="#10b981" />
                {isCourier ? 'Courier Information' : 'Business Information'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: 24 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#10b981" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} color="#10b981" /> {isCourier ? 'Service Type' : 'Business Category'}
                </label>
                <input
                  type="text"
                  value={businessCategory}
                  onChange={e => setBusinessCategory(e.target.value)}
                  placeholder={isCourier ? 'e.g., Food Delivery, Groceries' : 'Business Category'}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#10b981" /> {isCourier ? 'Service Areas' : 'Business Address'}
              </label>
              <input
                type="text"
                value={businessAddress}
                onChange={e => setBusinessAddress(e.target.value)}
                placeholder={isCourier ? 'e.g., Lagos, Abuja, Port Harcourt' : 'Business Address'}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
                disabled={!editMode}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} color="#10b981" /> {isCourier ? 'Service Description' : 'Business Description'}
              </label>
              <textarea
                value={businessDescription}
                onChange={e => setBusinessDescription(e.target.value)}
                placeholder={isCourier ? 'Describe your delivery services...' : 'Describe your business...'}
                rows={3}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                disabled={!editMode}
              />
            </div>
            {isVendor && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="#10b981" /> Bio
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell customers about yourself..."
                  rows={2}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  disabled={!editMode}
                />
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: 24 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#10b981" /> {isCourier ? 'Delivery Radius (km)' : 'Delivery Radius (km)'}
                </label>
                <input
                  type="text"
                  value={deliveryRadius}
                  onChange={e => setDeliveryRadius(e.target.value)}
                  placeholder={isCourier ? 'e.g., 10' : 'e.g., 5'}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="#10b981" /> {isCourier ? 'Service Areas' : 'Service Areas'}
                </label>
                <input
                  type="text"
                  value={serviceAreas}
                  onChange={e => setServiceAreas(e.target.value)}
                  placeholder={isCourier ? 'e.g., Ikeja, Victoria Island' : 'e.g., Ikeja, Victoria Island'}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: 24 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#10b981" /> {isCourier ? 'Start Time' : 'Opening Hours'}
                </label>
                <input
                  type="time"
                  value={openingHours}
                  onChange={e => setOpeningHours(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                  disabled={!editMode}
                />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#10b981" /> {isCourier ? 'End Time' : 'Closing Hours'}
                </label>
                <input
                  type="time"
                  value={closingHours}
                  onChange={e => setClosingHours(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="checkbox"
                id="offersDelivery"
                checked={offersDelivery}
                onChange={e => setOffersDelivery(e.target.checked)}
                disabled={!editMode}
                style={{ width: 18, height: 18 }}
              />
              <label htmlFor="offersDelivery" style={{ fontWeight: 600, fontSize: 15, cursor: editMode ? 'pointer' : 'default' }}>
                {isCourier ? 'Available for Delivery' : 'Offers Delivery Service'}
              </label>
            </div>
          </div>
          )}

          {/* Bank Information Section - Only for Vendors */}
          {isVendor && (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building2 size={24} color="#10b981" /> Bank Information
              </div>
              <div style={{ 
                background: '#f8fffe', 
                border: '1px solid #d1fae5', 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <Shield size={20} color="#059669" />
                <div style={{ fontSize: 14, color: '#047857', lineHeight: 1.4 }}>
                  <strong>Bank details are verified and secure.</strong> You can update your bank information below. Changes may require re-verification.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: 24 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={16} color="#10b981" /> Bank Name
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => {
                      const selectedBank = supportedBanks.find(bank => bank.name === e.target.value);
                      setBankName(e.target.value);
                      setBankCode(selectedBank?.code || '');
                    }}
                    style={{ 
                      width: '100%', 
                      padding: 12, 
                      borderRadius: 8, 
                      border: '1.5px solid #e5e7eb', 
                      fontSize: 16, 
                      marginTop: 6,
                      backgroundColor: '#fff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Bank</option>
                    {supportedBanks.map((bank) => (
                      <option key={bank.code} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} color="#10b981" /> Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    style={{ 
                      width: '100%', 
                      padding: 12, 
                      borderRadius: 8, 
                      border: '1.5px solid #e5e7eb', 
                      fontSize: 16, 
                      marginTop: 6,
                      backgroundColor: '#fff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="#10b981" /> Account Name
                  </label>
                  <input
                    type="text"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    placeholder="Enter account name"
                    style={{ 
                      width: '100%', 
                      padding: 12, 
                      borderRadius: 8, 
                      border: '1.5px solid #e5e7eb', 
                      fontSize: 16, 
                      marginTop: 6,
                      backgroundColor: '#fff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={async () => {
                    if (!bankName || !bankAccountNumber || !bankAccountName) {
                      showError('Please fill in all bank details');
                      return;
                    }
                    
                    try {
                      const token = localStorage.getItem('access_token');
                      if (!token) {
                        showError('Authentication required');
                        return;
                      }
                      
                      await updateVendorBankDetails(token, {
                        bank_account_number: bankAccountNumber,
                        bank_account_name: bankAccountName,
                        bank_name: bankName,
                        bank_code: bankCode
                      });
                      
                      showSuccess('Bank details updated successfully');
                      setBankVerified(false); // Reset verification status
                    } catch (error) {
                      console.error('Failed to update bank details:', error);
                      showError('Failed to update bank details');
                    }
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Update Bank Details
                </button>
              </div>
            </div>
          )}

          {/* Courier-Specific Section */}
          {isCourier && (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Truck size={24} color="#10b981" /> Courier Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: 24 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={16} color="#10b981" /> Vehicle Type
                  </label>
                  <select
                    value={deliveryRadius} // Reusing this field for vehicle type
                    onChange={e => setDeliveryRadius(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                    disabled={!editMode}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="bike">Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#10b981" /> Coverage Area
                  </label>
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={e => setServiceAreas(e.target.value)}
                    placeholder="e.g., Ikeja, Victoria Island, Lekki"
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* User-Specific Section */}
          {isUser && (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={24} color="#10b981" /> Customer Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: 24 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#10b981" /> Preferred Delivery Area
                  </label>
                  <input
                    type="text"
                    value={businessAddress} // Reusing this field for preferred delivery area
                    onChange={e => setBusinessAddress(e.target.value)}
                    placeholder="e.g., Ikeja, Victoria Island"
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, boxSizing: 'border-box' }}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="#10b981" /> Preferred Delivery Time
                  </label>
                  <select
                    value={openingHours} // Reusing this field for preferred delivery time
                    onChange={e => setOpeningHours(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
                    disabled={!editMode}
                  >
                    <option value="">Select Preferred Time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 8PM)</option>
                    <option value="night">Night (8PM - 12AM)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security Section */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Shield size={24} color="#10b981" /> Privacy & Security
        </div>
            <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 16, background: '#f8fafc', borderRadius: 8, padding: '12px 18px' }}>Change Password</div>
            <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 16, background: '#f8fafc', borderRadius: 8, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              Two-Factor Authentication <span style={{ background: '#facc15', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 6, padding: '2px 10px', marginLeft: 8 }}>Recommended</span>
        </div>
            <div style={{ fontWeight: 600, fontSize: 16, background: '#f8fafc', borderRadius: 8, padding: '12px 18px' }}>Download my Data</div>
      </div>
      {/* Save Changes Button */}
          {editMode && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 32px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/save.png" alt="Save" style={{ width: 22, height: 22 }} /> Save Changes
        </button>
      </div>
          )}
        </form>
      ) : (
        <div style={{ color: '#888', fontSize: 18 }}>No profile data found.</div>
      )}

    </div>
  );
};

export default ProfilePage; 