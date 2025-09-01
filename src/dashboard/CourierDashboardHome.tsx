import React, { useState, useEffect } from 'react';
import SalesLineChart from '../components/SalesLineChart';
import { Package, CreditCard, Timer, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ChangeData {
  value: string;
  type: 'up' | 'down';
  period: string;
}

interface Delivery {
  id: number;
  customer_name: string;
  pickup_address: string;
  delivery_address: string;
  amount: number;
  amount_display: string;
  status: string;
  status_display: string;
  delivery_time_display: string;
  created_at: string;
  delivered_at: string;
}

interface RecentDeliveriesResponse {
  count: number;
  results: Delivery[];
}

interface DashboardStats {
  total_deliveries: number;
  total_earnings: string;
  avg_delivery_time: string;
  changes: {
    deliveries: ChangeData;
    earnings: ChangeData;
    delivery_time: ChangeData;
  };
}

interface EarningsChartData {
  chart_data: Array<{
    x: string;
    y: number;
  }>;
  trend_analysis: {
    slope: number;
    intercept: number;
    r_squared: number;
    trend_points: number[];
  };
  peak_earnings: number;
  peak_day: number;
  total_month_earnings: number;
  average_daily_earnings: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatTrend = (value: number, label: string): [string, string] => {
  const isPositive = value >= 0;
  const color = isPositive ? '#10b981' : '#ef4444';
  const sign = isPositive ? '+' : '';
  const trendText = `${sign}${Math.abs(value)}% ${isPositive ? 'Up' : 'Down'} from ${label}`;
  return [trendText, color];
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return new Date(dateString).toLocaleString('en-US', options);
};

const statusColors: Record<string, { bg: string; color: string }> = {
  cancelled: { bg: '#fee2e2', color: '#ef4444' },
  delivered: { bg: '#d1fae5', color: '#10b981' },
  pending: { bg: '#e0f2fe', color: '#0ea5e9' },
  accepted: { bg: '#fef3c7', color: '#f59e42' },
  in_progress: { bg: '#f0f9ff', color: '#0ea5e9' },
  completed: { bg: '#d1fae5', color: '#10b981' },
};

const CourierDashboardHome = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([]);
  const [earningsData, setEarningsData] = useState<EarningsChartData | null>(null);
  const [loading, setLoading] = useState({
    stats: true,
    deliveries: true,
    earnings: true
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true, deliveries: true, earnings: true }));
        
        const [statsResponse, deliveriesResponse, earningsResponse] = await Promise.all([
          axios.get<DashboardStats>('/api/user/couriers/dashboard/analytics/'),
          axios.get<RecentDeliveriesResponse>('/api/user/couriers/dashboard/recent-deliveries/'),
          axios.get<EarningsChartData>('/api/user/couriers/dashboard/earnings-chart/')
        ]);
        
        setStats(statsResponse.data);
        setRecentDeliveries(deliveriesResponse.data.results);
        setEarningsData(earningsResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(prev => ({
          ...prev,
          stats: false,
          deliveries: false,
          earnings: false
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      label: 'Total Delivery',
      value: stats?.total_deliveries.toLocaleString() || '0',
      icon: <Package size={32} color="#10b981" />,
      trend: stats ? [
        `${stats.changes.deliveries.value} ${stats.changes.deliveries.period}`,
        stats.changes.deliveries.type === 'up' ? '#10b981' : '#ef4444'
      ] : ['Loading...', '#888'],
    },
    {
      label: 'Earnings',
      value: stats?.total_earnings || '₦0',
      icon: <CreditCard size={32} color="#10b981" />,
      trend: stats ? [
        `${stats.changes.earnings.value} ${stats.changes.earnings.period}`,
        stats.changes.earnings.type === 'up' ? '#10b981' : '#ef4444'
      ] : ['Loading...', '#888'],
    },
    {
      label: 'Avg. Delivery Time',
      value: stats?.avg_delivery_time || '0 mins',
      icon: <Timer size={32} color="#10b981" />,
      trend: stats ? [
        `${stats.changes.delivery_time.value} ${stats.changes.delivery_time.period}`,
        stats.changes.delivery_time.type === 'down' ? '#10b981' : '#ef4444'
      ] : ['Loading...', '#888'],
    },
  ];

  if (loading.stats || loading.deliveries) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Loader2 className="animate-spin" size={48} color="#10b981" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#ef4444'
      }}>
        {error}
      </div>
    );
  }

  return (
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
      {statsCards.map((stat, i) => {
        const [trendText, trendColor] = stat.trend;
        return (
          <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#888', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 600 }}>{stat.value}</span>
              {stat.icon}
            </div>
            <div style={{ fontSize: 14, color: trendColor, fontWeight: 600 }}>{trendText}</div>
          </div>
        );
      })}
    </div>
    <div style={{ marginBottom: 32 }}>
      <SalesLineChart 
        label="Earnings Overview" 
        height={320}
        data={earningsData || undefined}
        loading={loading.earnings}
        error={error}
      />
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
          {recentDeliveries.map((delivery) => (
            <tr key={delivery.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>#{delivery.id}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{delivery.pickup_address}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{delivery.delivery_address}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{formatDate(delivery.created_at)}</td>
              <td style={{ padding: '16px 12px', fontWeight: 600 }}>{delivery.amount_display}</td>
              <td style={{ padding: '16px 12px' }}>
                <span style={{ 
                  background: statusColors[delivery.status]?.bg || '#e5e7eb', 
                  color: statusColors[delivery.status]?.color || '#4b5563',
                  borderRadius: 8, 
                  padding: '6px 18px', 
                  fontWeight: 600, 
                  fontSize: 15 
                }}>
                  {delivery.status_display}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>
  );
};

export default CourierDashboardHome; 