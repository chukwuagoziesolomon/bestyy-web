import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import MobileDashboardHome from './MobileDashboardHome';
import MobileOrdersPage from './MobileOrdersPage';
import { useResponsive } from '../hooks/useResponsive';



const UserDashboardLayout: React.FC = () => {
  const { isMobile, isTablet, windowSize } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();

  // TEMPORARY: Force mobile view for testing - REMOVE THIS LATER
  const forceMobile = window.innerWidth < 1200; // Temporarily force mobile for larger screens

  // Debug logs
  useEffect(() => {
    console.log('UserDashboardLayout - windowSize:', windowSize);
    console.log('UserDashboardLayout - isMobile:', isMobile);
    console.log('UserDashboardLayout - isTablet:', isTablet);
    console.log('UserDashboardLayout - forceMobile:', forceMobile);
    console.log('UserDashboardLayout - Current path:', location.pathname);
  }, [isMobile, isTablet, location.pathname, windowSize, forceMobile]);
  
  // Redirect to appropriate view based on device
  useEffect(() => {
    if (isMobile || isTablet || forceMobile) {
      if (!location.pathname.startsWith('/user/dashboard')) {
        console.log('Redirecting to mobile/tablet home...');
        navigate('/user/dashboard');
      }
    }
  }, [isMobile, isTablet, forceMobile, location.pathname, navigate]);

  // Mobile or Tablet view (including forced mobile for testing)
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