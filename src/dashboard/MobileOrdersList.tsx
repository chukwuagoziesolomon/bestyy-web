import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Table, Filter, ChevronDown, Menu, X, BarChart3, CreditCard, HelpCircle, Settings } from 'lucide-react';
import { fetchVendorOrders } from '../api';
import { showError } from '../toast';

interface Order {
  id: string;
  customer_name: string;
  customer_address?: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const MobileOrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Last 30 Days');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const token = localStorage.getItem('vendor_token');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        if (token) {
          const data = await fetchVendorOrders(token);
          setOrders(data.orders || data || []);
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch orders');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [token]);

  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'rejected':
        return { background: '#fef2f2', color: '#dc2626' };
      case 'accepted':
      case 'confirmed':
        return { background: '#d1fae5', color: '#065f46' };
      case 'pending':
        return { background: '#fef3c7', color: '#92400e' };
      case 'delivered':
        return { background: '#dbeafe', color: '#1e40af' };
      default:
        return { background: '#f3f4f6', color: '#4b5563' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return 'Just Now';
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };

  // Sample orders if no real data
  const sampleOrders = [
    {
      id: '00001',
      customer_name: 'Christine Brooks',
      customer_address: '12, yaba street',
      status: 'rejected',
      total_amount: 2500,
      created_at: new Date().toISOString()
    },
    {
      id: '00002',
      customer_name: 'Christine Brooks',
      customer_address: '12, yaba street',
      status: 'accepted',
      total_amount: 2500,
      created_at: new Date().toISOString()
    },
    {
      id: '00003',
      customer_name: 'Christine Brooks',
      customer_address: '12, yaba street',
      status: 'accepted',
      total_amount: 2500,
      created_at: new Date().toISOString()
    }
  ];

  const displayOrders = orders.length > 0 ? orders : sampleOrders;

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
          Orders List
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
                { icon: <BarChart3 size={20} />, label: 'Analytics', onClick: () => navigate('/vendor/dashboard/analytics') },
                { icon: <CreditCard size={20} />, label: 'Payout', onClick: () => navigate('/vendor/dashboard/payouts') },
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

      {/* Filters */}
      <div style={{
        padding: '16px',
        display: 'flex',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f3f4f6',
          padding: '12px 16px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          <Filter size={16} color="#10b981" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Filters
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f3f4f6',
          padding: '12px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          flex: 1
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: '#10b981',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '6px',
              border: '2px solid white',
              borderTop: 'none',
              borderRight: 'none',
              transform: 'rotate(-45deg)',
              marginTop: '-1px'
            }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            {selectedFilter}
          </span>
          <ChevronDown size={16} color="#6b7280" style={{ marginLeft: 'auto' }} />
        </div>
      </div>

      {/* Orders List */}
      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            Loading orders...
          </div>
        ) : (
          displayOrders.map((order, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {/* Order ID and Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#6b7280'
                }}>
                  #{order.id}
                </span>
                <div style={{
                  ...getStatusStyles(order.status),
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {order.status}
                </div>
              </div>

              {/* Order Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Name
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    {order.customer_name}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Address
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    {order.customer_address || '12, yaba street'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Total
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    ₦{order.total_amount?.toLocaleString() || '04, Sep. 2025'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    Date
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
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
            active: true,
            onClick: () => {}
          },
          {
            icon: <Utensils size={20} />,
            label: 'Menu',
            active: false,
            onClick: () => navigate('/vendor/dashboard/menu')
          },
          {
            icon: <Table size={20} />,
            label: 'Item Stock',
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

export default MobileOrdersList;
