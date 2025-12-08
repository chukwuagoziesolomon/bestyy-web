import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Bike,
  Home,
  List,
  Utensils,
  Layers
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchVendorAnalytics, fetchVendorSalesChart, fetchVendorTopDishes, fetchVendorOrderActivity } from '../api';
import { showError } from '../toast';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';

// Interfaces for API data
interface VendorAnalyticsData {
  total_orders: number;
  todays_order: number;
  total_sales: number;
  total_pending: number;
  delivery_time: string;
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
  sales_chart: Array<{
    label: string;
    sales: number;
    date: string;
  }>;
  order_activity: {
    completed: number;
    rejected: number;
    pending: number;
  };
  top_dishes: Array<{
    id: number;
    name: string;
    price: number;
    order_count: number;
    percentage_change: number;
    trend: 'up' | 'down';
    image: string;
  }>;
}

// Interface for top dishes API response
interface TopDishesResponse {
  period: string;
  top_dishes: Array<{
    id: number;
    name: string;
    price: number;
    order_count: number;
    percentage_change: number;
    trend: 'up' | 'down';
    image: string;
  }>;
}

// Interface for order activity API response
interface OrderActivityResponse {
  period: string;
  total_orders: number;
  breakdown: {
    completed: {
      count: number;
      percentage: number;
    };
    rejected: {
      count: number;
      percentage: number;
    };
    other: {
      count: number;
      percentage: number;
    };
  };
  chart_data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

const MobileVendorAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const [analytics, setAnalytics] = useState<VendorAnalyticsData | null>(null);
  const [topDishes, setTopDishes] = useState<TopDishesResponse | null>(null);
  const [orderActivity, setOrderActivity] = useState<OrderActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('access_token');

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const currentDate = new Date();
        const params = { 
          month: currentDate.getMonth() + 1, 
          year: currentDate.getFullYear() 
        };

        const [analyticsData, salesChartData, topDishesData, orderActivityData] = await Promise.all([
          fetchVendorAnalytics(token, params),
          fetchVendorSalesChart(token, { ...params, period: 'daily' }),
          fetchVendorTopDishes(token, { period: 'week', limit: 5 }),
          fetchVendorOrderActivity(token, { period: 'week' })
        ]);

        setAnalytics(analyticsData);
        setTopDishes(topDishesData);
        setOrderActivity(orderActivityData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        showError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get business name from localStorage
  const businessName = localStorage.getItem('businessName') || 'Vendor';

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader showBusinessName={true} />

      {/* Analytics Content */}
      <div style={{ padding: '16px' }}>
        {/* Key Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* Today's Order */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  Today's Order
                </h3>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {analytics?.todays_order || '--'}
                </div>
              </div>
              <Package size={20} color="#10b981" />
            </div>
            <div style={{
              fontSize: '10px',
              color: analytics?.percentage_changes?.orders?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {analytics?.percentage_changes?.orders?.daily?.direction === 'up' ? 
                <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {analytics?.percentage_changes?.orders?.daily?.text || 'No data'}
            </div>
          </div>

          {/* Total Sales */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  Total Sales
                </h3>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {analytics?.total_sales ? formatCurrency(analytics.total_sales) : '--'}
                </div>
              </div>
              <TrendingUp size={20} color="#10b981" />
            </div>
            <div style={{
              fontSize: '10px',
              color: analytics?.percentage_changes?.sales?.daily?.direction === 'up' ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {analytics?.percentage_changes?.sales?.daily?.direction === 'up' ? 
                <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {analytics?.percentage_changes?.sales?.daily?.text || 'No data'}
            </div>
          </div>

          {/* Total Pending */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  Total Pending
                </h3>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {analytics?.total_pending || '--'}
                </div>
              </div>
              <Clock size={20} color="#10b981" />
            </div>
            <div style={{
              fontSize: '10px',
              color: analytics?.percentage_changes?.pending?.daily?.direction === 'up' ? '#ef4444' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {analytics?.percentage_changes?.pending?.daily?.direction === 'up' ? 
                <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {analytics?.percentage_changes?.pending?.daily?.text || 'No data'}
            </div>
          </div>

          {/* Delivery */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  margin: '0 0 4px 0'
                }}>
                  Delivery
                </h3>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {analytics?.delivery_time || '--'}
                </div>
              </div>
              <Bike size={20} color="#10b981" />
            </div>
            <div style={{
              fontSize: '10px',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <TrendingUp size={12} />
              Avg. {analytics?.delivery_time || '--'} min
            </div>
          </div>
        </div>

        {/* Sales Details Chart */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Sales Details
            </h3>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {analytics?.sales_chart && analytics.sales_chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={analytics.sales_chart.map(item => ({
                name: item.label,
                sales: item.sales
              }))}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  domain={[0, 100]}
                  ticks={[20, 40, 60, 80, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '120px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              No sales data available
            </div>
          )}
        </div>

        {/* Order Activity */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Order Activity
            </h3>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={orderActivity?.chart_data || []}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {(orderActivity?.chart_data || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Total <span style={{ color: '#1f2937', fontWeight: '800', fontSize: '16px', marginLeft: '4px' }}>
                {orderActivity?.total_orders || 0}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <span style={{ color: '#10b981', fontWeight: '600' }}>
                Completed: {orderActivity?.breakdown?.completed?.count || 0}
              </span>
              <span style={{ color: '#ef4444', fontWeight: '600' }}>
                Rejected: {orderActivity?.breakdown?.rejected?.count || 0}
              </span>
              <span style={{ color: '#6b7280', fontWeight: '600' }}>
                Other: {orderActivity?.breakdown?.other?.count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Dishes */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Top Dishes
            </h3>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
            </select>
          </div>

          {topDishes?.top_dishes && topDishes.top_dishes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topDishes.top_dishes.map((dish, index) => (
                <div key={dish.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                  borderBottom: index < topDishes.top_dishes.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937', marginBottom: '2px' }}>
                      {dish.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {formatCurrency(dish.price)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginRight: '12px'
                  }}>
                    {dish.order_count} Orders {dish.percentage_change > 0 ? '+' : ''}{dish.percentage_change}%
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: dish.trend === 'up' ? '#10b981' : '#ef4444'
                  }}>
                    {dish.percentage_change > 0 ? '+' : ''}{dish.percentage_change}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '14px', margin: 0 }}>No dish data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/dashboard" />
    </div>
  );
};

export default MobileVendorAnalytics;

