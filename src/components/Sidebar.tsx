import React from 'react';
import { Home, Book, MapPin, CreditCard, Star, HelpCircle, User, MessageCircle } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const navLinks = [
  { label: 'Overview', path: '/user/dashboard', icon: <Home size={20} /> },
  { label: 'My Bookings', path: '/user/dashboard/bookings', icon: <Book size={20} /> },
  { label: 'Saved Addresses', path: '/user/dashboard/addresses', icon: <MapPin size={20} /> },
  { label: 'Payment Methods', path: '/user/dashboard/payments', icon: <CreditCard size={20} /> },
  { label: 'Favorite', path: '/user/dashboard/favorite', icon: <Star size={20} /> },
];

const bottomLinks = [
  { label: 'Help/Support', path: '/user/dashboard/help', icon: <HelpCircle size={20} /> },
  { label: 'Profile Settings', path: '/user/dashboard/profile', icon: <User size={20} /> },
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 32px', marginBottom: 36 }}>
        <img src="/logo.png" alt="Bestie Logo" style={{ width: 38, height: 38 }} />
        <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: 0.5, color: '#111' }}>BESTIE</span>
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
      {/* Bottom Links */}
      <div style={{ marginTop: 32 }}>
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
      {/* Chat With Besty Button */}
      <a
        href="https://wa.me/2340000000000" // Replace with actual WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 12, background: '#10b981', color: '#fff',
          fontWeight: 700, fontSize: 17, borderRadius: 8, padding: '14px 32px', textDecoration: 'none',
          margin: '32px 32px 0 32px', justifyContent: 'center',
        }}
      >
        <MessageCircle size={22} /> Chat With Besty
      </a>
    </aside>
  );
};

export default Sidebar; 