import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import PayoutsPage from './PayoutsPage';
import MobilePayout from './MobilePayout';

const ResponsivePayout: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobilePayout />;
  }
  
  // Use desktop component for desktop view
  return <PayoutsPage />;
};

export default ResponsivePayout;
