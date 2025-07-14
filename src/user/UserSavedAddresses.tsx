import React from 'react';
import { Home, Briefcase, Edit, Trash2, Plus, CreditCard } from 'lucide-react';

const addresses = [
  {
    type: 'Home',
    icon: <Home size={24} />, 
    address: '123, Bananna Island, Lagos state, 100001',
    isDefault: true,
  },
  {
    type: 'Work',
    icon: <Briefcase size={24} />, 
    address: '123, Bananna Island, Lagos state, 100001',
    isDefault: false,
  },
];

const paymentMethods = [
  {
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
  },
  {
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
  },
  {
    brand: 'Master Card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    number: 'xxxx xxxx xxxx 1234',
    expiry: '10/24',
  },
];

const UserSavedAddresses = () => (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
    {/* Saved Address Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <div>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Saved Address</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>Quickly select saved delivery locations when placing food orders. Add or update them anytime.</div>
      </div>
      <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', borderRadius: 8, padding: '12px 28px', cursor: 'pointer' }}>
        <Plus size={20} /> Add new Address
      </button>
    </div>
    {/* Saved Address Cards */}
    <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
      {addresses.map((addr, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '32px 32px 24px 32px', minWidth: 320, flex: 1, border: '1.5px solid #f3f4f6', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {addr.icon}
            <span style={{ fontWeight: 600, fontSize: 22 }}>{addr.type}</span>
            {addr.isDefault && <span style={{ position: 'absolute', right: 32, top: 32, background: '#fff', color: '#10b981', fontWeight: 700, fontSize: 15, borderRadius: 8, padding: '4px 16px', border: '1.5px solid #d1fae5' }}>Default</span>}
          </div>
          <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>{addr.address}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
            <button style={{ background: '#f8fafc', color: '#222', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><Edit size={18} /></button>
            <button style={{ background: '#f8fafc', color: '#ef4444', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><Trash2 size={18} /></button>
          </div>
        </div>
      ))}
    </div>
    

    </div>
);

export default UserSavedAddresses; 