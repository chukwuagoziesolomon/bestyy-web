import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserBottomNavigation from '../components/UserBottomNavigation';
import MobileDashboardHome from '../user/MobileDashboardHome';
import MobileOrdersPage from '../user/MobileOrdersPage';
import { useResponsive } from '../hooks/useResponsive';
import ChatWithBestie from '../components/ChatWithBestie';

const UserDashboardLayout: React.FC = () => {
  const { isMobile, isTablet, windowSize } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug logs
  useEffect(() => {
    console.log('UserDashboardLayout - windowSize:', windowSize);
    console.log('UserDashboardLayout - isMobile:', isMobile);
    console.log('UserDashboardLayout - isTablet:', isTablet);
    console.log('UserDashboardLayout - isDesktop:', windowSize.width >= 1024);
    console.log('UserDashboardLayout - Current path:', location.pathname);
    console.log('UserDashboardLayout - window.innerWidth:', window.innerWidth);
    console.log('UserDashboardLayout - forceMobile:', window.innerWidth < 1200);
    console.log('UserDashboardLayout - Rendering desktop view:', !isMobile && !isTablet && window.innerWidth >= 1200);
  }, [isMobile, isTablet, location.pathname, windowSize]);
  
  // TEMPORARY: Force mobile view for testing - REMOVE THIS LATER
  const forceMobile = window.innerWidth < 1200; // Temporarily force mobile for larger screens
  
  // Mobile or Tablet view
  if (isMobile || isTablet || forceMobile) {
    return (
      <div style={{ 
        maxWidth: '100vw', 
        overflowX: 'hidden',
        position: 'relative',
        // Add some padding for tablet view
        padding: isTablet ? '0 20px' : '0',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        {/* Use Outlet for nested routes */}
        <Outlet context={{ isMobile, isTablet }} />
        {/* Add UserBottomNavigation for mobile - only if not already added by child component */}
      </div>
    );
  }
  
  // Desktop view
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      position: 'relative'
    }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '0', 
        minHeight: '100vh', 
        width: '100%',
        overflowY: 'auto'
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '40px 20px'
        }}>
          {/* Debug indicator */}
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#10b981',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 9999
          }}>
            Desktop View Active
          </div>
          <Outlet context={{ isMobile }} />
        </div>
      </main>
      <ChatWithBestie />
    </div>
  );
};

export default UserDashboardLayout;
