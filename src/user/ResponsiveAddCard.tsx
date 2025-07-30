import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserAddCard from './UserAddCard';
import MobileAddCardPage from './MobileAddCardPage';

const ResponsiveAddCard: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // TEMPORARY: Force mobile view for testing - REMOVE THIS LATER
  const forceMobile = window.innerWidth < 1200; // Temporarily force mobile for larger screens
  
  // Use mobile component for mobile, tablet, or forced mobile view
  if (isMobile || isTablet || forceMobile) {
    return <MobileAddCardPage />;
  }
  
  // Use desktop component for desktop view
  return <UserAddCard />;
};

export default ResponsiveAddCard;
