import React, { ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, List, Utensils, Archive, BarChart2, CreditCard, User, Table, LogOut } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useResponsive } from '../hooks/useResponsive';
import { getThumbnailUrl } from '../services/cloudinaryService';
import { useAuth } from '../context/AuthContext';
import ChatWithBestie from '../components/ChatWithBestie';

interface VendorDashboardLayoutProps {
  children?: ReactNode;
}

interface LinkItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const mainLinks: LinkItem[] = [
  { label: 'Dashboard', path: '/vendor/dashboard', icon: <Home size={20} /> },
  { label: 'Food Orders', path: '/vendor/orders', icon: <List size={20} /> },
  { label: 'Menu', path: '/vendor/menu', icon: <Utensils size={20} /> },
  { label: 'Item Stock', path: '/vendor/stock', icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 32, height: 32 }}><Table size={18} color="#222" /></span> },
  { label: 'Reports and Analytics', path: '/vendor/analytics', icon: <BarChart2 size={20} /> },
];

const bottomLinks = [
  { label: 'Subscription', path: '/plans', icon: <CreditCard size={20} /> },
  { label: 'Payouts', path: '/vendor/payouts', icon: <CreditCard size={20} /> },
  { label: 'Profile Settings', path: '/vendor/profile', icon: <User size={20} /> },
];

const VendorDashboardLayout: React.FC<VendorDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const { user } = useAuth();

  // Get business name and business logo from localStorage
  let businessName = '';
  let businessLogo = '';
  const savedVendor = localStorage.getItem('vendor_profile');
  if (savedVendor) {
    try {
      const vendor = JSON.parse(savedVendor);
      businessName = vendor.business_name || '';
      businessLogo = vendor.logo || vendor.businessLogo || '';
    } catch (e) {}
  }
  
  // Fallback to businessLogo from localStorage if not in vendor_profile
  if (!businessLogo) {
    businessLogo = localStorage.getItem('businessLogo') || '';
  }

  // Mobile/Tablet view - render outlet directly without sidebar
  if (isMobile || isTablet) {
    return (
      <div style={{
        maxWidth: '100vw',
        overflowX: 'hidden',
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <Outlet />
      </div>
    );
  }

  // Desktop view with sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', position: 'relative' }}>
      <aside style={{ width: 240, background: '#fff', borderRight: '1px solid #eee', padding: '2rem 1.2rem 1.2rem 1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 32, letterSpacing: 1 }}>
            <img src="/logo.png" alt="Bestie Logo" style={{ height: 40, marginBottom: 8 }} />
          </div>
          {mainLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1.1rem', borderRadius: 8,
                textDecoration: 'none', color: location.pathname === link.path ? '#fff' : '#222',
                background: location.pathname === link.path ? 'linear-gradient(to right, #34e7e4, #10b981)' : 'none',
                fontWeight: 600, fontSize: 16, marginBottom: 2
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          {bottomLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1.1rem', borderRadius: 8,
                textDecoration: 'none', color: location.pathname === link.path ? '#fff' : '#222',
                background: location.pathname === link.path ? 'linear-gradient(to right, #34e7e4, #10b981)' : 'none',
                fontWeight: 600, fontSize: 16, marginBottom: 2
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1.1rem', borderRadius: 8,
              border: 'none', background: 'none', cursor: 'pointer',
              color: '#ef4444', fontWeight: 600, fontSize: 16, width: '100%', textAlign: 'left'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}><LogOut size={20} /></span>
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh', padding: '0.5rem 2.5rem 2.5rem 2.5rem' }}>
        <DashboardNavbar
          profileImageSrc={businessLogo ? getThumbnailUrl(businessLogo, 48) : ""}
          initials={businessName?.[0] || 'V'}
          userId={user?.id}
          userType={user?.role}
          businessName={businessName}
          showSearchBar={false}
          showDarkMode={false}
        />
        <Outlet />
      </main>
      {/* Floating Chat button */}
      <ChatWithBestie />
    </div>
  );
}

export default VendorDashboardLayout; 