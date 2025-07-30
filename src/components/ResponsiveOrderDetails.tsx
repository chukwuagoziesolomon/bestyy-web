import React from 'react';
import { useParams } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import OrderDetailsPage from '../user/OrderDetailsPage';

const ResponsiveOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  console.log('ResponsiveOrderDetails - Device detection:', { isMobile, isTablet, isDesktop, orderId });

  // For mobile and tablet, show the mobile order details page
  if (isMobile || isTablet) {
    console.log('Rendering mobile OrderDetailsPage with orderId:', orderId);
    return <OrderDetailsPage orderId={orderId} />;
  }

  // For desktop, show a desktop-appropriate view or redirect
  console.log('Desktop view - showing desktop order details');
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontSize: '18px',
      color: '#666'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Order Details</h2>
        <p>Desktop view for Order #{orderId}</p>
        <p>This would show the desktop version of order details</p>
      </div>
    </div>
  );
};

export default ResponsiveOrderDetails;
