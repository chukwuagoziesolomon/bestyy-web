import React from 'react';
import { Search, Bell, Moon } from 'lucide-react';
import ProfileImage from './ProfileImage';
import NotificationBell from './NotificationBell';

interface DashboardNavbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  profileImageSrc: string;
  showSearchBar?: boolean;
  showDarkMode?: boolean;
  showNotification?: boolean;
  showProfileImage?: boolean;
  initials?: string; // Add initials prop
  userId?: number; // Add userId for notifications
  userType?: string; // Add userType for notifications
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
    {showSearchBar ? (
      <div style={{ width: 420, position: 'relative' }}>
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.9rem 2.5rem 0.9rem 2.5rem',
            borderRadius: 24,
            border: 'none',
            background: '#f8fafc',
            fontSize: 18,
            fontWeight: 500,
            color: '#222',
            outline: 'none',
            boxShadow: '0 1px 4px rgba(16,24,40,0.04)'
          }}
        />
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#bbb' }}>
          <Search size={20} />
        </span>
      </div>
    ) : <div />}
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {showDarkMode && (
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(16,24,40,0.04)', cursor: 'pointer' }}>
          <Moon size={22} color="#555" />
        </div>
      )}
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
      {showProfileImage && (
        <ProfileImage src={profileImageSrc} size={40} initials={initials} />
      )}
    </div>
  </div>
);

export default DashboardNavbar; 