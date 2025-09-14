import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import CourierAnalytics from './CourierAnalytics';
import MobileCourierAnalytics from './MobileCourierAnalytics';

const ResponsiveCourierAnalytics: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();

  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileCourierAnalytics />;
  }

  // Use desktop component for desktop view
  return <CourierAnalytics />;
};

export default ResponsiveCourierAnalytics;
