import React from 'react';
import { Edit, Trash2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const paymentMethods = [
  {
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
    isPrimary: true,
  },
  {
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
    isPrimary: false,
  },
  {
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
    isPrimary: false,
  },
];

const UserPaymentMethods = () => {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Payment Methods</h2>
          <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>Securely manage your cards for faster checkouts. Add new cards or remove old ones easily</div>
        </div>
        <button onClick={() => navigate('/user/dashboard/payments/add')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 28px', cursor: 'pointer' }}>
          <CreditCard size={20} /> Add Payment Method
        </button>
      </div>
      {/* Payment Methods Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {paymentMethods.map((pm, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '32px 32px 24px 32px', minWidth: 320, border: '1.5px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <img src={pm.logo} alt={pm.brand} style={{ width: 48, height: 32, objectFit: 'contain', borderRadius: 6, background: '#fff' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 22 }}>{pm.brand}</div>
                <div style={{ color: '#888', fontSize: 16 }}>{pm.number} | Expiry{pm.expiry}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={{ background: '#f8fafc', color: '#222', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><Edit size={18} /></button>
              <button style={{ background: '#f8fafc', color: '#ef4444', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><Trash2 size={18} /></button>
            </div>
            {pm.isPrimary && (
              <span style={{ position: 'absolute', left: 32, bottom: -28, background: '#d1fae5', color: '#10b981', fontWeight: 600, fontSize: 14, borderRadius: 8, padding: '4px 18px' }}>Primary</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPaymentMethods; 