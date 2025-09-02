import React from 'react';
import { useParams } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import OrderDetailsPage from '../user/OrderDetailsPage';
import DesktopOrderDetailsPage from '../user/DesktopOrderDetailsPage';

const ResponsiveOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  console.log('ResponsiveOrderDetails - Device detection:', { isMobile, isTablet, isDesktop, orderId });

  // For mobile and tablet, show the mobile order details page
  if (isMobile || isTablet) {
    console.log('Rendering mobile OrderDetailsPage with orderId:', orderId);
    return <OrderDetailsPage orderId={orderId} />;
  }

  // For desktop, show the desktop order details page
  console.log('Desktop view - showing desktop order details');
  return <DesktopOrderDetailsPage orderId={orderId} />;
};

export default ResponsiveOrderDetails;
