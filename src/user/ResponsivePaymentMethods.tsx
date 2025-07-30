import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserPaymentMethods from './UserPaymentMethods';
import MobilePaymentMethodsPage from './MobilePaymentMethodsPage';

const ResponsivePaymentMethods: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // TEMPORARY: Force mobile view for testing - REMOVE THIS LATER
  const forceMobile = window.innerWidth < 1200; // Temporarily force mobile for larger screens
  
  // Use mobile component for mobile, tablet, or forced mobile view
  if (isMobile || isTablet || forceMobile) {
    return <MobilePaymentMethodsPage />;
  }
  
  // Use desktop component for desktop view
  return <UserPaymentMethods />;
};

export default ResponsivePaymentMethods;
