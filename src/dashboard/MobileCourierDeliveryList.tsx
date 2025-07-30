import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Settings, X } from 'lucide-react';
import { Home, List, BarChart3, CreditCard, Search, Filter, Calendar, Menu } from 'lucide-react';
import { showError } from '../toast';

const MobileCourierDeliveryList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);


  const token = localStorage.getItem('token');

  useEffect(() => {
    // Simulate loading delivery data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Sample delivery data
  const deliveries = [
    { 
      id: '00001', 
      pickup: 'Lagos Pizza,Yaba', 
      dropoff: '12, yaba street', 
      date: 'Just Now', 
      amount: 2000, 
      status: 'Accepted' 
    },
    { 
      id: '00002', 
      pickup: 'Mr Biggs, Victoria Island', 
      dropoff: '45, Lekki Phase 1', 
      date: '2 hours ago', 
      amount: 3500, 
      status: 'Delivered' 
    },
    { 
      id: '00003', 
      pickup: 'KFC, Ikeja', 
      dropoff: '23, Allen Avenue', 
      date: '4 hours ago', 
      amount: 1800, 
      status: 'Delivered' 
    },
    { 
      id: '00004', 
      pickup: 'Dominos, Surulere', 
      dropoff: '67, Bode Thomas', 
      date: '6 hours ago', 
      amount: 2500, 
      status: 'Cancelled' 
    },
    { 
      id: '00005', 
      pickup: 'Chicken Republic, Gbagada', 
      dropoff: '12, Oworonshoki', 
      date: '8 hours ago', 
      amount: 2200, 
      status: 'Delivered' 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return { bg: '#fef3c7', color: '#f59e42' };
      case 'Delivered':
        return { bg: '#d1fae5', color: '#10b981' };
      case 'Cancelled':
        return { bg: '#fee2e2', color: '#ef4444' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };



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
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            margin: 0,
            color: '#1f2937'
          }}>
            Delivery List
          </h1>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
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

        {/* Filter and Date Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: '#f3f4f6',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <Filter size={16} color="#10b981" />
            <span style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151'
            }}>
              Filters
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: '#f3f4f6',
            borderRadius: '8px',
            cursor: 'pointer',
            flex: 1
          }}>
            <Calendar size={16} color="#10b981" />
            <span style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151'
            }}>
              Last 30 Days
            </span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '14px',
              color: '#9ca3af'
            }}>
              ▼
            </span>
          </div>
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
            Loading deliveries...
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {deliveries.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                No deliveries found
              </div>
            ) : (
              deliveries.map((delivery, index) => (
                <div key={delivery.id} style={{
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>
                      #{delivery.id}
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 500,
                      ...getStatusColor(delivery.status)
                    }}>
                      {delivery.status}
                    </div>
                  </div>
                  <div style={{
                    display: 'grid',
                    gap: '12px'
                  }}>
                        <div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: 500,
                            display: 'block',
                            marginBottom: '2px'
                          }}>
                            Pick Up
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: '#1f2937',
                            fontWeight: 500
                          }}>
                            {delivery.pickup}
                          </span>
                        </div>
                        
                        <div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: 500,
                            display: 'block',
                            marginBottom: '2px'
                          }}>
                            Drop off
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: '#1f2937',
                            fontWeight: 500
                          }}>
                            {delivery.dropoff}
                          </span>
                        </div>
                        
                        <div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: 500,
                            display: 'block',
                            marginBottom: '2px'
                          }}>
                            Date
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: '#1f2937',
                            fontWeight: 500
                          }}>
                            {delivery.date}
                          </span>
                        </div>
                        
                        <div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: 500,
                            display: 'block',
                            marginBottom: '2px'
                          }}>
                            Amount
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: '#1f2937',
                            fontWeight: 600
                          }}>
                            ₦ {delivery.amount.toLocaleString()}
                          </span>
                        </div>
                  </div>
                </div>
              ))
            )}
          </div>
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
            active: true,
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
    </div>
  );
};

export default MobileCourierDeliveryList;
