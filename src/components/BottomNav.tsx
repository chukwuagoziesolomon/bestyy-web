import React from 'react';
import { Home, Utensils, MapPin, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Overview', path: '/user/dashboard', icon: Home },
  { label: 'My Orders', path: '/user/orders', icon: Utensils },
  { label: 'Addresses', path: '/user/addresses', icon: MapPin },
  { label: 'Favorites', path: '/user/favorites', icon: Heart },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const handleNavClick = (path: string, label: string) => {
    console.log(`BottomNav: Clicked ${label}, navigating to ${path}`);
    console.log(`Current location: ${location.pathname}`);
    console.log(`BottomNav: About to navigate...`);
    
    // Add a small delay to see if navigation happens
    setTimeout(() => {
      console.log(`BottomNav: After navigation attempt, location is: ${window.location.pathname}`);
    }, 100);
  };
  
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
          zIndex: 1000,
          boxShadow: '0 -2px 12px #f3f4f6',
          maxWidth: '414px',
          width: '100%',
          margin: '0 auto'
        }}
      >
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => handleNavClick(item.path, item.label)}
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