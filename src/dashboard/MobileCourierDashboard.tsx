import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, TrendingUp, CreditCard, Truck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CourierHeader from '../components/CourierHeader';
import CourierBottomNavigation from '../components/CourierBottomNavigation';

const MobileCourierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courierName = localStorage.getItem('first_name') || 'Silver';

  // State for real courier data
  const [courierData, setCourierData] = useState({
    totalDeliveries: 0,
    earnings: 0,
    avgDeliveryTime: 0,
    deliveries: [] as any[]
  });
  const [earningsChartData, setEarningsChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch courier analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        // Fetch analytics data
        const analyticsResponse = await fetch('http://127.0.0.1:8000/api/user/couriers/dashboard/analytics/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!analyticsResponse.ok) {
          throw new Error(`Analytics API error! status: ${analyticsResponse.status}`);
        }

        const analyticsData = await analyticsResponse.json();
        console.log('Mobile Analytics API Response:', analyticsData);
        
        // Fetch earnings chart data
        const chartResponse = await fetch('http://127.0.0.1:8000/api/user/couriers/dashboard/earnings-chart/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (chartResponse.ok) {
          const chartData = await chartResponse.json();
          console.log('Mobile Earnings Chart API Response:', chartData);
          setEarningsChartData(chartData.chart_data || []);
        }
        
        // Fetch recent deliveries data
        try {
          const deliveriesResponse = await fetch('http://127.0.0.1:8000/api/user/couriers/dashboard/recent-deliveries/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (deliveriesResponse.ok) {
            const deliveriesData = await deliveriesResponse.json();
            console.log('Recent Deliveries API Response:', deliveriesData);
            setCourierData(prev => ({
              ...prev,
              deliveries: deliveriesData.deliveries || []
            }));
          }
        } catch (deliveriesError) {
          console.log('Deliveries API error (non-critical):', deliveriesError);
        }
        
        // Transform API data to match our component structure
        setCourierData(prev => ({
          totalDeliveries: analyticsData.total_deliveries || 0,
          earnings: parseInt(analyticsData.total_earnings?.replace(/[₦,]/g, '') || '0'),
          avgDeliveryTime: parseInt(analyticsData.avg_delivery_time?.replace(/[mins]/g, '') || '0'),
          deliveries: prev.deliveries || [] // Keep deliveries if already fetched
        }));
      } catch (err: any) {
        console.error('Error fetching courier analytics:', err);
        setError(err.message || 'Failed to fetch analytics data');
        
        // Show empty state - no fake data
        setCourierData({
          totalDeliveries: 0,
          earnings: 0,
          avgDeliveryTime: 0,
          deliveries: [] as any[]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const stats = [
    {
      label: 'Total Deliveries',
      value: courierData.totalDeliveries,
      icon: <Package size={20} color="#10b981" />,
      trend: courierData.totalDeliveries > 0 ? '+1.3% Up from past week' : 'Start delivering to see trends',
      trendColor: courierData.totalDeliveries > 0 ? '#10b981' : '#9ca3af'
    },
    {
      label: 'Earnings',
      value: courierData.earnings > 0 ? `₦${courierData.earnings.toLocaleString()}` : '₦0',
      icon: <CreditCard size={20} color="#10b981" />,
      trend: courierData.earnings > 0 ? '+1.3% Up from past week' : 'Start delivering to earn',
      trendColor: courierData.earnings > 0 ? '#10b981' : '#9ca3af'
    },
    {
      label: 'Avg. Delivery Time',
      value: courierData.avgDeliveryTime > 0 ? `${courierData.avgDeliveryTime}mins` : '0mins',
      icon: <TrendingUp size={20} color="#10b981" />,
      trend: courierData.avgDeliveryTime > 0 ? '+1.3% Up from past week' : 'Start delivering to track time',
      trendColor: courierData.avgDeliveryTime > 0 ? '#10b981' : '#9ca3af'
    }
  ];

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <CourierHeader title="Dashboard" />



      {/* Content */}
      <div style={{ padding: '24px 16px' }}>
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
        {!loading && !error && courierData.totalDeliveries === 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            border: '1px solid #e2e8f0', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#1e293b', 
              marginBottom: '12px',
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Truck size={20} color="#10b981" />
                Welcome to Your Courier Dashboard!
              </div>
            </div>
            <div style={{ 
              fontSize: '15px', 
              color: '#64748b',
              lineHeight: '1.5',
              fontFamily: 'Nunito Sans, sans-serif'
            }}>
              You haven't made any deliveries yet. Start accepting orders to see your earnings and stats.
            </div>
          </div>
        )}

          <>
            {/* Stats Cards */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexDirection: 'column' }}>
              {stats.map((stat, index) => (
                <div key={index} className="dashboard-card" style={{ 
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
                    <span style={{ fontSize: 30, fontWeight: 700, color: '#202224', fontFamily: 'Nunito Sans, sans-serif' }}>{stat.value}</span>
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
                  <div style={{ fontSize: 14, color: stat.trendColor, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {stat.trend}
                  </div>
                </div>
              ))}
            </div>

            {/* Earning Details Chart */}
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
              {earningsChartData && earningsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={earningsChartData}>
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

            {/* Delivery List */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '20px 20px 16px 20px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Delivery List
                </h3>
              </div>

              {courierData.deliveries.length > 0 ? (
                courierData.deliveries.map((delivery, index) => (
                <div key={delivery.id}>
                  <div style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1f2937',
                        marginBottom: '8px'
                      }}>
                        #{delivery.id}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        <strong>Pick Up</strong><br />
                          {delivery.pickup_address}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        <strong>Drop off</strong><br />
                          {delivery.dropoff_address || delivery.delivery_address}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        <strong>Date</strong><br />
                          {delivery.created_at ? new Date(delivery.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <strong>Amount</strong><br />
                          ₦ {delivery.amount ? delivery.amount.toLocaleString() : delivery.amount_display || '0'}
                        </div>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#10b981',
                        background: '#f0fdf4',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                          {delivery.status_display || delivery.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
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


        </>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        <CourierBottomNavigation currentPath="/courier/dashboard" />
      </div>

      {/* WhatsApp Chat Button */}
      <div 
        onClick={() => {
          const whatsappUrl = `https://wa.me/2348090530061?text=${encodeURIComponent('Hi! I need help with my courier account.')}`;
          window.open(whatsappUrl, '_blank');
        }}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          background: '#25D366',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
          cursor: 'pointer',
          zIndex: 40,
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
          width="28" 
          height="28" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="white"/>
          <path d="M23.47 19.37c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.06-2.54-.28-.68-.57-.59-.77-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.54.17.23 2.42 3.7 5.87 5.04.82.32 1.46.51 1.96.65.82.26 1.57.22 2.16.13.66-.1 2.01-.82 2.3-1.61.28-.79.28-1.47.2-1.61-.08-.14-.31-.23-.65-.4z" fill="#25D366"/>
        </svg>
        <span style={{
          position: 'absolute',
          bottom: '-8px',
          right: '-8px',
          background: '#fff',
          color: '#25D366',
          fontSize: '10px',
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Chat With Bestie
        </span>
      </div>
    </div>
  );
};

export default MobileCourierDashboard;
