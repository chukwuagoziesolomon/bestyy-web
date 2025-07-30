import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import MenuPage from './MenuPage';
import MobileMenu from './MobileMenu';

const ResponsiveMenu: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileMenu />;
  }
  
  // Use desktop component for desktop view
  return <MenuPage />;
};

export default ResponsiveMenu;
