import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const UserDashboardLayout: React.FC = () => {
  return (
    <div className="user-dashboard-layout">
      <Sidebar className="sidebar-desktop" />
      <main style={{ flex: 1, padding: '0 0 0 0', background: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0 0 0' }}>
          <Outlet />
        </div>
      </main>
      <BottomNav className="bottom-nav-mobile" />
    </div>
  );
};

export default UserDashboardLayout; 