import React from 'react';

const DashboardHome = () => (
  <div>
    <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24 }}>Welcome Back, Silver!</h2>
    {/* Metrics Cards */}
    <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
      {[{
        label: "Today's Order",
        value: 50,
        icon: '📦',
        trend: '+1.3% Up from past week',
        trendColor: '#10b981',
      }, {
        label: 'Total Sales',
        value: '₦50,000',
        icon: '📈',
        trend: '-4.3% Down from yesterday',
        trendColor: '#ef4444',
      }, {
        label: 'Total Pending',
        value: 10,
        icon: '⏱️',
        trend: '+1.8% Up from yesterday',
        trendColor: '#10b981',
      }, {
        label: 'Delivery Time',
        value: '10-15mins',
        icon: '🚴',
        trend: '+1.8% Up from yesterday',
        trendColor: '#10b981',
      }].map((card, i) => (
        <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#888', marginBottom: 8 }}>{card.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 900 }}>{card.value}</span>
            <span style={{ fontSize: 28 }}>{card.icon}</span>
          </div>
          <div style={{ fontSize: 14, color: card.trendColor, fontWeight: 600 }}>{card.trend}</div>
        </div>
      ))}
    </div>
    {/* Sales Details Chart Placeholder */}
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 24, marginBottom: 32 }}>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Sales Details</div>
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 18, border: '1px dashed #e5e7eb', borderRadius: 12 }}>
        [Sales Chart Placeholder]
      </div>
    </div>
    {/* New Orders Table */}
    <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 24 }}>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>New Orders</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
        <thead>
          <tr style={{ color: '#888', fontWeight: 700, textAlign: 'left' }}>
            <th style={{ padding: '8px 0' }}>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Item</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0' }}>00001</td>
            <td>Christine Brooks</td>
            <td>12,Lagos State</td>
            <td>04 Sep 2025</td>
            <td>₦5,0000</td>
            <td><span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 8, padding: '4px 14px', fontWeight: 700 }}>Rejected</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default DashboardHome; 