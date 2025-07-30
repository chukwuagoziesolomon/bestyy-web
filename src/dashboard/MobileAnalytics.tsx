import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, Menu, X, BarChart3, CreditCard, HelpCircle, Settings, TrendingUp, Package, Truck, ChevronDown } from 'lucide-react';
import { showError } from '../toast';

const MobileAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Sample analytics data
  const analyticsData = {
    todaysOrders: 50,
    totalSales: 50000,
    totalPending: 50,
    delivery: 50,
    salesDetails: 64564.77,
    orderActivity: {
      total: 145,
      completed: 112,
      rejected: 10,
      completedValue: 2300
    },
    topDishes: [
      { name: 'Jollof Rice', price: 40000, orders: 30, trend: 'up' },
      { name: 'Grilled Chicken', price: 65000, orders: 65, trend: 'down' },
      { name: 'Grilled Turkey', price: 40000, orders: 30, trend: 'up' }
    ]
  };

  const StatCard = ({ title, value, change, icon, color }: any) => (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1f2937'
          }}>
            {value}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <TrendingUp size={12} />
            {change}
          </div>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
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
              background: 'rgba(0,0,0,0.3)',
              zIndex: 40
            }}
          />
          
          {/* Dropdown Content */}
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: 50,
            minWidth: '200px',
            overflow: 'hidden'
          }}>
            {/* Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '12px 16px 8px 16px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div 
                onClick={() => setShowDropdown(false)}
                style={{
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <X size={20} color="#6b7280" />
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '8px 0' }}>
              {[
                { icon: <BarChart3 size={20} />, label: 'Analytics', onClick: () => {}, active: true },
                { icon: <CreditCard size={20} />, label: 'Payout', onClick: () => navigate('/vendor/dashboard/payout') },
                { icon: <HelpCircle size={20} />, label: 'Help/Support', onClick: () => navigate('/vendor/dashboard/support') },
                { icon: <Settings size={20} />, label: 'Profile', onClick: () => navigate('/vendor/dashboard/profile') }
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
                    transition: 'background-color 0.2s ease',
                    color: item.active ? '#10b981' : '#374151',
                    background: item.active ? '#f0fdf4' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ color: item.active ? '#10b981' : '#6b7280' }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: item.active ? 600 : 500
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Analytics Content */}
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
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <StatCard
                title="Today's Order"
                value="50"
                change="1.3% Up from past week"
                icon={<Package size={20} color="#10b981" />}
                color="linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)"
              />
              <StatCard
                title="Total Sales"
                value="50,000"
                change="1.3% Up from past week"
                icon={<BarChart3 size={20} color="#3b82f6" />}
                color="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
              />
              <StatCard
                title="Total Pending"
                value="50"
                change="1.3% Up from past week"
                icon={<Package size={20} color="#f59e0b" />}
                color="linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
              />
              <StatCard
                title="Delivery"
                value="50"
                change="1.3% Up from past week"
                icon={<Truck size={20} color="#10b981" />}
                color="linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)"
              />
            </div>

            {/* Sales Details */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
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
                  gap: '4px',
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  This Week
                  <ChevronDown size={16} />
                </div>
              </div>

              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#10b981',
                marginBottom: '16px'
              }}>
                ₦4,564.77
              </div>

              {/* Simple mobile-optimized chart */}
              <div style={{
                height: '120px',
                width: '100%',
                position: 'relative',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* Chart line path */}
                <svg
                  width="100%"
                  height="120"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  viewBox="0 0 300 120"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="30" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 24" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Chart area */}
                  <path
                    d="M 0,90 Q 30,85 60,70 T 120,60 Q 150,45 180,35 Q 210,25 240,30 Q 270,35 300,40 L 300,120 L 0,120 Z"
                    fill="url(#gradient)"
                    opacity="0.6"
                  />

                  {/* Chart line */}
                  <path
                    d="M 0,90 Q 30,85 60,70 T 120,60 Q 150,45 180,35 Q 210,25 240,30 Q 270,35 300,40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  <circle cx="60" cy="70" r="4" fill="#10b981" />
                  <circle cx="120" cy="60" r="4" fill="#10b981" />
                  <circle cx="180" cy="35" r="4" fill="#10b981" />
                  <circle cx="240" cy="30" r="4" fill="#10b981" />

                  {/* Peak value badge */}
                  <g>
                    <rect x="220" y="10" rx="8" ry="8" width="40" height="20" fill="#10b981" />
                    <text x="240" y="23" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">75</text>
                  </g>

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                </svg>

                {/* X-axis labels */}
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 8px',
                  fontSize: '10px',
                  color: '#9ca3af'
                }}>
                  <span>10k</span>
                  <span>20k</span>
                  <span>30k</span>
                  <span>40k</span>
                  <span>50k</span>
                  <span>60k</span>
                </div>
              </div>
            </div>

            {/* Order Activity */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    margin: 0,
                    color: '#1f2937'
                  }}>
                    Order Activity
                  </h3>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#6b7280',
                    fontWeight: 600
                  }}>
                    i
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  This Week
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Donut chart */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '160px',
                  height: '160px'
                }}>
                  {/* SVG Donut Chart */}
                  <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="20"
                    />
                    {/* Completed section (dark green) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray={`${(analyticsData.orderActivity.completed / analyticsData.orderActivity.total) * 377} 377`}
                      strokeLinecap="round"
                    />
                    {/* Rejected section (light green) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="#86efac"
                      strokeWidth="20"
                      strokeDasharray={`${(analyticsData.orderActivity.rejected / analyticsData.orderActivity.total) * 377} 377`}
                      strokeDashoffset={`-${(analyticsData.orderActivity.completed / analyticsData.orderActivity.total) * 377}`}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Center content */}
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
                      marginBottom: '4px'
                    }}>
                      Total
                    </div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#1f2937'
                    }}>
                      {analyticsData.orderActivity.total}
                    </div>
                  </div>

                  {/* Value badge */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: '#10b981',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                  }}>
                    {analyticsData.orderActivity.completedValue}
                  </div>
                </div>

                {/* Legend */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '32px',
                  width: '100%'
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
                      color: '#6b7280'
                    }}>
                      Completed: {analyticsData.orderActivity.completed}
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
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      Rejected: {analyticsData.orderActivity.rejected}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Dishes */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '0',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Header with dotted border */}
              <div style={{
                padding: '20px 20px 16px 20px',
                borderBottom: '2px dotted #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    margin: 0,
                    color: '#1f2937'
                  }}>
                    Top Dishes
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    This Week
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Dishes List */}
              <div style={{ padding: '0 20px 20px 20px' }}>
                {analyticsData.topDishes.map((dish, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {dish.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        ₦ {dish.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Mini Chart */}
                    <div style={{
                      width: '60px',
                      height: '30px',
                      margin: '0 16px',
                      position: 'relative'
                    }}>
                      {/* Simple line chart representation */}
                      <svg width="60" height="30" style={{ overflow: 'visible' }}>
                        <polyline
                          points={dish.trend === 'up' ? "0,25 15,20 30,15 45,10 60,5" : "0,5 15,10 30,15 45,20 60,25"}
                          fill="none"
                          stroke={dish.trend === 'up' ? '#10b981' : '#ef4444'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Data points */}
                        {[0, 15, 30, 45, 60].map((x, i) => {
                          const y = dish.trend === 'up' ? 25 - (i * 5) : 5 + (i * 5);
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="2"
                              fill={dish.trend === 'up' ? '#10b981' : '#ef4444'}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    <div style={{
                      textAlign: 'right',
                      minWidth: '80px'
                    }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {dish.orders} Orders
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: dish.trend === 'up' ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: 'flex-end'
                      }}>
                        <TrendingUp size={12} style={{
                          transform: dish.trend === 'down' ? 'rotate(180deg)' : 'none'
                        }} />
                        10%
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
