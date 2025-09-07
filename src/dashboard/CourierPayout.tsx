import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import MobileCourierPayout from './MobileCourierPayout';
import DesktopCourierPayout from './DesktopCourierPayout';

const CourierPayout: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileCourierPayout />;
  }
  
  // Use desktop courier component for desktop view
  return <DesktopCourierPayout />;
};

export default CourierPayout;
