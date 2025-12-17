import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Utensils, Table, BarChart2, CreditCard, User, LogOut } from 'lucide-react';

const mainLinks = [
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

const VendorSidebar: React.FC = () => {
  const location = useLocation();
  return (
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
  );
};

export default VendorSidebar;
