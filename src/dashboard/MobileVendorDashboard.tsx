import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Clock, Bike, Home, List, Utensils, Table, Smile } from 'lucide-react';
import { fetchDashboardAnalytics, fetchVendorOrders } from '../api';
import { showError } from '../toast';
import SalesLineChart, { EarningsChartData } from '../components/SalesLineChart';

interface Analytics {
  todays_order: number;
  total_sales: number;
  total_pending: number;
  delivery_time: string;
  sales_chart: Array<{ label: string; sales: number }>;
  percentage_changes?: {
    orders?: {
      daily?: {
        text: string;
        value: number;
      };
    };
    sales?: {
      daily?: {
        text: string;
        value: number;
      };
    };
    pending?: {
      daily?: {
        text: string;
        value: number;
      };
    };
  };
}

interface Order {
  id: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const MobileVendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('July');
  
  // State for dynamic profile data
  const [businessName, setBusinessName] = useState('Business');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Initialize profile data from localStorage
  useEffect(() => {
    let name = 'Business';
    let image: string | null = null;

    // Try to get from vendor_profile first
    const savedVendor = localStorage.getItem('vendor_profile');
    if (savedVendor) {
      try {
        const vendor = JSON.parse(savedVendor);
        name = vendor.business_name || name;
        image = vendor.logo || vendor.profile_picture || null;
      } catch (e) {}
    }

    // If no vendor_profile, try to get from signup data as fallback
    if (name === 'Business') {
      const signupData = localStorage.getItem('vendor_signup_data');
      if (signupData) {
        try {
          const data = JSON.parse(signupData);
          name = data.businessName || name;
          // Note: signup data might not have image
        } catch (e) {}
      }
    }

    setBusinessName(name);
    setProfileImage(image);
  }, []);

  const token = localStorage.getItem('vendor_token');

