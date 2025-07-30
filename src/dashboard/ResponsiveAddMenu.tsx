import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import AddMenuItemPage from './AddMenuItemPage';
import MobileAddMenu from './MobileAddMenu';

const ResponsiveAddMenu: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileAddMenu />;
  }
  
  // Use desktop component for desktop view
  return <AddMenuItemPage />;
};

export default ResponsiveAddMenu;
