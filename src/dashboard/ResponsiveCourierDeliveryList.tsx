import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import DeliveryListPage from './DeliveryListPage';
import MobileCourierDeliveryList from './MobileCourierDeliveryList';

const ResponsiveCourierDeliveryList: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileCourierDeliveryList />;
  }
  
  // Use desktop component for desktop view
  return <DeliveryListPage />;
};

export default ResponsiveCourierDeliveryList;
