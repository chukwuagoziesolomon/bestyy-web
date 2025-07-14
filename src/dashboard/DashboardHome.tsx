import React from 'react';
import { Package, LineChart, Timer, Bike, TrendingUp, TrendingDown } from 'lucide-react';
import SalesLineChart from '../components/SalesLineChart';

const cardIcons = [
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}>
    <Package size={28} color="#10b981" />
  </span>,
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}>
    <LineChart size={28} color="#10b981" />
  </span>,
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}>
    <Timer size={28} color="#10b981" />
  </span>,
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}>
    <Bike size={28} color="#10b981" />
  </span>
];

const cardData = [
  {
    label: "Today's Order",
    value: 50,
    trend: '+1.3% Up from past week',
    trendColor: '#10b981',
    isPositive: true,
  },
  {
    label: 'Total Sales',
    value: '₦50,000',
    trend: '-4.3% Down from yesterday',
    trendColor: '#ef4444',
    isPositive: false,
  },
  {
    label: 'Total Pending',
    value: 10,
    trend: '+1.8% Up from yesterday',
    trendColor: '#10b981',
    isPositive: true,
  },
  {
    label: 'Delivery Time',
    value: '10-15mins',
    trend: '+1.8% Up from yesterday',
    trendColor: '#10b981',
    isPositive: true,
  },
];

const salesData = [
  { name: '5k', value: 30 },
  { name: '10k', value: 45 },
  { name: '15k', value: 60 },
  { name: '20k', value: 80 },
  { name: '25k', value: 50 },
  { name: '30k', value: 90 },
  { name: '35k', value: 70 },
  { name: '40k', value: 100 },
  { name: '45k', value: 80 },
  { name: '50k', value: 60 },
  { name: '55k', value: 75 },
  { name: '60k', value: 85 },
];

const DashboardHome = () => (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
    <h2 style={{ fontWeight: 600, fontSize: 28, marginBottom: 24 }}>Welcome Back, Silver!</h2>
    {/* Metrics Cards */}
    <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
      {cardData.map((card, i) => (
        <div key={i} className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#888', marginBottom: 8 }}>{card.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 600, color: '#202224', fontFamily: 'Nunito Sans, sans-serif' }}>{card.value}</span>
            {cardIcons[i]}
          </div>
          <div style={{ fontSize: 14, color: card.trendColor, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            {card.isPositive ? (
              <TrendingUp size={16} color={card.trendColor} style={{ marginRight: 2 }} />
            ) : (
              <TrendingDown size={16} color={card.trendColor} style={{ marginRight: 2 }} />
            )}
            {card.trend}
          </div>
        </div>
      ))}
    </div>
    {/* Sales Details Chart */}
    <div className="dashboard-card">
      <SalesLineChart data={salesData} label="Sales Details" height={220} />
    </div>
    {/* New Orders Table */}
    <div className="dashboard-card">
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>New Orders</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
        <thead>
          <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
            <th style={{ padding: '24px 18px' }}>ID</th>
            <th style={{ padding: '24px 18px' }}>Name</th>
            <th style={{ padding: '24px 18px' }}>Address</th>
            <th style={{ padding: '24px 18px' }}>Item</th>
            <th style={{ padding: '24px 18px' }}>Total</th>
            <th style={{ padding: '24px 18px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(1)].map((_, i, arr) => (
            <tr key={i} style={{ borderBottom: i !== arr.length - 1 ? '2px solid #e5e7eb' : 'none' }}>
              <td style={{ padding: '24px 18px' }}>00001</td>
              <td style={{ padding: '24px 18px' }}>Christine Brooks</td>
              <td style={{ padding: '24px 18px' }}>12,Lagos State</td>
              <td style={{ padding: '24px 18px' }}>04 Sep 2025</td>
              <td style={{ padding: '24px 18px' }}>₦5,0000</td>
              <td style={{ padding: '24px 18px' }}><span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 8, padding: '4px 14px', fontWeight: 600 }}>Rejected</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DashboardHome; 