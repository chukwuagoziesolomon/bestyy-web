import React, { useState } from 'react';
import { Menu, Calendar, ChevronDown, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const orders = [
  {
    name: 'Fried Rice and Turkey, Sa...',
    restaurant: 'Korede Spagetti',
    date: '15, Jun 2025, 12:00',
    price: 'N 5000',
  },
  // Add more sample orders as needed
];

const MobileOrdersPage = () => {
  const firstName = localStorage.getItem('first_name') || 'there';
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111', paddingBottom: 80 }}>
      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 18px 0 18px', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <img src={localStorage.getItem('profile_image') || '/user1.png'} alt="Profile" style={{ width: 48, height: 48, borderRadius: '50%' }} />
        <button style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
          <Menu size={38} color="#222" />
        </button>
      </div>

      {/* Title & Subtitle */}
      <div style={{ padding: '24px 18px 0 18px' }}>
        <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>My Orders</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 18 }}>
          Track your recent food orders, check delivery status, or re-order your favorite meals instantly via WhatsApp
        </div>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: 18, padding: '0 18px', marginBottom: 24 }}>
        <button
          style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: 'none', padding: '18px 0', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', position: 'relative' }}
          onClick={() => setShowFilter((v) => !v)}
        >
          <Filter size={28} color="#10b981" /> Filters
          {/* Filter Dropdown */}
          {showFilter && (
            <div style={{ position: 'absolute', left: 0, top: '110%', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(16,24,40,0.12)', padding: '24px 0', minWidth: 220, zIndex: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px', fontSize: 20, color: '#059669', fontWeight: 600 }}>
                <CheckCircle2 size={24} color="#059669" /> Delivered
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px', fontSize: 20, color: '#ef4444', fontWeight: 600 }}>
                <XCircle size={24} color="#ef4444" /> Cancelled
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px', fontSize: 20, color: '#f59e42', fontWeight: 600 }}>
                <Clock size={24} color="#f59e42" /> Pending
              </div>
            </div>
          )}
        </button>
        <button
          style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: 'none', padding: '18px 0', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}
        >
          <Calendar size={28} color="#10b981" /> Last 30 Days <ChevronDown size={22} color="#222" />
        </button>
      </div>

      {/* Orders List */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', overflow: 'hidden', margin: '0 18px' }}>
        {orders.map((order, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 16px', borderBottom: i !== orders.length - 1 ? '1.5px solid #f3f4f6' : 'none' }}>
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

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MobileOrdersPage; 