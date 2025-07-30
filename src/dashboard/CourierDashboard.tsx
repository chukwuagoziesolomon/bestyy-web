import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import CourierDashboardHome from './CourierDashboardHome';
import MobileCourierDashboard from './MobileCourierDashboard';

const CourierDashboard: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileCourierDashboard />;
  }
  
  // Use desktop component for desktop view
  return <CourierDashboardHome />;
};

export default CourierDashboard;
