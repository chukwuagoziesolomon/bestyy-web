import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, List, BarChart3, CreditCard } from 'lucide-react';

interface CourierBottomNavigationProps {
  currentPath?: string;
}

const CourierBottomNavigation: React.FC<CourierBottomNavigationProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use provided currentPath or fall back to location.pathname
  const activePath = currentPath || location.pathname;

  const navItems = [
    {
      path: '/courier/dashboard',
      icon: <Home size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/courier/deliveries',
      icon: <List size={20} />,
      label: 'Delivery List'
    },
    {
      path: '/courier/analytics',
      icon: <BarChart3 size={20} />,
      label: 'Analytics'
    },
    {
      path: '/courier/payouts',
      icon: <CreditCard size={20} />,
      label: 'Payout'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      borderTop: '1px solid #e5e7eb',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 50
    }}>
      {navItems.map((item) => {
        const isActive = activePath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: isActive ? '#f0f9ff' : 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ color: isActive ? '#10b981' : '#9ca3af' }}>
              {item.icon}
            </div>
            <span style={{ 
              fontSize: '12px', 
              color: isActive ? '#10b981' : '#9ca3af', 
              fontWeight: isActive ? '600' : '500' 
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CourierBottomNavigation;
