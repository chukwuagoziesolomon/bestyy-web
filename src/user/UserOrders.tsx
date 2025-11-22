import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Bell, User, Loader2 } from 'lucide-react';
import { fetchUserOrders } from '../api';
import PremiumLoadingAnimation from '../components/PremiumLoadingAnimation';

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

const UserOrders = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('access_token');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <PremiumLoadingAnimation message="Loading your orders..." />;
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
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: 12,
          maxWidth: 400
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: 8 }}>Error Loading Orders</h3>
          <p style={{ color: '#991b1b', marginBottom: 16 }}>{error}</p>
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
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>My Orders</h2>
          <p style={{ color: '#888', fontSize: 16, margin: '8px 0 0 0' }}>Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Moon size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <Bell size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {user?.first_name?.[0]?.toUpperCase() || <User size={20} />}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: 0, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 17, fontFamily: 'inherit' }}>
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
                        border: '1px solid #e5e7eb', 
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
  );
};

export default UserOrders;
