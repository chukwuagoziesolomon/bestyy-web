import React from 'react';

const OrdersPage = () => (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
      <h1 style={{ fontWeight: 900, fontSize: 32, letterSpacing: 0.5 }}>Order List</h1>
    
    </div>
    <div className="dashboard-card" style={{ borderRadius: 28, padding: 48, margin: '0 auto', maxWidth: 1200 }}>
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
          {[...Array(10)].map((_, i, arr) => (
            <tr key={i}>
              <td style={{ padding: '24px 18px', borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>00001</td>
              <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>Christine Brooks</td>
              <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>12,Lagos State</td>
              <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>04 Sep 2025</td>
              <td style={{ borderRight: '1px solid #D1D5DB', padding: '24px 18px', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>₦5,0000</td>
              <td style={{ padding: '24px 18px', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>
                {i === 0 ? (
                  <span style={{ background: '#fee2e2', color: '#ef4444', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 17, fontFamily: 'inherit' }}>Rejected</span>
                ) : (
                  <span style={{ background: '#d1fae5', color: '#10b981', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 17, fontFamily: 'inherit' }}>Accepted</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersPage; 