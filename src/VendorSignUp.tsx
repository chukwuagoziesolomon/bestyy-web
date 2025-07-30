import React, { useState, useEffect } from 'react';
import './UserLogin.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signupVendor, createMenuItem } from './api';
import { showError, showSuccess, showInfo } from './toast';

const steps = [
  'Account',
  'Business Info',
  'Location & Delivery',
  'Menu Items',
  'Plan Selection',
  'Success',
];

type MenuItem = {
  dishName: string;
  price: string;
  category: string;
  otherCategory?: string; // Add this field
  image: File | undefined; // Store as File
  available: boolean;
  item_description: string; // new
  quantity: string; // new (as string for form input)
};

type VendorFormData = {
  fullName: string;
  email: string;
  phone: string; // NEW
  password: string;
  confirmPassword: string;
  businessName: string;
  businessCategory: string;
  otherBusinessCategory?: string;
  cacNumber: string;
  businessDescription: string;
  logo: string;
  businessAddress: string;
  deliveryRadius: string;
  serviceAreas: string;
  openingHours: string;
  closingHours: string; // NEW
  offersDelivery: boolean;
  menuItems: MenuItem[];
};

const VendorSignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  type FieldKey = keyof VendorFormData;

  const [formData, setFormData] = useState<VendorFormData>(() => {
    const saved = localStorage.getItem('vendor_signup_data');
    const defaults = {
      fullName: '', email: '', phone: '', password: '', confirmPassword: '',
      businessName: '', businessCategory: '', otherBusinessCategory: '', cacNumber: '', businessDescription: '', logo: '',
      businessAddress: '', deliveryRadius: '', serviceAreas: '', openingHours: '', closingHours: '', offersDelivery: false,
      menuItems: [{
        dishName: '', price: '', category: '', otherCategory: '', image: undefined, available: true
      }]
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Always reset image to undefined for all menu items
        if (parsed.menuItems) {
          parsed.menuItems = parsed.menuItems.map((item: any) => ({
            ...item,
            image: undefined
          }));
        }
        return { ...defaults, ...parsed };
      } catch (e) {
        console.error("Failed to parse vendor form data from localStorage", e);
      }
    }
    return defaults;
  });

  const [step, setStep] = useState(() => {
    // Check URL parameter first
    const urlStep = searchParams.get('step');
    if (urlStep) {
      return parseInt(urlStep, 10);
    }
    const savedStep = localStorage.getItem('vendor_signup_step');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('vendor_signup_data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('vendor_signup_step', step.toString());
  }, [step]);

  const handleInputChange = (field: FieldKey, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMenuChange = (index: number, field: keyof MenuItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, {
        dishName: '',
        price: '',
        category: '', // Default to empty
        otherCategory: '', // Add this
        image: undefined,
        available: true, // <-- add this line
        item_description: '',
        quantity: '',
      }]
    }));
  };

  const removeMenuItem = (index: number) => {
    if (formData.menuItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        menuItems: prev.menuItems.filter((_, i) => i !== index)
      }));
    }
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        if (!formData.fullName.trim()) {
          showError('Full name is required');
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
        if (formData.password !== formData.confirmPassword) {
          showError('Passwords do not match');
          return false;
        }
        break;
      case 1:
        if (!formData.businessName.trim()) {
          showError('Business name is required');
          return false;
        }
        if (!formData.businessCategory.trim()) {
          showError('Business category is required');
          return false;
        }
        break;
      case 2:
        if (!formData.businessAddress.trim()) {
          showError('Business address is required');
          return false;
        }
        if (!formData.openingHours.trim()) {
          showError('Opening time is required');
          return false;
        }
        if (!formData.closingHours.trim()) {
          showError('Closing time is required');
          return false;
        }
        break;
    }
    return true;
  };

  const next = async () => {
    if (!validateStep(step)) return;
    setIsLoading(true);
    try {
      if (step === 2) {
        // Call vendor signup endpoint after step 2 (without menu_items)
        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        const finalBusinessCategory = (formData.businessCategory === 'Other'
          ? formData.otherBusinessCategory
          : formData.businessCategory) || '';
        const payload = {
          user: {
            username: formData.email.split('@')[0],
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword, // This field is required
            first_name: firstName,
            last_name: lastName,
          },
          phone: formData.phone,
          business_name: formData.businessName,
          business_category: finalBusinessCategory,
          business_address: formData.businessAddress,
          delivery_radius: formData.deliveryRadius,
          service_areas: formData.serviceAreas,
          opening_hours: `${formData.openingHours}:00`, // Format to HH:mm:ss
          closing_hours: `${formData.closingHours}:00`, // Format to HH:mm:ss
          offers_delivery: formData.offersDelivery,
        };
        const res = await signupVendor(payload);
        // Save token if returned
        if (res && res.token) {
          localStorage.setItem('vendor_token', res.token);
        }
        setStep(3); // Move to menu items step
      } else {
        setStep(s => Math.min(s + 1, steps.length - 1));
        if (step === 0) {
          showInfo('Your progress has been saved! You can safely refresh the page or come back later.');
        }
      }
    } catch (err: any) {
      showError(err.message || 'Failed to create vendor account');
    } finally {
      setIsLoading(false);
    }
  };

  const back = () => setStep(s => Math.max(s - 1, 0));

  // Menu item submission handler for step 3
  const handleMenuSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('vendor_token');
      if (!token) throw new Error('No vendor token found. Please log in again.');
      // Collect menu items (filter out empty ones)
      const items: MenuItem[] = formData.menuItems.filter((item: MenuItem) => item.dishName.trim() && item.price.trim());
      for (const item of items) {
        console.log('Image type:', typeof item.image, 'instanceof File:', item.image instanceof File, 'value:', item.image);
        await createMenuItem(token, {
          dish_name: item.dishName,
          item_description: item.item_description,
          price: parseFloat(item.price).toFixed(2),
          category: item.category === 'Other' ? (item.otherCategory || 'Other') : item.category,
          quantity: parseInt(item.quantity, 10),
          image: item.image,
          available_now: item.available,
        });
      }
      showSuccess('Menu items added successfully!');
      setStep(4); // Move to plan selection page
      localStorage.removeItem('vendor_signup_data');
      localStorage.removeItem('vendor_signup_step');
      // Do NOT remove vendor_token here so dashboard works after sign-up
    } catch (err: any) {
      showError(err.message || 'Failed to add menu items');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-login__bg">
      <div className="user-login__card">
        <div className="logo-blackbox">
          <img src="/plainlogo.png" alt="Logo" className="logo-img" />
        </div>
        <div style={{ width: '100%', marginBottom: '1.2rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            Step {step + 1} of {steps.length}
          </div>
          <div style={{ height: 5, background: 'var(--divider)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ width: `${((step + 1) / steps.length) * 100}%`, height: '100%', background: 'var(--bestie-gradient)' }} />
          </div>
        </div>
        {step === 0 && (
          <>
            <h2 className="user-login__heading">Sign up to Bestyy</h2>
            <h3 className="user-login__subheading">Create your Bestyy Vendor Account</h3>
            <label className="user-login__label">Full Name</label>
            <input 
              className="user-login__input" 
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
            <label className="user-login__label">Email Address</label>
            <input 
              className="user-login__input" 
              placeholder="johndoe@example.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <label className="user-login__label">Phone Number</label>
            <input 
              className="user-login__input" 
              placeholder="e.g. +2348012345678"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <label className="user-login__label">Password</label>
            <input 
              className="user-login__input" 
              type="password" 
              placeholder="***********"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <label className="user-login__label">Confirm Password</label>
            <input 
              className="user-login__input" 
              type="password" 
              placeholder="***********"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="user-login__heading">Tell us About Your Food Business</h2>
            <h3 className="user-login__subheading">Share your business info</h3>
            <label className="user-login__label">Business Name</label>
            <input 
              className="user-login__input" 
              placeholder="Lagos Pizza"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
            />
            <label className="user-login__label">Business Category</label>
            <select
              className="user-login__input"
              value={formData.businessCategory}
              onChange={(e) => {
                handleInputChange('businessCategory', e.target.value);
                if (e.target.value !== 'Other') {
                  handleInputChange('otherBusinessCategory', '');
                }
              }}
            >
              <option value="">Select a category...</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Hotel">Hotel</option>
              <option value="Shortlet">Shortlet</option>
              <option value="Other">Other</option>
            </select>
            
            {formData.businessCategory === 'Other' && (
              <div style={{ marginTop: '1rem' }}>
                <label className="user-login__label">Please specify your business category</label>
                <input
                  className="user-login__input"
                  placeholder="e.g., Catering, Food Truck"
                  value={formData.otherBusinessCategory || ''}
                  onChange={(e) => handleInputChange('otherBusinessCategory', e.target.value)}
                />
              </div>
            )}

            <label className="user-login__label">CAC Number (optional for MVP)</label>
            <input 
              className="user-login__input" 
              placeholder="1234567"
              value={formData.cacNumber}
              onChange={(e) => handleInputChange('cacNumber', e.target.value)}
            />
            <label className="user-login__label">Business Description</label>
            <input 
              className="user-login__input" 
              placeholder="lorem ipsum loves the app and will..."
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
            />
            <label className="user-login__label">Upload Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleInputChange('logo', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="logo-upload"
                className="user-login__input"
                style={{ cursor: 'pointer', flex: 1, border: '1px solid black' }}
              >
                {formData.logo ? 'Logo Selected!' : 'Choose a file...'}
              </label>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="user-login__heading">Location And Delivery Setup</h2>
            <h3 className="user-login__subheading">Help customers know where you deliver and how to reach you.</h3>
            <label className="user-login__label">Business Address</label>
            <div className="input-icon-flex">
              <span className="input-icon-flex__icon">
                <svg width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z"/>
                  <circle cx="12" cy="11" r="2"/>
                </svg>
              </span>
              <input 
                className="user-login__input" 
                placeholder="23, banana island road, Lagos state"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              />
            </div>
            <label className="user-login__label">Delivery Radius</label>
            <input 
              className="user-login__input" 
              placeholder="5km, 10km"
              value={formData.deliveryRadius}
              onChange={(e) => handleInputChange('deliveryRadius', e.target.value)}
            />
            <label className="user-login__label">Delivery Areas</label>
            <input 
              className="user-login__input" 
              placeholder="Lagos, abuja, akure"
              value={formData.serviceAreas}
              onChange={(e) => handleInputChange('serviceAreas', e.target.value)}
            />
            <label className="user-login__label">Opening Time</label>
            <input 
              className="user-login__input" 
              type="time"
              value={formData.openingHours}
              onChange={(e) => handleInputChange('openingHours', e.target.value)}
            />
            <label className="user-login__label">Closing Time</label>
            <input 
              className="user-login__input" 
              type="time"
              value={formData.closingHours}
              onChange={(e) => handleInputChange('closingHours', e.target.value)}
            />
            <h3 className="user-login__label">Do you offer delivery?</h3>
            <div className="signup-radio-row">
              <label>
                <input 
                  type="radio" 
                  name="delivery" 
                  checked={formData.offersDelivery}
                  onChange={() => handleInputChange('offersDelivery', true)}
                /> 
                Yes
              </label>
              <label>
                <input 
                  type="radio" 
                  name="delivery" 
                  checked={!formData.offersDelivery}
                  onChange={() => handleInputChange('offersDelivery', false)}
                /> 
                No
              </label>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <button 
                onClick={back}
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '1rem',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
            </div>
            <h2 className="user-login__heading">Add some Items to Your Menu</h2>
            <h3 className="user-login__subheading">Help customers discover your food, you can add more later</h3>
            <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); addMenuItem(); }}>
              {formData.menuItems.map((item, index) => (
                <div key={index} style={{ marginBottom: 20, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0 }}>Item {index + 1}</h4>
                    {formData.menuItems.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeMenuItem(index)}
                        style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
              <div className="form-group">
                <label className="floating-label">Dish Name</label>
                    <input 
                      className="user-login__input" 
                      placeholder="pizza"
                      value={item.dishName}
                      onChange={(e) => handleMenuChange(index, 'dishName', e.target.value)}
                    />
              </div>
              <div className="form-group">
                <label className="floating-label">Price</label>
                    <input 
                      className="user-login__input" 
                      placeholder="₦ 4000"
                      value={item.price}
                      onChange={(e) => handleMenuChange(index, 'price', e.target.value)}
                    />
              </div>
              <div className="form-group select-group">
                <label className="floating-label">Category</label>
                    <select 
                      className="user-login__input"
                      value={item.category}
                      onChange={(e) => {
                        handleMenuChange(index, 'category', e.target.value);
                        if (e.target.value !== 'Other') {
                          handleMenuChange(index, 'otherCategory', '');
                        }
                      }}
                    >
                      <option value="">Select a category...</option>
                      <option value="Swallow & Soups">Swallow & Soups</option>
                      <option value="Rice & Pasta Dishes">Rice & Pasta Dishes</option>
                      <option value="Proteins (Meats & Fish)">Proteins (Meats & Fish)</option>
                      <option value="Snacks & Small Chops">Snacks & Small Chops</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks & Beverages">Drinks & Beverages</option>
                      <option value="Other">Other</option>
                </select>
                <span className="dropdown-arrow">&#9662;</span>
              </div>

                  {item.category === 'Other' && (
                    <div className="form-group">
                      <label className="floating-label">Specify Category</label>
                      <input
                        className="user-login__input"
                        placeholder="e.g., Grills"
                        value={item.otherCategory || ''}
                        onChange={(e) => handleMenuChange(index, 'otherCategory', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="floating-label">Dish Image</label>
                    <input
                      type="file"
                      id={`item-image-upload-${index}`}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleMenuChange(index, 'image', file); // Store as File
                        }
                      }}
                    />
                    <label htmlFor={`item-image-upload-${index}`} className="user-login__input" style={{ cursor: 'pointer', lineHeight: 'normal', display: 'flex', alignItems: 'center' }}>
                      {item.image ? 'Image Selected!' : 'Choose an image...'}
                    </label>
              </div>
              <div className="form-group">
                <label className="floating-label">Item Description</label>
                <textarea
                  className="user-login__input"
                  placeholder="Describe this dish"
                  value={item.item_description}
                  onChange={(e) => handleMenuChange(index, 'item_description', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="floating-label">Quantity</label>
                <input
                  className="user-login__input"
                  type="number"
                  min="1"
                  placeholder="e.g. 20"
                  value={item.quantity}
                  onChange={(e) => handleMenuChange(index, 'quantity', e.target.value)}
                />
              </div>
              <div className="form-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.5rem 0'}}>
                <span style={{fontWeight: 500}}>Available Now?</span>
                <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={item.available}
                        onChange={(e) => handleMenuChange(index, 'available', e.target.checked)}
                      />
                  <span className="slider"></span>
                </label>
              </div>
                </div>
              ))}
              <div className="signup-btn-group--wide">
                {formData.menuItems.some(item => item.dishName.trim() !== '') ? (
                  <button className="signup-btn-back" type="button" onClick={handleMenuSubmit} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Save Menu & Continue'}
                  </button>
                ) : (
                  <button className="signup-btn-back" type="button" onClick={() => navigate('/vendor/plan-selection')}>Skip for Now</button>
                )}
                <button className="signup-btn-next" type="button" onClick={() => navigate('/vendor/plan-selection')}>Next</button>
              </div>
            </form>
          </>
        )}

        {step === 5 && (
          <>
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <img src="/confetti.png" alt="Success" style={{ width: 120, marginBottom: 24 }} />
              <h2 className="user-login__heading">You're All Set!</h2>
              <div className="user-login__subheading" style={{ marginBottom: 16 }}>
                Thanks for signing up with Bestyy. We're reviewing your information and will notify you as soon as your account is approved.
              </div>
              <button className="user-login__main-btn" style={{ margin: '0 0.5rem' }} onClick={() => navigate('/vendor/dashboard')}>Continue to Dashboard</button>
              <button className="user-login__main-btn" style={{ margin: '0 0.5rem', background: '#25D366' }}>Chat on WhatsApp</button>
              <button className="user-login__main-btn" style={{ margin: '0 0.5rem', background: '#f87171' }} onClick={() => {
                // Clear all vendor-related localStorage and reset form/step
                localStorage.removeItem('vendor_signup_data');
                localStorage.removeItem('vendor_signup_step');
                localStorage.removeItem('vendor_token');
                localStorage.removeItem('vendor_profile');
                setFormData({
                  fullName: '', email: '', phone: '', password: '', confirmPassword: '',
                  businessName: '', businessCategory: '', otherBusinessCategory: '', cacNumber: '', businessDescription: '', logo: '',
                  businessAddress: '', deliveryRadius: '', serviceAreas: '', openingHours: '', closingHours: '', offersDelivery: false,
                  menuItems: [{
                    dishName: '', price: '', category: '', otherCategory: '', image: undefined, available: true, item_description: '', quantity: ''
                  }]
                });
                setStep(0);
              }}>
                Start New Business
              </button>
            </div>
          </>
        )}
        {/* Button group for navigation */}
        {step !== 5 && ( // Only hide buttons on the final success step
          <div className="signup-btn-group">
            {step > 0 && (
              <button className="signup-btn-back" onClick={back} disabled={isLoading}>Back</button>
            )}
            {step < 3 && (
              <button 
                className="signup-btn-next" 
                onClick={next}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Next'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorSignUp; 