import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, MessageCircle } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

interface CourierHeaderProps {
  title?: string;
  showHamburger?: boolean;
  showCourierName?: boolean;
}

const CourierHeader: React.FC<CourierHeaderProps> = ({ title, showHamburger = true, showCourierName = false }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();

  // Get courier profile picture and name from localStorage
  let courierProfilePic = '/logo.png';
  let courierName = 'Courier';
  
  // Try to get from courier_profile in localStorage
  const savedCourier = localStorage.getItem('courier_profile') || localStorage.getItem('vendor_profile');
  if (savedCourier) {
    try {
      const courier = JSON.parse(savedCourier);
      courierName = courier.first_name || courier.full_name || courier.name || courierName;
      const profileImage = courier.profile_image || courier.profile_picture || courier.avatar || courier.logo;
      if (profileImage) {
        courierProfilePic = profileImage.startsWith('http') ? profileImage : 
                          profileImage.startsWith('/') ? `${API_URL}${profileImage}` : profileImage;
      }
    } catch (e) {
      // Fallback
    }
  }
  
  // Also check individual localStorage items
  const firstName = localStorage.getItem('first_name');
  if (firstName) {
    courierName = firstName;
  }
  
  const profilePic = localStorage.getItem('profile_picture') || localStorage.getItem('profile_image');
  if (profilePic) {
    courierProfilePic = profilePic.startsWith('http') ? profilePic : 
                       profilePic.startsWith('/') ? `${API_URL}${profilePic}` : profilePic;
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMenu && !target.closest('[data-menu]')) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flex: 1,
          minWidth: 0
        }}>
          {showCourierName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0
            }}>
              <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: courierProfilePic && courierProfilePic !== '/logo.png' ? 'transparent' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                  border: '3px solid rgba(255, 255, 255, 0.9)',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {courierProfilePic && courierProfilePic !== '/logo.png' ? (
                    <img
                      src={courierProfilePic}
                      alt={`${courierName}'s profile`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                          e.currentTarget.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 18px;';
                          fallback.textContent = courierName.charAt(0).toUpperCase();
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '18px'
                    }}>
                      {courierName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Subtle inner glow */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }} />
                </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#10b981',
                  lineHeight: '1.1',
                  letterSpacing: '-0.5px',
                  textShadow: '0 1px 2px rgba(16, 185, 129, 0.1)',
                  whiteSpace: 'nowrap'
                }}>
                  {courierName}
                </span>
              </div>
            </div>
          )}
          <div style={{
            height: '36px',
            width: '2px',
            background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
            borderRadius: '1px',
            opacity: 0.6,
            flexShrink: 0
          }} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              color: '#1f2937',
              letterSpacing: '-0.5px',
              lineHeight: '1.2'
            }}>
              Welcome
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              color: '#1f2937',
              letterSpacing: '-0.5px',
              lineHeight: '1.2'
            }}>
              back
            </span>
          </div>
        </div>

        {/* Notification Bell */}
        {user && (
          <NotificationBell
            userId={user.id}
            userType="courier"
            className="mobile-notification-bell"
          />
        )}

        {showHamburger && (
          <button
            data-menu
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: showMenu ? '#10b981' : 'rgba(16, 185, 129, 0.1)',
              border: showMenu ? 'none' : '1px solid rgba(16, 185, 129, 0.2)',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.3s ease',
              boxShadow: showMenu ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}
          >
           <Menu size={20} color={showMenu ? "#fff" : "#10b981"} />
         </button>
        )}
      </div>

      {/* Hamburger Menu Dropdown */}
      {showMenu && showHamburger && (
        <div 
          data-menu
          style={{
            position: 'fixed',
            top: '72px',
            right: '16px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            zIndex: 1000,
            minWidth: '200px',
            overflow: 'hidden',
            animation: 'slideIn 0.2s ease-out'
          }}
        >
          <div style={{
            padding: '8px 0'
          }}>
            <button
              onClick={() => {
                navigate('/courier/profile');
                setShowMenu(false);
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                color: '#374151',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                borderBottom: '1px solid #f3f4f6'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <User size={20} color="#10b981" />
              Profile
            </button>
            
            <button
              onClick={() => {
                setShowMenu(false);
                alert('Help & Support - Coming Soon!');
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                color: '#374151',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <MessageCircle size={20} color="#10b981" />
              Help & Support
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default CourierHeader;
