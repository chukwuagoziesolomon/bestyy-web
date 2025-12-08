import React from 'react';
import { Search, Bell, Moon } from 'lucide-react';
import ProfileImage from './ProfileImage';
import NotificationBell from './NotificationBell';

interface DashboardNavbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  profileImageSrc?: string;
  showSearchBar?: boolean;
  showDarkMode?: boolean;
  showNotification?: boolean;
  showProfileImage?: boolean;
  initials?: string; // Add initials prop
  userId?: number; // Add userId for notifications
  userType?: string; // Add userType for notifications
  businessName?: string; // Add business name for welcome message
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  searchValue = '',
  onSearchChange,
  profileImageSrc,
  showSearchBar = true,
  showDarkMode = true,
  showNotification = true,
  showProfileImage = true,
  initials, // Add initials prop
  userId,
  userType,
  businessName,
}) => (
  <div style={{
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    marginTop: 0,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(16,24,40,0.06)',
    padding: '0.7rem 2rem',
    position: 'relative',
    zIndex: 2
  }}>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
      {showProfileImage && profileImageSrc && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #10b981',
          flexShrink: 0
        }}>
          <img
            src={profileImageSrc}
            alt="Business Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && initials) {
                parent.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                parent.style.display = 'flex';
                parent.style.alignItems = 'center';
                parent.style.justifyContent = 'center';
                parent.innerHTML = `<span style="color: white; font-weight: 600; font-size: 20px;">${initials}</span>`;
              }
            }}
          />
        </div>
      )}
      {businessName && (
        <div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#10b981',
            lineHeight: '1.2'
          }}>
            {businessName}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Business Dashboard
          </div>
        </div>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {showNotification && (
        userId && userType ? (
          <NotificationBell 
            userId={userId} 
            userType={userType}
            className="dashboard-notification-bell"
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(16,24,40,0.04)', cursor: 'pointer' }}>
            <Bell size={22} color="#555" />
          </div>
        )
      )}
    </div>
  </div>
);

export default DashboardNavbar; 