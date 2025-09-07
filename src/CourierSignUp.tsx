import React, { useState, useEffect } from 'react';
import CourierTermsStep from './CourierTermsStep';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerCourier, loginUser } from './api';
import { useAuth } from './context/AuthContext';
import { showApiError, showError, showSuccess } from './toast';

// Custom styles to override problematic CSS
const customStyles = `
  .courier-signup__button {
    width: 100%;
    height: 56px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
    margin-top: 32px;
  }
  
  .courier-signup__button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
  }
  
  .courier-signup__button:active {
    transform: translateY(0);
  }
  
  .password-field {
    position: relative;
    width: 100%;
  }
  
  .password-field .user-login__input {
    padding-right: 60px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  .password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .password-toggle:hover {
    background-color: #f3f4f6;
  }
  
  .password-toggle svg {
    width: 24px;
    height: 24px;
    color: #6b7280;
  }
  
  .courier-signup__title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin: 0 0 8px 0;
    color: #1e293b;
    letter-spacing: -0.025em;
  }
  
  .courier-signup__subtitle {
    color: #64748b;
    font-size: 16px;
    text-align: center;
    margin-bottom: 40px;
    line-height: 1.5;
  }
  
  .courier-signup__logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
  }
  
  .courier-signup__logo-box {
    background: #1a1a1a;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
  }
  
  .courier-signup__logo-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .form-group {
    margin-bottom: 24px !important;
  }
  
  .form-group label {
    margin-bottom: 8px !important;
    display: block !important;
  }
  
  .user-login__input {
    margin-bottom: 0 !important;
  }
  
  /* Step 2 specific styles */
  .step2-container {
    width: 100%;
  }
  
  .step2-progress {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 8px;
    margin-bottom: 24px;
    overflow: hidden;
  }
  
  .step2-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #06b6d4 100%);
    border-radius: 8px;
    transition: width 0.3s ease;
  }
  
  .step2-step-indicator {
    color: #374151;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 24px;
    text-align: center;
  }
  
  .step2-time-inputs {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .step2-time-group {
    flex: 1;
  }
  
  .step2-radio-group {
    margin-bottom: 32px;
  }
  
  .step2-radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .step2-radio-input {
    width: 20px;
    height: 20px;
    accent-color: #10b981;
  }
  
  .step2-button-group {
    display: flex;
    gap: 16px;
  }
  
  .step2-back-button {
    flex: 1;
    background: #fff;
    color: #374151;
    font-weight: 600;
    font-size: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 18px 0;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .step2-back-button:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
  }
`;

