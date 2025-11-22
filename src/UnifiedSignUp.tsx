import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerMultiRole } from './api';
import { useAuth } from './context/AuthContext';
import { showError, showSuccess, showInfo } from './toast';
import { useImageUpload } from './hooks/useImageUpload';
import PremiumLoadingAnimation from './components/PremiumLoadingAnimation';

const steps = [
  'Role Selection',
  'Account Info',
  'Role Details',
  'Business Details',
];

type UnifiedFormData = {
  // Basic info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  roles: string[];

  // Vendor fields
  business_name: string;
  business_category: string;
  business_address: string;
  delivery_radius: number;
  service_areas: string;
  logo: File | string; // File or URL for business logo

  // Courier fields
  vehicle_type: string;
  license_number: string;
  vehicle_registration: string;
  availability_status: string;

  // Business details (for both vendor and courier)
  cac_number: string;
  tin_number: string;
  opening_hours: string; // HH:MM:SS format
  closing_hours: string; // HH:MM:SS format
  cover_photo: File | string; // File or URL for cover photo

};

const UnifiedSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, setUserFromSignup } = useAuth();

  // Check for pre-selected role from navigation state
  const preSelectedRole = location.state?.preSelectedRole;

  const [formData, setFormData] = useState<UnifiedFormData>(() => {
    const initialRoles = preSelectedRole ? [preSelectedRole] : [];
    return {
      first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '',
      roles: initialRoles,
      business_name: '', business_category: '', business_address: '', delivery_radius: 10, service_areas: '', logo: '' as File | string,
      vehicle_type: '', license_number: '', vehicle_registration: '', availability_status: 'available',
      cac_number: '', tin_number: '', opening_hours: '', closing_hours: '', cover_photo: '' as File | string,
    };
  });

  const [step, setStep] = useState(() => preSelectedRole ? 1 : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [verificationCodes, setVerificationCodes] = useState({ phone: '' });
  const [userId, setUserId] = useState<string>('');
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Image upload hooks
  const { uploadImage: uploadBusinessImage, isUploading: isUploadingImage, error: imageUploadError, clearError: clearImageError } = useImageUpload({
    onSuccess: (fileOrUrl) => {
      handleInputChange('logo', fileOrUrl);
      showSuccess('Business logo selected successfully!');
    },
    onError: (error) => {
      showError(error);
    }
  });

  const { uploadImage: uploadCoverPhoto, isUploading: isUploadingCover, error: coverUploadError, clearError: clearCoverError } = useImageUpload({
    onSuccess: (fileOrUrl) => {
      handleInputChange('cover_photo', fileOrUrl);
      showSuccess('Cover photo selected successfully!');
    },
    onError: (error) => {
      showError(error);
    }
  });


  // Determine if this signup is for user-only (single step after role selection)
  const isUserOnly = formData.roles.length === 1 && formData.roles[0] === 'user';
  // Final step index depends on selected roles
  const finalStepIndex = isUserOnly ? 1 : 3;

  useEffect(() => {
    localStorage.setItem('unified_signup_data', JSON.stringify(formData));
    localStorage.setItem('unified_signup_step', step.toString());
  }, [formData, step]);



  const handleInputChange = (field: keyof UnifiedFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 0: // Role Selection
        if (formData.roles.length === 0) {
          showError('Please select at least one role');
          return false;
        }
        break;
      case 1: // Account Info
        if (!formData.first_name.trim() || !formData.last_name.trim()) {
          showError('First and last name are required');
          return false;
        }
        if (!formData.email.trim()) {
          showError('Email is required');
          return false;
        }
        if (!formData.phone.trim()) {
          showError('Phone number is required');
          return false;
        }
        if (!formData.password.trim()) {
          showError('Password is required');
          return false;
        }
        if (formData.password !== formData.confirm_password) {
          showError('Passwords do not match');
          return false;
        }
        break;
      case 2: // Role Details
        if (formData.roles.includes('vendor')) {
          if (!formData.business_name.trim() || !formData.business_category.trim() || !formData.business_address.trim()) {
            showError('Business details are required for vendor role');
            return false;
          }
          // Business image is optional, no validation needed
        }
        if (formData.roles.includes('courier')) {
          if (!formData.vehicle_type.trim() || !formData.license_number.trim()) {
            showError('Vehicle and license details are required for courier role');
            return false;
          }
        }
        break;
      case 3: // Business Details
        if (!formData.opening_hours.trim()) {
          showError('Opening hours is required');
          return false;
        }
        if (!formData.closing_hours.trim()) {
          showError('Closing hours is required');
          return false;
        }
        break;
    }
    return true;
  };

  const next = async () => {
    if (!validateStep(step)) return;

    setIsLoading(true);
    setAnimationDirection('forward');
    setIsAnimating(true);

    try {
      if (step === finalStepIndex) {
        // Prepare user data for registration
        const userData = {
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          roles: formData.roles,
          ...(isUserOnly ? {} : {
            cac_number: formData.cac_number,
            tin_number: formData.tin_number,
            opening_hours: formData.opening_hours ? `${formData.opening_hours}:00` : '',
            closing_hours: formData.closing_hours ? `${formData.closing_hours}:00` : '',
            cover_photo: formData.cover_photo,
          }),
          ...(formData.roles.includes('vendor') && {
            business_name: formData.business_name,
            business_category: formData.business_category,
            business_address: formData.business_address,
            delivery_radius: formData.delivery_radius,
            service_areas: formData.service_areas,
            logo: formData.logo,
          }),
          ...(formData.roles.includes('courier') && {
            vehicle_type: formData.vehicle_type,
            license_number: formData.license_number,
            vehicle_registration: formData.vehicle_registration,
            availability_status: formData.availability_status,
          }),
        };

        setHasSubmitted(true); // Prevent multiple submissions

        const response = await registerMultiRole(userData);
        console.log('Signup response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', response ? Object.keys(response) : 'null/undefined');

        if (response && response.success) {
          // Store JWT tokens if provided
          if (response.tokens) {
            localStorage.setItem('access_token', response.tokens.access);
            localStorage.setItem('refresh_token', response.tokens.refresh);
          }

          if (isUserOnly) {
            showSuccess('Account created successfully! Redirecting to your dashboard...');
            // Set user in context directly from signup response to avoid async issues
            try {
              console.log('🔵 Setting user from signup response...');
              await setUserFromSignup(response);
              console.log('✅ User set from signup response');
            } catch (setUserError) {
              console.error('❌ setUserFromSignup failed:', setUserError);
              // Still navigate even if setting user fails - tokens are stored
              console.log('⚠️ Navigating to dashboard despite setUserFromSignup error');
            }
            // Go straight to user dashboard for user-only signup
            navigate('/user/dashboard', { replace: true });
          } else {
            showSuccess('Account created successfully! Please complete your verifications.');
            console.log('Registration successful, navigating to WhatsApp verification with signup data');

            // Navigate to WhatsApp verification with signup response data
            navigate('/whatsapp-verification', {
              state: {
                userType: formData.roles[0],
                signupResponse: response // Pass the entire signup response
              }
            });
          }
          return; // Exit early, don't continue with step logic
        } else {
          console.error('Signup failed:', response);
          // Handle different error response formats
          let errorMessage = 'Failed to create account';
          if (response && typeof response === 'object') {
            if (response.message) {
              errorMessage = response.message;
            } else if (response.error) {
              errorMessage = response.error;
            } else if (response.detail) {
              errorMessage = response.detail;
            }
          }
          showError(errorMessage);
          setIsAnimating(false);
          setAnimationDirection(null);
          setIsLoading(false);
          return;
        }
      } else {
        setTimeout(() => setStep(s => Math.min(s + 1, finalStepIndex)), 150);
      }
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 300);
    } catch (err: any) {
      // Extract field-specific errors from backend response
      let errorMessage = err.message || 'Failed to create account';

      // Handle specific UNIQUE constraint error
      if (err.message && err.message.includes('UNIQUE constraint failed: user_userprofile.user_id')) {
        errorMessage = 'An account with this email or phone number already exists. Please try logging in instead.';
      } else if (err.message && err.message.includes('UNIQUE constraint')) {
        errorMessage = 'This information is already registered. Please check your details or try logging in.';
      } else if (err.message && err.message.includes(':')) {
        // If the error contains field-specific messages, display them
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Handle structured error responses
        const errorParts = [];
        Object.entries(err).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            errorParts.push(`${field}: ${messages.join(', ')}`);
          } else if (typeof messages === 'string') {
            errorParts.push(`${field}: ${messages}`);
          }
        });
        if (errorParts.length > 0) {
          errorMessage = errorParts.join('; ');
        }
      }

      showError(errorMessage);
      setIsAnimating(false);
      setAnimationDirection(null);
    } finally {
      setIsLoading(false);
    }
  };

  const back = () => {
    if (preSelectedRole && step === 1) {
      // If we skipped role selection and are on step 1, go back to role selection page
      navigate('/role-selection');
    } else {
      setAnimationDirection('backward');
      setIsAnimating(true);
      setTimeout(() => setStep(s => Math.max(s - 1, preSelectedRole ? 1 : 0)), 150);
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 300);
    }
  };

  // Show loading animation while processing
  if (isLoading && hasSubmitted) {
    return (
      <div className="user-login__bg">
        <div className="user-login__card" style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}>
          <PremiumLoadingAnimation 
            message={step === finalStepIndex ? "Creating your account..." : "Processing..."} 
          />
        </div>
      </div>
    );
  }


  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="user-login__logo">
          <img src="/logo.png" alt="Bestyy Logo" />
        </div>
        <div style={{ width: '100%', marginBottom: '1.2rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            Step {preSelectedRole ? step : step + 1} of {preSelectedRole ? finalStepIndex : finalStepIndex + 1}
          </div>
          <div style={{ height: 5, background: 'var(--divider)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ width: `${((preSelectedRole ? step : step + 1) / (preSelectedRole ? finalStepIndex : finalStepIndex + 1)) * 100}%`, height: '100%', background: 'var(--bestie-gradient)' }} />
          </div>
        </div>

        <div className={`step-content ${animationDirection === 'forward' ? 'slide-in-right' : animationDirection === 'backward' ? 'slide-in-left' : ''} ${isAnimating ? 'animating' : ''}`}>
          {step === 0 && !preSelectedRole && (
            <>
              <h2 className="user-login__heading">Choose Your Role</h2>
              <h3 className="user-login__subheading">Select the roles you want to take on Bestie</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.roles.includes('user')}
                    onChange={() => handleRoleToggle('user')}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Customer</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Order food and track deliveries</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.roles.includes('vendor')}
                    onChange={() => handleRoleToggle('vendor')}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Vendor</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Sell food and manage your business</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.roles.includes('courier')}
                    onChange={() => handleRoleToggle('courier')}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Courier</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Deliver orders and earn money</div>
                  </div>
                </label>
              </div>
            </>
          )}

          {step === 1 && (
          <>
            <h2 className="user-login__heading">Create Your Account</h2>
            <h3 className="user-login__subheading">Basic information for all selected roles</h3>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                className="user-login__input"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                className="user-login__input"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="user-login__input"
                placeholder="your.email@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="user-login__input"
                placeholder="+234 801 234 5678"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="user-login__input"
                placeholder="Create a strong password (min. 6 characters)"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                Password must be at least 6 characters long
              </small>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="user-login__input"
                placeholder="Confirm your password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
              />
            </div>
          </>
        )}

        {!isUserOnly && step === 2 && (
          <>
            <h2 className="user-login__heading">Business & Service Details</h2>
            <h3 className="user-login__subheading">Tell us more about your business and services</h3>

            {formData.roles.includes('vendor') && (
              <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Vendor Details</h4>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input
                    className="user-login__input"
                    placeholder="Enter your business name"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Category</label>
                  <select
                    className="user-login__input"
                    value={formData.business_category}
                    onChange={(e) => handleInputChange('business_category', e.target.value)}
                  >
                    <option value="">Select Business Category</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Shortlet">Shortlet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Business Address</label>
                  <input
                    className="user-login__input"
                    placeholder="Enter your business address"
                    value={formData.business_address}
                    onChange={(e) => handleInputChange('business_address', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Radius (km)</label>
                  <input
                    className="user-login__input"
                    placeholder="e.g. 10"
                    type="number"
                    value={formData.delivery_radius}
                    onChange={(e) => handleInputChange('delivery_radius', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Service Areas</label>
                  <input
                    className="user-login__input"
                    placeholder="e.g. Lagos, Abuja, Port Harcourt"
                    value={formData.service_areas}
                    onChange={(e) => handleInputChange('service_areas', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Logo (Optional)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.background = '#f0fdf4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.background = '#f9fafb';
                    }}
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <div style={{ fontSize: '24px', color: '#6b7280', marginBottom: '8px' }}>📷</div>
                      <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        Click to upload business logo
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        PNG, JPG up to 10MB
                      </div>
                    </div>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadBusinessImage(file, 'vendor-logo');
                        }
                      }}
                      disabled={isUploadingImage}
                      style={{ display: 'none' }}
                    />
                    {isUploadingImage && <div style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Uploading...</div>}
                    {imageUploadError && <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{imageUploadError}</div>}
                    {formData.logo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <img
                          src={formData.logo instanceof File ? URL.createObjectURL(formData.logo) : formData.logo}
                          alt="Business Logo"
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                        <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Logo selected successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {formData.roles.includes('courier') && (
              <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Courier Details</h4>
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select
                    className="user-login__input"
                    value={formData.vehicle_type}
                    onChange={(e) => handleInputChange('vehicle_type', e.target.value)}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">License Number</label>
                  <input
                    className="user-login__input"
                    placeholder="Enter your license number"
                    value={formData.license_number}
                    onChange={(e) => handleInputChange('license_number', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Registration</label>
                  <input
                    className="user-login__input"
                    placeholder="Enter vehicle registration number"
                    value={formData.vehicle_registration}
                    onChange={(e) => handleInputChange('vehicle_registration', e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {!isUserOnly && step === 3 && (
          <>
            <h2 className="user-login__heading">Business Registration & Banking</h2>
            <h3 className="user-login__subheading">Complete your business registration and banking details</h3>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '1rem' }}>Business Registration</h4>
              <div className="form-group">
                <label className="form-label">CAC Number</label>
                <input
                  className="user-login__input"
                  placeholder="Enter your CAC registration number"
                  value={formData.cac_number}
                  onChange={(e) => handleInputChange('cac_number', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">TIN Number</label>
                <input
                  className="user-login__input"
                  placeholder="Enter your Tax Identification Number"
                  value={formData.tin_number}
                  onChange={(e) => handleInputChange('tin_number', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Opening Hours</label>
                <input
                  className="user-login__input"
                  placeholder="e.g. 08:00"
                  value={formData.opening_hours}
                  onChange={(e) => handleInputChange('opening_hours', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Closing Hours</label>
                <input
                  className="user-login__input"
                  placeholder="e.g. 22:00"
                  value={formData.closing_hours}
                  onChange={(e) => handleInputChange('closing_hours', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Photo</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f9fafb',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.background = '#f0fdf4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  >
                    <div style={{ fontSize: '24px', color: '#6b7280', marginBottom: '8px' }}>🖼️</div>
                    <div style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      Click to upload cover photo
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      PNG, JPG up to 10MB
                    </div>
                  </div>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadCoverPhoto(file, 'cover-photo');
                      }
                    }}
                    disabled={isUploadingCover}
                    style={{ display: 'none' }}
                  />
                  {isUploadingCover && <div style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Uploading...</div>}
                  {coverUploadError && <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{coverUploadError}</div>}
                  {formData.cover_photo && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <img
                        src={formData.cover_photo instanceof File ? URL.createObjectURL(formData.cover_photo) : formData.cover_photo}
                        alt="Cover Photo"
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                      <span style={{ color: '#10b981', fontSize: '0.9rem' }}>Cover photo selected successfully</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </>
        )}

        </div>

        <div className="signup-btn-group">
          {(preSelectedRole ? step > 1 : step > 0) && (
            <button className="signup-btn-back" onClick={back} disabled={isLoading}>Back</button>
          )}
          <button
            className="signup-btn-next"
            onClick={next}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : step === finalStepIndex ? 'Complete Signup' : 'Next'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UnifiedSignUp;