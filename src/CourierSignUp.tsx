import React, { useState } from 'react';
import CourierTermsStep from './CourierTermsStep';
import { useNavigate, useLocation } from 'react-router-dom';

const CourierSignUp = () => {
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
    openingHours: '',
    hasBike: true,
    verificationPref: '',
    ninNumber: '',
    uploadId: null as File | null,
    uploadProfile: null as File | null,
  });
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      <h2 style={{ fontWeight: 700, fontSize: 28, textAlign: 'center', margin: 0, marginBottom: 8 }}>Sign up to Besties</h2>
      <div style={{ color: '#222', fontSize: 16, textAlign: 'center', marginBottom: 32 }}>Create your bestie Courier Account</div>
      <form onSubmit={e => { e.preventDefault(); setStep(2); }}>
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Full Name</label>
        <input name="name" type="text" placeholder="example.ng" value={form.name} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #222', fontSize: 17, fontWeight: 600, background: '#fff', outline: 'none' }} />
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Phone</label>
        <input name="phone" type="tel" placeholder="000-0000-000" value={form.phone} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Email Address</label>
        <input name="email" type="email" placeholder="johndoe@example.com" value={form.email} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Password</label>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <input name="password" type={showPassword ? 'text' : 'password'} placeholder="***********" value={form.password} onChange={handleChange} style={{ width: '100%', padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
          <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {showPassword ? (
              <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.09-5.18 5.66-6.53M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Confirm Password</label>
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="***********" value={form.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
          <button type="button" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {showConfirmPassword ? (
              <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.09-2.86 3.09-5.18 5.66-6.53M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 16.5c1.38 0 2.63-.83 3.16-2.03"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        <button type="submit" style={{ width: '100%', background: 'linear-gradient(90deg, #34e7e4 0%, #10b981 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '18px 0', cursor: 'pointer' }}>Next</button>
      </form>
    </>
  );

  // Step 2: Where & How You Deliver
  const renderStep2 = () => (
    <>
      <h2 style={{ fontWeight: 700, fontSize: 28, textAlign: 'center', margin: 0, marginBottom: 8 }}>Where & How You Deliver</h2>
      <div style={{ color: '#222', fontSize: 16, textAlign: 'center', marginBottom: 32 }}>Let us know your delivery area</div>
      {/* Progress Bar */}
      <div style={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 6, marginBottom: 18 }}>
        <div style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #34e7e4 0%, #10b981 100%)', borderRadius: 6 }}></div>
      </div>
      <div style={{ color: '#222', fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Step 2 of 4</div>
      <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Service Areas</label>
        <input name="serviceAreas" type="text" placeholder="Lagos, abuja, akure" value={form.serviceAreas} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Delivery Radius</label>
        <input name="deliveryRadius" type="text" placeholder="5km, 10km" value={form.deliveryRadius} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Opening and Closing Hours</label>
        <select name="openingHours" value={form.openingHours} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }}>
          <option value="">Select...</option>
          <option value="All days">All days</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
        </select>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Do you have a delivery bike?</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 16 }}>
            <input type="radio" name="hasBike" value="yes" checked={form.hasBike === true} onChange={handleChange} style={{ width: 20, height: 20, accentColor: '#10b981' }} /> Yes
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 16 }}>
            <input type="radio" name="hasBike" value="no" checked={form.hasBike === false} onChange={handleChange} style={{ width: 20, height: 20, accentColor: '#10b981' }} /> No
          </label>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <button type="button" onClick={() => setStep(1)} style={{ flex: 1, background: '#fff', color: '#222', fontWeight: 600, fontSize: 18, border: '2px solid #e5e7eb', borderRadius: 12, padding: '18px 0', cursor: 'pointer' }}>Back</button>
          <button type="submit" style={{ flex: 1, background: 'linear-gradient(90deg, #34e7e4 0%, #10b981 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '18px 0', cursor: 'pointer' }}>Next</button>
        </div>
      </form>
    </>
  );

  // Step 3: Verify Your Identity
  const renderStep3 = () => (
    <>
      <h2 style={{ fontWeight: 700, fontSize: 28, textAlign: 'center', margin: 0, marginBottom: 8 }}>Verify Your Identity</h2>
      <div style={{ color: '#222', fontSize: 16, textAlign: 'center', marginBottom: 32 }}>Help us keep Bestie platform secure and trusted for all vendors and customers</div>
      {/* Progress Bar */}
      <div style={{ width: '100%', height: 6, background: '#e5e7eb', borderRadius: 6, marginBottom: 18 }}>
        <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #34e7e4 0%, #10b981 100%)', borderRadius: 6 }}></div>
      </div>
      <div style={{ color: '#222', fontWeight: 600, fontSize: 15, marginBottom: 18 }}>Step 3 of 4</div>
      <form onSubmit={e => { e.preventDefault(); setStep(4); }}>
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Verification Preference</label>
        <select name="verificationPref" value={form.verificationPref || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }}>
          <option value="">Select...</option>
          <option value="NIN">NIN</option>
          <option value="Driver's License">Driver's License</option>
          <option value="Voter's Card">Voter's Card</option>
        </select>
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>NIN Number</label>
        <input name="ninNumber" type="text" placeholder="1234567890" value={form.ninNumber || ''} onChange={handleChange} style={{ width: '100%', marginBottom: 18, padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Upload ID</label>
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <input name="uploadId" type="file" accept="image/*,.pdf" onChange={handleChange} style={{ width: '100%', padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
          <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
            <svg width="22" height="22" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16l2-2 2 2 4-4"/></svg>
          </span>
          {form.uploadId && typeof form.uploadId !== 'string' && (
            <div style={{ fontSize: 13, color: '#10b981', marginTop: 6 }}>{form.uploadId.name}</div>
          )}
        </div>
        <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: 'block' }}>Upload Profile Photo</label>
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <input name="uploadProfile" type="file" accept="image/*" onChange={handleChange} style={{ width: '100%', padding: '14px 18px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 17, fontWeight: 600, background: '#fafbfc', outline: 'none' }} />
          <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
            <svg width="22" height="22" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16l2-2 2 2 4-4"/></svg>
          </span>
          {form.uploadProfile && typeof form.uploadProfile !== 'string' && (
            <div style={{ fontSize: 13, color: '#10b981', marginTop: 6 }}>{form.uploadProfile.name}</div>
          )}
        </div>
        <div style={{ margin: '24px 0 32px 0', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            style={{ marginRight: 10, width: 18, height: 18 }}
          />
          <label htmlFor="agree-terms" style={{ fontSize: 15, fontWeight: 500 }}>
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'underline', fontWeight: 600 }}>
              Terms and Conditions
            </a>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <button type="button" onClick={() => setStep(2)} style={{ flex: 1, background: '#fff', color: '#222', fontWeight: 600, fontSize: 18, border: '2px solid #e5e7eb', borderRadius: 12, padding: '18px 0', cursor: 'pointer' }}>Back</button>
          <button type="submit" style={{ flex: 1, background: 'linear-gradient(90deg, #34e7e4 0%, #10b981 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '18px 0', cursor: 'pointer' }}>Next</button>
        </div>
      </form>
    </>
  );

  return (
    step === 4 ? (
      <CourierTermsStep
        onCancel={() => setStep(3)}
        onAgree={() => navigate('/vendor/plans', { state: { userType: 'courier' } })}
      />
    ) : (
      <div style={{ minHeight: '100vh', background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito Sans, sans-serif' }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 24px #f3f4f6', padding: '48px 40px 32px 40px', maxWidth: 420, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <img src="/logo.png" alt="Logo" style={{ width: 54, height: 54 }} />
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