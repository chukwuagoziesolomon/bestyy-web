import React, { useState, useEffect } from 'react';
import { Smile, Package, LineChart, Timer, Bike, TrendingUp, TrendingDown } from 'lucide-react';
import SalesLineChart from '../components/SalesLineChart';
import { fetchDashboardAnalytics, fetchVendorOrders } from '../api';
import { showError } from '../toast';

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

const DashboardHome = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  // Get business name and logo from localStorage vendor_profile
  let businessName = 'Vendor';
  let businessLogo: string | null = null;
  const savedVendor = localStorage.getItem('vendor_profile');
  if (savedVendor) {
    try {
      const vendor = JSON.parse(savedVendor);
      businessName = vendor.business_name || 'Vendor';
      businessLogo = vendor.logo || null;
    } catch (e) {}
  }

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
    async function getOrders() {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        if (token) {
          const data = await fetchVendorOrders(token);
          setOrders(data.orders || data || []);
        }
      } catch (err: any) {
        setOrdersError(err.message || 'Could not fetch orders');
      } finally {
        setOrdersLoading(false);
      }
    }
    getOrders();
  }, [token]);

  // Prepare card data from analytics
  const cardData = analytics ? [
  {
    label: "Today's Order",
      value: analytics.todays_order,
      trend: analytics.percentage_changes?.orders?.daily?.text || '',
      trendValue: analytics.percentage_changes?.orders?.daily?.value || 0,
      trendColor: analytics.percentage_changes?.orders?.daily?.value > 0 ? '#10b981' : analytics.percentage_changes?.orders?.daily?.value < 0 ? '#ef4444' : '#888',
      isPositive: analytics.percentage_changes?.orders?.daily?.value > 0,
      isNegative: analytics.percentage_changes?.orders?.daily?.value < 0,
  },
  {
    label: 'Total Sales',
      value: `₦${analytics.total_sales?.toLocaleString()}`,
      trend: analytics.percentage_changes?.sales?.daily?.text || '',
      trendValue: analytics.percentage_changes?.sales?.daily?.value || 0,
      trendColor: analytics.percentage_changes?.sales?.daily?.value > 0 ? '#10b981' : analytics.percentage_changes?.sales?.daily?.value < 0 ? '#ef4444' : '#888',
      isPositive: analytics.percentage_changes?.sales?.daily?.value > 0,
      isNegative: analytics.percentage_changes?.sales?.daily?.value < 0,
  },
  {
    label: 'Total Pending',
      value: analytics.total_pending,
      trend: analytics.percentage_changes?.pending?.daily?.text || '',
      trendValue: analytics.percentage_changes?.pending?.daily?.value || 0,
      trendColor: analytics.percentage_changes?.pending?.daily?.value > 0 ? '#10b981' : analytics.percentage_changes?.pending?.daily?.value < 0 ? '#ef4444' : '#888',
      isPositive: analytics.percentage_changes?.pending?.daily?.value > 0,
      isNegative: analytics.percentage_changes?.pending?.daily?.value < 0,
  },
  {
    label: 'Delivery Time',
      value: analytics.delivery_time,
      trend: '',
    trendColor: '#10b981',
    isPositive: true,
      isNegative: false,
    },
  ] : [];

  const salesData = analytics?.sales_chart?.map((d: any) => ({ name: d.label, value: d.sales })) || [];

  // Check for new vendor (no orders, no sales, no pending)
  const isNewVendor = analytics && analytics.todays_order === 0 && analytics.total_sales === 0 && analytics.total_pending === 0;

  return (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>Welcome Back, {businessName}!</h2>
      </div>
      {loading ? (
        <div style={{ color: '#888', fontSize: 18 }}>Loading analytics...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', fontSize: 18 }}>{error}</div>
      ) : analytics ? (
        isNewVendor ? (
          <div style={{ textAlign: 'center', color: '#888', fontWeight: 600, margin: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
            <Smile size={120} color="#e5e7eb" style={{ marginBottom: 32 }} />
            <div style={{ fontSize: 22, color: '#888', fontWeight: 600, maxWidth: 500 }}>
              You haven’t had an order yet. Once you receive your first order, you’ll see your stats here!
            </div>
          </div>
        ) : (
        <>
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
                  {card.trendValue > 0 ? (
              <TrendingUp size={16} color={card.trendColor} style={{ marginRight: 2 }} />
                  ) : card.trendValue < 0 ? (
              <TrendingDown size={16} color={card.trendColor} style={{ marginRight: 2 }} />
                  ) : null}
                  {card.trend || (card.trendValue === 0 ? 'No change from yesterday' : '')}
          </div>
        </div>
      ))}
    </div>
    {/* Sales Details Chart */}
    <div className="dashboard-card">
      <SalesLineChart data={salesData} label="Sales Details" height={220} />
    </div>
          {/* New Orders Table (live) */}
    <div className="dashboard-card">
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>New Orders</div>
            {ordersLoading ? (
              <div style={{ color: '#888', fontSize: 15, padding: 24 }}>Loading orders...</div>
            ) : ordersError ? (
              <div style={{ color: '#ef4444', fontSize: 15, padding: 24 }}>{ordersError}</div>
            ) : (
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
                  {orders.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 32 }}>No orders found.</td></tr>
                  ) : (
                    orders.slice(0, 5).map((order: any, i: number) => (
                      <tr key={order.id || i} style={{ borderBottom: i !== orders.length - 1 ? '2px solid #e5e7eb' : 'none' }}>
                        <td style={{ padding: '24px 18px' }}>{order.id || '-'}</td>
                        <td style={{ padding: '24px 18px' }}>{order.customer_name || '-'}</td>
                        <td style={{ padding: '24px 18px' }}>{order.delivery_address || '-'}</td>
                        <td style={{ padding: '24px 18px' }}>{order.item_name || '-'}</td>
                        <td style={{ padding: '24px 18px' }}>{order.total_amount ? `₦${order.total_amount}` : '-'}</td>
                        <td style={{ padding: '24px 18px' }}>
                          <span style={{ background: order.status === 'Rejected' ? '#fee2e2' : '#d1fae5', color: order.status === 'Rejected' ? '#ef4444' : '#10b981', borderRadius: 8, padding: '4px 14px', fontWeight: 600 }}>{order.status || '-'}</span>
                        </td>
            </tr>
                    ))
                  )}
        </tbody>
      </table>
            )}
          </div>
        </>
        )
      ) : null}
  </div>
);
};

export default DashboardHome; 