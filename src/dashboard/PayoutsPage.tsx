import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import MobileVendorPayout from './MobileVendorPayout';
import DesktopVendorPayout from './DesktopVendorPayout';

const PayoutsPage: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileVendorPayout />;
  }
  
  // Use desktop component for desktop view
  return <DesktopVendorPayout />;
};

export default PayoutsPage; 
