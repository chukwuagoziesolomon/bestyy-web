import React, { useState } from 'react';
import { Package, LineChart as LucideLineChart, Timer, Bike, TrendingUp, TrendingDown } from 'lucide-react';
import SalesLineChart from '../components/SalesLineChart';
import Sparkline from '../components/Sparkline';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const metricCards = [
  {
    label: "Today's Order",
    value: 50,
    icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><Package size={28} color="#10b981" /></span>,
    trend: '+1.3% Up from past week',
    trendColor: '#10b981',
    isPositive: true,
  },
  {
    label: 'Total Sales',
    value: '₦50,000',
    icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><LucideLineChart size={28} color="#10b981" /></span>,
    trend: '-4.3% Down from yesterday',
    trendColor: '#ef4444',
    isPositive: false,
  },
  {
    label: 'Total Pending',
    value: 10,
    icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><Timer size={28} color="#10b981" /></span>,
    trend: '+1.8% Up from yesterday',
    trendColor: '#10b981',
    isPositive: true,
  },
  {
    label: 'Delivery Time',
    value: '10-15mins',
    icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><Bike size={28} color="#10b981" /></span>,
    trend: '+1.8% Up from yesterday',
    trendColor: '#10b981',
    isPositive: true,
  },
];

const pieData = [
  { name: 'Completed', value: 112, color: '#10b981' },
  { name: 'Rejected', value: 10, color: '#ef4444' },
];

const topDishes = [
  {
    name: 'Jollof Rice',
    price: 40000,
    orders: 30,
    trend: -32,
    data: [
      { name: 'Mon', value: 10 },
      { name: 'Tue', value: 20 },
      { name: 'Wed', value: 15 },
      { name: 'Thu', value: 25 },
      { name: 'Fri', value: 18 },
      { name: 'Sat', value: 12 },
      { name: 'Sun', value: 8 },
    ],
  },
  {
    name: 'Grilled Chicken Wrap',
    price: 40000,
    orders: 65,
    trend: 12,
    data: [
      { name: 'Mon', value: 8 },
      { name: 'Tue', value: 12 },
      { name: 'Wed', value: 18 },
      { name: 'Thu', value: 22 },
      { name: 'Fri', value: 30 },
      { name: 'Sat', value: 28 },
      { name: 'Sun', value: 35 },
    ],
  },
  {
    name: 'Grilled Chicken Wrap',
    price: 40000,
    orders: 30,
    trend: 24,
    data: [
      { name: 'Mon', value: 5 },
      { name: 'Tue', value: 10 },
      { name: 'Wed', value: 15 },
      { name: 'Thu', value: 20 },
      { name: 'Fri', value: 25 },
      { name: 'Sat', value: 30 },
      { name: 'Sun', value: 35 },
    ],
  },
];

const weekOptions = ['This Week', 'Last Week'];

const AnalyticsPage = () => {
  const [orderActivityWeek, setOrderActivityWeek] = useState('This Week');
  const [topDishesWeek, setTopDishesWeek] = useState('This Week');

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      <h1 style={{ fontWeight: 900, fontSize: 32, marginBottom: 32, letterSpacing: 0.5 }}>Analytics</h1>
      {/* Metric Cards */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {metricCards.map((card, i) => (
          <div key={i} className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#888', marginBottom: 8 }}>{card.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#202224', fontFamily: 'Nunito Sans, sans-serif' }}>{card.value}</span>
              {card.icon}
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
      <SalesLineChart label="Sales Details" />
      {/* Order Activity & Top Dishes */}
      <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        {/* Order Activity Donut */}
        <div className="dashboard-card" style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Order Activity</div>
            <select value={orderActivityWeek} onChange={e => setOrderActivityWeek(e.target.value)} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 14px', color: '#555', fontSize: 14, fontWeight: 600, background: '#fff', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {weekOptions.map(week => <option key={week} value={week}>{week}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={80}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12, fontWeight: 600, color: '#888', fontSize: 15 }}>Total <span style={{ color: '#222', fontWeight: 800, fontSize: 18, marginLeft: 4 }}>145</span></div>
          <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>Completed: 112</span>
            <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 15 }}>Rejected: 10</span>
          </div>
        </div>
        {/* Top Dishes */}
        <div className="dashboard-card" style={{ flex: 2, minWidth: 320, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Top Dishes</div>
            <select value={topDishesWeek} onChange={e => setTopDishesWeek(e.target.value)} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 14px', color: '#555', fontSize: 14, fontWeight: 600, background: '#fff', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {weekOptions.map(week => <option key={week} value={week}>{week}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {topDishes.map((dish, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, borderBottom: i !== topDishes.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: 12, paddingTop: 6 }}>
                <div style={{ flex: 2, fontWeight: 700, fontSize: 17 }}>{dish.name}</div>
                <div style={{ flex: 2, color: '#888', fontWeight: 600, fontSize: 15 }}>₦ {dish.price.toLocaleString()}</div>
                <div style={{ flex: 3, minWidth: 80, maxWidth: 120 }}>
                  <Sparkline data={dish.data} color={i === 0 ? '#ef447a' : '#10b981'} />
                </div>
                <div style={{ flex: 2, fontWeight: 700, fontSize: 15, color: '#222', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {dish.orders} Orders
                </div>
                <div style={{ flex: 1, fontWeight: 700, fontSize: 15, color: dish.trend < 0 ? '#ef4444' : '#10b981' }}>
                  {dish.trend > 0 ? `+${dish.trend}%` : `${dish.trend}%`}
                </div>
                <div style={{ flex: 1, textAlign: 'right', color: '#cbd5e1', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>Do</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 