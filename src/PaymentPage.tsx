import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';
import { useResponsive } from './hooks/useResponsive';
import './UserLogin.css';

const visaIcon = (
  <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{margin: '0 6px'}}>
    <rect width="44" height="24" rx="4" fill="#fff"/>
    <text x="8" y="17" fontFamily="Arial Black, Arial, sans-serif" fontWeight="bold" fontSize="13" fill="#1A1F71">VISA</text>
  </svg>
);
const mcIcon = (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{margin: '0 6px'}}>
    <rect width="36" height="24" rx="4" fill="#fff"/>
    <circle cx="14" cy="12" r="7" fill="#EB001B"/>
    <circle cx="22" cy="12" r="7" fill="#F79E1B" fillOpacity="0.85"/>
  </svg>
);
const infoIcon = (
  <svg width="20" height="20" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2.2" fill="#fff"/>
    <circle cx="12" cy="8.5" r="1.2" fill="#888"/>
    <rect x="11.1" y="11.5" width="1.8" height="5" rx="0.9" fill="#888"/>
  </svg>
);
const backArrow = (
  <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

const months = [
  'Month', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
];
const years = [
  'Year', '2024', '2025', '2026', '2027', '2028', '2029', '2030'
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet } = useResponsive();

  const userType = (location.state as any)?.userType || 'vendor';
  const backToPlan = userType === 'courier' ? '/courier/plan-selection' : '/vendor/plan-selection';
  const successRoute = userType === 'courier' ? '/success' : '/vendor/signup-success';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'courier') {
      navigate(successRoute, { state: { userType: 'courier' } });
    } else {
      navigate(successRoute);
    }
  };

  // Mobile/Tablet Layout
  if (isMobile || isTablet) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: isTablet ? '768px' : '414px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #e9ecef'
        }}>
          <ArrowLeft
            size={24}
            color="#333"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(backToPlan)}
          />
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 0 16px',
            color: '#212529'
          }}>
            Credit Card Details
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 20px' }}>
          {/* Payment Methods */}
          <div style={{
            border: '2px dashed #e9ecef',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            background: '#fff'
          }}>
            <span style={{
              color: '#6c757d',
              fontWeight: '600',
              fontSize: '14px',
              marginRight: '8px'
            }}>
              Payment Method
            </span>
            {visaIcon}
            {mcIcon}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Name on Card */}
            <div>
              <label style={{
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '8px',
                display: 'block',
                color: '#212529'
              }}>
                Name on card
              </label>
              <input
                type="text"
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  fontSize: '16px',
                  background: '#fff',
                  fontWeight: '500',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Card Number */}
            <div>
              <label style={{
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '8px',
                display: 'block',
                color: '#212529'
              }}>
                Card number
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  fontSize: '16px',
                  background: '#fff',
                  fontWeight: '500',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Card Expiration */}
            <div>
              <label style={{
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '8px',
                display: 'block',
                color: '#212529'
              }}>
                Card expiration
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select style={{
                  flex: 1,
                  padding: '16px 12px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  fontSize: '16px',
                  background: '#fff',
                  fontWeight: '500'
                }}>
                  {months.map(m => <option key={m}>{m}</option>)}
                </select>
                <select style={{
                  flex: 1,
                  padding: '16px 12px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  fontSize: '16px',
                  background: '#fff',
                  fontWeight: '500'
                }}>
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Security Code */}
            <div>
              <label style={{
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '8px',
                display: 'block',
                color: '#212529'
              }}>
                Card Security Code
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Code"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingRight: '48px',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    fontSize: '16px',
                    background: '#fff',
                    fontWeight: '500',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  {infoIcon}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                marginTop: '24px',
                background: '#10b981',
                color: '#fff',
                fontWeight: '600',
                fontSize: '16px',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
              }}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Desktop Layout (existing)
  return (
    <div style={{ minHeight: '100vh', background: '#fafbfb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 0', fontFamily: 'Montserrat, Nunito Sans, Arial, sans-serif' }}>
      <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 8px 40px rgba(16,24,40,0.08)', padding: '2.5rem 2.2rem 2.5rem 2.2rem', margin: '2.5rem 0', position: 'relative' }}>
        <button onClick={() => navigate(backToPlan)} style={{ background: 'none', border: 'none', position: 'absolute', left: 24, top: 24, cursor: 'pointer', padding: 0 }} aria-label="Back">
          {backArrow}
        </button>
        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.45rem', marginBottom: '2.2rem', letterSpacing: '-0.5px' }}>
          Credit Card Details
        </div>
        <div style={{ border: '1.5px dashed #e5e7eb', borderRadius: 10, padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2.1rem', justifyContent: 'flex-start' }}>
          <span style={{ color: '#888', fontWeight: 600, fontSize: '1.05rem', marginRight: 12 }}>Payment Method</span>
          {visaIcon}
          {mcIcon}
          {mcIcon}
        </div>
        <form autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }} onSubmit={handleSubmit}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 6, display: 'block' }}>Name on card</label>
            <input style={{ width: '100%', padding: '0.95rem 1.1rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: '1.08rem', background: '#fafbfb', fontWeight: 500 }} placeholder="John Doe" />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 6, display: 'block' }}>Card number</label>
            <input style={{ width: '100%', padding: '0.95rem 1.1rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: '1.08rem', background: '#fafbfb', fontWeight: 500 }} placeholder="0000 0000 0000 0000" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 6, display: 'block' }}>Card expiration</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select style={{ flex: 1, padding: '0.95rem 0.7rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: '1.08rem', background: '#fafbfb', fontWeight: 500 }}>
                  {months.map(m => <option key={m}>{m}</option>)}
                </select>
                <select style={{ flex: 1, padding: '0.95rem 0.7rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: '1.08rem', background: '#fafbfb', fontWeight: 500 }}>
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 6, display: 'block' }}>Card Security Code</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input style={{ width: '100%', padding: '0.95rem 1.1rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: '1.08rem', background: '#fafbfb', fontWeight: 500 }} placeholder="Code" />
              <span style={{ position: 'absolute', right: 12 }}>{infoIcon}</span>
            </div>
          </div>
          <button type="submit" style={{ marginTop: '1.7rem', background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '1.18rem', border: 'none', borderRadius: 8, padding: '1.1rem 0', cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px rgba(25,198,172,0.08)' }}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage; 