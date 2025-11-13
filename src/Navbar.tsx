import React from 'react';
import './Navbar.css';
import './HeroSection.css';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => (
  <nav className="navbar">
    <div className="navbar-left">
      <img src="/logo.png" alt="Bestyy Logo" className="logo" />
    </div>
    
    <div className="navbar-right">
      <a href="/login" className="hero__cta" style={{display: 'inline-block', padding: '0.9rem 2.2rem', fontSize: '1.15rem'}}>Login/Signup</a>
    </div>
  </nav>
);

export default Navbar; 