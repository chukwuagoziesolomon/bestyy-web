import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserLogin.css';
import PaymentPage from './PaymentPage';

const PlanSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Determine user type from location state or default to vendor
  const userType = location.state?.userType || 'vendor';
  return (
    <div style={{ minHeight: '100vh', background: '#fafbfb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 0 2.5rem 0' }}>
      <h2 style={{ fontWeight: 900, fontSize: '2.5rem', textAlign: 'center', marginBottom: '1.1rem', letterSpacing: '-1px' }}>
        Choose the <span style={{ color: '#10b981' }}>Plan</span> That<br />Grows With You
      </h2>
      <h3 style={{ fontWeight: 500, color: '#444', marginBottom: '2.7rem', fontSize: '1.18rem', textAlign: 'center', maxWidth: 600 }}>
        Unlock more visibility, badges, and insights with Bestie Pro or keep it simple with Free. You can change anytime from your dashboard.
      </h3>
      <div className="plan-cards-row">
        <div className="plan-card plan-card--free">
          <div className="plan-card__title">Free Plan</div>
          <div className="plan-card__desc">Best for testing the waters</div>
          <div className="plan-card__price">$0 <span className="plan-card__per">/month</span></div>
          <ul className="plan-card__features">
            <li><span className="plan-card__check">✔</span> Accept Unlimited Orders</li>
            <li><span className="plan-card__check">✔</span> Receive Payout Via Bestie</li>
            <li><span className="plan-card__check">✔</span> Basic Dashboard Access</li>
          </ul>
          <button className="plan-card__cta plan-card__cta--free" onClick={() => navigate('/vendor/success', { state: { userType } })}>Get Started For Free</button>
        </div>
        <div className="plan-card plan-card--pro">
          <div className="plan-card__title">Bestie Pro</div>
          <div className="plan-card__desc">Best for testing the waters</div>
          <div className="plan-card__price">$0 <span className="plan-card__per">/month</span></div>
          <ul className="plan-card__features">
            <li><span className="plan-card__check">✔</span> Priority Listing</li>
            <li><span className="plan-card__check">✔</span> Pro vendor Badge</li>
            <li><span className="plan-card__check">✔</span> Weekly Sales Insight</li>
            <li><span className="plan-card__check">✔</span> Early Access to New Features</li>
            <li><span className="plan-card__check">✔</span> Premium Support line</li>
          </ul>
          <button className="plan-card__cta plan-card__cta--pro" onClick={() => navigate('/vendor/payment', { state: { userType } })}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection; 