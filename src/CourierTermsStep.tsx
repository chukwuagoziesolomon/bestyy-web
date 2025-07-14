import React from 'react';

const CourierTermsStep = ({ onCancel, onAgree }: { onCancel: () => void; onAgree: () => void }) => (
  <div style={{ minHeight: '100vh', background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito Sans, sans-serif' }}>
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 24px #f3f4f6', padding: '40px 36px 32px 36px', maxWidth: 700, width: '100%' }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, color: '#059669', marginBottom: 18 }}>Terms and Conditions</h2>
      <div style={{
        maxHeight: 320,
        overflowY: 'auto',
        background: '#fafbfc',
        borderRadius: 10,
        border: '1.5px solid #e5e7eb',
        padding: 22,
        margin: '0 0 32px 0',
        color: '#222',
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.6,
      }}>
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
        <button type="button" onClick={onCancel} style={{ background: '#fff', color: '#059669', fontWeight: 600, fontSize: 18, border: '2px solid #e5e7eb', borderRadius: 12, padding: '14px 36px', cursor: 'pointer' }}>Cancel</button>
        <button type="button" onClick={onAgree} style={{ background: '#059669', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '14px 36px', cursor: 'pointer' }}>Agree</button>
      </div>
    </div>
  </div>
);

export default CourierTermsStep; 