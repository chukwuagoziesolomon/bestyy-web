import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import OrdersPage from './OrdersPage';
import MobileOrdersList from './MobileOrdersList';

const ResponsiveOrders: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileOrdersList />;
  }
  
  // Use desktop component for desktop view
  return <OrdersPage />;
};

export default ResponsiveOrders;
