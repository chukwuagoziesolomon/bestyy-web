import React, { useState } from 'react';
import './UserLogin.css';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Account',
  'Business Info',
  'Location & Delivery',
  'Menu Items',
  'Plan Selection',
  'Success',
];

const VendorSignUp = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

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
            <input className="user-login__input" placeholder="example.ng" />
            <label className="user-login__label">Email Address</label>
            <input className="user-login__input" placeholder="johndoe@example.com" />
            <label className="user-login__label">Password</label>
            <input className="user-login__input" type="password" placeholder="***********" />
            <label className="user-login__label">Confirm Password</label>
            <input className="user-login__input" type="password" placeholder="***********" />
          </>
        )}
        {step === 1 && (
          <>
            <h2 className="user-login__heading">Tell us About Your Food Business</h2>
            <h3 className="user-login__subheading">Share your business info</h3>
            <label className="user-login__label">Business Name</label>
            <input className="user-login__input" placeholder="Lagos Pizza" />
            <label className="user-login__label">Business Category</label>
            <input className="user-login__input" placeholder="Restaurant, Hotel, Event" />
            <label className="user-login__label">CAC Number (optional for MVP)</label>
            <input className="user-login__input" placeholder="1234567" />
            <label className="user-login__label">Business Description</label>
            <input className="user-login__input" placeholder="lorem ipsum loves the app and will..." />
            <label className="user-login__label">Upload Logo</label>
            <input className="user-login__input" placeholder="IMG.WW283828199" />
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
              <input className="user-login__input" placeholder="23, banana island road, Lagos state" />
            </div>
            <label className="user-login__label">Delivery Radius</label>
            <input className="user-login__input" placeholder="5km, 10km" />
            <label className="user-login__label">Service Areas</label>
            <input className="user-login__input" placeholder="Lagos, abuja, akure" />
            <label className="user-login__label">Opening and Closing Hours</label>
            <input className="user-login__input" placeholder="All days" />
            <h3 className="user-login__label">Do you offer delivery?</h3>
            <div className="signup-radio-row">
              <label><input type="radio" name="delivery" /> Yes</label>
              <label><input type="radio" name="delivery" /> No</label>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="user-login__heading">Add some Items to Your Menu</h2>
            <h3 className="user-login__subheading">Help customers discover your food, you can add more later</h3>
            <form autoComplete="off">
              <div className="form-group">
                <label className="floating-label">Dish Name</label>
                <input className="user-login__input" placeholder="pizza" />
              </div>
              <div className="form-group">
                <label className="floating-label">Price</label>
                <input className="user-login__input" placeholder="₦ 4000" />
              </div>
              <div className="form-group select-group">
                <label className="floating-label">Category</label>
                <select className="user-login__input">
                  <option>pizza</option>
                  <option>burger</option>
                  <option>rice</option>
                </select>
                <span className="dropdown-arrow">&#9662;</span>
              </div>
              <div className="form-group input-icon-flex">
                <label className="floating-label">Upload Image</label>
                <input className="user-login__input" placeholder="IMG.WW283828199" />
                <span className="input-icon-flex__icon">
                  <svg width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </span>
              </div>
              <div className="form-row" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '1.5rem 0'}}>
                <span style={{fontWeight: 500}}>Available Now?</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="signup-btn-group--wide">
                <button className="signup-btn-back" type="button" onClick={() => navigate('/vendor/plans')}>Skip for Now</button>
                <button className="signup-btn-next" type="submit">Add More</button>
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
              <button className="user-login__main-btn" style={{ margin: '0 0.5rem' }} onClick={() => navigate('/dashboard')}>Continue to Dashboard</button>
              <button className="user-login__main-btn" style={{ margin: '0 0.5rem', background: '#25D366' }}>Chat on WhatsApp</button>
            </div>
          </>
        )}
        {/* Button group for navigation */}
        {step !== 3 && (
          <div className="signup-btn-group">
            {step > 0 && step < 5 && (
              <button className="signup-btn-back" onClick={back}>Back</button>
            )}
            {/* Only show Next button if not on plan selection step */}
            {step < 5 && step !== 4 && (
              <button className="signup-btn-next" onClick={next}>Next</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorSignUp; 