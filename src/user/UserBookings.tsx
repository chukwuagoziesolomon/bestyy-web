import React from 'react';

const bookings = [
  { name: 'Eko Hotel', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
  { name: 'Crestville Apartment', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
  { name: 'Eko Hotel', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
  { name: 'Crestville Apartment', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
  { name: 'Eko Hotel', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
  { name: 'Crestville Apartment', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
];

const UserBookings = () => (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
    {/* Header */}
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Bookings</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>See your upcoming and past bookings. View details, get directions, or modify plans through Bestie</div>
    </div>
    {/* Bookings Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      {bookings.map((booking, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '32px 32px 24px 32px', minWidth: 320, border: '1.5px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>{booking.name}</div>
              <div style={{ color: '#888', fontSize: 16 }}>{booking.date}</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 22 }}>{booking.price}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
            <span style={{ background: '#d1fae5', color: '#10b981', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15 }}>Confirmed</span>
            <button style={{ background: '#fff', color: '#222', fontWeight: 600, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer', marginLeft: 'auto' }}>View Invoice</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserBookings; 