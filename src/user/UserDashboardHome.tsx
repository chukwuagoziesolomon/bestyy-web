import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Bell, User, Loader2 } from 'lucide-react';
import { fetchUserOrders } from '../api';

// Define types for orders based on API response
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

const UserDashboardHome = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('access_token');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        // If no token, user might be pending approval or not fully authenticated
        console.log('No authentication token found - user might be pending approval');
        setError('Account pending approval. Please wait for admin approval or contact support.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const response: OrdersResponse = await fetchUserOrders(token);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return { background: '#d1fae5', color: '#10b981' };
      case 'out_for_delivery':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'ready':
        return { background: '#fef3c7', color: '#d97706' };
      case 'confirmed':
        return { background: '#e0e7ff', color: '#6366f1' };
      case 'pending':
        return { background: '#fef3c7', color: '#d97706' };
      case 'cancelled':
        return { background: '#fee2e2', color: '#dc2626' };
      default:
        return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif', 
        color: '#111',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 18 }}>Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        fontFamily: 'Nunito Sans, sans-serif',
        color: '#111',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: 32,
          background: error.includes('pending approval') ? '#fef3c7' : '#fee2e2',
          border: `1px solid ${error.includes('pending approval') ? '#fde68a' : '#fecaca'}`,
          borderRadius: 12,
          maxWidth: 400
        }}>
          <h3 style={{ color: error.includes('pending approval') ? '#d97706' : '#dc2626', marginBottom: 8 }}>
            {error.includes('pending approval') ? 'Account Pending Approval' : 'Error Loading Orders'}
          </h3>
          <p style={{ color: error.includes('pending approval') ? '#92400e' : '#991b1b', marginBottom: 16 }}>{error}</p>
          {error.includes('pending approval') ? (
            <div style={{ marginBottom: 16, color: '#6b7280', fontSize: '14px' }}>
              <p>Your account is being reviewed. You'll receive an email notification once approved.</p>
              <p>In the meantime, you can contact our support team for assistance.</p>
            </div>
          ) : (
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>Welcome Back, {user?.first_name || 'User'}!</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Moon size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <Bell size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {user?.first_name?.[0]?.toUpperCase() || <User size={20} />}
          </div>
        </div>
      </div>

      {/* My Orders */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Orders</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp</div>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: 0, overflow: 'hidden', border: '1.5px solid #f3f4f6' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 17, fontFamily: 'inherit', border: '1px solid #e5e7eb' }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 700, background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e5e7eb' }}>ORDER</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e5e7eb' }}>VENDOR</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e5e7eb' }}>ITEMS</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e5e7eb' }}>TOTAL</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e5e7eb' }}>DATE</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e5e7eb' }}>STATUS</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 32 }}>
                    <a
                      href="https://wa.me/234XXXXXXXXXX" // Replace with your WhatsApp number
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: '#10b981', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
                    >
                      <img src="/WhatsApp.png" alt="WhatsApp" width={48} height={48} style={{ display: 'block' }} />
                      <span style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>No orders yet</span>
                      <span style={{ color: '#888', fontSize: 16, marginTop: 4, marginBottom: 8 }}>Click here to place your first order on WhatsApp!</span>
                    </a>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusColors = getStatusColor(order.status);
                  return (
                    <tr key={order.id} style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '20px 18px', fontWeight: 700, color: '#222', borderRight: '1px solid #e5e7eb' }}>
                        {order.order_name}
                      </td>
                      <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600, borderRight: '1px solid #e5e7eb' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{order.vendor.business_name}</div>
                          <div style={{ fontSize: 14, color: '#666' }}>{order.vendor.business_address}</div>
                        </div>
                      </td>
                      <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600, borderRight: '1px solid #e5e7eb' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{order.items_count} items</div>
                          <div style={{ fontSize: 14, color: '#666' }}>
                            {order.items.slice(0, 2).map(item => item.dish_name).join(', ')}
                            {order.items.length > 2 && '...'}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '20px 18px', color: '#222', fontWeight: 700, borderRight: '1px solid #e5e7eb' }}>
                        {order.total_price_display}
                      </td>
                      <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600, borderRight: '1px solid #e5e7eb' }}>
                        {formatDate(order.created_at)}
                    </td>
                      <td style={{ padding: '20px 18px', borderRight: '1px solid #e5e7eb' }}>
                        <span style={{ 
                          background: statusColors.background, 
                          color: statusColors.color, 
                          borderRadius: 8, 
                          padding: '6px 18px', 
                          fontWeight: 700, 
                          fontSize: 15 
                        }}>
                          {order.status_display}
                        </span>
                    </td>
                    <td style={{ padding: '20px 18px' }}>
                        <button style={{ 
                          background: '#f8fafc', 
                          color: '#222', 
                          fontWeight: 700, 
                          fontSize: 15, 
                          border: '1.5px solid #e5e7eb', 
                          borderRadius: 8, 
                          padding: '10px 22px', 
                          cursor: 'pointer' 
                        }}>
                          View Details
                        </button>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Chat Button */}
      <div 
        onClick={() => {
          const whatsappUrl = `https://wa.me/2348090530061?text=${encodeURIComponent('Hi! I need help with my account.')}`;
          window.open(whatsappUrl, '_blank');
        }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: '#25D366',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
        }}
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="white"/>
          <path d="M23.47 19.37c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.06-2.54-.28-.68-.57-.59-.77-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.54.17.23 2.42 3.7 5.87 5.04.82.32 1.46.51 1.96.65.82.26 1.57.22 2.16.13.66-.1 2.01-.82 2.3-1.61.28-.79.28-1.47.2-1.61-.08-.14-.31-.23-.65-.4z" fill="#25D366"/>
        </svg>
      </div>
    </div>
  );
};

export default UserDashboardHome;