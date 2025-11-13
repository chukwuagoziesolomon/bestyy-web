import React, { useState, useEffect } from 'react';
import { Package, CreditCard, Timer, TrendingUp, Bell, Moon, BarChart3, List, Settings, Wallet, Clock, Truck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useResponsive } from '../hooks/useResponsive';
import { API_URL } from '../api';

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

const CourierDashboardHome = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // State for API data
  const [stats, setStats] = useState({
    total_deliveries: 0,
    total_earnings: '₦0',
    avg_delivery_time: '0mins',
    changes: {
      deliveries: { value: '0%', type: 'up' as 'up' | 'down', period: 'No data' },
      earnings: { value: '0%', type: 'up' as 'up' | 'down', period: 'No data' },
      delivery_time: { value: '0%', type: 'up' as 'up' | 'down', period: 'No data' },
    },
  });
  const [chartData, setChartData] = useState({
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
  });
  const [recentDeliveries, setRecentDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courier analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('access_token');
        console.log('Access token found:', !!token); // Debug log
        
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch(`${API_URL}/api/user/couriers/dashboard/analytics/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        // Fetch earnings chart data
        try {
          const chartResponse = await fetch(`${API_URL}/api/user/couriers/dashboard/earnings-chart/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (chartResponse.ok) {
            const chartDataResponse = await chartResponse.json();
            console.log('Earnings Chart API Response:', chartDataResponse);
            setChartData(chartDataResponse);
          }
        } catch (chartError) {
          console.log('Chart API error (non-critical):', chartError);
        }
        
        // Fetch recent deliveries data
        try {
          const deliveriesResponse = await fetch(`${API_URL}/api/user/couriers/dashboard/recent-deliveries/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (deliveriesResponse.ok) {
            const deliveriesData = await deliveriesResponse.json();
            console.log('Recent Deliveries API Response:', deliveriesData);
            setRecentDeliveries(deliveriesData.deliveries || []);
          }
        } catch (deliveriesError) {
          console.log('Deliveries API error (non-critical):', deliveriesError);
        }
        
        // Transform API data to match our component structure
        setStats({
          total_deliveries: data.total_deliveries,
          total_earnings: data.total_earnings,
          avg_delivery_time: data.avg_delivery_time,
          changes: {
            deliveries: {
              value: data.changes.deliveries.value,
              type: data.changes.deliveries.type,
              period: data.changes.deliveries.period
            },
            earnings: {
              value: data.changes.earnings.value,
              type: data.changes.earnings.type,
              period: data.changes.earnings.period
            },
            delivery_time: {
              value: data.changes.delivery_time.value,
              type: data.changes.delivery_time.type,
              period: data.changes.delivery_time.period
            },
          },
        });
      } catch (err) {
        console.error('Error fetching courier analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
        
        // Show empty state when API fails - no fake data
        setStats({
          total_deliveries: 0,
          total_earnings: '₦0',
          avg_delivery_time: '0mins',
          changes: {
            deliveries: { value: '0%', type: 'up' as 'up' | 'down', period: 'No data available' },
            earnings: { value: '0%', type: 'up' as 'up' | 'down', period: 'No data available' },
            delivery_time: { value: '0%', type: 'up' as 'up' | 'down', period: 'No data available' },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statusColors: Record<string, { bg: string; color: string }> = {
    cancelled: { bg: '#fee2e2', color: '#ef4444' },
    delivered: { bg: '#d1fae5', color: '#10b981' },
    pending: { bg: '#e0f2fe', color: '#0ea5e9' },
    accepted: { bg: '#fef3c7', color: '#f59e42' },
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const statsCards = [
    {
      label: 'Total Delivery',
      value: stats.total_deliveries.toLocaleString(),
      icon: <Package size={32} color="#0ea5e9" />,
      trend: [
        `${stats.changes.deliveries.value} ${stats.changes.deliveries.type === 'up' ? 'Up' : 'Down'} from ${stats.changes.deliveries.period}`,
        stats.changes.deliveries.type === 'up' ? '#10b981' : '#ef4444'
      ],
    },
    {
      label: 'Earnings',
      value: stats.total_earnings,
      icon: <TrendingUp size={32} color="#10b981" />,
      trend: [
        `${stats.changes.earnings.value} ${stats.changes.earnings.type === 'up' ? 'Up' : 'Down'} from ${stats.changes.earnings.period}`,
        stats.changes.earnings.type === 'up' ? '#10b981' : '#ef4444'
      ],
    },
    {
      label: 'Avg. Delivery Time',
      value: stats.avg_delivery_time,
      icon: <Clock size={32} color="#0ea5e9" />,
      trend: [
        `${stats.changes.delivery_time.value} ${stats.changes.delivery_time.type === 'up' ? 'Up' : 'Down'} from ${stats.changes.delivery_time.period}`,
        stats.changes.delivery_time.type === 'up' ? '#10b981' : '#ef4444'
      ],
    },
  ];

  // Mobile-specific layout
  if (isMobile || isTablet) {
    return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Verification Banners */}
        <div style={{ padding: '16px' }}>
          {/* Bank Verification Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.1)',
              zIndex: 1
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2, position: 'relative' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
              }}>
                🏦
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#92400e', marginBottom: '6px', fontSize: '16px' }}>
                  ⚠️ Bank Account Verification Required
                </div>
                <div style={{ color: '#a16207', fontSize: '14px', lineHeight: '1.4', maxWidth: '280px' }}>
                  <strong>Important:</strong> Verify your bank account to receive payouts. Without verification, you won't receive any delivery payments.
                </div>
              </div>
            </div>
            <button style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
              zIndex: 2,
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Verify Now →
            </button>
          </div>
  
          {/* WhatsApp Verification Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            border: '2px solid #22c55e',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.1)',
              zIndex: 1
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2, position: 'relative' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
              }}>
                📱
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#166534', marginBottom: '6px', fontSize: '16px' }}>
                  📱 WhatsApp Verification Required
                </div>
                <div style={{ color: '#15803d', fontSize: '14px', lineHeight: '1.4', maxWidth: '280px' }}>
                  <strong>Important:</strong> Verify your WhatsApp number to receive order notifications. Without verification, you won't receive delivery requests.
                </div>
              </div>
            </div>
            <button style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.3s ease',
              zIndex: 2,
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Verify Now →
            </button>
          </div>
        </div>
  
        {/* Mobile Header */}
        <div style={{
          background: '#fff',
          padding: '20px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 6px 0',
              color: '#1f2937',
              letterSpacing: '0.5px'
            }}>
              Welcome Back, Silver!
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#6b7280', fontWeight: '500' }}>
              Courier Dashboard
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Bell size={20} color="#6b7280" />
            </button>
            <img 
              src="/user1.png" 
              alt="Profile" 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%',
                cursor: 'pointer'
              }} 
            />
          </div>
        </div>

        {/* Mobile Content */}
        <div style={{ padding: '16px' }}>
          {/* Loading State */}
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '40px 20px',
              background: '#fff',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading analytics data...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '16px',
              color: '#dc2626'
            }}>
              <strong>Error:</strong> {error} - Showing empty state
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && stats.total_deliveries === 0 && (
            <div style={{ 
              background: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '12px', 
              padding: '20px', 
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Truck size={18} color="#10b981" />
                Welcome to Your Courier Dashboard!
              </div>
              <div style={{ fontSize: '14px', color: '#0c4a6e' }}>
                You haven't made any deliveries yet. Start accepting orders to see your earnings, delivery stats, and performance metrics here.
              </div>
            </div>
          )}

          {/* Mobile Stats Cards */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexDirection: 'column' }}>
            {statsCards.map((stat, i) => {
              const [trendText, trendColor] = stat.trend;
              const hasData = stat.value !== '0' && stat.value !== '₦0' && stat.value !== '0mins';

              return (
                <div key={i} className="dashboard-card" style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 8, 
                  minWidth: 200, 
                  position: 'relative',
                  padding: 24
                }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#888', marginBottom: 8 }}>{stat.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    {hasData ? (
                      <span style={{ fontSize: 30, fontWeight: 700, color: '#202224', fontFamily: 'Nunito Sans, sans-serif' }}>{stat.value}</span>
                    ) : (
                      <span style={{ fontSize: 18, fontWeight: 500, color: '#9ca3af', fontStyle: 'italic' }}>No data available</span>
                    )}
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: '#e6f7f2', 
                      borderRadius: '50%', 
                      width: 44, 
                      height: 44 
                    }}>
                      {stat.icon}
                    </span>
                  </div>
                  {hasData ? (
                    <div style={{ fontSize: 14, color: trendColor, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {trendText}
                    </div>
                  ) : (
                    <div style={{ fontSize: 14, color: '#9ca3af', fontStyle: 'italic', marginTop: 2 }}>
                      Start delivering to see your stats
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Earning Details Chart */}
          <div className="dashboard-card" style={{ 
            flex: 1, 
            minWidth: 320, 
            padding: 24,
            marginBottom: 24
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: 16 
            }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>Earning Details</div>
              <select style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                padding: '4px 14px', 
                color: '#555', 
                fontSize: 14, 
                fontWeight: 600, 
                background: '#fff', 
                outline: 'none', 
                cursor: 'pointer', 
                fontFamily: 'inherit' 
              }}>
                <option>July</option>
                <option>August</option>
                <option>September</option>
              </select>
            </div>
            
            {/* Chart */}
            {chartData.chart_data && chartData.chart_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="x" 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: '250px',
                background: '#f9fafb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '16px',
                textAlign: 'center',
                padding: '24px'
              }}>
                Start delivering to see your earnings trend
              </div>
            )}
          </div>

          {/* Mobile Recent Deliveries */}
          <div style={{ 
            background: '#fff', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            padding: '20px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '16px' 
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                Recent Deliveries
              </h3>
              <select style={{
                padding: '6px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '13px',
                background: '#fff'
              }}>
                <option>Today</option>
                <option>Yesterday</option>
                <option>This Week</option>
              </select>
            </div>
            
            {recentDeliveries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentDeliveries.map((delivery, index) => (
                  <div key={delivery.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    background: index % 2 === 0 ? '#fff' : '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        #{delivery.id.toString().padStart(5, '0')}
                      </div>
                      <span style={{ 
                        background: statusColors[delivery.status]?.bg || '#e5e7eb', 
                        color: statusColors[delivery.status]?.color || '#4b5563',
                        borderRadius: '12px', 
                        padding: '4px 8px', 
                        fontWeight: '600', 
                        fontSize: '11px'
                      }}>
                        {delivery.status_display}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Pickup:</div>
                      <div style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                        {delivery.pickup_address}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Drop-off:</div>
                      <div style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                        {delivery.delivery_address}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {formatDate(delivery.created_at)}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>
                        {delivery.amount_display}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '6px' }}>
                  No deliveries yet
                </div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                  When you start accepting delivery orders, they will appear here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout (unchanged)
  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      {/* Verification Banners */}
      <div style={{ padding: '32px 32px 0 32px' }}>
        {/* Bank Verification Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            zIndex: 1
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2, position: 'relative' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
            }}>
              🏦
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#92400e', marginBottom: '8px', fontSize: '18px' }}>
                ⚠️ Bank Account Verification Required
              </div>
              <div style={{ color: '#a16207', fontSize: '15px', lineHeight: '1.4', maxWidth: '400px' }}>
                <strong>Important:</strong> Verify your bank account to receive payouts. Without verification, you won't receive any delivery payments. Complete this now to start earning.
              </div>
            </div>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
            transition: 'all 0.3s ease',
            zIndex: 2,
            position: 'relative'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Verify Bank Account →
          </button>
        </div>

        {/* WhatsApp Verification Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
          border: '2px solid #22c55e',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.1)',
            zIndex: 1
          }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 2, position: 'relative' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
            }}>
              📱
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#166534', marginBottom: '8px', fontSize: '18px' }}>
                📱 WhatsApp Verification Required
              </div>
              <div style={{ color: '#15803d', fontSize: '15px', lineHeight: '1.4', maxWidth: '400px' }}>
                <strong>Important:</strong> Verify your WhatsApp number to receive order notifications. Without verification, you won't receive delivery requests and miss earning opportunities.
              </div>
            </div>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 24px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
            transition: 'all 0.3s ease',
            zIndex: 2,
            position: 'relative'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Verify WhatsApp →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ background: '#f8fafc' }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            margin: 0,
            color: '#1f2937'
          }}>
            Welcome Back, Silver !
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Moon size={20} color="#6b7280" />
            </button>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
            }}>
              <Bell size={20} color="#6b7280" />
            </button>
            <img 
              src="/user1.png" 
              alt="Profile" 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                cursor: 'pointer'
              }} 
            />
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '32px' }}>
          {/* Loading State */}
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '40px',
              background: '#fff',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading analytics data...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '16px', 
              marginBottom: '24px',
              color: '#dc2626'
            }}>
              <strong>Error:</strong> {error} - Showing empty state
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && stats.total_deliveries === 0 && (
            <div style={{ 
              background: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '12px', 
              padding: '24px', 
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Truck size={20} color="#10b981" />
                Welcome to Your Courier Dashboard!
              </div>
              <div style={{ fontSize: '14px', color: '#0c4a6e' }}>
                You haven't made any deliveries yet. Start accepting orders to see your earnings, delivery stats, and performance metrics here.
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            {statsCards.map((stat, i) => {
              const [trendText, trendColor] = stat.trend;
              const hasData = stat.value !== '0' && stat.value !== '₦0' && stat.value !== '0mins';
              
              return (
                <div key={i} style={{ 
                  flex: 1, 
                  background: '#fff', 
                  borderRadius: '18px', 
                  boxShadow: '0 2px 12px #e5e7eb', 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px' 
                }}>
                  <div style={{ fontSize: '16', fontWeight: '600', color: '#888', marginBottom: '8px' }}>
                    {stat.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {hasData ? (
                      <>
                        <span style={{ fontSize: '32px', fontWeight: '600' }}>{stat.value}</span>
                        {stat.icon}
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '18px', fontWeight: '500', color: '#9ca3af', fontStyle: 'italic' }}>
                          No data available
                        </span>
                        {stat.icon}
                      </>
                    )}
                  </div>
                  {hasData ? (
                    <div style={{ fontSize: '14px', color: trendColor, fontWeight: '600' }}>
                      {trendText}
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>
                      Start delivering to see your stats
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Earning Details Chart */}
          <div style={{ 
            background: '#fff', 
            borderRadius: '18px', 
            boxShadow: '0 2px 12px #e5e7eb', 
            padding: '32px', 
            marginBottom: '32px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '24px' 
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                Earning Details
              </h3>
              <select style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#fff'
              }}>
                <option>July</option>
                <option>August</option>
                <option>September</option>
              </select>
            </div>
            
            {/* Chart */}
            {chartData.chart_data && chartData.chart_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="x" 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
            <div style={{
              height: '300px',
                background: '#f9fafb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '16px'
              }}>
                Start delivering to see your earnings trend
              </div>
            )}
          </div>

          {/* New Deliveries Table */}
          <div style={{ 
            background: '#fff', 
            borderRadius: '18px', 
            boxShadow: '0 2px 12px #e5e7eb', 
            padding: '32px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '24px' 
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                New Deliveries
              </h3>
              <select style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#fff'
              }}>
                <option>Today</option>
                <option>Yesterday</option>
                <option>This Week</option>
              </select>
            </div>
            
            {recentDeliveries.length > 0 ? (
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                fontSize: '14px', 
                border: '1px solid #e5e7eb', 
                fontFamily: 'inherit' 
              }}>
                <thead>
                  <tr style={{ 
                    color: '#6b7280', 
                    fontWeight: '600', 
                    textAlign: 'left', 
                    backgroundColor: '#f9fafb' 
                  }}>
                    <th style={{ padding: '18px 12px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>ID</th>
                    <th style={{ padding: '18px 12px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>PICK UP</th>
                    <th style={{ padding: '18px 12px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>DROP-OFF</th>
                    <th style={{ padding: '18px 12px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>DATE</th>
                    <th style={{ padding: '18px 12px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>AMOUNT</th>
                    <th style={{ padding: '18px 12px', borderBottom: '1px solid #D1D5DB' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeliveries.map((delivery, index) => (
                    <tr key={delivery.id} style={{ 
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb'
                    }}>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: '#1f2937' }}>
                        {delivery.id.toString().padStart(5, '0')}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: '#374151' }}>
                        {delivery.pickup_address}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: '#374151' }}>
                        {delivery.delivery_address}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: '#6b7280' }}>
                        {formatDate(delivery.created_at)}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600', color: '#1f2937' }}>
                        {delivery.amount_display}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{ 
                          background: statusColors[delivery.status]?.bg || '#e5e7eb', 
                          color: statusColors[delivery.status]?.color || '#4b5563',
                          borderRadius: '20px', 
                          padding: '6px 16px', 
                          fontWeight: '600', 
                          fontSize: '12px',
                          display: 'inline-block'
                        }}>
                          {delivery.status_display}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                  No deliveries yet
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  When you start accepting delivery orders, they will appear here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <div 
        onClick={() => {
          const whatsappUrl = `https://wa.me/2348090530061?text=${encodeURIComponent('Hi! I need help with my courier account.')}`;
          window.open(whatsappUrl, '_blank');
        }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: '#25D366',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
        }}
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="white"/>
          <path d="M23.47 19.37c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.06-2.54-.28-.68-.57-.59-.77-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.54.17.23 2.42 3.7 5.87 5.04.82.32 1.46.51 1.96.65.82.26 1.57.22 2.16.13.66-.1 2.01-.82 2.3-1.61.28-.79.28-1.47.2-1.61-.08-.14-.31-.23-.65-.4z" fill="#25D366"/>
        </svg>
      </div>
    </div>
  );
};

export default CourierDashboardHome; 