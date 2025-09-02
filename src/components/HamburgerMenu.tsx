import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, MapPin, CreditCard, UserPlus, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
}

interface HamburgerMenuProps {
  color?: string;
  size?: number;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  color = "#6c757d", 
  size = 24 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <MapPin size={20} color="#6b7280" />,
      path: '/user/dashboard'
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: <CreditCard size={20} color="#6b7280" />,
      path: '/user/orders'
    },
    {
      id: 'addresses',
      label: 'Saved Addresses',
      icon: <MapPin size={20} color="#6b7280" />,
      path: '/user/addresses'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <UserPlus size={20} color="#6b7280" />,
      path: '/user/favorites'
    },
    {
      id: 'profile-settings',
      label: 'Profile Settings',
      icon: <Settings size={20} color="#6b7280" />,
      path: '/user/settings'
    },
    {
      id: 'help-support',
      label: 'Help & Support',
      icon: <HelpCircle size={20} color="#6b7280" />,
      action: () => {
        // Handle help & support action
        console.log('Help & Support clicked');
        setIsOpen(false);
      }
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut size={20} color="#ef4444" />,
      action: () => {
        // Handle logout action
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
        setIsOpen(false);
      }
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
      setIsOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? (
          <X size={size} color={color} />
        ) : (
          <Menu size={size} color={color} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 998
            }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Dropdown */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              minWidth: '220px',
              zIndex: 999,
              marginTop: '8px',
              overflow: 'hidden'
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: item.id === 'logout' ? '#ef4444' : '#374151',
                  borderBottom: index < menuItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                  transition: 'background-color 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HamburgerMenu;
