import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import PayoutsPage from './PayoutsPage';
import MobileCourierPayout from './MobileCourierPayout';

const CourierPayout: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileCourierPayout />;
  }
  
  // Use desktop component for desktop view
  return <PayoutsPage />;
};

export default CourierPayout;
