import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, MessageCircle, DollarSign, BarChart3, HelpCircle, Settings, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { API_URL, fetchVendorProfile } from '../api';

interface VendorHeaderProps {
  title?: string;
  showHamburger?: boolean;
  showBusinessName?: boolean;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({ title, showHamburger = true, showBusinessName = false }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const [vendorName, setVendorName] = useState('Vendor');
  const [initials, setInitials] = useState('V');

  // Fetch vendor profile from API on mount
  useEffect(() => {
    const loadVendorProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const profileData = await fetchVendorProfile(token);
        console.log('🔍 Fetched vendor profile from API:', profileData);

        // Extract business logo
        const logoUrl = profileData.logo;
        if (logoUrl) {
          const fullLogoUrl = logoUrl.startsWith('http') ? logoUrl :
                             logoUrl.startsWith('/') ? `${API_URL}${logoUrl}` : logoUrl;
          setProfilePic(fullLogoUrl);
          console.log('📸 Set profile pic from API:', fullLogoUrl);
          
          // Update localStorage
          localStorage.setItem('businessLogo', logoUrl);
        }

        // Extract business name
        const name = profileData.business_name || 'Vendor';
        setVendorName(name);
        if (name) {
          setInitials(name[0].toUpperCase());
        }

        // Update vendor_profile in localStorage
        localStorage.setItem('vendor_profile', JSON.stringify({
          business_name: profileData.business_name,
          logo: profileData.logo,
          businessLogo: profileData.logo,
          phone: profileData.phone,
          business_address: profileData.business_address,
          business_description: profileData.business_description,
          verification_status: profileData.verification_status
        }));

      } catch (error) {
        console.error('❌ Error fetching vendor profile:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    };

    loadVendorProfile();
  }, []);

  // Fallback: Load from localStorage
  const loadFromLocalStorage = () => {
    // Get profile picture (prioritize business logo) and business name
    let userProfilePic = '';
    let businessName = 'Vendor';
    let userInitials = 'V';
  
    console.log('🔍 Loading from localStorage...');
    
    // First, try to get business logo and name from vendor_profile
    const savedVendor = localStorage.getItem('vendor_profile');
    
    if (savedVendor) {
      try {
        const vendor = JSON.parse(savedVendor);
        businessName = vendor.business_name || vendor.businessName || businessName;
        
        // Try to get business logo first (what user uploads on profile page)
        const logoUrl = vendor.logo || vendor.businessLogo || vendor.business_logo;
        if (logoUrl) {
          userProfilePic = logoUrl.startsWith('http') ? logoUrl :
                          logoUrl.startsWith('/') ? `${API_URL}${logoUrl}` : logoUrl;
          console.log('📸 Using business logo from vendor_profile:', userProfilePic);
        }
      } catch (e) {
        console.error('Error parsing vendor_profile:', e);
      }
    }
    
    // Fallback to businessLogo from localStorage
    if (!userProfilePic) {
      const businessLogo = localStorage.getItem('businessLogo');
      if (businessLogo) {
        userProfilePic = businessLogo.startsWith('http') ? businessLogo :
                        businessLogo.startsWith('/') ? `${API_URL}${businessLogo}` : businessLogo;
        console.log('📸 Using businessLogo from localStorage:', userProfilePic);
      }
    }
    
    // Fallback to user profile picture
    if (!userProfilePic) {
      if (user?.profile_picture) {
        userProfilePic = user.profile_picture.startsWith('http') ? user.profile_picture :
                         user.profile_picture.startsWith('/') ? `${API_URL}${user.profile_picture}` : user.profile_picture;
        console.log('📸 Using user profile_picture from auth:', userProfilePic);
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            if (userData.profile_picture) {
              userProfilePic = userData.profile_picture.startsWith('http') ? userData.profile_picture :
                              userData.profile_picture.startsWith('/') ? `${API_URL}${userData.profile_picture}` : userData.profile_picture;
              console.log('📸 Using user profile_picture from localStorage:', userProfilePic);
            }
          } catch (e) {}
        }
      }
    }
    
    // Get user initials for fallback
    if (businessName && businessName !== 'Vendor') {
      userInitials = businessName[0].toUpperCase();
    } else if (user?.first_name) {
      userInitials = user.first_name[0].toUpperCase();
    } else if (user?.email) {
      userInitials = user.email[0].toUpperCase();
    }

    setProfilePic(userProfilePic);
    setVendorName(businessName);
    setInitials(userInitials);
  };

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

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('businessName');
    localStorage.removeItem('businessLogo');
    navigate('/login');
  };

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
          {showBusinessName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: 1,
              minWidth: 0,
              maxWidth: 'calc(100% - 100px)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: profilePic ? 'transparent' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                border: profilePic ? 'none' : '3px solid rgba(255, 255, 255, 0.9)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      display: 'block'
                    }}
                    onLoad={(e) => {
                      console.log('✅ Profile image loaded successfully:', profilePic);
                      e.currentTarget.style.display = 'block';
                    }}
                    onError={(e) => {
                      console.error('❌ Profile image failed to load:', profilePic);
                      e.currentTarget.style.display = 'none';
                      // Show initials when image fails
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const initialsDiv = document.createElement('div');
                        initialsDiv.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:18px;';
                        initialsDiv.textContent = initials;
                        parent.appendChild(initialsDiv);
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
                    {initials}
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
                flex: 1,
                minWidth: 0,
                overflow: 'hidden'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#10b981',
                  lineHeight: '1.2',
                  letterSpacing: '-0.5px',
                  textShadow: '0 1px 2px rgba(16, 185, 129, 0.1)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  display: 'block'
                }}>
                  {vendorName}
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
            userType="vendor"
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
                navigate('/vendor/payouts');
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
              <DollarSign size={20} color="#10b981" />
              Payout
            </button>
            
            <button
              onClick={() => {
                navigate('/vendor/analytics');
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
              <BarChart3 size={20} color="#10b981" />
              Analytics
            </button>

            <button
              onClick={() => {
                navigate('/vendor/profile');
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
              <Settings size={20} color="#10b981" />
              Profile Settings
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
                transition: 'all 0.2s ease',
                borderBottom: '1px solid #f3f4f6'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <MessageCircle size={20} color="#10b981" />
              Help & Support
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
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
                color: '#ef4444',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={20} color="#ef4444" />
              Logout
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

export default VendorHeader;