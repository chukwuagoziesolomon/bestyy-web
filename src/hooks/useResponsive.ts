import { useEffect, useState } from 'react';

export const useResponsive = () => {
  const [isClient, setIsClient] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
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

  // Screen sizes - use actual window size instead of defaulting to mobile
  const isMobile = isClient ? windowSize.width < 768 : windowSize.width < 768;
  const isTablet = isClient ? windowSize.width >= 768 && windowSize.width < 1024 : windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = isClient ? windowSize.width >= 1024 : windowSize.width >= 1024;
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
