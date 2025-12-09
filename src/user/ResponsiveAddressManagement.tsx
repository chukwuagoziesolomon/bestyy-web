import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import AddressManagement from './AddressManagement';
import MobileAddressManagement from './MobileAddressManagement';

const ResponsiveAddressManagement: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Force mobile view for testing - adjust threshold as needed
  const forceMobile = window.innerWidth < 1200;
  
  // Use mobile component for mobile, tablet, or forced mobile view
  if (isMobile || isTablet || forceMobile) {
    return <MobileAddressManagement />;
  }
  
  // Use desktop component for desktop view
  return <AddressManagement />;
};

export default ResponsiveAddressManagement;
