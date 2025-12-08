import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Bike
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { fetchVendorAnalytics, fetchVendorSalesChart, fetchVendorOrdersList } from '../api';
import { showError } from '../toast';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';
import ChatWithBestie from '../components/ChatWithBestie';

interface VendorAnalyticsData {
  total_orders: number;
  todays_order: number;
  total_sales: number;
  total_pending: number;
  delivery_time: string;
  sales_chart: Array<{
    label: string;
    sales: number;
    orders: number;
  }>;
  percentage_changes: {
    orders: {
      daily: { value: number; direction: string; text: string };
      weekly: { value: number; direction: string; text: string };
    };
    sales: {
      daily: { value: number; direction: string; text: string };
      weekly: { value: number; direction: string; text: string };
    };
    pending: {
      daily: { value: number; direction: string; text: string };
      weekly: { value: number; direction: string; text: string };
    };
  };
}

interface VendorSalesChartData {
  chart_data: Array<{
    x: string;
    y: number;
    value: number;
    date: string;
    day: number;
  }>;
  summary: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    period: string;
    month: string;
    year: number;
  };
  percentage_change: {
    value: number;
    direction: string;
    text: string;
    previous_period_sales: number;
    current_period_sales: number;
  };
}

interface VendorOrder {
  id: string;
  name: string;
  address: string;
  date: string;
  total_amount: number;
  status: string;
  customer_email: string;
  customer_phone: string;
  payment_confirmed: boolean;
  user_receipt_confirmed: boolean;
  delivered_at: string | null;
  order_placed_at: string;
}

const MobileVendorDashboardNew: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [businessName, setBusinessName] = useState('Silver');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<VendorAnalyticsData | null>(null);
  const [salesChartData, setSalesChartData] = useState<VendorSalesChartData | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('access_token');

  // Initialize profile data from localStorage
  useEffect(() => {
    const storedBusinessName = localStorage.getItem('businessName');
    const storedProfileImage = localStorage.getItem('businessLogo');
    
    if (storedBusinessName) {
      setBusinessName(storedBusinessName);
    }
    
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (token) {
          const [analyticsData, salesChart, ordersData] = await Promise.all([
            fetchVendorAnalytics(token),
            fetchVendorSalesChart(token),
            fetchVendorOrdersList(token, { page_size: 1 })
          ]);
          setAnalytics(analyticsData);
          setSalesChartData(salesChart);
          
          // Ensure orders is always an array and filter to just one order
          const ordersArray = Array.isArray(ordersData) ? ordersData : 
                             Array.isArray(ordersData?.results) ? ordersData.results : 
                             Array.isArray(ordersData?.orders) ? ordersData.orders : 
                             Array.isArray(ordersData?.data) ? ordersData.data : [];
          setOrders(ordersArray.slice(0, 1)); // Filter to just one order
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);


  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('businessName');
    localStorage.removeItem('businessLogo');
    navigate('/login');
  };

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      preparing: '#8b5cf6',
      ready: '#10b981',
      out_for_delivery: '#06b6d4',
      delivered: '#059669',
      completed: '#10b981',
      cancelled: '#ef4444',
      failed: '#dc2626',
      refunded: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  // Prepare chart data for sales chart
  const chartData = salesChartData?.chart_data?.map(item => ({
    name: item.x,
    sales: item.y
  })) || analytics?.sales_chart?.map(item => ({
    name: item.label,
    sales: item.sales
  })) || [];

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader showBusinessName={true} />

      <div style={{ padding: '16px' }}>
        {/* Key Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Today's Order */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package size={20} color="#10b981" />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: analytics?.percentage_changes?.orders?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
                fontWeight: '500'
              }}>
                {analytics?.percentage_changes?.orders?.daily?.direction === 'up' ? 
                  <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{analytics?.percentage_changes?.orders?.daily?.text || 'No data'}</span>
              </div>
            </div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Today's Order
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0,
              lineHeight: '1.2'
            }}>
              {analytics?.todays_order || '--'}
            </p>
          </div>

          {/* Total Sales */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={20} color="#10b981" />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: analytics?.percentage_changes?.sales?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
                fontWeight: '500'
              }}>
                {analytics?.percentage_changes?.sales?.daily?.direction === 'up' ? 
                  <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{analytics?.percentage_changes?.sales?.daily?.text || 'No data'}</span>
              </div>
            </div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Sales
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0,
              lineHeight: '1.2'
            }}>
              {analytics?.total_sales ? formatCurrency(analytics.total_sales) : '--'}
            </p>
          </div>

          {/* Total Pending */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} color="#10b981" />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: analytics?.percentage_changes?.pending?.daily?.direction === 'up' ? '#ef4444' : '#10b981',
                fontWeight: '500'
              }}>
                {analytics?.percentage_changes?.pending?.daily?.direction === 'up' ? 
                  <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{analytics?.percentage_changes?.pending?.daily?.text || 'No data'}</span>
              </div>
            </div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Pending
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0,
              lineHeight: '1.2'
            }}>
              {analytics?.total_pending || '--'}
            </p>
          </div>

          {/* Delivery */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bike size={20} color="#10b981" />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#10b981',
                fontWeight: '500'
              }}>
                <TrendingUp size={10} />
                <span>Avg. {analytics?.delivery_time || '--'} min</span>
              </div>
            </div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#64748b',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Delivery
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0,
              lineHeight: '1.2'
            }}>
              {analytics?.delivery_time || '--'}
            </p>
          </div>
        </div>

        {/* Sales Details Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #f1f5f9',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0
            }}>
              Sales Details
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              background: 'white',
              cursor: 'pointer'
            }}>
              <span style={{
                fontSize: '14px',
                color: '#475569',
                fontWeight: '500'
              }}>
                {selectedMonth}
              </span>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#64748b">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div style={{ height: '220px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    fontSize={11}
                    fontWeight="500"
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={11}
                    fontWeight="500"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    dot={{ fill: '#10b981', strokeWidth: 3, r: 5 }}
                    activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: '#64748b',
                fontSize: '14px'
              }}>
                No sales data available
              </div>
            )}
          </div>
        </div>

        {/* New Orders */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 20px 0'
          }}>
            New Orders
          </h3>

          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '120px',
              fontSize: '14px',
              color: '#64748b'
            }}>
              Loading orders...
            </div>
          ) : !Array.isArray(orders) || orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#64748b'
            }}>
              <p style={{ fontSize: '14px', margin: 0 }}>No recent orders</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(Array.isArray(orders) ? orders.slice(0, 1) : []).map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div>
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      margin: '0 0 6px 0',
                      fontWeight: '500'
                    }}>
                      #{String(index + 1).padStart(5, '0')}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      margin: '0 0 6px 0',
                      fontWeight: '500'
                    }}>
                      {formatDate(order.order_placed_at)}
                    </p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 4px 0'
                    }}>
                      {order.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b',
                      margin: '0 0 8px 0'
                    }}>
                      {order.address}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                  <button style={{
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    background: getStatusColor(order.status),
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/dashboard" />

      {/* Chat With Bestie */}
      <ChatWithBestie />
    </div>
  );
};

export default MobileVendorDashboardNew;
