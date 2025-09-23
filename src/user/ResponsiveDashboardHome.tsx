import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserDashboardHome from './UserDashboardHome';
import MobileDashboardHome from './MobileDashboardHome';

const ResponsiveDashboardHome: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  console.log('ResponsiveDashboardHome - isMobile:', isMobile, 'isTablet:', isTablet);
  console.log('ResponsiveDashboardHome - window.innerWidth:', window.innerWidth);
  
  // TEMPORARY: Force mobile view for testing - REMOVE THIS LATER
  const forceMobile = window.innerWidth < 1200; // Temporarily force mobile for larger screens
  console.log('ResponsiveDashboardHome - forceMobile:', forceMobile);
  
  // Use mobile component for mobile, tablet, or forced mobile view
  if (isMobile || isTablet || forceMobile) {
    console.log('ResponsiveDashboardHome - Rendering mobile view');
    return <MobileDashboardHome />;
  }
  
  // Use desktop component for desktop view
  console.log('ResponsiveDashboardHome - Rendering desktop view');
  return <UserDashboardHome />;
};

export default ResponsiveDashboardHome;
