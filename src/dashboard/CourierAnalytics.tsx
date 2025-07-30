import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import AnalyticsPage from './AnalyticsPage';
import MobileCourierAnalytics from './MobileCourierAnalytics';

const CourierAnalytics: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileCourierAnalytics />;
  }
  
  // Use desktop component for desktop view (can be customized later)
  return <AnalyticsPage />;
};

export default CourierAnalytics;
