import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchVendorOrdersList } from '../api';

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

const DesktopVendorOrders: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
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
      day: 'numeric',
      year: 'numeric'
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
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0
        }}>
          Orders
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Filter by period:
          </span>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: '8px 32px 8px 12px',
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
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6b7280'
              }}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '16px',
            color: '#666'
          }}>
            Loading orders...
          </div>
        ) : ordersData.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
          }}>
            <p style={{ fontSize: '18px', margin: 0 }}>No orders found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Order ID
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Customer
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Items
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Date
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Total
                  </th>
                  <th style={{
                    padding: '16px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order, index) => (
                  <tr 
                    key={order.id} 
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      #{order.id.slice(-8)}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {order.customer_name}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {formatDate(order.order_placed_at)}
                    </td>
                    <td style={{
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td style={{
                      padding: '12px'
                    }}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopVendorOrders;