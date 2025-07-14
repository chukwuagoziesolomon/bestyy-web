import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc', fontFamily: 'Nunito Sans, sans-serif', padding: '0 0 48px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 0 24px' }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, margin: 0, marginBottom: 24, color: '#059669', textAlign: 'left' }}>Terms and Conditions</h2>
        <div style={{ color: '#222', fontSize: 17, fontWeight: 400, lineHeight: 1.7, marginBottom: 48 }}>
          <b>Your Agreement</b>
          <br /><br />
          <b>3.1 Delivery Requirements</b><br />
          You must have a valid government-issued ID. If using a motorcycle, you must hold the appropriate license and deliver safely.<br />
          You agree to pick up and deliver items on time, as assigned by Bestie.<br /><br />
          <b>3.2 Conduct</b><br />
          You must treat vendors and customers with respect. Any abuse, theft, fraud, or misconduct may result in termination from the platform.<br /><br />
          <b>3.3 Payments</b><br />
          You’ll be paid per successful delivery. Payout schedules and rates will be communicated in the rider dashboard.<br /><br />
          <b>3.4 Responsibility</b><br />
          You are responsible for the care and safe delivery of food or items assigned to you.<br />
          Repeated late deliveries or customer complaints may affect your ability to receive jobs.<br /><br />
          <b>SECTION 4: TERMINATION & ACCOUNT SUSPENSION</b><br />
          We may suspend or terminate your access to Bestie if you:<br />
          Provide false information<br />
          Repeatedly fail to complete deliveries or orders<br />
          Violate customer trust or safety<br />
          Use the platform for fraud, spam, or illegal activity
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
          <button type="button" onClick={() => navigate(-1)} style={{ background: '#fff', color: '#059669', fontWeight: 600, fontSize: 18, border: '2px solid #e5e7eb', borderRadius: 12, padding: '14px 36px', cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={() => navigate('/signup/courier')} style={{ background: '#059669', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '14px 36px', cursor: 'pointer' }}>Agree</button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 