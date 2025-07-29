import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import MobileDashboardHome from './MobileDashboardHome';
import MobileOrdersPage from './MobileOrdersPage';

// Debug component
const DebugInfo = ({ isMobile }: { isMobile: boolean }) => (
  <div style={{
    position: 'fixed',
    top: '10px',
    right: '10px',
    background: '#333',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: 1000
  }}>
    {isMobile ? 'Mobile' : 'Desktop'} View
  </div>
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
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
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return isMobile;
}

const UserDashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Debug logs
  useEffect(() => {
    console.log('UserDashboardLayout - isMobile:', isMobile);
    console.log('UserDashboardLayout - Current path:', location.pathname);
  }, [isMobile, location.pathname]);
  
  // Redirect to mobile home if on mobile and not on a mobile route
  useEffect(() => {
    if (isMobile && !location.pathname.startsWith('/user/dashboard')) {
      console.log('Redirecting to mobile home...');
      navigate('/user/dashboard');
    }
  }, [isMobile, location.pathname, navigate]);
  
  // Mobile view
  if (isMobile) {
    return (
      <div style={{ 
        maxWidth: '100vw', 
        overflowX: 'hidden',
        position: 'relative'
      }}>
        {process.env.NODE_ENV === 'development' && <DebugInfo isMobile={isMobile} />}
        
        {location.pathname.startsWith('/user/dashboard/orders') ? (
          <MobileOrdersPage />
        ) : (
          <MobileDashboardHome />
        )}
      </div>
    );
  }
  
  // Desktop view
  return (
    <div className="user-dashboard-layout" style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {process.env.NODE_ENV === 'development' && <DebugInfo isMobile={isMobile} />}
      
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