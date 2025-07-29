import React from 'react';
import BottomNav from '../components/BottomNav';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const orders = [
  {
    name: 'Fried Rice and Turkey, Sa...',
    restaurant: 'Korede Spagetti',
    date: '15, Jun 2025, 12:00',
    price: 'N 5000',
  },
  // Add more sample orders as needed
];

const bookings = [
  {
    image: '/image1.png',
    hotel: 'Sample Hotel',
    date: '15, Jun 2025, 12:00',
    status: 'Confirmed',
  },
  // Add more sample bookings as needed
];

const MobileDashboardHome = () => {
  const firstName = localStorage.getItem('first_name') || 'there';

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111', paddingBottom: 80 }}>
      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 18px 0 18px', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <img src={localStorage.getItem('profile_image') || '/user1.png'} alt="Profile" style={{ width: 48, height: 48, borderRadius: '50%' }} />
        <span style={{ fontWeight: 700, fontSize: 22 }}>Welcome Back, {firstName} !</span>
        <button style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </button>
      </div>

      {/* My Orders */}
      <div style={{ padding: '24px 18px 0 18px' }}>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Orders</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp</div>
        {orders.map((order, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', padding: '18px 16px', marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i !== orders.length - 1 ? '1.5px solid #f3f4f6' : 'none' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{order.name}</div>
              <div style={{ color: '#888', fontSize: 15 }}>{order.restaurant}</div>
              <div style={{ color: '#888', fontSize: 14 }}>{order.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#10b981' }}>{order.price}</div>
              <button style={{ background: '#f3fefb', color: '#10b981', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, padding: '8px 18px', marginTop: 8, cursor: 'pointer' }}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* My Bookings */}
      <div style={{ padding: '24px 18px 0 18px' }}>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Bookings</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp</div>
        {bookings.map((booking, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', overflow: 'hidden', marginBottom: 18, position: 'relative' }}>
            {/* Carousel Image with Arrows */}
            <div style={{ width: '100%', height: 160, background: `url(${booking.image}) center/cover`, position: 'relative' }}>
              <button style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                <ChevronLeft size={22} color="#222" />
              </button>
              <button style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                <ChevronRight size={22} color="#222" />
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{booking.hotel}</div>
              <div style={{ color: '#888', fontSize: 15 }}>{booking.date}</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ background: '#e6f9f2', color: '#10b981', borderRadius: 6, padding: '4px 12px', fontWeight: 600, fontSize: 12 }}>{booking.status}</span>
                <button style={{ background: '#f3fefb', color: '#10b981', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer' }}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MobileDashboardHome; 