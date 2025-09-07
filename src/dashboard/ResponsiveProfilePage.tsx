import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import MobileVendorProfile from './MobileVendorProfile';
import ProfilePage from './ProfilePage';

const ResponsiveProfilePage: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Use mobile component for mobile and tablet views
  if (isMobile || isTablet) {
    return <MobileVendorProfile />;
  }
  
  // Use desktop component for desktop view
  return <ProfilePage />;
};

export default ResponsiveProfilePage;
