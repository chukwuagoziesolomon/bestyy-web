import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserBookings from './UserBookings';
import MobileBookingsPage from './MobileBookingsPage';

const ResponsiveBookings: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // TEMPORARY: Force mobile view for testing - REMOVE THIS LATER
  const forceMobile = window.innerWidth < 1200; // Temporarily force mobile for larger screens
  
  // Use mobile component for mobile, tablet, or forced mobile view
  if (isMobile || isTablet || forceMobile) {
    return <MobileBookingsPage />;
  }
  
  // Use desktop component for desktop view
  return <UserBookings />;
};

export default ResponsiveBookings;
