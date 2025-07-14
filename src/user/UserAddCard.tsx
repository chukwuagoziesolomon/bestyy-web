import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserAddCard = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
      <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Add New Card</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 32 }}>Add new card and save for later</div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', padding: '48px 48px 32px 48px', maxWidth: 900, margin: '0 auto' }}>
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Card Number */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Card Number</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f7f8fa', borderRadius: 8, padding: '14px 18px', border: 'none', fontSize: 18, fontWeight: 600 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" style={{ width: 32, height: 22, marginRight: 12 }} />
              <input type="text" placeholder="1234 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: 18, fontWeight: 600, outline: 'none', width: '100%' }} />
            </div>
          </div>
          {/* CVV */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>CVV</label>
            <input type="password" placeholder="•••" value={cvv} onChange={e => setCvv(e.target.value)} style={{ background: '#f7f8fa', borderRadius: 8, padding: '14px 18px', border: 'none', fontSize: 18, fontWeight: 600, outline: 'none' }} />
          </div>
          {/* Name on Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Name on Card</label>
            <input type="text" placeholder="e.g. Silver Snow" value={name} onChange={e => setName(e.target.value)} style={{ background: '#f7f8fa', borderRadius: 8, padding: '14px 18px', border: 'none', fontSize: 18, fontWeight: 600, outline: 'none' }} />
          </div>
          {/* Expiry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Expiry</label>
            <input type="text" placeholder="MM / YYYY" value={expiry} onChange={e => setExpiry(e.target.value)} style={{ background: '#f7f8fa', borderRadius: 8, padding: '14px 18px', border: 'none', fontSize: 18, fontWeight: 600, outline: 'none' }} />
          </div>
        </form>
        {/* Save Card Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 32, marginBottom: 32 }}>
          <input type="checkbox" checked={saveCard} onChange={() => setSaveCard(v => !v)} style={{ width: 20, height: 20, accentColor: '#10b981' }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Save Card</span>
        </div>
        {/* Buttons */}
        <div style={{ display: 'flex', gap: 32, marginTop: 12 }}>
          <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, background: '#fff', color: '#222', fontWeight: 600, fontSize: 18, border: '2px solid #e5e7eb', borderRadius: 12, padding: '18px 0', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" style={{ flex: 1, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '18px 0', cursor: 'pointer' }}>Add Card</button>
        </div>
      </div>
    </div>
  );
};

export default UserAddCard; 