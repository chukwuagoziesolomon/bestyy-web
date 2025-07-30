import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import AnalyticsPage from './AnalyticsPage';
import MobileAnalytics from './MobileAnalytics';

const ResponsiveAnalytics: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileAnalytics />;
  }
  
  // Use desktop component for desktop view
  return <AnalyticsPage />;
};

export default ResponsiveAnalytics;
