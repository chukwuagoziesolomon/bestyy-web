import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, Menu, X, BarChart3, CreditCard, HelpCircle, Settings, Eye, EyeOff, Landmark, Calendar, ChevronDown } from 'lucide-react';
import { showError, showSuccess } from '../toast';

const MobilePayout: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dateOptions = [
    'Last 7 Days',
    'Last 30 Days',
    'Last 3 Months',
    'Last 6 Months',
    'This Year'
  ];

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Simulate loading payout data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Sample payout data
  const payoutData = {
    totalBalance: 2000000,
    availableToWithdraw: 2000000,
    activeCards: [
      { id: 1, type: 'Active Cards', number: '****6540', masked: true },
      { id: 2, type: 'Active Cards', number: '****4536', masked: true }
    ],
    transactions: Array(12).fill(null).map((_, index) => ({
      id: index + 1,
      type: 'SilverSnow',
      account: 'Opay ******2206',
      date: '24 July 2025, 8:28:20',
      amount: 6000,
      status: 'Received'
    }))
  };

  const handleWithdraw = () => {
    showSuccess('Withdrawal request submitted successfully!');
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
          Payout
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
                { icon: <BarChart3 size={20} />, label: 'Analytics', onClick: () => navigate('/vendor/dashboard/analytics') },
                { icon: <CreditCard size={20} />, label: 'Payout', onClick: () => {}, active: true },
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

      {/* Payout Content */}
      <div style={{ padding: '24px 16px' }}>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            Loading payout information...
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px 20px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <Landmark size={20} color="#6b7280" />
                <span style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1f2937'
                }}>
                  {showBalance ? `₦${payoutData.totalBalance.toLocaleString()}` : '₦••••••••'}
                </span>
                <div 
                  onClick={() => setShowBalance(!showBalance)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showBalance ? <Eye size={20} color="#6b7280" /> : <EyeOff size={20} color="#6b7280" />}
                </div>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '20px'
              }}>
                Available to Withdraw
              </div>

              {/* Active Cards */}
              <div style={{ marginBottom: '20px' }}>
                {payoutData.activeCards.map((card, index) => (
                  <div key={card.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: index < payoutData.activeCards.length - 1 ? '8px' : '0'
                  }}>
                    <CreditCard size={16} color="#10b981" />
                    <span style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {card.type} {card.number}
                    </span>
                  </div>
                ))}
              </div>

              {/* Withdraw Button */}
              <button
                onClick={handleWithdraw}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                Withdraw
              </button>
            </div>

            {/* Transaction History */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {/* Transaction History Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 20px 16px 20px',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Transaction History
                </h3>

                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                  >
                    <Calendar size={16} color="#6b7280" />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151'
                    }}>
                      {dateRange}
                    </span>
                    <ChevronDown size={14} color="#9ca3af" />
                  </div>

                  {/* Date Dropdown */}
                  {showDateDropdown && (
                    <>
                      {/* Backdrop */}
                      <div
                        onClick={() => setShowDateDropdown(false)}
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 40
                        }}
                      />

                      {/* Dropdown Content */}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        zIndex: 50,
                        minWidth: '140px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb'
                      }}>
                        {dateOptions.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setDateRange(option);
                              setShowDateDropdown(false);
                            }}
                            style={{
                              padding: '10px 12px',
                              cursor: 'pointer',
                              background: dateRange === option ? '#f0fdf4' : 'transparent',
                              color: dateRange === option ? '#10b981' : '#374151',
                              fontSize: '14px',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                              borderBottom: index < dateOptions.length - 1 ? '1px solid #f3f4f6' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (dateRange !== option) {
                                e.currentTarget.style.background = '#f9fafb';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (dateRange !== option) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {payoutData.transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {transaction.type}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '2px'
                      }}>
                        {transaction.account}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        {transaction.date}
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        ₦ {transaction.amount.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#10b981',
                        background: '#f0fdf4',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        display: 'inline-block'
                      }}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                  {index < payoutData.transactions.length - 1 && (
                    <div style={{
                      borderBottom: '1px solid #f3f4f6',
                      marginLeft: '20px'
                    }} />
                  )}
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

export default MobilePayout;
