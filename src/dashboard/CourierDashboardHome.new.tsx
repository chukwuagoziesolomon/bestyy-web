import React, { useEffect, useState } from 'react';
import SalesLineChart from '../components/SalesLineChart';
import { Package, CreditCard, Timer } from 'lucide-react';
import { fetchCourierDashboardMetrics, fetchCourierDeliveries } from '../api';
import { DashboardMetrics, Delivery, DeliveryResponse, TrendData } from '../types/courier';

interface ChartDataPoint {
  x: string;
  y: number;
}

interface TrendAnalysis {
  slope: number;
  intercept: number;
  r_squared: number;
  trend_points: number[];
}

interface EarningsChartData {
  chart_data: ChartDataPoint[];
  trend_analysis: TrendAnalysis;
  peak_earnings: number;
  peak_day: number;
  total_month_earnings: number;
  average_daily_earnings: number;
}

const initialChartData: EarningsChartData = {
  chart_data: [],
  trend_analysis: {
    slope: 0,
    intercept: 0,
    r_squared: 0,
    trend_points: []
  },
  peak_earnings: 0,
  peak_day: 0,
  total_month_earnings: 0,
  average_daily_earnings: 0
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const statusColors: Record<string, { bg: string; color: string }> = {
  cancelled: { bg: '#fee2e2', color: '#ef4444' },
  delivered: { bg: '#d1fae5', color: '#10b981' },
  accepted: { bg: '#fef3c7', color: '#f59e42' },
  pending: { bg: '#e0e7ff', color: '#6366f1' },
};

const CourierDashboardHome: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [chartData, setChartData] = useState<EarningsChartData>(initialChartData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const [metricsData, deliveriesData] = await Promise.all([
          fetchCourierDashboardMetrics(token),
          fetchCourierDeliveries(token)
        ]);

        // Transform metrics data to match the expected chart data format
        const earningsData: EarningsChartData = {
          chart_data: metricsData?.trend?.map((item: TrendData, index: number) => ({
            x: `Day ${index + 1}`,
            y: item.earnings || 0
          })) || [],
          trend_analysis: {
            slope: 0,
            intercept: 0,
            r_squared: 0,
            trend_points: []
          },
          peak_earnings: metricsData?.earnings || 0,
          peak_day: 0,
          total_month_earnings: metricsData?.earnings || 0,
          average_daily_earnings: metricsData?.earnings ? metricsData.earnings / 30 : 0
        };

        setChartData(earningsData);

        setMetrics(metricsData);
        setDeliveries(deliveriesData.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: '#ef4444', textAlign: 'center' }}>{error}</div>;
  }

  const stats = metrics ? [
    {
      label: 'Total Delivery',
      value: metrics.total_deliveries,
      icon: <Package size={32} color="#10b981" />,
      trend: '+1.3% Up from past week',
      trendColor: '#10b981',
    },
    {
      label: 'Earnings',
      value: formatCurrency(metrics.earnings),
      icon: <CreditCard size={32} color="#10b981" />,
      trend: '-4.3% Down from yesterday',
      trendColor: '#ef4444',
    },
    {
      label: 'Avg. Delivery Time',
      value: `${metrics.avg_delivery_time}mins`,
      icon: <Timer size={32} color="#10b981" />,
      trend: '1.8% Up from yesterday',
      trendColor: '#10b981',
    },
  ] : [];


  return (
    <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh', padding: '0.5rem 2.5rem 2.5rem 2.5rem', fontFamily: 'Nunito Sans, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>Welcome Back, {localStorage.getItem('first_name') || 'Courier'}!</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img src="/user1.png" alt="Profile" style={{ width: 38, height: 38, borderRadius: '50%' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        <SalesLineChart 
          data={chartData} 
          label="Earning Details" 
          height={220} 
          loading={loading}
          error={error}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #e5e7eb', padding: 32, margin: '0 auto', maxWidth: 1200 }}>
        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 24 }}>New Deliveries</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 17, border: '1px solid #e5e7eb', fontFamily: 'inherit' }}>
          <thead>
            <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
              <th style={{ padding: '18px 12px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>ID</th>
              <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>ADDRESS</th>
              <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>PACKAGE TYPE</th>
              <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>DATE</th>
              <th style={{ borderRight: '1px solid #D1D5DB', padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>AMOUNT</th>
              <th style={{ padding: '18px 12px', borderBottom: '1px solid #D1D5DB', fontWeight: 600 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{`#${delivery.id}`}</td>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{delivery.address}</td>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{delivery.package_type}</td>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{formatDate(delivery.date)}</td>
                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{formatCurrency(delivery.total_price)}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ 
                    background: statusColors[delivery.status]?.bg || '#e5e7eb',
                    color: statusColors[delivery.status]?.color || '#374151',
                    borderRadius: 8,
                    padding: '6px 18px',
                    fontWeight: 600,
                    fontSize: 15
                  }}>
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
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
