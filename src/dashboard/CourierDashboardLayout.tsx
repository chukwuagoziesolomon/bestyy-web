import React, { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import { Home, List, BarChart3, Wallet, Settings } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import ChatWithBestie from '../components/ChatWithBestie';

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
  const { user } = useAuth();

  // For mobile and tablet, render content directly without sidebar
  if (isMobile || isTablet) {
    return <Outlet />;
  }

  // Desktop layout with sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Nunito Sans, sans-serif', position: 'relative' }}>
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
          <Link to="/courier/dashboard" style={sidebarLinkStyle(location.pathname === '/courier/dashboard')}>
            <Home size={20} />
            Dashboard
          </Link>
          <Link to="/courier/deliveries" style={sidebarLinkStyle(location.pathname === '/courier/deliveries')}>
            <List size={20} />
            Delivery List
          </Link>
          <Link to="/courier/analytics" style={sidebarLinkStyle(location.pathname === '/courier/analytics')}>
            <BarChart3 size={20} />
            Reports and Analytics
          </Link>
        </nav>
        <div style={{ marginTop: 32 }}>
          <Link to="/plans" style={sidebarLinkStyle(location.pathname === '/plans')}>
            <Wallet size={20} />
            Subscription
          </Link>
          <Link to="/courier/payouts" style={sidebarLinkStyle(location.pathname === '/courier/payouts')}>
            <Wallet size={20} />
            Payouts
          </Link>
          <Link to="/courier/profile" style={sidebarLinkStyle(location.pathname === '/courier/profile')}>
            <Settings size={20} />
            Profile Settings
          </Link>
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh', padding: '0.5rem 2.5rem 2.5rem 2.5rem' }}>
        <DashboardNavbar
          userId={user?.id}
          userType={user?.role}
        />
        <Outlet />
      </main>
      <ChatWithBestie />
    </div>
  );
};

export default CourierDashboardLayout; 