import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import MobileDashboardHome from './MobileDashboardHome';
import MobileOrdersPage from './MobileOrdersPage';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const UserDashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  if (isMobile) {
    if (location.pathname.startsWith('/user/dashboard/orders')) {
      return <MobileOrdersPage />;
    }
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