import React, { useEffect, useState } from 'react';
import { Moon, Bell, User } from 'lucide-react';
import { fetchUserOrders } from '../api';
import { showError } from '../toast';

const UserDashboardHome = () => {
  const firstName = localStorage.getItem('first_name') || 'there';
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function getOrdersAndBookings() {
      try {
        if (token) {
          const data = await fetchUserOrders(token);
          setOrders(data.orders || []);
          setBookings(data.bookings || []);
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch orders/bookings');
      }
    }
    getOrdersAndBookings();
  }, [token]);

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>Welcome Back, {firstName}!</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Moon size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <Bell size={22} style={{ color: '#222', cursor: 'pointer' }} />
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" style={{ width: 38, height: 38, borderRadius: '50%' }} />
        </div>
      </div>
      {/* My Orders */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Orders</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp</div>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: 0, overflow: 'hidden', border: '1.5px solid #f3f4f6' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 17, fontFamily: 'inherit' }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 700, background: '#fff' }}>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>NAME</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>ADDRESS</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>DATE</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 32 }}>
                    <a
                      href="https://wa.me/234XXXXXXXXXX" // <-- replace with your WhatsApp number
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: '#10b981', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
                    >
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="24" fill="#25D366"/>
                        <path d="M34.6 28.7c-.5-.2-2.8-1.4-3.2-1.6-.4-.2-.7-.2-1 .2-.3.4-1.1 1.6-1.4 1.9-.2.3-.5.3-.9.1-2.5-1.2-4.1-2.2-5.7-5.1-.4-.7.4-.7 1.1-2.3.1-.3 0-.6-.1-.8-.1-.2-.9-2.2-1.2-3-.3-.7-.6-.6-.9-.6h-.8c-.3 0-.8.1-1.2.6-.4.5-1.5 1.5-1.5 3.7 0 2.2 1.6 4.3 1.8 4.6.2.3 3.2 5 7.8 6.8.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.1-1.4-.1-.1-.4-.2-.9-.4z" fill="#fff"/>
                      </svg>
                      <span style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>No orders yet</span>
                      <span style={{ color: '#888', fontSize: 16, marginTop: 4, marginBottom: 8 }}>Click here to place your first order on WhatsApp!</span>
                    </a>
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: i !== orders.length - 1 ? '1.5px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14, fontWeight: 700, color: '#222' }}>
                      <img src={order.logo || 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg'} alt={order.name || 'Order'} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'contain', background: '#fff', border: '1.5px solid #f3f4f6' }} />
                      {order.name || order.restaurant || 'Order'}
                    </td>
                    <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600 }}>{order.address || order.delivery_address || '-'}</td>
                    <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600 }}>{order.date || order.created_at || '-'}</td>
                    <td style={{ padding: '20px 18px' }}>
                      <span style={{ background: order.statusColor || '#d1fae5', color: order.statusTextColor || '#10b981', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15 }}>{order.status || '-'}</span>
                    </td>
                    <td style={{ padding: '20px 18px' }}>
                      <button style={{ background: '#f8fafc', color: '#222', fontWeight: 700, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>{order.action || 'View Details'}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* My Bookings */}
      <div>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Bookings</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>See your upcoming and past bookings. View details, get directions, or modify plans through Bestie</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {bookings.length === 0 ? (
            <div style={{ color: '#888', fontSize: 18, padding: 32 }}>No bookings found.</div>
          ) : (
            bookings.map((booking, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '32px 32px 24px 32px', minWidth: 320, flex: 1, border: '1.5px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{booking.name || booking.hotel || 'Booking'}</div>
                <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>{booking.date || booking.created_at || '-'}</div>
                <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 18 }}>{booking.price || booking.amount || '-'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: '#d1fae5', color: '#10b981', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15 }}>{booking.status || 'Confirmed'}</span>
                  <button style={{ background: '#f8fafc', color: '#222', fontWeight: 700, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>Track Order</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHome; 