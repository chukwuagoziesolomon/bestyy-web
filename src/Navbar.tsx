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
      <img src="/logo.png" alt="Bestie Logo" className="logo" />
    </div>
    
    <div className="navbar-right">
      <a href="/login" className="hero__cta">Login/Signup</a>
    </div>
  </nav>
);

export default Navbar; 