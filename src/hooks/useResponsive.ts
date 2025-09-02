import { useEffect, useState } from 'react';

export const useResponsive = () => {
  const [isClient, setIsClient] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // This ensures we're on the client
    setIsClient(true);
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Screen sizes - default to mobile to prevent flash
  const isMobile = isClient ? windowSize.width < 768 : true;
  const isTablet = isClient ? windowSize.width >= 768 && windowSize.width < 1024 : false;
  const isDesktop = isClient ? windowSize.width >= 1024 : false;
  const isMobileOrTablet = isMobile || isTablet;

  // Function to redirect to desktop dashboard
  const redirectToDesktop = (path: string = '/user/dashboard') => {
    if (isClient && isDesktop) {
      window.location.href = path;
    }
  };

  // Debug logging for screen size changes
  useEffect(() => {
    if (isClient) {
      console.log('useResponsive - Screen size changed:', {
        width: windowSize.width,
        isMobile,
        isTablet,
        isDesktop
      });
    }
  }, [windowSize.width, isMobile, isTablet, isDesktop, isClient]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    windowSize,
    redirectToDesktop,
  };
};
