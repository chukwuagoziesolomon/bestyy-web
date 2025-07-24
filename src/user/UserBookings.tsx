import React, { useEffect, useState } from 'react';
import { fetchUserOrders } from '../api';
import { showError } from '../toast';

const UserBookings = () => {
  const token = localStorage.getItem('token');
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function getBookings() {
      try {
        if (token) {
          const data = await fetchUserOrders(token);
          setBookings(data.bookings || []);
        }
      } catch (err: any) {
        showError(err.message || 'Could not fetch bookings');
      }
    }
    getBookings();
  }, [token]);

  return (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
    {/* Header */}
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Bookings</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>See your upcoming and past bookings. View details, get directions, or modify plans through Bestie</div>
    </div>
    {/* Bookings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, minHeight: '350px' }}>
        {bookings.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', width: '100%' }}>
            <a
              href="https://wa.me/234XXXXXXXXXX" // <-- replace with your WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#10b981', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
            >
              <img src="/whatsapp.png" alt="WhatsApp" width={64} height={64} style={{ display: 'block' }} />
              <span style={{ fontWeight: 700, fontSize: 22, marginTop: 12, textAlign: 'center' }}>No bookings yet</span>
              <span style={{ color: '#222', fontWeight: 700, fontSize: 18, marginTop: 8, marginBottom: 8, textAlign: 'center' }}>
                Click here to book your first stay or service via WhatsApp!
              </span>
            </a>
          </div>
        ) : (
          bookings.map((booking, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '32px 32px 24px 32px', minWidth: 320, border: '1.5px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
                  <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>{booking.name || booking.hotel || 'Booking'}</div>
                  <div style={{ color: '#888', fontSize: 16 }}>{booking.date || booking.created_at || '-'}</div>
            </div>
                <div style={{ fontWeight: 600, fontSize: 22 }}>{booking.price || booking.amount || '-'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
                <span style={{ background: '#d1fae5', color: '#10b981', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15 }}>{booking.status || 'Confirmed'}</span>
            <button style={{ background: '#fff', color: '#222', fontWeight: 600, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer', marginLeft: 'auto' }}>View Invoice</button>
          </div>
        </div>
          ))
        )}
    </div>
  </div>
);
};

export default UserBookings; 