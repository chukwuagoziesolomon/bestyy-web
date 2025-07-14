import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__content">
      <span>© {new Date().getFullYear()} Bestie. All rights reserved.</span>
      <nav className="footer__links">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
      </nav>
    </div>
  </footer>
);

export default Footer; 