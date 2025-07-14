import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const UserDashboardLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Nunito Sans, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '0 0 0 0', background: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0 0 0' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout; 