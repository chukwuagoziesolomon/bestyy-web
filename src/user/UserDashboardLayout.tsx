import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Bell, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const UserDashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="user-dashboard-layout">
      {!isMobile && <Sidebar />}
      <main style={{ flex: 1, padding: '0 0 0 0', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0 0 0' }}>
          <Outlet context={{ isMobile }} />
        </div>
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
};

export default UserDashboardLayout;