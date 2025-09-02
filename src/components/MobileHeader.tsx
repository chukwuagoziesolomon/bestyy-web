import React, { useRef, useState } from 'react';
import { ArrowLeft, Menu, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
  variant?: 'default' | 'compact' | 'elevated';
  profileImageSize?: 'small' | 'medium' | 'large';
  showProfileImage?: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  rightAction,
  variant = 'default',
  profileImageSize = 'medium',
  showProfileImage = true
}) => {
  const navigate = useNavigate();
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const getProfileImageSize = () => {
    switch (profileImageSize) {
      case 'small': return { width: 32, height: 32 };
      case 'medium': return { width: 40, height: 40 };
      case 'large': return { width: 48, height: 48 };
      default: return { width: 40, height: 40 };
    }
  };

  const getHeaderStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      backgroundColor: '#ffffff',
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
      width: '100%',
      boxSizing: 'border-box' as const,
    };

    switch (variant) {
      case 'compact':
        return {
          ...baseStyles,
          padding: '12px 16px',
          borderBottom: '1px solid #f1f5f9',
        };
      case 'elevated':
        return {
          ...baseStyles,
          padding: '20px 20px 16px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid #e2e8f0',
        };
      default:
        return {
          ...baseStyles,
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
        };
    }
  };

  const profileImageStyles = getProfileImageSize();
  
  // Get user profile image from localStorage or use default
  const userProfileImage = localStorage.getItem('profile_image') || localStorage.getItem('user_profile_image');
  const firstName = localStorage.getItem('first_name') || 'User';

  // Menu items for the hamburger menu
  const menuItems = [
    { label: 'Profile Settings', path: '/user/settings' },
    { label: 'Help & Support', action: () => console.log('Help clicked') },
    { 
      label: 'Logout', 
      action: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  ];

  return (
    <>
      <header style={getHeaderStyles()}>
        {/* Left Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1,
          minWidth: 0
        }}>
          {/* Profile Image or Logo */}
          {showProfileImage ? (
            <div 
              onClick={() => navigate('/user/settings')}
              style={{
                ...profileImageStyles,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {userProfileImage ? (
                <img
                  src={userProfileImage}
                  alt={`${firstName}'s profile`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    e.currentTarget.style.display = 'none';
                    if (fallbackRef.current) {
                      fallbackRef.current.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              {/* Fallback Avatar */}
              <div 
                ref={fallbackRef}
                style={{
                  display: userProfileImage ? 'none' : 'flex',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: profileImageSize === 'large' ? '18px' : profileImageSize === 'medium' ? '16px' : '14px',
                  fontWeight: '600'
                }}
              >
                {firstName.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <img
              src="/logo.png"
              alt="Bestie Logo"
              onClick={() => navigate('/user/dashboard')}
              style={{
                width: profileImageSize === 'large' ? 60 : profileImageSize === 'medium' ? 50 : 40,
                height: profileImageSize === 'large' ? 24 : profileImageSize === 'medium' ? 20 : 16,
                objectFit: 'contain',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          )}

          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={handleBackClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft size={20} color="#64748b" />
            </button>
          )}

          {/* Title Section */}
          <div style={{
            flex: 1,
            minWidth: 0,
            marginLeft: showBackButton ? '4px' : '0'
          }}>
            <h1 style={{
              fontSize: variant === 'compact' ? '18px' : '20px',
              fontWeight: 700,
              margin: 0,
              color: '#1e293b',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                margin: '2px 0 0 0',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          {rightAction}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: '#f8fafc',
              border: '2px solid #10b981',
              cursor: 'pointer',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s',
              color: '#64748b',
              zIndex: 101,
              position: 'relative',
              minWidth: '40px',
              minHeight: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#10b981';
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Dropdown Menu */}
      {isMenuOpen && (
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
              zIndex: 99
            }}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Dropdown */}
          <div
            style={{
              position: 'fixed',
              top: '80px',
              right: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              border: '2px solid #10b981',
              minWidth: '220px',
              zIndex: 9999,
              overflow: 'hidden'
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                  setIsMenuOpen(false);
                }}
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
                  color: item.label === 'Logout' ? '#ef4444' : '#374151',
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
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MobileHeader;
