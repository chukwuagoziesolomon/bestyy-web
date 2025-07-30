import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, BarChart3, CreditCard, Package, TrendingUp, MessageCircle } from 'lucide-react';
import { showError } from '../toast';

const MobileCourierDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const courierName = localStorage.getItem('first_name') || 'Silver';

  useEffect(() => {
    // Simulate loading courier data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Sample courier data
  const courierData = {
    totalDeliveries: 50,
    earnings: 50000,
    avgDeliveryTime: 50,
    deliveries: [
      {
        id: '00001',
        pickup: 'Lagos Pizza,Yaba',
        dropoff: '12, yaba street',
        date: 'Just Now',
        amount: 2000,
        status: 'Accepted'
      }
    ]
  };

  const stats = [
    {
      label: 'Total Deliveries',
      value: courierData.totalDeliveries,
      icon: <Package size={20} color="#10b981" />,
      trend: '+1.3% Up from past week',
      trendColor: '#10b981'
    },
    {
      label: 'Earnings',
      value: courierData.earnings.toLocaleString(),
      icon: <CreditCard size={20} color="#10b981" />,
      trend: '+1.3% Up from past week',
      trendColor: '#10b981'
    },
    {
      label: 'Avg. Delivery Time',
      value: courierData.avgDeliveryTime,
      icon: <TrendingUp size={20} color="#10b981" />,
      trend: '+1.3% Up from past week',
      trendColor: '#10b981'
    }
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
        padding: '24px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Bestie Logo" style={{ width: '32px', height: 'auto' }} />
          <h1 style={{
            fontSize: '20px',
            fontWeight: 700,
            margin: 0,
            color: '#1f2937'
          }}>
            Welcome Back, {courierName}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 16px' }}>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {stats.map((stat, index) => (
                <div key={index} style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    {stat.icon}
                    <span style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      fontWeight: 500
                    }}>
                      {stat.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: stat.trendColor,
                    fontWeight: 500
                  }}>
                    {stat.trend}
                  </div>
                </div>
              ))}
            </div>

            {/* Earning Details Chart */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Earning Details
                </h3>
                <select style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#6b7280',
                  background: '#fff',
                  outline: 'none'
                }}>
                  <option>July</option>
                  <option>June</option>
                  <option>May</option>
                </select>
              </div>

              {/* Simple mobile-optimized chart */}
              <div style={{
                height: '300px',
                width: '100%',
                position: 'relative',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* Chart SVG */}
                <svg
                  width="100%"
                  height="300"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  viewBox="0 0 500 300"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Chart area */}
                  <path
                    d="M 0,250 Q 50,240 100,200 Q 150,160 200,120 Q 250,80 300,90 Q 350,100 400,130 Q 450,140 500,135 L 500,300 L 0,300 Z"
                    fill="url(#gradient)"
                    opacity="0.4"
                  />

                  {/* Chart line */}
                  <path
                    d="M 0,250 Q 50,240 100,200 Q 150,160 200,120 Q 250,80 300,90 Q 350,100 400,130 Q 450,140 500,135"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  <circle cx="100" cy="200" r="5" fill="#10b981" />
                  <circle cx="200" cy="120" r="5" fill="#10b981" />
                  <circle cx="300" cy="90" r="5" fill="#10b981" />
                  <circle cx="400" cy="130" r="5" fill="#10b981" />

                  {/* Peak value badge */}
                  <g>
                    <rect x="270" y="60" rx="12" ry="12" width="80" height="32" fill="#10b981" />
                    <text x="310" y="80" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">₦64.77</text>
                  </g>

                  {/* Y-axis labels */}
                  <text x="15" y="30" fontSize="14" fill="#9ca3af">100%</text>
                  <text x="15" y="90" fontSize="14" fill="#9ca3af">80%</text>
                  <text x="15" y="150" fontSize="14" fill="#9ca3af">60%</text>
                  <text x="15" y="210" fontSize="14" fill="#9ca3af">40%</text>
                  <text x="15" y="270" fontSize="14" fill="#9ca3af">20%</text>

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
                  bottom: '12px',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  fontSize: '12px',
                  color: '#9ca3af'
                }}>
                  <span>5k</span>
                  <span>10k</span>
                  <span>15k</span>
                  <span>20k</span>
                  <span>25k</span>
                  <span>30k</span>
                  <span>35k</span>
                  <span>40k</span>
                  <span>45k</span>
                  <span>50k</span>
                  <span>55k</span>
                  <span>60k</span>
                </div>
              </div>
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

              {courierData.deliveries.map((delivery, index) => (
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
                        {delivery.pickup}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        <strong>Drop off</strong><br />
                        {delivery.dropoff}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        <strong>Date</strong><br />
                        {delivery.date}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <strong>Amount</strong><br />
                        ₦ {delivery.amount.toLocaleString()}
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
                        {delivery.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
            active: true,
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
            active: false,
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

      {/* WhatsApp Chat Button */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        background: '#10b981',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        cursor: 'pointer',
        zIndex: 40
      }}>
        <MessageCircle size={24} color="#fff" />
        <span style={{
          position: 'absolute',
          bottom: '-8px',
          right: '-8px',
          background: '#fff',
          color: '#10b981',
          fontSize: '10px',
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Chat With Bestyy
        </span>
      </div>
    </div>
  );
};

export default MobileCourierDashboard;
