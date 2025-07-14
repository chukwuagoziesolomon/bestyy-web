import React from 'react';
import SalesLineChart from '../components/SalesLineChart';
import { Package, CreditCard, Timer } from 'lucide-react';

const stats = [
  {
    label: 'Total Delivery',
    value: 50,
    icon: <Package size={32} color="#10b981" />,
    trend: '+1.3% Up from past week',
    trendColor: '#10b981',
  },
  {
    label: 'Earnings',
    value: '₦50,000',
    icon: <CreditCard size={32} color="#10b981" />,
    trend: '-4.3% Down from yesterday',
    trendColor: '#ef4444',
  },
  {
    label: 'Avg. Delivery Time',
    value: '10mins',
    icon: <Timer size={32} color="#10b981" />,
    trend: '1.8% Up from yesterday',
    trendColor: '#10b981',
  },
];

const deliveries = [
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Cancelled' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Mr Biggs, Yaba', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N2,0000', status: 'Delivered' },
  { id: '00001', pickup: 'Christine Brooks', dropoff: '12,Lagos State', date: '04 Sep 2025', amount: 'N5,0000', status: 'Accepted' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Cancelled: { bg: '#fee2e2', color: '#ef4444' },
  Delivered: { bg: '#d1fae5', color: '#10b981' },
  Accepted: { bg: '#fef3c7', color: '#f59e42' },
};

const CourierDashboardHome = () => (
  <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh', padding: '0.5rem 2.5rem 2.5rem 2.5rem', fontFamily: 'Nunito Sans, sans-serif' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>Welcome Back, Silver !</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <img src="/user1.png" alt="Profile" style={{ width: 38, height: 38, borderRadius: '50%' }} />
      </div>
    </div>
    <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
      {stats.map((stat, i) => (
        <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#888', marginBottom: 8 }}>{stat.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 600 }}>{stat.value}</span>
            <span>{stat.icon}</span>
          </div>
          <div style={{ fontSize: 14, color: stat.trendColor, fontWeight: 600 }}>{stat.trend}</div>
        </div>
      ))}
    </div>
    <div style={{ marginBottom: 32 }}>
      <SalesLineChart label="Earning Details" height={220} />
    </div>
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 32, margin: '0 auto', maxWidth: 1200 }}>
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 24 }}>New Deliveries</div>
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

export default CourierDashboardHome; 