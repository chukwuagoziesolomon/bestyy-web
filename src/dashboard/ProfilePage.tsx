import React, { useEffect, useState, useRef } from 'react';
import { showError, showSuccess } from '../toast';
import { Edit2, Camera, Building2, Bell, Shield, Clock, MapPin, Truck, User, Mail, Phone } from 'lucide-react';

const ProfilePage = () => {

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  // Editable fields - expanded to include all vendor signup data
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [serviceAreas, setServiceAreas] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [closingHours, setClosingHours] = useState('');
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setFullName(vendor.business_name || vendor.user?.full_name || '');
        setNickName(vendor.user?.first_name || '');
        setEmail(vendor.user?.email || vendor.email || '');
        setPhone(vendor.phone || '');
        setBusinessAddress(vendor.business_address || '');
        setBusinessCategory(vendor.business_category || '');
        setBusinessDescription(vendor.business_description || '');
        setDeliveryRadius(vendor.delivery_radius || '');
        setServiceAreas(vendor.service_areas || '');
        setOpeningHours(vendor.opening_hours?.replace(':00', '') || '');
        setClosingHours(vendor.closing_hours?.replace(':00', '') || '');
        setOffersDelivery(vendor.offers_delivery || false);
        setProfilePicture(vendor.logo || null);

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

        setFullName(user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '');
        setNickName(user.first_name || '');
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

        setFullName(pending.fullName || pending.businessName || '');
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
    // Only populate from localStorage - no API calls
    const hasLocalData = populateFormFromLocalStorage();
    
    // Always set profile to true so the form is always shown
    // Users can fill out the form even if there's no existing data
    setProfile(true);
    setLoading(false);
    
    if (hasLocalData) {
      console.log('Profile loaded from localStorage successfully');
    } else {
      console.log('No local data found, showing empty form for user input');
    }
  }, []);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update the vendor_profile in localStorage with the new data
      const currentVendorProfile = JSON.parse(localStorage.getItem('vendor_profile') || '{}');
      const updatedVendorProfile = {
        ...currentVendorProfile,
        business_name: fullName,
        phone: phone,
        business_address: businessAddress,
        business_category: businessCategory,
        business_description: businessDescription,
        delivery_radius: deliveryRadius,
        service_areas: serviceAreas,
        opening_hours: openingHours ? `${openingHours}:00` : '',
        closing_hours: closingHours ? `${closingHours}:00` : '',
        offers_delivery: offersDelivery,
        logo: previewPicture || profilePicture,
        user: {
          ...currentVendorProfile.user,
          email: email,
          first_name: nickName,
          full_name: fullName
        }
      };
      localStorage.setItem('vendor_profile', JSON.stringify(updatedVendorProfile));

      // Update local state
      setProfilePicture(previewPicture || profilePicture);
      setPreviewPicture(null);
      setProfile(updatedVendorProfile);

      showSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error: any) {
      showError('Failed to update profile');
    }
  };

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111', maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 8 }}>Profile Settings</h2>
          <div style={{ color: '#888', fontSize: 17, marginBottom: 8 }}>Manage your Bestie Account and preferences</div>
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
      
      {/* Role-specific help text */}
      {isVendor && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          color: '#166534'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Business Profile</div>
          <div style={{ fontSize: '14px' }}>Complete your business information to help customers find and order from you.</div>
        </div>
      )}
      
      {isCourier && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fed7aa',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          color: '#92400e'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Delivery Partner Profile</div>
          <div style={{ fontSize: '14px' }}>Set up your delivery preferences and service areas to receive delivery requests.</div>
        </div>
      )}
      
      {isUser && (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          color: '#1e40af'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Customer Profile</div>
          <div style={{ fontSize: '14px' }}>Customize your preferences to get the best delivery experience.</div>
        </div>
      )}
      
      {loading ? (
        <div style={{ color: '#888', fontSize: 18 }}>Loading profile...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', fontSize: 18 }}>{error}</div>
      ) : profile ? (
        <form onSubmit={handleSave}>
          {/* Profile Card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              {previewPicture ? (
                <img src={previewPicture} alt="Profile Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
              ) : profilePicture ? (
                <img src={profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#10b981' }}>{(nickName || fullName || 'U')[0]}</div>
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
              <div style={{ fontWeight: 700, fontSize: 22 }}>{nickName || fullName || 'User'}</div>
              <div style={{ color: '#888', fontSize: 16 }}>{email}</div>
              <div style={{ color: '#10b981', fontSize: 14, fontWeight: '600', textTransform: 'capitalize' }}>
                {userRole === 'user' ? 'Customer' : userRole === 'vendor' ? 'Business Owner' : 'Delivery Partner'}
              </div>
        </div>
            <button type="button" onClick={() => setEditMode(!editMode)} style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Edit2 size={18} /> Edit
            </button>
      </div>
      {/* Profile Form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div>
            <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#10b981" /> Full Name
            </label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode} />
        </div>
        <div>
            <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#10b981" /> Nick Name
            </label>
              <input type="text" value={nickName} onChange={e => setNickName(e.target.value)} placeholder="Nick Name" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode} />
        </div>
        <div>
            <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#10b981" /> Language
            </label>
              <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
          </select>
        </div>
        <div>
            <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#10b981" /> Email
            </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }} disabled={!editMode} />
            </div>
        </div>

          {/* Business Information Section - Only for Vendors and Couriers */}
          {(isVendor || isCourier) && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building2 size={24} color="#10b981" />
                {isCourier ? 'Courier Information' : 'Business Information'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#10b981" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6, resize: 'vertical' }}
                disabled={!editMode}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#10b981" /> {isCourier ? 'Delivery Radius (km)' : 'Delivery Radius (km)'}
                </label>
                <input
                  type="text"
                  value={deliveryRadius}
                  onChange={e => setDeliveryRadius(e.target.value)}
                  placeholder={isCourier ? 'e.g., 10' : 'e.g., 5'}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
                  disabled={!editMode}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#10b981" /> {isCourier ? 'Start Time' : 'Opening Hours'}
                </label>
                <input
                  type="time"
                  value={openingHours}
                  onChange={e => setOpeningHours(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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

          {/* Courier-Specific Section */}
          {isCourier && (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Truck size={24} color="#10b981" /> Courier Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={16} color="#10b981" /> Vehicle Type
                  </label>
                  <select
                    value={deliveryRadius} // Reusing this field for vehicle type
                    onChange={e => setDeliveryRadius(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#10b981" /> Preferred Delivery Area
                  </label>
                  <input
                    type="text"
                    value={businessAddress} // Reusing this field for preferred delivery area
                    onChange={e => setBusinessAddress(e.target.value)}
                    placeholder="e.g., Ikeja, Victoria Island"
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16, marginTop: 6 }}
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

          {/* Notifications Section */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bell size={24} color="#10b981" /> Notifications
        </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Email Notifications</div>
                <div style={{ color: '#888', fontSize: 15 }}>Receive updates about your Order/Bookings via email</div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} disabled={!editMode} />
                <span className="slider round"></span>
              </label>
        </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Push Notification</div>
                <div style={{ color: '#888', fontSize: 15 }}>Get notified when order is Sent</div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={pushNotifications} onChange={e => setPushNotifications(e.target.checked)} disabled={!editMode} />
                <span className="slider round"></span>
              </label>
        </div>
      </div>
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