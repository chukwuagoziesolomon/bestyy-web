import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  DollarSign, 
  BarChart3, 
  HelpCircle, 
  Settings, 
  User,
  Bell,
  Search
} from 'lucide-react';

interface VendorMobileHeaderProps {
  title: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
}

const VendorMobileHeader: React.FC<VendorMobileHeaderProps> = ({
  title,
  showSearch = false,
  showNotifications = false,
  onSearch,
  onNotificationClick
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Get business info from localStorage
  useEffect(() => {
    const storedBusinessName = localStorage.getItem('businessName');
    const storedProfileImage = localStorage.getItem('businessLogo');
    
    if (storedBusinessName) {
      setBusinessName(storedBusinessName);
    }
    
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-dropdown]')) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('businessName');
    localStorage.removeItem('businessLogo');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div style={{
        background: 'white',
        padding: '20px 16px',
        borderBottom: '1px solid #e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}>

      {/* Header Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: showSearch ? '16px' : '0'
      }}>
        {/* Left Side - Title and Business Info */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            {title}
          </h1>
          {businessName && (
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: 0,
              fontWeight: '500'
            }}>
              {businessName}
            </p>
          )}
        </div>

        {/* Right Side - Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Notifications */}
          {showNotifications && (
            <button
              onClick={onNotificationClick}
              style={{
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Bell size={20} color="#6b7280" />
            </button>
          )}

          {/* Profile Picture / Hamburger Menu */}
          <div style={{ position: 'relative' }} data-dropdown>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: '#f3f4f6',
                border: '2px solid #e5e7eb',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <Menu size={20} color="#6b7280" />
              )}
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div style={{
                position: 'fixed',
                top: '80px',
                right: '16px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                border: '1px solid #e5e7eb',
                minWidth: '280px',
                maxWidth: '320px',
                zIndex: 9999,
                overflow: 'hidden',
                animation: 'slideDown 0.2s ease-out'
              }}>
                {/* Profile Section */}
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: profileImage ? `url(${profileImage})` : 'rgba(255,255,255,0.2)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.3)',
                    overflow: 'hidden'
                  }}>
                    {!profileImage && <User size={20} color="white" />}
                    {profileImage && (
                      <img
                        src={profileImage}
                        alt="Profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '2px'
                    }}>
                      {businessName || 'Vendor'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      opacity: 0.8
                    }}>
                      Business Account
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '12px 8px' }}>
                  <button
                    onClick={() => {
                      navigate('/plans');
                      setIsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      width: '100%',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.color = '#10b981';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      // Update icon color to green
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      // Reset icon color to gray
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#6b7280';
                    }}
                  >
                    <DollarSign size={16} color="#6b7280" />
                    Subscription
                  </button>

                  <button
                    onClick={() => {
                      navigate('/vendor/payouts');
                      setIsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      width: '100%',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.color = '#10b981';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      // Update icon color to green
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      // Reset icon color to gray
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#6b7280';
                    }}
                  >
                    <DollarSign size={16} color="#6b7280" />
                    Payout
                  </button>

                  <button
                    onClick={() => {
                      navigate('/vendor/analytics');
                      setIsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      width: '100%',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.color = '#10b981';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      // Update icon color to green
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      // Reset icon color to gray
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#6b7280';
                    }}
                  >
                    <BarChart3 size={16} color="#6b7280" />
                    Analytics
                  </button>

                  <button
                    onClick={() => {
                      // Navigate to help & support
                      setIsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      width: '100%',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.color = '#10b981';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      // Update icon color to green
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      // Reset icon color to gray
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#6b7280';
                    }}
                  >
                    <HelpCircle size={16} color="#6b7280" />
                    Help & Support
                  </button>

                  <button
                    onClick={() => {
                      navigate('/vendor/profile');
                      setIsMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#374151',
                      textAlign: 'left',
                      width: '100%',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.color = '#10b981';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      // Update icon color to green
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                      // Reset icon color to gray
                      const icon = e.currentTarget.querySelector('svg');
                      if (icon) icon.style.color = '#6b7280';
                    }}
                  >
                    <Settings size={16} color="#6b7280" />
                    Profile Settings
                  </button>

                  {/* Sign Out Button */}
                  <div style={{
                    borderTop: '1px solid #f3f4f6',
                    marginTop: '8px',
                    paddingTop: '8px'
                  }}>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#374151',
                        textAlign: 'left',
                        width: '100%',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                        marginBottom: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0fdf4';
                        e.currentTarget.style.color = '#10b981';
                        e.currentTarget.style.transform = 'translateX(4px)';
                        // Update icon color to green
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#10b981';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.transform = 'translateX(0)';
                        // Reset icon color to gray
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#6b7280';
                      }}
                    >
                      <User size={16} color="#6b7280" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <form onSubmit={handleSearch} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search 
              size={18} 
              color="#6b7280" 
              style={{
                position: 'absolute',
                left: '16px',
                zIndex: 1
              }} 
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '1px solid #e5e7eb',
                borderRadius: '25px',
                background: '#f9fafb',
                color: '#1f2937',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#10b981';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'scale(1)';
              }}
            />
            <input
              type="submit"
              value=""
              style={{
                position: 'absolute',
                right: '8px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#10b981',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>
        </form>
      )}
    </div>
    </>
  );
};

export default VendorMobileHeader;
