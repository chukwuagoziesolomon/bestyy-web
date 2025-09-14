import React from 'react';
import './Navbar.css';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => (
  <nav className="navbar">
    <div className="navbar-left">
      <img src="/logo.png" alt="Bestyy Logo" className="logo" />
    </div>
    
    <div className="navbar-center">
      <a href="#how-it-works" className="nav-link">How It Works</a>
    </div>
    
    <div className="navbar-right">
      <a href="/login" className="login-btn">Login/Signup</a>
    </div>
  </nav>
);

export default Navbar; 