import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, BarChart3, CreditCard, Menu, X, HelpCircle, Settings, Camera, Eye, EyeOff, Clock } from 'lucide-react';
import CourierHeader from '../components/CourierHeader';
import { fetchCourierProfile, updateCourierProfile } from '../api';

const MobileCourierProfile: React.FC = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  
  // Editable fields - will be populated from localStorage
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('18:00');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending' or 'verified'
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [hasBike, setHasBike] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  // Auto-populate profile data from API on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const profileData = await fetchCourierProfile(token);
          console.log('Loaded courier profile data:', profileData);

          // Populate from API response
          setFullName(profileData.user?.first_name + ' ' + profileData.user?.last_name || profileData.first_name + ' ' + profileData.last_name || 'Courier Partner');
          setEmail(profileData.user?.email || profileData.email || 'Enter your email');
          setPhoneNumber(profileData.phone || 'Enter your phone number');
          setDeliveryRadius(profileData.delivery_radius || '');
          setOpeningTime(profileData.opening_hours || '08:00');
          setClosingTime(profileData.closing_hours || '18:00');
          setVehicleType(profileData.vehicle_type || 'Motorcycle');
          setHasBike(profileData.has_bike !== undefined ? profileData.has_bike : true);
          setServiceAreas(profileData.service_areas || []);
          setVerificationStatus(profileData.verification_status || 'pending');
          setProfilePicture(profileData.profile_picture || null);
        } else {
          // Fallback to localStorage
          populateFromLocalStorage();
        }
      } catch (error) {
        console.log('Error loading profile from API:', error);
        // Fallback to localStorage
        populateFromLocalStorage();
      }
    };

    const populateFromLocalStorage = () => {
      try {
        // Get user data from localStorage - check multiple possible sources
        const storedFirstName = localStorage.getItem('first_name') || localStorage.getItem('user_first_name');
        const storedLastName = localStorage.getItem('last_name') || localStorage.getItem('user_last_name');
        const storedEmail = localStorage.getItem('email') || localStorage.getItem('user_email');
        const storedPhone = localStorage.getItem('phone_number') || localStorage.getItem('user_phone') || localStorage.getItem('phone');
        const storedProfileImage = localStorage.getItem('profile_image') || localStorage.getItem('user_profile_image');
        const storedCourierProfile = localStorage.getItem('courier_profile');

        // Also check for signup data that might be stored
        const signupData = localStorage.getItem('pending_profile_data');
        let signupInfo = null;
        if (signupData) {
          try {
            signupInfo = JSON.parse(signupData);
            console.log('Found signup data:', signupInfo); // Debug log
      } catch (e) {
            console.log('Error parsing signup data:', e);
          }
        }

        // Set full name - prioritize stored data, then signup data
        if (storedFirstName && storedLastName) {
          setFullName(`${storedFirstName} ${storedLastName}`);
        } else if (storedFirstName) {
          setFullName(storedFirstName);
        } else if (signupInfo?.fullName) {
          setFullName(signupInfo.fullName);
        }

        // Set email - prioritize stored data, then signup data
        if (storedEmail) {
          setEmail(storedEmail);
        } else if (signupInfo?.email) {
          setEmail(signupInfo.email);
        }

        // Set phone number - prioritize stored data, then signup data
        if (storedPhone) {
          setPhoneNumber(storedPhone);
        } else if (signupInfo?.phone) {
          setPhoneNumber(signupInfo.phone);
        }

        // Set profile picture
        if (storedProfileImage) {
          setProfilePicture(storedProfileImage);
        }

        // Set courier-specific data if available
        if (storedCourierProfile) {
          try {
            const courierData = JSON.parse(storedCourierProfile);
            if (courierData.delivery_radius) setDeliveryRadius(courierData.delivery_radius);
            if (courierData.opening_time) setOpeningTime(courierData.opening_time);
            if (courierData.closing_time) setClosingTime(courierData.closing_time);
            if (courierData.vehicle_type) setVehicleType(courierData.vehicle_type);
            if (courierData.has_vehicle !== undefined) setHasBike(courierData.has_vehicle);
            if (courierData.service_areas) setServiceAreas(courierData.service_areas);
            if (courierData.verification_status) setVerificationStatus(courierData.verification_status);
          } catch (error) {
            console.log('Error parsing courier profile data:', error);
          }
        }

        // Also check signup data for courier-specific fields
        if (signupInfo) {
          if (signupInfo.serviceAreas && signupInfo.serviceAreas.length > 0) {
            setServiceAreas(signupInfo.serviceAreas);
          }
          if (signupInfo.vehicleType) {
            setVehicleType(signupInfo.vehicleType);
          }
        }

        // Set default values if no data found - use more realistic defaults
        if (!fullName) {
          setFullName('Courier Partner');
        }
        if (!email) {
          setEmail('Enter your email');
        }
        if (!phoneNumber) {
          setPhoneNumber('Enter your phone number');
        }
        if (serviceAreas.length === 0) {
          setServiceAreas([]); // Empty array instead of fake areas
        }

      } catch (error) {
        console.log('Error populating profile data:', error);
        // Set realistic fallback values
        setFullName('Courier Partner');
        setEmail('Enter your email');
        setPhoneNumber('Enter your phone number');
        setServiceAreas([]);
      }
    };

    loadProfileData();
  }, []);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewPicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const updateData = {
          first_name: fullName.split(' ')[0] || '',
          last_name: fullName.split(' ').slice(1).join(' ') || '',
          phone: phoneNumber,
          delivery_radius: deliveryRadius,
          opening_hours: openingTime,
          closing_hours: closingTime,
          vehicle_type: vehicleType,
          has_bike: hasBike,
          service_areas: serviceAreas,
          profile_picture: previewPicture || profilePicture
        };

        await updateCourierProfile(token, updateData);
      }

      // Save profile data to localStorage as backup
      if (previewPicture) {
        setProfilePicture(previewPicture);
        setPreviewPicture(null);
        localStorage.setItem('profile_image', previewPicture);
      }

      // Save courier-specific data
      const courierData = {
        delivery_radius: deliveryRadius,
        opening_time: openingTime,
        closing_time: closingTime,
        vehicle_type: vehicleType,
        has_vehicle: hasBike,
        service_areas: serviceAreas,
        verification_status: verificationStatus
      };

      localStorage.setItem('courier_profile', JSON.stringify(courierData));

      // Save basic profile data
      if (fullName) {
        const nameParts = fullName.split(' ');
        if (nameParts.length >= 2) {
          localStorage.setItem('first_name', nameParts[0]);
          localStorage.setItem('last_name', nameParts.slice(1).join(' '));
        } else {
          localStorage.setItem('first_name', fullName);
        }
      }

      if (email) {
        localStorage.setItem('email', email);
      }

      if (phoneNumber) {
        localStorage.setItem('phone_number', phoneNumber);
      }

      setEditMode(false);
      // Show success message
      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Error saving profile data:', error);
      alert('Error saving profile data. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPreviewPicture(null);
    
    // Reset to stored values from localStorage
    try {
      const storedFirstName = localStorage.getItem('first_name');
      const storedLastName = localStorage.getItem('last_name');
      const storedEmail = localStorage.getItem('email');
      const storedPhone = localStorage.getItem('phone_number');
      const storedCourierProfile = localStorage.getItem('courier_profile');
      
      // Reset basic profile
      if (storedFirstName && storedLastName) {
        setFullName(`${storedFirstName} ${storedLastName}`);
      } else if (storedFirstName) {
        setFullName(storedFirstName);
              } else {
          setFullName('Courier Partner');
        }
        
        if (storedEmail) {
          setEmail(storedEmail);
        } else {
          setEmail('Enter your email');
        }
        
        if (storedPhone) {
          setPhoneNumber(storedPhone);
        } else {
          setPhoneNumber('Enter your phone number');
        }
      
      // Reset courier-specific data
      if (storedCourierProfile) {
        try {
          const courierData = JSON.parse(storedCourierProfile);
          setDeliveryRadius(courierData.delivery_radius || '10km');
          setOpeningTime(courierData.opening_time || '08:00');
          setClosingTime(courierData.closing_time || '18:00');
          setVehicleType(courierData.vehicle_type || 'Motorcycle');
          setHasBike(courierData.has_vehicle !== undefined ? courierData.has_vehicle : true);
          setServiceAreas(courierData.service_areas || ['Lagos Island', 'Victoria Island', 'Ikoyi']);
          setVerificationStatus(courierData.verification_status || 'pending');
        } catch (error) {
          console.log('Error parsing stored courier data:', error);
          // Set default values
          setDeliveryRadius('10km');
          setOpeningTime('08:00');
          setClosingTime('18:00');
          setVehicleType('Motorcycle');
          setHasBike(true);
          setServiceAreas(['Lagos Island', 'Victoria Island', 'Ikoyi']);
          setVerificationStatus('pending');
        }
              } else {
          // Set default values if no stored data
          setDeliveryRadius('');
          setOpeningTime('08:00');
          setClosingTime('18:00');
          setVehicleType('Motorcycle');
          setHasBike(true);
          setServiceAreas([]);
          setVerificationStatus('pending');
        }
      } catch (error) {
        console.log('Error resetting profile data:', error);
        // Set realistic fallback values
        setFullName('Courier Partner');
        setEmail('Enter your email');
        setPhoneNumber('Enter your phone number');
        setDeliveryRadius('');
        setOpeningTime('08:00');
        setClosingTime('18:00');
        setVehicleType('Motorcycle');
        setHasBike(true);
        setServiceAreas([]);
        setVerificationStatus('pending');
    }
  };

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <CourierHeader />


      {/* Profile Content */}
      <div style={{ padding: '24px 16px' }}>

            {/* Profile Picture Section */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
            padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <img
              src={previewPicture || profilePicture || '/logo.png'}
              alt="Profile"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
                {editMode && (
              <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#10b981',
                  border: 'none',
                      borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                <Camera size={20} color="#fff" />
              </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: '#1f2937'
          }}>
            {fullName}
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 16px 0'
          }}>
            Courier Partner
          </p>
          
          {/* Verification UI removed */}
            </div>

        {/* Verification UI removed */}

        {/* Profile Form */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
          padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Personal Information
                </h3>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCancel}
                  style={{
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            )}
              </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Full Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                  fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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

              {/* Phone Number */}
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
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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

              {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                  fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              {/* Vehicle Type */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
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
                  <option value="Van">Van</option>
                </select>
              </div>

              {/* Has Bike */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Do you have a vehicle?
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="hasBike"
                      checked={hasBike}
                      onChange={() => setHasBike(true)}
                      disabled={!editMode}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Yes</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name="hasBike"
                      checked={!hasBike}
                      onChange={() => setHasBike(false)}
                      disabled={!editMode}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>No</span>
                  </label>
                </div>
              </div>

              {/* Delivery Radius */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Delivery Radius
                </label>
                <input
                  type="text"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(e.target.value)}
                  disabled={!editMode}
                  placeholder="e.g., 10km"
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

              {/* Opening and Closing Time */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
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
                    marginBottom: '8px'
                  }}>
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
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

              {/* Service Areas */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Service Areas
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: editMode ? '#fff' : '#f9fafb',
                  minHeight: '48px'
                }}>
                  {serviceAreas.map((area, index) => (
                    <span key={index} style={{
                      background: '#10b981',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>


            </div>
          </form>

          {/* Change Password Section */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginTop: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1f2937'
            }}>
              Change Password
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Current Password
                </label>
                <input
                  type="password"
                  disabled={!editMode}
                  placeholder="Enter current password"
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
                  marginBottom: '8px'
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  disabled={!editMode}
                  placeholder="Enter new password"
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
                  marginBottom: '8px'
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  disabled={!editMode}
                  placeholder="Confirm new password"
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

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 50
      }}>
        {[
          { 
            icon: <Home size={20} />, 
            label: 'Dashboard', 
            active: false,
            onClick: () => navigate('/courier/dashboard')
          },
          { 
            icon: <List size={20} />, 
            label: 'Delivery List', 
            active: false,
            onClick: () => navigate('/courier/deliveries')
          },
          { 
            icon: <BarChart3 size={20} />, 
            label: 'Analytics', 
            active: false,
            onClick: () => navigate('/courier/analytics')
          },
          { 
            icon: <CreditCard size={20} />, 
            label: 'Payout', 
            active: false,
            onClick: () => navigate('/courier/payouts')
          },
          { 
            icon: <Settings size={20} />, 
            label: 'Profile', 
            active: true,
            onClick: () => navigate('/courier/profile')
          }
        ].map((item, index) => (
          <div 
            key={index} 
            onClick={item.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: item.active ? '#10b981' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '10px', fontWeight: '500' }}>{item.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MobileCourierProfile;
