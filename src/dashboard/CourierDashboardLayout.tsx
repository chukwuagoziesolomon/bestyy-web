import React, { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';

interface CourierDashboardLayoutProps {
  children?: ReactNode;
}

function sidebarLinkStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 14, padding: '0.85rem 2.2rem', borderRadius: 8,
    textDecoration: 'none', color: active ? '#fff' : '#222',
    background: active ? '#10b981' : 'none',
    fontWeight: 600, fontSize: 16, marginBottom: 2,
    transition: 'background 0.2s',
  };
}

const CourierDashboardLayout: React.FC<CourierDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isMobile, isTablet } = useResponsive();

  // For mobile and tablet, render content directly without sidebar
  if (isMobile || isTablet) {
    return <Outlet />;
  }

  // Desktop layout with sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Nunito Sans, sans-serif' }}>
      <aside style={{
        width: 240,
        background: '#fff',
        minHeight: '100vh',
        borderRight: '1.5px solid #f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Nunito Sans, sans-serif',
        padding: '32px 0 24px 0',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 32px', marginBottom: 36 }}>
          <img src="/logo.png" alt="Bestie Logo" style={{ width: 54, height: 'auto' }} />
        </div>
        <nav style={{ flex: 1 }}>
          <Link to="/courier/dashboard" style={sidebarLinkStyle(location.pathname === '/courier/dashboard')}>Dashboard</Link>
          <Link to="/courier/delivery-list" style={sidebarLinkStyle(location.pathname === '/courier/delivery-list')}>Delivery List</Link>
          <Link to="/courier/analytics" style={sidebarLinkStyle(location.pathname === '/courier/analytics')}>Reports and Analytics</Link>
        </nav>
        <div style={{ marginTop: 32 }}>
          <Link to="/courier/payouts" style={sidebarLinkStyle(location.pathname === '/courier/payouts')}>Payouts</Link>
          <Link to="/courier/profile" style={sidebarLinkStyle(location.pathname === '/courier/profile')}>Profile Settings</Link>
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default CourierDashboardLayout; 