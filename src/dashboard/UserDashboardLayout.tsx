import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import MobileDashboardHome from '../user/MobileDashboardHome';
import MobileOrdersPage from '../user/MobileOrdersPage';
import { useResponsive } from '../hooks/useResponsive';

const UserDashboardLayout: React.FC = () => {
  const { isMobile, isTablet, windowSize } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug logs
  useEffect(() => {
    console.log('UserDashboardLayout - windowSize:', windowSize);
    console.log('UserDashboardLayout - isMobile:', isMobile);
    console.log('UserDashboardLayout - isTablet:', isTablet);
    console.log('UserDashboardLayout - Current path:', location.pathname);
  }, [isMobile, isTablet, location.pathname, windowSize]);
  
  // Mobile or Tablet view
  if (isMobile || isTablet) {
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
        {/* Add BottomNav for mobile */}
        <BottomNav />
      </div>
    );
  }
  
  // Desktop view
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
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
          <Outlet context={{ isMobile }} />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
