import React, { useState, useEffect } from 'react';
import { Package, LineChart as LucideLineChart, Timer, Bike, TrendingUp, TrendingDown } from 'lucide-react';
import SalesLineChart from '../components/SalesLineChart';
import Sparkline from '../components/Sparkline';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchDashboardAnalytics } from '../api';
import { showError } from '../toast';

const weekOptions = ['This Week', 'Last Week'];

const AnalyticsPage = () => {
  const [orderActivityWeek, setOrderActivityWeek] = useState('This Week');
  const [topDishesWeek, setTopDishesWeek] = useState('This Week');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function getAnalytics() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await fetchDashboardAnalytics(token);
          setAnalytics(data);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Could not fetch analytics';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    getAnalytics();
  }, [token]);

  // Prepare metric cards from analytics data
  const metricCards = analytics ? [
    {
      label: "Today's Order",
      value: analytics.todays_order,
      icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><Package size={28} color="#10b981" /></span>,
      trend: analytics.percentage_changes?.orders?.daily?.text || '',
      trendColor: analytics.percentage_changes?.orders?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
      isPositive: analytics.percentage_changes?.orders?.daily?.direction === 'up',
    },
    {
      label: 'Total Sales',
      value: `₦${analytics.total_sales?.toLocaleString()}`,
      icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><LucideLineChart size={28} color="#10b981" /></span>,
      trend: analytics.percentage_changes?.sales?.daily?.text || '',
      trendColor: analytics.percentage_changes?.sales?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
      isPositive: analytics.percentage_changes?.sales?.daily?.direction === 'up',
    },
    {
      label: 'Total Pending',
      value: analytics.total_pending,
      icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><Timer size={28} color="#10b981" /></span>,
      trend: analytics.percentage_changes?.pending?.daily?.text || '',
      trendColor: analytics.percentage_changes?.pending?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
      isPositive: analytics.percentage_changes?.pending?.daily?.direction === 'up',
    },
    {
      label: 'Delivery Time',
      value: analytics.delivery_time,
      icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 44, height: 44 }}><Bike size={28} color="#10b981" /></span>,
      trend: '',
      trendColor: '#10b981',
      isPositive: true,
    },
  ] : [];

  // Prepare pieData for Order Activity Donut from analytics
  const pieData = analytics && analytics.order_activity ? [
    { name: 'Completed', value: analytics.order_activity.completed || 0, color: '#10b981' },
    { name: 'Rejected', value: analytics.order_activity.rejected || 0, color: '#ef4444' },
  ] : [
    { name: 'Completed', value: 0, color: '#10b981' },
    { name: 'Rejected', value: 0, color: '#ef4444' },
  ];

  // Prepare topDishes from analytics
  const topDishes = analytics && analytics.top_dishes ? analytics.top_dishes : [];

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      <h1 style={{ fontWeight: 900, fontSize: 32, marginBottom: 32, letterSpacing: 0.5 }}>Analytics</h1>
      {loading ? (
        <div style={{ color: '#888', fontSize: 18 }}>Loading analytics...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', fontSize: 18 }}>{error}</div>
      ) : analytics ? (
        <>
      {/* Metric Cards */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {metricCards.map((card, i) => (
          <div key={i} className="dashboard-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200, position: 'relative' }}>
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
            {/* Weekly trend for Orders and Sales */}
            {card.label === "Today's Order" && analytics.percentage_changes?.orders?.weekly && (
              <div style={{ fontSize: 13, color: analytics.percentage_changes.orders.weekly.direction === 'up' ? '#10b981' : '#ef4444', fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                {analytics.percentage_changes.orders.weekly.direction === 'up' ? (
                  <TrendingUp size={14} color="#10b981" style={{ marginRight: 2 }} />
                ) : (
                  <TrendingDown size={14} color="#ef4444" style={{ marginRight: 2 }} />
                )}
                {analytics.percentage_changes.orders.weekly.text}
              </div>
            )}
            {card.label === 'Total Sales' && analytics.percentage_changes?.sales?.weekly && (
              <div style={{ fontSize: 13, color: analytics.percentage_changes.sales.weekly.direction === 'up' ? '#10b981' : '#ef4444', fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                {analytics.percentage_changes.sales.weekly.direction === 'up' ? (
                  <TrendingUp size={14} color="#10b981" style={{ marginRight: 2 }} />
                ) : (
                  <TrendingDown size={14} color="#ef4444" style={{ marginRight: 2 }} />
                )}
                {analytics.percentage_changes.sales.weekly.text}
              </div>
            )}
            {/* Trend line visual indicator */}
            {card.trend && (
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 8, height: 4, borderRadius: 2, background: card.isPositive ? '#10b981' : '#ef4444', opacity: 0.25 }} />
            )}
          </div>
        ))}
      </div>
      {/* Sales Details Chart */}
          <SalesLineChart label="Sales Details" data={analytics.sales_chart?.map((d: any) => ({ name: d.label, value: d.sales }))} />
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
              <div style={{ marginTop: 12, fontWeight: 600, color: '#888', fontSize: 15 }}>Total <span style={{ color: '#222', fontWeight: 800, fontSize: 18, marginLeft: 4 }}>{(analytics.order_activity?.completed || 0) + (analytics.order_activity?.rejected || 0)}</span></div>
          <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>Completed: {analytics.order_activity?.completed || 0}</span>
            <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 15 }}>Rejected: {analytics.order_activity?.rejected || 0}</span>
          </div>
        </div>
            {/* Top Dishes (dynamic) */}
        <div className="dashboard-card" style={{ flex: 2, minWidth: 320, padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Top Dishes</div>
            {topDishes.length === 0 ? (
              <div style={{ color: '#888', fontSize: 16, marginTop: 12 }}>No data available.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {topDishes.map((dish: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, borderBottom: i !== topDishes.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: 12, paddingTop: 6 }}>
                    <div style={{ flex: 2, fontWeight: 700, fontSize: 17 }}>{dish.name}</div>
                    <div style={{ flex: 2, color: '#888', fontWeight: 600, fontSize: 15 }}>₦ {dish.price?.toLocaleString?.() ?? dish.price}</div>
                    <div style={{ flex: 2, fontWeight: 700, fontSize: 15, color: '#222', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {dish.orders} Orders
                    </div>
                    <div style={{ flex: 1, fontWeight: 700, fontSize: 15, color: dish.trend < 0 ? '#ef4444' : '#10b981' }}>
                      {dish.trend > 0 ? `+${dish.trend}%` : `${dish.trend}%`}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AnalyticsPage; 