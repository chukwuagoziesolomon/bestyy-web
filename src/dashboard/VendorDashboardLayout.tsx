import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, List, Utensils, Archive, BarChart2, CreditCard, User, Table } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const mainLinks = [
  { label: 'Dashboard', path: '/vendor/dashboard', icon: <Home size={20} /> },
  { label: 'Food Orders', path: '/vendor/dashboard/orders', icon: <List size={20} /> },
  { label: 'Menu', path: '/vendor/dashboard/menu', icon: <Utensils size={20} /> },
  { label: 'Item Stock', path: '/vendor/dashboard/stock', icon: <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f2', borderRadius: '50%', width: 32, height: 32 }}><Table size={18} color="#222" /></span> },
  { label: 'Reports and Analytics', path: '/vendor/dashboard/analytics', icon: <BarChart2 size={20} /> },
];

const bottomLinks = [
  { label: 'Payouts', path: '/vendor/dashboard/payouts', icon: <CreditCard size={20} /> },
  { label: 'Profile Settings', path: '/vendor/dashboard/profile', icon: <User size={20} /> },
];

function VendorDashboardLayout() {
  const location = useLocation();
  // Get business logo and name from localStorage vendor_profile
  let businessLogo = '';
  let businessName = '';
  const savedVendor = localStorage.getItem('vendor_profile');
  if (savedVendor) {
    try {
      const vendor = JSON.parse(savedVendor);
      businessLogo = vendor.logo || '';
      businessName = vendor.business_name || '';
    } catch (e) {}
  }
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
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
        </div>
      </aside>
      <main style={{ flex: 1, background: '#f8fafc', minHeight: '100vh', padding: '0.5rem 2.5rem 2.5rem 2.5rem' }}>
        <DashboardNavbar
          profileImageSrc={businessLogo || ""}
          initials={businessName ? businessName[0] : 'V'}
        />
        <Outlet />
      </main>
    </div>
  );
}

export default VendorDashboardLayout; 