import React, { Suspense } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import DesktopVendorDashboard from './DesktopVendorDashboard';

// Use dynamic import to avoid module resolution issues
const MobileVendorDashboard = React.lazy(() => import('./MobileVendorDashboardNew'));

const ResponsiveVendorDashboard: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return (
      <Suspense fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
          color: '#666'
        }}>
          Loading mobile dashboard...
        </div>
      }>
        <MobileVendorDashboard />
      </Suspense>
    );
  }
  
  // Use desktop component for desktop view
  return <DesktopVendorDashboard />;
};

export default ResponsiveVendorDashboard;
