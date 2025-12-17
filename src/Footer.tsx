import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const handleSocialClick = (platform: string) => {
    console.log(`${platform} clicked`);
  };

  return (
    <footer className={`footer ${className}`}>
      <div className="footer-container">
        {/* Navigation Section */}
        <div className="footer-section">
          <h3 className="nav-item">
            <a href="/">HOME</a> <span className="superscript">4</span>
          </h3>
          <h3 className="nav-item">
            <a href="/#how-it-works">HOW IT WORKS</a> <span className="superscript">27</span>
          </h3>
          <h3 className="nav-item">
            <a href="/#features">FEATURES</a>
          </h3>
          <h3 className="nav-item">
            <a href="/#faq">FAQ'S</a>
          </h3>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact-section">
          <p className="contact-item">
            <a href="tel:+2349132518599">+234 913 251 8599</a>
          </p>
          <p className="contact-item">
            <a href="mailto:info@bestyyexpress.com">info@bestyyexpress.com</a>
          </p>
          <p className="contact-item">
            <a href="mailto:support@bestyyexpress.com">support@bestyyexpress.com</a>
          </p>
          <a
            className="whatsapp-link"
            href="https://wa.me/2349132518599"
            target="_blank"
            rel="noopener noreferrer"
          >
            Whatsapp
            <span className="arrow">↗</span>
          </a>
        </div>

        {/* Partners Section */}
        <div className="footer-section partner-section">
          <span>Become Partners</span>
        </div>
      </div>

      {/* Social Icons - Left Side */}
      <div className="social-icons">
        <button
          className="social-icon"
          onClick={() => handleSocialClick('facebook')}
          aria-label="Facebook"
        >
          <svg viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
        
        <button
          className="social-icon"
          onClick={() => handleSocialClick('twitter')}
          aria-label="Twitter"
        >
          <svg viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </button>
        
        <button
          className="social-icon"
          onClick={() => handleSocialClick('pinterest')}
          aria-label="Pinterest"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.128.155.145.291.108.448-.118.495-.38 1.555-.432 1.772-.068.283-.225.343-.517.206-1.932-.896-3.135-3.711-3.135-5.973 0-3.772 2.749-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
          </svg>
        </button>
      </div>

      {/* Footer Bottom - Right Side */}
      <div className="footer-bottom">
        <a className="privacy-link" href="/terms">Privacy</a>
        
        <button
          className="behance-icon"
          onClick={() => handleSocialClick('behance')}
          aria-label="Behance"
        >
          <svg viewBox="0 0 24 24">
            <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.67 1.42.67 2.29 0 .75-.13 1.39-.4 1.93-.27.54-.65.99-1.14 1.34-.49.35-1.08.62-1.78.79-.7.17-1.48.25-2.34.25H0V4.51h6.938v-.007zM3.495 8.876h2.768c.384 0 .686-.1.902-.3.216-.2.324-.54.324-.99 0-.46-.108-.8-.324-1-.216-.2-.518-.3-.902-.3H3.495v2.59zM3.495 14.655h3.24c.446 0 .824-.15 1.137-.45.313-.3.47-.75.47-1.34 0-.58-.157-1.04-.47-1.35-.313-.31-.69-.46-1.137-.46H3.495v3.6zM24 13.516c0 .12-.037.37-.11.75h-6.939c.061.677.311 1.17.75 1.47.439.3.99.45 1.649.45.678 0 1.26-.2 1.75-.61.49-.41.77-.92.84-1.54h2.309c-.241 1.23-.77 2.2-1.59 2.93-.82.73-1.89 1.09-3.21 1.09-1.15 0-2.14-.25-2.97-.74-.83-.49-1.46-1.18-1.9-2.07-.44-.89-.66-1.93-.66-3.12 0-1.18.22-2.22.66-3.11.44-.89 1.07-1.58 1.9-2.07.83-.49 1.82-.74 2.97-.74 1.12 0 2.09.24 2.91.71.82.47 1.44 1.13 1.87 1.98.43.85.64 1.84.64 2.97v.02h-.001zm-2.64-1.83c-.061-.64-.291-1.14-.69-1.5-.399-.36-.91-.54-1.529-.54-.61 0-1.11.17-1.5.51-.39.34-.65.81-.78 1.41h4.499v.12z"/>
          </svg>
        </button>
        
        <span className="copyright">© 2025 — Copyright</span>
      </div>
    </footer>
  );
};

export default Footer;