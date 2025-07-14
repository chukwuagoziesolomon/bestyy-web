import React from 'react';
import { Moon, Bell, User } from 'lucide-react';

const orders = [
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Pizza_Hut_logo.svg', name: 'Pizza Hut', address: '12 Enugu ave,222', date: '04 Jun 2025', status: 'Out For delivery', statusColor: '#fef3c7', statusTextColor: '#f59e42', action: 'Track Order' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg', name: 'Domino Pizza', address: '12 Enugu ave,222', date: '28 may 2025', status: 'Completed', statusColor: '#d1fae5', statusTextColor: '#10b981', action: 'View Details' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Spaghetti_icon.png', name: 'Korede Spagetti', address: '12 Enugu ave,222', date: '23 may 2025', status: 'Rejected', statusColor: '#fee2e2', statusTextColor: '#ef4444', action: 'View Details' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Burger_King_logo.svg', name: 'Burger King', address: '12 Enugu ave,222', date: '05 Feb 2025', status: 'Completed', statusColor: '#d1fae5', statusTextColor: '#10b981', action: 'Track Order' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Mr_Biggs_logo.svg', name: 'Mr Biggs', address: '12 Enugu ave,222', date: '29 jan 2025', status: 'Completed', statusColor: '#d1fae5', statusTextColor: '#10b981', action: 'View Details' },
];

const bookings = [
  { name: 'Eko Hotel', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
  { name: 'Crestville Apartment', date: 'Jun 29-30, 20205', price: 'N 150,000', status: 'Confirmed' },
];

const UserDashboardHome = () => (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <h2 style={{ fontWeight: 600, fontSize: 28, margin: 0 }}>Welcome Back, Silver !</h2>
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
            {orders.map((order, i) => (
              <tr key={i} style={{ background: '#fff', borderBottom: i !== orders.length - 1 ? '1.5px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14, fontWeight: 700, color: '#222' }}>
                  <img src={order.logo} alt={order.name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'contain', background: '#fff', border: '1.5px solid #f3f4f6' }} />
                  {order.name}
                </td>
                <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600 }}>{order.address}</td>
                <td style={{ padding: '20px 18px', color: '#222', fontWeight: 600 }}>{order.date}</td>
                <td style={{ padding: '20px 18px' }}>
                  <span style={{ background: order.statusColor, color: order.statusTextColor, borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15 }}>{order.status}</span>
                </td>
                <td style={{ padding: '20px 18px' }}>
                  <button style={{ background: '#f8fafc', color: '#222', fontWeight: 700, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>{order.action}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {/* My Bookings */}
    <div>
      <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Bookings</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>See your upcoming and past bookings. View details, get directions, or modify plans through Bestie</div>
      <div style={{ display: 'flex', gap: 24 }}>
        {bookings.map((booking, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '32px 32px 24px 32px', minWidth: 320, flex: 1, border: '1.5px solid #f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{booking.name}</div>
            <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>{booking.date}</div>
            <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 18 }}>{booking.price}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ background: '#d1fae5', color: '#10b981', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15 }}>Confirmed</span>
              <button style={{ background: '#f8fafc', color: '#222', fontWeight: 700, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>Track Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UserDashboardHome; 