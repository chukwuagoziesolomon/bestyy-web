import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, Menu, X, BarChart3, CreditCard, Settings, TrendingUp, TrendingDown, Package, Timer, Bike, LineChart as LucideLineChart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { fetchDashboardAnalytics } from '../api';
import { showError } from '../toast';

const MobileAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function getAnalytics() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await fetchDashboardAnalytics(token);
          setAnalytics(data);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Could not fetch analytics';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    getAnalytics();
  }, [token]);

  // Get business logo and name from localStorage vendor_profile
  let businessLogo = '';
  let businessName = '';
  const savedVendor = localStorage.getItem('vendor_profile');
  if (savedVendor) {
    try {
      const vendor = JSON.parse(savedVendor);
      businessLogo = vendor.logo || '';
      businessName = vendor.business_name || '';
    } catch (e) {}
  }

  const StatCard = ({ title, value, change, icon, color, isPositive }: any) => (
    <div style={{
      background: '#fff',
      borderRadius: '8px',
      padding: '14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            marginBottom: '3px',
            fontWeight: 500
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            {value}
          </div>
          {change && (
            <div style={{
              fontSize: '10px',
              color: isPositive ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {change}
            </div>
          )}
        </div>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '6px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

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
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          color: '#1f2937'
        }}>
          Analytics
        </h1>
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease'
          }}
        >
          <Menu size={24} color="#6b7280" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            background: '#fff',
            width: '280px',
            height: '100%',
            padding: '20px',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Close Button */}
            <div 
              onClick={() => setShowDropdown(false)}
              style={{
                alignSelf: 'flex-end',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}
            >
              <X size={24} color="#6b7280" />
            </div>

            {/* Profile Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: businessLogo ? `url(${businessLogo})` : '#e5e7eb',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 600,
                color: '#6b7280'
              }}>
                {!businessLogo && (businessName ? businessName[0] : 'V')}
              </div>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  {businessName || 'Vendor'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Vendor Account
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '8px 0' }}>
              {[
                { icon: <BarChart3 size={20} />, label: 'Analytics', onClick: () => {}, active: true },
                { icon: <CreditCard size={20} />, label: 'Payout', onClick: () => navigate('/vendor/dashboard/payout') },
                { icon: <Settings size={20} />, label: 'Profile Settings', onClick: () => navigate('/vendor/dashboard/profile') }
              ].map((item, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setShowDropdown(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: item.active ? '#f0fdf4' : 'transparent',
                    color: item.active ? '#10b981' : '#6b7280',
                    marginBottom: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.icon}
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      <div style={{ padding: '16px 12px' }}>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            Loading analytics...
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#ef4444' 
          }}>
            {error}
          </div>
        ) : analytics ? (
          <>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <StatCard
                title="Today's Order"
                value={analytics.todays_order?.toString() || '0'}
                change={analytics.percentage_changes?.orders?.daily?.text || ''}
                isPositive={analytics.percentage_changes?.orders?.daily?.direction === 'up'}
                icon={<Package size={18} color="#10b981" />}
                color="linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)"
              />
              <StatCard
                title="Total Sales"
                value={`₦${analytics.total_sales?.toLocaleString() || '0'}`}
                change={analytics.percentage_changes?.sales?.daily?.text || ''}
                isPositive={analytics.percentage_changes?.sales?.daily?.direction === 'up'}
                icon={<LucideLineChart size={18} color="#3b82f6" />}
                color="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
              />
              <StatCard
                title="Total Pending"
                value={analytics.total_pending?.toString() || '0'}
                change={analytics.percentage_changes?.pending?.daily?.text || ''}
                isPositive={analytics.percentage_changes?.pending?.daily?.direction === 'up'}
                icon={<Timer size={18} color="#f59e0b" />}
                color="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
              />
              <StatCard
                title="Delivery Time"
                value={analytics.delivery_time || '0 min'}
                change=""
                isPositive={true}
                icon={<Bike size={18} color="#8b5cf6" />}
                color="linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)"
              />
            </div>

            {/* Sales Details */}
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                margin: '0 0 12px 0',
                color: '#1f2937'
              }}>
                Sales Details
              </h3>

              <div style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#10b981',
                marginBottom: '12px'
              }}>
                ₦{analytics.sales_chart?.reduce((total: number, item: any) => total + (item.sales || 0), 0)?.toLocaleString() || '0'}
              </div>

              {/* Sales Chart */}
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={analytics.sales_chart?.map((d: any) => ({ name: d.label, value: d.sales })) || []}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Order Activity */}
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                margin: '0 0 16px 0',
                color: '#1f2937'
              }}>
                Order Activity
              </h3>

              {/* Pie Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: analytics.order_activity?.completed || 0, color: '#10b981' },
                        { name: 'Rejected', value: analytics.order_activity?.rejected || 0, color: '#ef4444' }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {[
                        { name: 'Completed', value: analytics.order_activity?.completed || 0, color: '#10b981' },
                        { name: 'Rejected', value: analytics.order_activity?.rejected || 0, color: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#888',
                  marginBottom: '8px'
                }}>
                  Total <span style={{ color: '#222', fontWeight: 800, fontSize: '16px', marginLeft: '4px' }}>
                    {(analytics.order_activity?.completed || 0) + (analytics.order_activity?.rejected || 0)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>
                    Completed: {analytics.order_activity?.completed || 0}
                  </span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>
                    Rejected: {analytics.order_activity?.rejected || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Dishes */}
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                margin: '0 0 16px 0',
                color: '#1f2937'
              }}>
                Top Dishes
              </h3>

              {(analytics.top_dishes || []).length === 0 ? (
                <div style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                  No data available.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(analytics.top_dishes || []).map((dish: any, index: number) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: index !== (analytics.top_dishes || []).length - 1 ? '12px' : '0',
                      borderBottom: index !== (analytics.top_dishes || []).length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1f2937' }}>
                          {dish.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          ₦{dish.price?.toLocaleString?.() ?? dish.price}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1f2937',
                        marginRight: '12px'
                      }}>
                        {dish.orders} Orders
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: dish.trend < 0 ? '#ef4444' : '#10b981'
                      }}>
                        {dish.trend > 0 ? `+${dish.trend}%` : `${dish.trend}%`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 50
      }}>
        {[
          {
            icon: <Home size={20} />,
            label: 'Overview',
            active: false,
            onClick: () => navigate('/vendor/dashboard')
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
            label: 'Menu Stock',
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

export default MobileAnalytics;
