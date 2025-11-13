import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Utensils, MapPin, Heart } from 'lucide-react';

interface UserBottomNavigationProps {
  currentPath?: string;
}

const UserBottomNavigation: React.FC<UserBottomNavigationProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use provided currentPath or fall back to location.pathname
  const activePath = currentPath || location.pathname;
  
  // Debug log to ensure component is rendering
  console.log('UserBottomNavigation rendering with activePath:', activePath);

  const navItems = [
    {
      path: '/user/dashboard',
      icon: <Home size={20} />,
      label: 'Overview'
    },
    {
      path: '/user/orders',
      icon: <Utensils size={20} />,
      label: 'My Orders'
    },
    {
      path: '/user/addresses',
      icon: <MapPin size={20} />,
      label: 'Addresses'
    },
    {
      path: '/user/favorites',
      icon: <Heart size={20} />,
      label: 'Favorites'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '2px solid #10b981',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 9999,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      visibility: 'visible',
      opacity: 1,
      minHeight: '70px'
    }}>
      {navItems.map((item) => {
        const isActive = activePath === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              transition: 'all 0.2s ease',
              flex: 1,
              minWidth: 0
            }}
          >
            <div style={{
              color: isActive ? '#10b981' : '#6b7280',
              transition: 'color 0.2s ease'
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#10b981' : '#6b7280',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default UserBottomNavigation;




