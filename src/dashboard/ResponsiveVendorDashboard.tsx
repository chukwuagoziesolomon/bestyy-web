import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import DashboardHome from './DashboardHome';
import MobileVendorDashboard from './MobileVendorDashboard';

const ResponsiveVendorDashboard: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileVendorDashboard />;
  }
  
  // Use desktop component for desktop view
  return <DashboardHome />;
};

export default ResponsiveVendorDashboard;
