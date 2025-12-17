import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Bell, 
  Moon,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchVendorAnalytics, fetchVendorSalesChart, fetchVendorOrdersList, fetchVendorTopDishes, fetchVendorOrderActivity } from '../api';

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

interface RecentOrder {
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

const DesktopVendorDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [analyticsData, setAnalyticsData] = useState<VendorAnalyticsData | null>(null);
  const [salesChartData, setSalesChartData] = useState<VendorSalesChartData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions
  const getToken = () => {
    return localStorage.getItem('access_token');
  };

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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch analytics, sales chart, and recent orders in parallel
        const [analytics, salesChart, ordersResponse] = await Promise.all([
          fetchVendorAnalytics(token),
          fetchVendorSalesChart(token),
          fetchVendorOrdersList(token, { page_size: 3 })
        ]);

        setAnalyticsData(analytics);
        setSalesChartData(salesChart);
        setRecentOrders(ordersResponse.results || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare KPI data
  const getKpiData = () => {
    if (!analyticsData) return [];

    return [
      {
        title: "Today's Orders",
        value: analyticsData.todays_order.toString(),
        icon: <Package size={24} color="#10b981" />,
        trend: analyticsData.percentage_changes?.orders?.daily?.text || '',
        trendColor: analyticsData.percentage_changes?.orders?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
        trendIcon: analyticsData.percentage_changes?.orders?.daily?.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
      },
      {
        title: "Total Sales",
        value: formatCurrency(analyticsData.total_sales),
        icon: <TrendingUp size={24} color="#10b981" />,
        trend: analyticsData.percentage_changes?.sales?.daily?.text || '',
        trendColor: analyticsData.percentage_changes?.sales?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
        trendIcon: analyticsData.percentage_changes?.sales?.daily?.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
      },
      {
        title: "Pending Orders",
        value: analyticsData.total_pending.toString(),
        icon: <Clock size={24} color="#10b981" />,
        trend: analyticsData.percentage_changes?.pending?.daily?.text || '',
        trendColor: analyticsData.percentage_changes?.pending?.daily?.direction === 'up' ? '#ef4444' : '#10b981',
        trendIcon: analyticsData.percentage_changes?.pending?.daily?.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
      },
      {
        title: "Delivery Time",
        value: analyticsData.delivery_time || "N/A",
        icon: <Clock size={24} color="#10b981" />,
        trend: '',
        trendColor: '#10b981',
        trendIcon: <TrendingUp size={16} />
      }
    ];
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '18px',
        color: '#ef4444'
      }}>
        Error: {error}
      </div>
    );
  }

  const kpiData = getKpiData();

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Verification Banner removed per request */}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '14px',
              color: '#374151'
            }}
          >
            <option value="July">July 2024</option>
            <option value="August">August 2024</option>
            <option value="September">September 2024</option>
          </select>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '14px',
              color: '#374151'
            }}
          >
            <option value="Today">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {kpiData.map((kpi, index) => (
          <div key={index} style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {kpi.icon}
              </div>
            </div>
            
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {kpi.value}
            </h3>
            
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 12px 0'
            }}>
              {kpi.title}
            </p>
            
            {kpi.trend && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: kpi.trendColor
              }}>
                {kpi.trendIcon}
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {kpi.trend}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts and Recent Orders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px'
      }}>
        {/* Sales Chart */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Sales Overview
            </h2>
          </div>
          
          {salesChartData && (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="x" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `₦${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Sales']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="y"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Recent Orders
            </h2>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {recentOrders.length === 0 ? (
              <p style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
                padding: '32px 0'
              }}>
                No recent orders
              </p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} style={{
                  padding: '16px',
                  border: '1px solid #f3f4f6',
                  borderRadius: '12px',
                  background: '#fafafa'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0 0 4px 0'
                      }}>
                        {order.name}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {formatDate(order.order_placed_at)}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status)
                    }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 8px 0'
                  }}>
                    {order.address}
                  </p>
                  
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <div 
        onClick={() => {
          const whatsappUrl = `https://wa.me/2348090530061?text=${encodeURIComponent('Hi! I need help with my vendor account.')}`;
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

export default DesktopVendorDashboard;
