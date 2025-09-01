import React, { useState, useEffect } from 'react';
import EditMenuItemPage from './EditMenuItemPage';
import MobileEditMenu from './MobileEditMenu';

const ResponsiveEditMenu: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile ? <MobileEditMenu /> : <EditMenuItemPage />;
};

export default ResponsiveEditMenu;
