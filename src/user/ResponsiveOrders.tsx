import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserOrders from './UserOrders';
import MobileOrdersPage from './MobileOrdersPage';

const ResponsiveOrders: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile or tablet view
  if (isMobile || isTablet) {
    return <MobileOrdersPage />;
  }
  
  // Use desktop component for desktop view
  return <UserOrders />;
};

export default ResponsiveOrders;
