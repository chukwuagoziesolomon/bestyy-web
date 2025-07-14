import React from 'react';
import { Link } from 'react-router-dom';

type Status = 'Cancelled' | 'Delivered' | 'Accepted';

const deliveries: { id: string; pickup: string; dropoff: string; date: string; amount: string; status: Status }[] = [
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Cancelled' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Christine Brooks', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N5,0000', status: 'Accepted' },
];

const statusColors: Record<Status, { bg: string; color: string }> = {
  Cancelled: { bg: '#fee2e2', color: '#ef4444' },
  Delivered: { bg: '#d1fae5', color: '#10b981' },
  Accepted: { bg: '#fef3c7', color: '#f59e42' },
};

const DeliveryListPage = () => (
  <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh', padding: '2.5rem 2.5rem 2.5rem 2.5rem', fontFamily: 'Nunito Sans, sans-serif' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
      <input type="text" placeholder="Search" style={{ width: 340, background: '#f3f4f6', border: 'none', borderRadius: 24, padding: '14px 28px', fontSize: 17, fontWeight: 600, outline: 'none', color: '#222' }} />
      <div style={{ minWidth: 160, textAlign: 'right' }}>
        <select style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 18px', color: '#555', fontSize: 15, fontWeight: 600, background: '#fff', outline: 'none', cursor: 'pointer', fontFamily: 'Nunito Sans, sans-serif' }}>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
    </div>
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 32, margin: '0 auto', maxWidth: 1200 }}>
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 24 }}>New Orders</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 17, border: '1px solid #e5e7eb', fontFamily: 'inherit' }}>
        <thead>
          <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
            <th style={{ padding: '18px 12px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>ID</th>
            <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>PICK UP</th>
            <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>DROP-OFF</th>
            <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>DATE</th>
            <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>AMOUNT</th>
            <th style={{ padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{d.id}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{d.pickup}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{d.dropoff}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{d.date}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{d.amount}</td>
              <td style={{ padding: '16px 12px' }}>
                <span style={{ background: statusColors[d.status].bg, color: statusColors[d.status].color, borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15 }}>{d.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>
);

function sidebarLinkStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 14, padding: '0.85rem 2.2rem', borderRadius: 8,
    textDecoration: 'none', color: active ? '#fff' : '#222',
    background: active ? '#10b981' : 'none',
    fontWeight: 600, fontSize: 16, marginBottom: 2,
    transition: 'background 0.2s',
  };
}

export default DeliveryListPage; 