  // Function to fetch and store vendor profile
  const fetchVendorProfile = async () => {
    if (!token) return;

    try {
      // Try to fetch vendor profile from backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/user/vendor/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        localStorage.setItem('vendor_profile', JSON.stringify(profileData));
        console.log('Vendor profile fetched and stored:', profileData);

        // Update state with fresh data
        if (profileData.business_name) {
          setBusinessName(profileData.business_name);
        }
        if (profileData.logo || profileData.profile_picture) {
          setProfileImage(profileData.logo || profileData.profile_picture);
        }
      }
    } catch (err) {
      console.log('Could not fetch vendor profile:', err);
      // Don't show error to user, just continue with fallback data
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (token) {
          // Fetch vendor profile first
          await fetchVendorProfile();

          const [analyticsData, ordersData] = await Promise.all([
            fetchDashboardAnalytics(token),
            fetchVendorOrders(token)
          ]);
          setAnalytics(analyticsData);
          setOrders(ordersData.orders || ordersData || []);
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  // Prepare card data from analytics (same as desktop)
  const statsCards = analytics ? [
    {
      title: "Today's Order",
      value: analytics.todays_order || 0,
      icon: <Package size={24} color="#10b981" />,
      trend: analytics.percentage_changes?.orders?.daily?.text || '',
      trendValue: analytics.percentage_changes?.orders?.daily?.value || 0,
      isPositive: (analytics.percentage_changes?.orders?.daily?.value || 0) > 0,
      isNegative: (analytics.percentage_changes?.orders?.daily?.value || 0) < 0
    },
    {
      title: "Total Sales",
      value: analytics.total_sales ? `₦${analytics.total_sales.toLocaleString()}` : "₦0",
      icon: <TrendingUp size={24} color="#10b981" />,
      trend: analytics.percentage_changes?.sales?.daily?.text || '',
      trendValue: analytics.percentage_changes?.sales?.daily?.value || 0,
      isPositive: (analytics.percentage_changes?.sales?.daily?.value || 0) > 0,
      isNegative: (analytics.percentage_changes?.sales?.daily?.value || 0) < 0
    },
    {
      title: "Total Pending",
      value: analytics.total_pending || 0,
      icon: <Clock size={24} color="#10b981" />,
      trend: analytics.percentage_changes?.pending?.daily?.text || '',
      trendValue: analytics.percentage_changes?.pending?.daily?.value || 0,
      isPositive: (analytics.percentage_changes?.pending?.daily?.value || 0) > 0,
      isNegative: (analytics.percentage_changes?.pending?.daily?.value || 0) < 0
    },
    {
      title: "Delivery Time",
      value: analytics.delivery_time || "N/A",
      icon: <Bike size={24} color="#10b981" />,
      trend: '',
      trendValue: 0,
      isPositive: true,
      isNegative: false
    }
  ] : [];

  // Prepare chart data for SalesLineChart
  const [salesData, setSalesData] = useState<EarningsChartData>({
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

  // Update sales data when analytics change
  useEffect(() => {
    if (analytics?.sales_chart) {
      const chartData = analytics.sales_chart.map(item => ({
        x: item.label,
        y: item.sales
      }));
      
      const totalEarnings = analytics.sales_chart.reduce((sum, item) => sum + item.sales, 0);
      const avgDailyEarnings = totalEarnings / (analytics.sales_chart.length || 1);
      
      setSalesData({
        chart_data: chartData,
        trend_analysis: {
          slope: 0,
          intercept: 0,
          r_squared: 0,
          trend_points: []
        },
        peak_earnings: Math.max(...analytics.sales_chart.map(item => item.sales)),
        peak_day: 0,
        total_month_earnings: totalEarnings,
        average_daily_earnings: avgDailyEarnings
      });
    }
  }, [analytics]);

  // Check for new vendor (no orders, no sales, no pending) - same logic as desktop
  const isNewVendor = analytics && analytics.todays_order === 0 && analytics.total_sales === 0 && analytics.total_pending === 0;

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          margin: 0,
          color: '#1f2937',
          flex: 1,
          marginRight: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          Welcome Back, {businessName}!
        </h1>
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e5e7eb'
            }}
          />
        ) : (
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #e5e7eb',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {businessName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Show empty state for new vendors or main content */}
      {loading ? (
        <div style={{ padding: '24px 16px' }}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            Loading dashboard...
          </div>
        </div>
      ) : isNewVendor ? (
        <div style={{
          textAlign: 'center',
          color: '#888',
          fontWeight: 600,
          margin: '4rem 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '0 16px'
        }}>
          <Smile size={120} color="#e5e7eb" style={{ marginBottom: 32 }} />
          <div style={{
            fontSize: 18,
            color: '#888',
            fontWeight: 600,
            maxWidth: 400,
            lineHeight: 1.5
          }}>
            You haven't had an order yet. Once you receive your first order, you'll see your stats here!
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
      <div style={{
        padding: '24px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        {statsCards.map((card, index) => (
          <div key={index} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px 16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              {card.title}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#1f2937'
              }}>
                {card.value}
              </span>
              {card.icon}
            </div>
            {card.trend && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: card.isPositive ? '#10b981' : card.isNegative ? '#ef4444' : '#6b7280'
              }}>
                <TrendingUp
                  size={12}
                  style={{
                    transform: card.isNegative ? 'rotate(180deg)' : 'none'
                  }}
                />
                {card.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sales Details Chart */}
      <div style={{
        margin: '0 16px 24px'
      }}>
<SalesLineChart
          data={salesData}
          label="Sales Details"
          height={200}
          defaultMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          loading={loading}
          error={error}
        />
      </div>

      {/* New Orders */}
      <div style={{
        margin: '0 16px 24px',
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          color: '#1f2937'
        }}>
          New Orders
        </h3>
        
        {/* Recent Orders - Show real data or empty state */}
        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#888',
            fontWeight: 600,
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Smile size={80} color="#e5e7eb" style={{ marginBottom: 16 }} />
            <div style={{
              fontSize: 14,
              color: '#888',
              fontWeight: 600,
              maxWidth: 300,
              lineHeight: 1.5
            }}>
              You haven't had an order yet. Once you receive your first order, you'll see your recent orders here!
            </div>
          </div>
        ) : (
          orders.slice(0, 3).map((order) => (
            <div key={order.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  #{order.id}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  Customer
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#1f2937',
                  marginTop: '4px'
                }}>
                  {order.customer_name || 'Unknown'}
                </div>
              </div>
              <div style={{
                background: order.status?.toLowerCase() === 'rejected' ? '#fef2f2' :
                           order.status?.toLowerCase() === 'accepted' ? '#f0fdf4' : '#f3f4f6',
                color: order.status?.toLowerCase() === 'rejected' ? '#dc2626' :
                       order.status?.toLowerCase() === 'accepted' ? '#16a34a' : '#6b7280',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {order.status || 'Pending'}
              </div>
            </div>
          ))
        )}
      </div>
      </>
      )}

      {/* Bottom Navigation - Always visible */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 30
      }}>
        {[
          {
            icon: <Home size={20} />,
            label: 'Dashboard',
            active: true,
            onClick: () => {}
          },
          {
            icon: <List size={20} />,
            label: 'Order List',
            active: false,
            onClick: () => navigate('/vendor/dashboard/orders')
          },
          {
            icon: <Utensils size={20} />,
            label: 'Menu',
            active: false,
            onClick: () => navigate('/vendor/dashboard/menu')
          },
          {
            icon: <Table size={20} />,
            label: 'Item Stock',
            active: false,
            onClick: () => navigate('/vendor/dashboard/stock')
          }
        ].map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: item.active ? '#10b981' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileVendorDashboard;
