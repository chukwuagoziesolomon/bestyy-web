import React from 'react';
import { Home, Utensils, Wallet, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Overview', path: '/user/dashboard', icon: Home },
  { label: 'My Orders', path: '/user/dashboard/orders', icon: Utensils },
  { label: 'Bookings', path: '/user/dashboard/bookings', icon: Wallet },
  { label: 'Favorite', path: '/user/dashboard/favorite', icon: Heart },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
        background: '#fff',
        borderTop: '1.5px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 -2px 12px #f3f4f6',
      }}
    >
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: active ? '#10b981' : '#555',
              fontWeight: active ? 700 : 500,
              fontSize: 14,
              gap: 4,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Icon size={32} color={active ? '#10b981' : '#555'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav; 