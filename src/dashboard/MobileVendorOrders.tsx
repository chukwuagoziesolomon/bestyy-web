import React, { useState, useEffect } from 'react';
import { Filter, Calendar, ChevronDown, Home, List, Utensils, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchVendorOrdersList } from '../api';
import VendorHeader from '../components/VendorHeader';
import VendorBottomNavigation from '../components/VendorBottomNavigation';

interface VendorOrder {
  id: string;
  customer_name: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: string;
  order_placed_at: string;
  delivery_address: string;
}

const MobileVendorOrders: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [ordersData, setOrdersData] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [selectedPeriod]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetchVendorOrdersList(token);
      if (response.success) {
        setOrdersData(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const periodOptions = ['Today', 'This Week', 'This Month', 'Last 30 Days'];

  return (
    <div style={{
      fontFamily: 'Nunito Sans, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      paddingBottom: '80px'
    }}>
      <VendorHeader title="Orders" />
      
      <div style={{ padding: '16px' }}>
        {/* Filter Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <Filter size={16} color="#6b7280" />
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Filter Orders
            </span>
          </div>
          
          <div style={{ position: 'relative' }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 40px 12px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                background: 'white',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {periodOptions.map(period => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={16} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6b7280'
              }}
            />
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#666'
          }}>
            Loading orders...
          </div>
        ) : ordersData.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <p style={{ fontSize: '16px', margin: 0 }}>No orders found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ordersData.map(order => (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {/* Order Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 4px 0'
                    }}>
                      #{order.id.slice(-8)}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {order.customer_name}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status)
                  }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Order Details */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '0 0 4px 0'
                    }}>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {formatDate(order.order_placed_at)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div style={{
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '0 0 4px 0',
                    fontWeight: '500'
                  }}>
                    Delivery Address:
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#374151',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {order.delivery_address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <VendorBottomNavigation currentPath="/vendor/orders" />
    </div>
  );
};

export default MobileVendorOrders;