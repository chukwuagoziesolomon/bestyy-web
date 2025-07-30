import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, BarChart3, CreditCard, Menu, ChevronDown, Clock, Package, TrendingUp, HelpCircle, Settings, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const MobileCourierAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Sample courier analytics data
  const analyticsData = {
    totalDeliveries: 50,
    avgDeliveryTime: 50,
    salesDetails: 64564.77,
    deliveryActivity: {
      total: 145,
      completed: 112,
      rejected: 10,
      completedValue: 2300
    },
    topCompanies: [
      { name: 'Mr Biggs', orders: 30, trend: 'up' },
      { name: 'Lagos Pizza', orders: 65, trend: 'down' },
      { name: 'Domino Pizza', orders: 30, trend: 'up' }
    ]
  };

  // Chart data for sales details
  const salesData = [
    { name: '1k', value: 20 },
    { name: '10k', value: 45 },
    { name: '17k', value: 30 },
    { name: '20k', value: 60 },
    { name: '25k', value: 40 },
    { name: '30k', value: 80 },
    { name: '31k', value: 75 },
    { name: '40k', value: 65 },
    { name: '45k', value: 55 },
    { name: '50k', value: 70 },
    { name: '55k', value: 60 },
    { name: '60k', value: 50 }
  ];

  // Pie chart data for delivery activity
  const pieData = [
    { name: 'Completed', value: 112, color: '#10b981' },
    { name: 'Rejected', value: 10, color: '#a7f3d0' }
  ];

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
          <Menu size={24} color="#1f2937" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDropdown(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 40
            }}
          />

          {/* Dropdown Content */}
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '16px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 50,
            minWidth: '200px',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937'
              }}>
                Menu
              </span>
              <X
                size={20}
                color="#6b7280"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowDropdown(false)}
              />
            </div>

            {/* Menu Items */}
            <div style={{ padding: '8px 0' }}>
              {[
                { icon: <HelpCircle size={20} />, label: 'Help/Support', onClick: () => navigate('/courier/support') },
                { icon: <Settings size={20} />, label: 'Profile', onClick: () => navigate('/courier/profile') }
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
                    padding: '12px 20px',
                    cursor: 'pointer',
                    background: 'transparent',
                    color: '#374151',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Content */}
      <div style={{ padding: '24px 16px' }}>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            Loading analytics...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#e6fffa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package size={20} color="#10b981" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      Total Deliveries
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#1f2937'
                    }}>
                      {analyticsData.totalDeliveries}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#10b981',
                  fontWeight: 500
                }}>
                  ↗ 1.3% Up from past week
                </div>
              </div>

              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Clock size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      Avg Delivery Time
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#1f2937'
                    }}>
                      {analyticsData.avgDeliveryTime}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#10b981',
                  fontWeight: 500
                }}>
                  ↗ 1.3% Up from past week
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
                  fontWeight: 600,
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Sales Details
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151'
                  }}>
                    This Week
                  </span>
                  <ChevronDown size={16} color="#9ca3af" />
                </div>
              </div>
              
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#10b981',
                marginBottom: '20px'
              }}>
                ₦{analyticsData.salesDetails.toLocaleString()}
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis hide />
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
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                  />
                </LineChart>
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
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Delivery Activity
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
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
                justifyContent: 'center',
                position: 'relative',
                marginBottom: '20px'
              }}>
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    Total
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#1f2937'
                  }}>
                    {analyticsData.deliveryActivity.total}
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#10b981'
                  }}>
                    {analyticsData.deliveryActivity.completedValue}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px'
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
                    fontWeight: 500,
                    color: '#374151'
                  }}>
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
                    background: '#a7f3d0'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151'
                  }}>
                    Rejected: {analyticsData.deliveryActivity.rejected}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Company Delivery List */}
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
                  fontWeight: 600,
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Top Company Delivery List
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
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
                    padding: '12px 0',
                    borderBottom: index < analyticsData.topCompanies.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {company.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        ₦ 40,000
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#6b7280'
                          }}>
                            👤
                          </span>
                        </div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#374151'
                        }}>
                          {company.orders} Orders
                        </span>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: company.trend === 'up' ? '#10b981' : '#ef4444',
                        fontWeight: 500
                      }}>
                        {company.trend === 'up' ? '↗' : '↘'} 5%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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
            label: 'Dashboard',
            active: false,
            onClick: () => navigate('/courier/dashboard')
          },
          {
            icon: <List size={20} />,
            label: 'Delivery List',
            active: false,
            onClick: () => navigate('/courier/delivery-list')
          },
          {
            icon: <BarChart3 size={20} />,
            label: 'Analytics',
            active: true,
            onClick: () => navigate('/courier/analytics')
          },
          {
            icon: <CreditCard size={20} />,
            label: 'Payout',
            active: false,
            onClick: () => navigate('/courier/payouts')
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

export default MobileCourierAnalytics;
