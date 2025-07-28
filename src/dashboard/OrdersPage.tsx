import React, { useEffect, useState } from 'react';
import { fetchVendorOrders } from '../api';
import '../styles/OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function getOrders() {
      setLoading(true);
      setError(null);
      try {
        if (token) {
          const data = await fetchVendorOrders(token);
          setOrders(data.orders || data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Could not fetch orders');
      } finally {
        setLoading(false);
      }
    }
    getOrders();
  }, [token]);

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'rejected':
        return { background: '#fee2e2', color: '#ef4444' };
      case 'pending':
        return { background: '#fef3c7', color: '#d97706' };
      case 'completed':
        return { background: '#d1fae5', color: '#10b981' };
      case 'delivered':
        return { background: '#dbeafe', color: '#2563eb' };
      default:
        return { background: '#e5e7eb', color: '#4b5563' };
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h1>Order List</h1>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h1>Order List</h1>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Order List</h1>
      </div>

      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {/* Desktop Table */}
            <div className="desktop-orders">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td data-label="Order ID">{order.id || '-'}</td>
                      <td data-label="Customer">{order.customer_name || '-'}</td>
                      <td data-label="Address">{order.delivery_address || '-'}</td>
                      <td data-label="Items">{order.item_name || '-'}</td>
                      <td data-label="Total">{order.total_amount ? `₦${order.total_amount.toLocaleString()}` : '-'}</td>
                      <td data-label="Status">
                        <span className="status-badge" style={getStatusStyles(order.status)}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-orders">
              {orders.map((order) => (
                <div key={`mobile-${order.id}`} className="order-card">
                  <div className="order-card-header">
                    <h3>Order #{order.id || 'N/A'}</h3>
                    <span 
                      className="status-badge" 
                      style={getStatusStyles(order.status)}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  <div className="order-details">
                    <div className="detail-row">
                      <span className="detail-label">Customer:</span>
                      <span className="detail-value">{order.customer_name || '-'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Items:</span>
                      <span className="detail-value">{order.item_name || '-'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value">
                        {order.total_amount ? `₦${order.total_amount.toLocaleString()}` : '-'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value address">
                        {order.delivery_address || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;