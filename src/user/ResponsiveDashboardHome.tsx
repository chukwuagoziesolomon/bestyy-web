import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserDashboardHome from './UserDashboardHome';
import MobileDashboardHome from './MobileDashboardHome';

const ResponsiveDashboardHome: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // TEMPORARY: Force mobile view for testing - REMOVE THIS LATER
  const forceMobile = window.innerWidth < 1200; // Temporarily force mobile for larger screens
  
  // Use mobile component for mobile, tablet, or forced mobile view
  if (isMobile || isTablet || forceMobile) {
    return <MobileDashboardHome />;
  }
  
  // Use desktop component for desktop view
  return <UserDashboardHome />;
};

export default ResponsiveDashboardHome;
