import React from 'react';
import { Star, Filter, RotateCcw, ChevronDown } from 'lucide-react';

const favourites = [
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg', name: 'Domino Pizza', address: '12 Enugu ave,222', date: '28 may 2025' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Burger_King_logo.svg', name: 'Domino Pizza', address: '12 Enugu ave,222', date: '28 may 2025' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg', name: 'Domino Pizza', address: '12 Enugu ave,222', date: '28 may 2025' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Mr_Biggs_logo.svg', name: 'Domino Pizza', address: '12 Enugu ave,222', date: '28 may 2025' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg', name: 'Domino Pizza', address: '12 Enugu ave,222', date: '28 may 2025' },
  { logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg', name: 'Domino Pizza', address: '12 Enugu ave,222', date: '28 may 2025' },
];

const UserFavourites = () => (
  <div style={{ fontFamily: 'Nunito Sans, sans-serif', color: '#111' }}>
    {/* Header */}
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Favourite</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 0 }}>Quickly select saved delivery locations when placing food orders. Add or update them anytime.</div>
    </div>
    {/* Filter Bar */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', marginBottom: 32, padding: 0, overflow: 'hidden', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', borderRight: '1.5px solid #f3f4f6', fontWeight: 700, color: '#222', fontSize: 16 }}>
        <Filter size={20} /> Filter By
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', borderRight: '1.5px solid #f3f4f6', fontWeight: 600, color: '#222', fontSize: 16, cursor: 'pointer' }}>
        Date <ChevronDown size={18} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', borderRight: '1.5px solid #f3f4f6', fontWeight: 600, color: '#222', fontSize: 16, cursor: 'pointer' }}>
        Order/Booking Type <ChevronDown size={18} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', borderRight: '1.5px solid #f3f4f6', fontWeight: 600, color: '#222', fontSize: 16, cursor: 'pointer' }}>
        Status <ChevronDown size={18} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 28px', color: '#ef4444', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
        <RotateCcw size={18} /> Reset Filter
      </div>
    </div>
    {/* Favourites Table/List */}
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #f3f4f6', border: '1.5px solid #f3f4f6', overflow: 'hidden' }}>
      {favourites.map((fav, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '0 0 0 0', borderBottom: i !== favourites.length - 1 ? '1.5px solid #f3f4f6' : 'none', minHeight: 80 }}>
          <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} color="#facc15" fill="#facc15" />
          </div>
          <div style={{ width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={fav.logo} alt={fav.name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'contain', background: '#fff', border: '1.5px solid #f3f4f6' }} />
          </div>
          <div style={{ flex: 2, fontWeight: 700, fontSize: 17 }}>{fav.name}</div>
          <div style={{ flex: 3, color: '#888', fontWeight: 600, fontSize: 16 }}>{fav.address}</div>
          <div style={{ flex: 2, color: '#888', fontWeight: 600, fontSize: 16 }}>{fav.date}</div>
          <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-end', paddingRight: 32 }}>
            <button style={{ background: '#f8fafc', color: '#222', fontWeight: 700, fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 22px', cursor: 'pointer' }}>Order Via WhatsApp</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserFavourites; 