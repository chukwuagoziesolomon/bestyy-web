import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import MobileDashboardHome from './MobileDashboardHome';
import MobileOrdersPage from './MobileOrdersPage';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    console.log('Checking if mobile...');
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 900;
      console.log('Window width:', window.innerWidth, 'Is mobile:', mobile);
      setIsMobile(mobile);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
}

const UserDashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  console.log('UserDashboardLayout rendering...');
  console.log('isMobile:', isMobile);
  console.log('Current path:', location.pathname);
  
  if (isMobile) {
    console.log('Rendering mobile view...');
    if (location.pathname.startsWith('/user/dashboard/orders')) {
      console.log('Rendering MobileOrdersPage');
      return <MobileOrdersPage />;
    }
    console.log('Rendering MobileDashboardHome');
    return <MobileDashboardHome />;
  }
  
  return (
    <div className="user-dashboard-layout">
      <Sidebar />
      <main style={{ flex: 1, padding: '0 0 0 0', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0 0 0' }}>
          <Outlet context={{ isMobile }} />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;