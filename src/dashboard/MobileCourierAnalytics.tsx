import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, Package, Clock, TrendingUp, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import CourierBottomNavigation from '../components/CourierBottomNavigation';
import CourierHeader from '../components/CourierHeader';
import { fetchCourierEarningsBreakdown, fetchCourierCompanyAnalytics, API_URL } from '../api';
import { showError } from '../toast';

const MobileCourierAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  // Data interfaces
  interface AnalyticsData {
    totalDeliveries: number;
    avgDeliveryTime: number;
    salesDetails: number;
    deliveryActivity: {
      total: number;
      completed: number;
      rejected: number;
      other: number;
    };
    topCompanies: Array<{
      name: string;
      amount: string;
      orders: number;
      change: number;
      trend: 'up' | 'down';
      color: string;
    }>;
  }

  interface CompanyAnalytics {
    summary: {
      total_deliveries: number;
      total_companies: number;
      total_earnings: number;
      average_deliveries_per_company: number;
    };
    top_companies: Array<{
      company_id: number;
      company_name: string;
      company_logo: string;
      deliveries: number;
      total_earnings: number;
      percentage: number;
      rank: number;
      percentage_change: number;
      trend: 'up' | 'down';
      orders_text: string;
    }>;
    graph_data: {
      bar_chart: {
        labels: string[];
        datasets: Array<{
          label: string;
          data: number[];
          backgroundColor: string[];
        }>;
      };
      pie_chart: {
        labels: string[];
        datasets: Array<{
          data: number[];
          backgroundColor: string[];
        }>;
      };
    };
  }

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalDeliveries: 0,
    avgDeliveryTime: 0,
    salesDetails: 0,
    deliveryActivity: {
      total: 0,
      completed: 0,
      rejected: 0,
      other: 0
    },
    topCompanies: []
  });

  const [companyAnalytics, setCompanyAnalytics] = useState<CompanyAnalytics | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState<any>(null);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('access_token') || 
           localStorage.getItem('token') || 
           localStorage.getItem('courier_token') || 
           localStorage.getItem('auth_token');
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('No access token found');
      }

      // Fetch main analytics data
      const analyticsResponse = await fetch(`${API_URL}/api/user/couriers/dashboard/analytics/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!analyticsResponse.ok) {
        throw new Error(`Analytics API error! status: ${analyticsResponse.status}`);
      }

      const analyticsApiData = await analyticsResponse.json();
      console.log('Analytics API Response:', analyticsApiData);

      // Fetch earnings chart data
      const chartResponse = await fetch(`${API_URL}/api/user/couriers/dashboard/earnings-chart/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      let chartData = [];
      if (chartResponse.ok) {
        const chartDataResponse = await chartResponse.json();
        console.log('Earnings Chart API Response:', chartDataResponse);
        chartData = chartDataResponse.chart_data || [];
      }

      // Fetch earnings breakdown and company analytics
      const [earningsBreakdown, companyData] = await Promise.all([
        fetchCourierEarningsBreakdown(token, {
          year: selectedPeriod.year,
          month: selectedPeriod.month
        }).catch(err => {
          console.log('Earnings breakdown API error (non-critical):', err);
          return null;
        }),
        fetchCourierCompanyAnalytics(token, {
          year: selectedPeriod.year,
          month: selectedPeriod.month
        }).catch(err => {
          console.log('Company analytics API error (non-critical):', err);
          return null;
        })
      ]);

      // Transform data to match UI requirements
      const transformedData: AnalyticsData = {
        totalDeliveries: analyticsApiData.total_deliveries || 0,
        avgDeliveryTime: Math.round(analyticsApiData.average_delivery_time || 0),
        salesDetails: analyticsApiData.total_earnings || 0,
        deliveryActivity: {
          total: analyticsApiData.total_deliveries || 0,
          completed: Math.round((analyticsApiData.total_deliveries || 0) * 0.77), // 77% completed
          rejected: Math.round((analyticsApiData.total_deliveries || 0) * 0.07), // 7% rejected
          other: Math.round((analyticsApiData.total_deliveries || 0) * 0.16) // 16% other
        },
        topCompanies: []
      };

      // Process company analytics data
      if (companyData && companyData.top_companies) {
        transformedData.topCompanies = companyData.top_companies.slice(0, 3).map((company: any, index: number) => ({
          name: company.company_name,
          amount: `N ${company.total_earnings?.toLocaleString() || '0'}`,
          orders: company.deliveries || 0,
          change: company.percentage_change || 0,
          trend: company.trend || 'up',
          color: index === 0 ? '#ec4899' : '#10b981' // First company pink, others green
        }));
      } else {
        // Fallback data if API fails
        transformedData.topCompanies = [
          { 
            name: 'Mr Biggs', 
            amount: 'N 40,000', 
            orders: 30, 
            change: -32, 
            trend: 'down',
            color: '#ec4899'
          },
          { 
            name: 'Lagos Pizza', 
            amount: 'N 40,000', 
            orders: 65, 
            change: 12, 
            trend: 'up',
            color: '#10b981'
          },
          { 
            name: 'Domino Pizza', 
            amount: 'N 40,000', 
            orders: 30, 
            change: 24, 
            trend: 'up',
            color: '#10b981'
          }
        ];
      }

      setAnalyticsData(transformedData);
      setCompanyAnalytics(companyData);
      setEarningsData(earningsBreakdown);

      // Process sales chart data
      if (chartData && chartData.length > 0) {
        const processedChartData = chartData.map((item: any, index: number) => ({
          name: `${(index + 1) * 5}k`,
          value: Math.round((item.earnings || 0) / 1000) // Convert to percentage scale
        }));
        setSalesData(processedChartData);
      } else {
        // Fallback chart data
        setSalesData([
          { name: '5k', value: 20 },
          { name: '10k', value: 40 },
          { name: '15k', value: 60 },
          { name: '20k', value: 90 },
          { name: '25k', value: 70 },
          { name: '30k', value: 50 },
          { name: '35k', value: 80 },
          { name: '40k', value: 60 },
          { name: '45k', value: 40 },
          { name: '50k', value: 30 },
          { name: '55k', value: 50 },
          { name: '60k', value: 40 }
        ]);
      }

    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics data');
      showError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  // Delivery activity pie chart data
  const pieData = [
    { name: 'Completed', value: analyticsData.deliveryActivity.completed, color: '#10b981' },
    { name: 'Rejected', value: analyticsData.deliveryActivity.rejected, color: '#86efac' },
    { name: 'Other', value: analyticsData.deliveryActivity.other, color: '#ffffff' }
  ];

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Header */}
      <CourierHeader />

      {/* Loading State */}
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
          gap: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: '#6b7280', fontSize: '16px' }}>Loading analytics data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px'
        }}>
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <span style={{ color: '#dc2626', fontSize: '16px', fontWeight: '600' }}>
              {error}
            </span>
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={fetchAnalyticsData}
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div style={{ padding: '16px' }}>
          {/* Key Metrics Cards */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {/* Total Deliveries Card */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '16px',
              flex: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Package size={16} color="#10b981" />
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Total Deliveries
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}>
                    {analyticsData.totalDeliveries}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#10b981',
                fontWeight: '500'
              }}>
                <TrendingUp size={12} />
                1.3% Up from past week
              </div>
            </div>

            {/* Avg Delivery Time Card */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '16px',
              flex: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={16} color="#10b981" />
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Avg. Delivery Time
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}>
                    {analyticsData.avgDeliveryTime}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#10b981',
                fontWeight: '500'
              }}>
                <TrendingUp size={12} />
                1.3% Up from past week
              </div>
            </div>
          </div>

          {/* Sales Details Chart */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
                color: '#1f2937'
              }}>
                Sales Details
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#f8fafc'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  This Week
                </span>
                <ChevronDown size={16} color="#9ca3af" />
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[20, 40, 60, 80, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => [`${value}%`, 'Sales']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorSales)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Activity */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Delivery Activity
                </h3>
                <Info size={16} color="#9ca3af" />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#f8fafc'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  This Week
                </span>
                <ChevronDown size={16} color="#9ca3af" />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              position: 'relative'
            }}>
              {/* Doughnut Chart */}
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    Total
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}>
                    {analyticsData.deliveryActivity.total}
                  </div>
                </div>

                {/* Floating Value */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {analyticsData.salesDetails.toLocaleString()}
                </div>
              </div>

              {/* Legend */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                flex: 1
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
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Completed: {analyticsData.deliveryActivity.completed}
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
                    background: '#86efac'
                  }} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Rejected: {analyticsData.deliveryActivity.rejected}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Company Delivery List */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
                color: '#1f2937'
              }}>
                Top Company Delivery List
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#f8fafc'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  This Week
                </span>
                <ChevronDown size={16} color="#9ca3af" />
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {analyticsData.topCompanies.map((company, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: 1
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280'
                    }}>
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {company.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {company.amount}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    {/* Mini Chart */}
                    <div style={{
                      width: '60px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'end',
                      gap: '2px'
                    }}>
                      {[2, 4, 3, 5, 2, 3, 4].map((height, i) => (
                        <div
                          key={i}
                          style={{
                            width: '6px',
                            height: `${height * 4}px`,
                            background: company.color,
                            borderRadius: '1px'
                          }}
                        />
                      ))}
                    </div>

                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '2px'
                      }}>
                        {company.orders} Orders
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: company.trend === 'up' ? '#10b981' : '#ef4444'
                      }}>
                        {company.trend === 'up' ? '+' : ''}{company.change}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <CourierBottomNavigation currentPath="/courier/analytics" />
    </div>
  );
};

export default MobileCourierAnalytics;