const CourierSignUp = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    serviceAreas: '',
    deliveryRadius: '',
    openingTime: '',
    closingTime: '',
    hasBike: true,
    verificationPref: '',
    ninNumber: '',
    uploadId: null as File | null,
    uploadProfile: null as File | null,
    vehicleType: '' as '' | 'bike' | 'car' | 'van' | 'other',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Inject custom CSS when component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    // Cleanup when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).files?.[0] || null });
    } else {
      setForm({ ...form, [name]: type === 'radio' ? value === 'yes' : value });
    }
  };

  // Step 1: Account Info
  const renderStep1 = () => (
    <>
      <h2 className="courier-signup__title">Join Bestie as a Courier</h2>
      <div className="courier-signup__subtitle">Start earning by delivering for your community</div>
      <form className="user-login__form" onSubmit={e => { e.preventDefault(); setStep(2); }}>
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" type="text" placeholder="Enter your full name" value={form.name} onChange={handleChange} className="user-login__input" />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone" type="tel" placeholder="+234 801 234 5678" value={form.phone} onChange={handleChange} className="user-login__input" />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input name="email" type="email" placeholder="your.email@example.com" value={form.email} onChange={handleChange} className="user-login__input" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-field">
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={form.password} onChange={handleChange} className="user-login__input" />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)} className="password-toggle">
            {showPassword ? (
                <svg width="24" height="24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.09-5.18 5.66-6.53M1 1l22 22"/>
                  <path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/>
                </svg>
            ) : (
                <svg width="24" height="24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" ry="6"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
            )}
          </button>
          </div>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <div className="password-field">
            <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} className="user-login__input" />
            <button type="button" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword(v => !v)} className="password-toggle">
            {showConfirmPassword ? (
                <svg width="24" height="24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.09-5.18 5.66-6.53M6.53M1 1l22 22"/>
                  <path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/>
                </svg>
            ) : (
                <svg width="24px" height="24px" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="10" ry="6"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
            )}
          </button>
          </div>
        </div>
        <button type="submit" className="courier-signup__button">Continue to Delivery Details</button>
      </form>
    </>
  );

  // Step 2: Where & How You Deliver
  const renderStep2 = () => (
    <>
      <h2 className="courier-signup__title">Where & How You Deliver</h2>
      <div className="courier-signup__subtitle">Let us know your delivery area</div>
      
      <div className="step2-container">
      {/* Progress Bar */}
        <div className="step2-progress">
          <div className="step2-progress-bar" style={{ width: '50%' }}></div>
      </div>
        <div className="step2-step-indicator">Step 2 of 4</div>
        
      <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
          <div className="form-group">
            <label>Service Areas</label>
            <input name="serviceAreas" type="text" placeholder="Lagos, Abuja, Akure" value={form.serviceAreas} onChange={handleChange} className="user-login__input" />
          </div>
          
          <div className="form-group">
            <label>Delivery Radius</label>
            <input name="deliveryRadius" type="text" placeholder="5km, 10km" value={form.deliveryRadius} onChange={handleChange} className="user-login__input" />
          </div>
          
          <div className="step2-time-inputs">
            <div className="step2-time-group">
              <label>Opening Time</label>
              <input name="openingTime" type="time" value={form.openingTime} onChange={handleChange} className="user-login__input" />
            </div>
            <div className="step2-time-group">
              <label>Closing Time</label>
              <input name="closingTime" type="time" value={form.closingTime} onChange={handleChange} className="user-login__input" />
          </div>
        </div>
          
          <div className="form-group">
            <label>Vehicle Type (optional)</label>
            <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="user-login__input">
          <option value="">Select...</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="van">Van</option>
          <option value="other">Other</option>
        </select>
          </div>
          
          <div className="step2-radio-group">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Do you have a delivery bike?</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <label className="step2-radio-label">
                <input type="radio" name="hasBike" value="yes" checked={form.hasBike === true} onChange={handleChange} className="step2-radio-input" /> Yes
          </label>
              <label className="step2-radio-label">
                <input type="radio" name="hasBike" value="no" checked={form.hasBike === false} onChange={handleChange} className="step2-radio-input" /> No
          </label>
        </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 32 }}>
            <button type="button" onClick={() => setStep(1)} style={{ flex: 1, background: '#fff', color: '#374151', fontWeight: 600, fontSize: 16, border: '2px solid #e5e7eb', borderRadius: 12, padding: '18px 0', cursor: 'pointer', transition: 'all 0.2s ease' }}>Back</button>
            <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 12, padding: '18px 0', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)' }}>Next</button>
        </div>
      </form>
      </div>
    </>
  );

  // Step 3: Verify Your Identity
  const renderStep3 = () => (
    <>
      <h2 className="courier-signup__title">Verify Your Identity</h2>
      <div className="courier-signup__subtitle">Help us keep Bestie platform secure and trusted for all vendors and customers</div>
      
      <div className="step2-container">
      {/* Progress Bar */}
        <div className="step2-progress">
          <div className="step2-progress-bar" style={{ width: '75%' }}></div>
      </div>
        <div className="step2-step-indicator">Step 3 of 4</div>
        
      <form onSubmit={e => { e.preventDefault(); setStep(4); }}>
          <div className="form-group">
            <label>Verification Preference</label>
            <select name="verificationPref" value={form.verificationPref || ''} onChange={handleChange} className="user-login__input">
          <option value="">Select...</option>
          <option value="NIN">NIN</option>
          <option value="DL">Driver's License</option>
          <option value="VC">Voter's Card</option>
        </select>
          </div>

          <div className="form-group">
            <label>NIN Number</label>
            <input name="ninNumber" type="text" placeholder="1234567890" value={form.ninNumber || ''} onChange={handleChange} className="user-login__input" />
          </div>
          
          <div className="form-group">
            <label>Upload ID</label>
        <div style={{ position: 'relative', marginBottom: 18 }}>
              <input 
                name="uploadId" 
                type="file" 
                accept="image/*,.pdf" 
                onChange={handleChange} 
                style={{ display: 'none' }}
                id="uploadIdInput"
              />
              <div 
                onClick={() => document.getElementById('uploadIdInput')?.click()}
                style={{ 
                  width: '100%', 
                  padding: '14px 18px', 
                  borderRadius: 8, 
                  border: '1.5px solid #e5e7eb', 
                  fontSize: 17, 
                  fontWeight: 600, 
                  background: '#fafbfc', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ color: form.uploadId ? '#10b981' : '#6b7280' }}>
                  {form.uploadId && typeof form.uploadId !== 'string' ? form.uploadId.name : 'Click to upload ID document'}
          </span>
                <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M8 16l2-2 2 2 4-4"/>
                </svg>
              </div>
            </div>
        </div>
          
          <div className="form-group">
            <label>Upload Profile Photo</label>
        <div style={{ position: 'relative', marginBottom: 32 }}>
              <input 
                name="uploadProfile" 
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                style={{ display: 'none' }}
                id="uploadProfileInput"
              />
              <div 
                onClick={() => document.getElementById('uploadProfileInput')?.click()}
                style={{ 
                  width: '100%', 
                  padding: '14px 18px', 
                  borderRadius: 8, 
                  border: '1.5px solid #e5e7eb', 
                  fontSize: 17, 
                  fontWeight: 600, 
                  background: '#fafbfc', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ color: form.uploadProfile ? '#10b981' : '#6b7280' }}>
                  {form.uploadProfile && typeof form.uploadProfile !== 'string' ? form.uploadProfile.name : 'Click to upload profile photo'}
          </span>
                <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M8 16l2-2 2 2 4-4"/>
                </svg>
              </div>
        </div>
        </div>
          

          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 32 }}>
            <button type="button" onClick={() => setStep(2)} style={{ flex: 1, background: '#fff', color: '#374151', fontWeight: 600, fontSize: 16, border: '2px solid #e5e7eb', borderRadius: 12, padding: '18px 0', cursor: 'pointer', transition: 'all 0.2s ease' }}>Back</button>
            <button type="submit" disabled={isLoading} style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 12, padding: '18px 0', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)', opacity: isLoading ? 0.7 : 1 }}>{isLoading ? 'Processing...' : 'Next'}</button>
        </div>
      </form>
      </div>
    </>
  );

  const submitRegistration = async () => {
    // Basic validation for required fields
    const required = [
      form.name,
      form.phone,
      form.email,
      form.password,
      form.confirmPassword,
      form.serviceAreas,
      form.deliveryRadius,
      form.openingTime,
      form.closingTime,
      form.verificationPref,
    ];
    if (required.some(v => !String(v || '').trim())) {
      showError('Please complete all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showError('Passwords do not match');
      return;
    }


    const [first_name, ...rest] = form.name.trim().split(' ');
    const last_name = rest.join(' ');

    const payload = {
      email: form.email,
      password: form.password,
      first_name: first_name || '',
      last_name: last_name || '',
      phone: form.phone,
      service_areas: form.serviceAreas,
      delivery_radius: form.deliveryRadius,
      opening_hours: form.openingTime, // HH:MM
      closing_hours: form.closingTime, // HH:MM
      verification_preference: form.verificationPref as 'NIN' | 'DL' | 'VC',
      agreed_to_terms: true,
      has_bike: !!form.hasBike,
      nin_number: form.ninNumber || undefined,
      vehicle_type: (form.vehicleType || undefined) as any,
      id_upload: form.uploadId,
      profile_photo: form.uploadProfile,
    };

    try {
      setIsLoading(true);
      const response = await registerCourier(payload as any);
      if (response) {
        try {
          const loginResponse = await loginUser(form.email, form.password);
          if (loginResponse && loginResponse.token) {
            await login(form.email, form.password);
            const userData = {
              email: form.email,
              fullName: form.name,
              phone: form.phone,
              serviceAreas: form.serviceAreas,
              vehicleType: form.vehicleType
            };
            localStorage.setItem('pending_profile_data', JSON.stringify(userData));
            showSuccess('Registration successful! Setting up your courier account...');
            navigate('/success', { state: { userType: 'courier' } });
            return;
          }
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
        }
        showSuccess('Registration successful! Please log in to continue.');
        navigate('/login');
      }
    } catch (err: any) {
      showApiError(err, 'Failed to register courier');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    step === 4 ? (
      <CourierTermsStep
        onCancel={() => setStep(3)}
        onAgree={submitRegistration}
        isLoading={isLoading}
      />
    ) : (
      <div className="user-login__bg">
        <div className="user-login__card">
          <div className="courier-signup__logo-container">
            <div className="courier-signup__logo-box">
              <img src="/logo.png" alt="Logo" />
            </div>
          </div>
          {step === 1 ? renderStep1() : null}
          {step === 2 ? renderStep2() : null}
          {step === 3 ? renderStep3() : null}
        </div>
      </div>
    )
  );
};

export default CourierSignUp;