import { ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveLayoutProps {
  mobileView: ReactNode;
  desktopView: ReactNode;
  tabletView?: ReactNode; // Optional, will use mobileView if not provided
}

export const ResponsiveLayout = ({
  mobileView,
  desktopView,
  tabletView,
}: ResponsiveLayoutProps) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile) {
    return <>{mobileView}</>;
  }

  if (isTablet) {
    return <>{tabletView || mobileView}</>;
  }

  if (isDesktop) {
    return <>{desktopView}</>;
  }

  // Default to desktop view during SSR/initial render
  return <>{desktopView}</>;
};
