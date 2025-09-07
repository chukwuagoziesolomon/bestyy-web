import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import MobileVendorOrders from './MobileVendorOrders';
import DesktopVendorOrders from './DesktopVendorOrders';

const ResponsiveVendorOrders: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileVendorOrders />;
  }
  
  // Use desktop component for larger screens
  return <DesktopVendorOrders />;
};

export default ResponsiveVendorOrders;
