import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import CourierProfile from './CourierProfile';
import MobileCourierProfile from './MobileCourierProfile';

const ResponsiveCourierProfile: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();

  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileCourierProfile />;
  }

  // Use desktop component for desktop view
  return <CourierProfile />;
};

export default ResponsiveCourierProfile;
