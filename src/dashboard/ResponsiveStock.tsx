import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import StockPage from './StockPage';
import MobileStock from './MobileStock';

const ResponsiveStock: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileStock />;
  }
  
  // Use desktop component for desktop view
  return <StockPage />;
};

export default ResponsiveStock;
