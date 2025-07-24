import React, { useEffect, useState } from 'react';
import { fetchVendorOrders } from '../api';

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

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <h1 style={{ fontWeight: 900, fontSize: 32, letterSpacing: 0.5 }}>Order List</h1>
      </div>
      <div className="dashboard-card" style={{ borderRadius: 28, padding: 48, margin: '0 auto', maxWidth: 1200 }}>
        {loading ? (
          <div style={{ color: '#888', fontSize: 18 }}>Loading orders...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', fontSize: 18 }}>{error}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 19, border: '1px solid #e5e7eb', fontFamily: 'inherit' }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 700, textAlign: 'left' }}>
                <th style={{ padding: '24px 18px', borderRight: '1px solid #D1D5DB', borderBottom: '1px solid #D1D5DB' }}>ID</th>
                <th style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px', borderBottom: '1px solid #D1D5DB' }}>Name</th>
                <th style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px', borderBottom: '1px solid #D1D5DB' }}>Address</th>
                <th style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px', borderBottom: '1px solid #D1D5DB' }}>Item</th>
                <th style={{ borderRight: '1px solidrgb(6, 6, 6)', padding: '24px 18px', borderBottom: '1px solid #D1D5DB' }}>Total</th>
                <th style={{ padding: '24px 18px', borderBottom: '1px solid #D1D5DB' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 32 }}>No orders found.</td></tr>
              ) : (
                orders.map((order: any, i: number) => (
                  <tr key={order.id || i}>
                    <td style={{ padding: '24px 18px', borderRight: '1px solid #D1D5DB' }}>{order.id || '-'}</td>
                    <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px' }}>{order.customer_name || '-'}</td>
                    <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px' }}>{order.delivery_address || '-'}</td>
                    <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px' }}>{order.item_name || '-'}</td>
                    <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px' }}>{order.total_amount ? `₦${order.total_amount}` : '-'}</td>
                    <td style={{ padding: '24px 18px' }}>
                      <span style={{ background: order.status === 'Rejected' ? '#fee2e2' : '#d1fae5', color: order.status === 'Rejected' ? '#ef4444' : '#10b981', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 17, fontFamily: 'inherit' }}>{order.status || '-'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 