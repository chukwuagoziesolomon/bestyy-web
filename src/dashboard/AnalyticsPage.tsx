import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useResponsive } from '../hooks/useResponsive';
import { fetchVendorAnalytics, fetchVendorSalesChart, fetchVendorTopDishes, fetchVendorOrderActivity } from '../api';
import MobileVendorAnalytics from './MobileVendorAnalytics';

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

const AnalyticsPage: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  const [selectedMonth, setSelectedMonth] = useState('July');
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  
  // API data state
  const [analyticsData, setAnalyticsData] = useState<VendorAnalyticsData | null>(null);
  const [salesChartData, setSalesChartData] = useState<VendorSalesChartData | null>(null);
  const [topDishes, setTopDishes] = useState<TopDishesResponse | null>(null);
  const [orderActivity, setOrderActivity] = useState<OrderActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get token function - using the correct token variable
  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  // Fetch data from APIs
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
        
        const currentDate = new Date();
        const params = { 
          month: currentDate.getMonth() + 1, 
          year: currentDate.getFullYear() 
        };

        const [analyticsResponse, salesChartResponse, topDishesResponse, orderActivityResponse] = await Promise.all([
          fetchVendorAnalytics(token, params),
          fetchVendorSalesChart(token, { ...params, period: 'daily' }),
          fetchVendorTopDishes(token, { period: 'week', limit: 5 }),
          fetchVendorOrderActivity(token, { period: 'week' })
        ]);

        setAnalyticsData(analyticsResponse);
        setSalesChartData(salesChartResponse);
        setTopDishes(topDishesResponse);
        setOrderActivity(orderActivityResponse);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get KPI data from API
  const getKpiData = () => {
    if (!analyticsData) return [];

    return [
      {
        title: "Today's Order",
        value: analyticsData.todays_order.toString(),
        icon: <Package size={24} color="#10b981" />,
        trend: analyticsData.percentage_changes.orders.daily.text,
        trendColor: analyticsData.percentage_changes.orders.daily.direction === 'up' ? '#10b981' : '#ef4444',
        trendIcon: analyticsData.percentage_changes.orders.daily.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
      },
      {
        title: "Total Sales",
        value: formatCurrency(analyticsData.total_sales),
        icon: <TrendingUp size={24} color="#10b981" />,
        trend: analyticsData.percentage_changes.sales.daily.text,
        trendColor: analyticsData.percentage_changes.sales.daily.direction === 'up' ? '#10b981' : '#ef4444',
        trendIcon: analyticsData.percentage_changes.sales.daily.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
      },
      {
        title: "Total Pending",
        value: analyticsData.total_pending.toString(),
        icon: <Clock size={24} color="#10b981" />,
        trend: analyticsData.percentage_changes.pending.daily.text,
        trendColor: analyticsData.percentage_changes.pending.daily.direction === 'up' ? '#10b981' : '#ef4444',
        trendIcon: analyticsData.percentage_changes.pending.daily.direction === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />
      },
      {
        title: "Delivery Time",
        value: analyticsData.delivery_time,
        icon: <Clock size={24} color="#10b981" />,
        trend: "Average delivery time",
        trendColor: "#10b981",
        trendIcon: <TrendingUp size={16} />
      }
    ];
  };

  // Get sales chart data from API
  const getSalesData = () => {
    if (!salesChartData) return [];
    
    return salesChartData.chart_data.map(item => ({
      name: item.x,
      value: item.y,
      sales: item.value,
      date: item.date
    }));
  };
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileVendorAnalytics />;
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        padding: '24px',
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
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#ef4444',
          background: '#fff',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <p style={{ margin: '0 0 16px', fontSize: '16px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use real API data for order activity donut chart
  const orderActivityData = orderActivity?.chart_data || [];

  // Use real API data for top dishes
  const topDishesData = topDishes?.top_dishes || [];

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {getKpiData().map((kpi, index) => (
          <div key={index} style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '16px',
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
                background: '#e6f7f2',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {kpi.icon}
              </div>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              {kpi.value}
            </div>
            <div style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              {kpi.title}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
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
          </div>
        ))}
      </div>

      {/* Sales Details Chart */}
      <div style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #f3f4f6',
        marginBottom: '32px'
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
            Sales Details
          </h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getSalesData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
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
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name, props) => [
                `${formatCurrency(props.payload.sales)}`,
                'Sales'
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return `Date: ${payload[0].payload.date}`;
                }
                return label;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Section - Order Activity and Top Dishes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
      }}>
        {/* Order Activity */}
        <div style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '16px',
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
              Order Activity
            </h2>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderActivityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {orderActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}
                >
                  Total {orderActivity?.total_orders || 0}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#374151'
              }}>
                Completed: {orderActivity?.breakdown?.completed?.count || 0}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ef4444'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#374151'
              }}>
                Rejected: {orderActivity?.breakdown?.rejected?.count || 0}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#6b7280'
              }} />
              <span style={{
                fontSize: '14px',
                color: '#374151'
              }}>
                Other: {orderActivity?.breakdown?.other?.count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Dishes */}
        <div style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '16px',
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
              Top Dishes
            </h2>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {topDishesData.map((dish, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      background: dish.trend === 'up' ? '#10b981' : '#ef4444',
                      borderRadius: '2px'
                    }} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {dish.name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {formatCurrency(dish.price)}
                    </div>
                  </div>
                </div>
                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {dish.order_count} Orders
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: dish.trend === 'up' ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {dish.percentage_change > 0 ? '+' : ''}{dish.percentage_change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;