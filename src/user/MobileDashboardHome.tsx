import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import UserBottomNavigation from '../components/UserBottomNavigation';
import ChatWithBestie from '../components/ChatWithBestie';
import { ChevronRight, Clock } from 'lucide-react';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';
import { useResponsive } from '../hooks/useResponsive';
import { fetchUserOrders } from '../api';

// Types
interface OrderItem {
  id: number;
  dish_name: string;
  price: string;
}

interface Vendor {
  id: number;
  business_name: string;
  business_address: string;
}

interface Order {
  id: number;
  order_name: string;
  vendor: Vendor;
  items: OrderItem[];
  items_count: number;
  total_price: string;
  total_price_display: string;
  delivery_address: string;
  status: string;
  status_display: string;
  created_at: string;
  delivered_at?: string;
  payment_confirmed: boolean;
  user_receipt_confirmed: boolean;
}

interface OrdersResponse {
  count: number;
  total_pages: number;
  current_page: number;
  results: Order[];
}

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

// Helper function to get status styles
const getStatusStyles = (status: string) => {
  switch(status.toLowerCase()) {
    case 'delivered':
    case 'completed':
      return { background: '#D1FAE5', color: '#065F46' };
    case 'in transit':
    case 'out_for_delivery':
      return { background: '#DBEAFE', color: '#1E40AF' };
    case 'pending':
    case 'confirmed':
      return { background: '#FEF3C7', color: '#D97706' };
    case 'cancelled':
      return { background: '#FEE2E2', color: '#DC2626' };
    default:
      return { background: '#F3F4F6', color: '#4B5563' };
  }
};



const MobileDashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem('first_name') || 'there';
  const { isTablet } = useResponsive();
  const token = localStorage.getItem('access_token');
  
  // State for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response: OrdersResponse = await fetchUserOrders(token, { page_size: 2 });
        setOrders(response.results || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      color: '#111',
      minHeight: '100vh',
      paddingBottom: '80px',
      background: '#f8fafc',
      maxWidth: isTablet ? '768px' : '414px', // Tablet: 768px, Mobile: 414px
      margin: '0 auto'
    }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Header */}
        <UserHeader />

      {/* Welcome Section */}
      <div style={{ 
          padding: '24px 16px 20px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
          marginBottom: '24px',
          marginTop: '8px'
      }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: '1.3'
        }}>
          Welcome back, {firstName}!
        </h2>
        <p style={{ 
          margin: 0, 
          fontSize: '13px',
          opacity: 0.9,
          lineHeight: '1.4'
        }}>
          Track your orders and manage your account
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '0 16px 24px',
        marginBottom: '16px'
      }}>
        <button 
          onClick={() => navigate('/user/orders')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: '#D1FAE5',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '15px',
            fontWeight: 500,
            color: '#1e293b'
          }}>
            My Orders
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '12px',
            color: '#64748b',
            lineHeight: '1.3'
          }}>
            Track and manage
          </p>
        </button>

        <button 
          onClick={() => navigate('/recommendations')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: '#FEF3C7',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '15px',
            fontWeight: 500,
            color: '#1e293b'
          }}>
            Order Food
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '12px',
            color: '#64748b',
            lineHeight: '1.3'
          }}>
            Browse restaurants
          </p>
        </button>
      </div>

      {/* Recent Orders */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        margin: '0 16px 24px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 16px 12px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '15px',
            fontWeight: 500,
            color: '#1e293b'
          }}>
            Recent Orders
          </h3>
          <button 
            onClick={() => navigate('/user/orders')}
            style={{
              background: 'none',
              border: 'none',
              color: '#10B981',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            View all <ChevronRight size={16} />
          </button>
        </div>
        
        {loading ? (
          <PremiumLoadingAnimation message="Loading your dashboard..." />
        ) : error ? (
          <div style={{ 
            padding: '32px 16px', 
            textAlign: 'center',
            color: '#ef4444',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ 
            padding: '32px 16px', 
            textAlign: 'center',
            color: '#64748b',
            fontSize: '13px',
            lineHeight: '1.4'
          }}>
            No recent orders
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div 
                key={order.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onClick={() => navigate(`/user/orders/${order.id}`)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1e293b',
                    maxWidth: '70%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.3'
                  }}>
                    {order.order_name}
                  </h4>
                  <span style={{ 
                    ...getStatusStyles(order.status),
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {order.status_display || order.status}
                  </span>
                </div>
                
                <p style={{ 
                  margin: '4px 0', 
                  color: '#64748b',
                  fontSize: '12px',
                  lineHeight: '1.3'
                }}>
                  {order.vendor.business_name}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: '#64748b',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    lineHeight: '1.3'
                  }}>
                    <Clock size={14} />
                    {formatDate(order.created_at)}
                  </span>
                  <span style={{ 
              color: '#10B981',
              fontSize: '14px',
                    fontWeight: 600
                  }}>
                    {order.total_price_display || order.total_price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Chat With Bestie */}
      <ChatWithBestie />

      {/* Bottom Navigation */}
      <UserBottomNavigation currentPath="/user/dashboard" />
    </div>
  );
};

export default MobileDashboardHome;
