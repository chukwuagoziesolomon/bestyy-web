import React from 'react';
import { Home, Book, MapPin, CreditCard, Star, HelpCircle, User, HeadphonesIcon } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const navLinks = [
  { label: 'Overview', path: '/user/dashboard', icon: <Home size={20} /> },
  { label: 'My Orders', path: '/user/orders', icon: <Book size={20} /> },
  { label: 'Saved Addresses', path: '/user/addresses', icon: <MapPin size={20} /> },
  { label: 'Payment Methods', path: '/user/payments', icon: <CreditCard size={20} /> },
  { label: 'Favorites', path: '/user/favorites', icon: <Star size={20} /> },
];

const bottomLinks = [
  { label: 'Profile Settings', path: '/user/settings', icon: <User size={20} /> },
  { label: 'Help/Support', path: '/user/help', icon: <HeadphonesIcon size={20} /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside style={{
      width: 260,
      background: '#fff',
      minHeight: '100vh',
      borderRight: '1.5px solid #f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Nunito Sans, sans-serif',
      padding: '32px 0 24px 0',
      position: 'relative',
    }}>
      {/* Logo */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        padding: '0 32px', 
        marginBottom: 36,
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: 24
      }}>
        <img 
          src="/logo.png" 
          alt="Bestie Logo" 
          style={{ 
            width: 100, 
            height: 38,
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))'
          }} 
        />
      </div>
      {/* Nav Links */}
      <nav style={{ flex: 1 }}>
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '0.85rem 2.2rem', borderRadius: 8,
              textDecoration: 'none', color: location.pathname === link.path ? '#fff' : '#222',
              background: location.pathname === link.path ? '#10b981' : 'none',
              fontWeight: 600, fontSize: 16, marginBottom: 2,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Subscription Link */}
      <Link
        to="/plans"
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '0.85rem 2.2rem', borderRadius: 8,
          textDecoration: 'none', color: location.pathname === '/plans' ? '#fff' : '#222',
          background: location.pathname === '/plans' ? '#10b981' : 'none',
          fontWeight: 600, fontSize: 16, marginBottom: 8, marginTop: 8,
          transition: 'background 0.2s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}><CreditCard size={20} /></span>
        Subscription
      </Link>
      {/* Bottom Links */}
      <div style={{ marginTop: 14 }}>
        {bottomLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 2.2rem', borderRadius: 8,
              textDecoration: 'none', color: location.pathname === link.path ? '#fff' : '#222',
              background: location.pathname === link.path ? '#10b981' : 'none',
              fontWeight: 600, fontSize: 16, marginBottom: 2,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
      {/* Remove in-sidebar WhatsApp button: now handled globally as floating chat */}
    </aside>
  );
};

export default Sidebar; 