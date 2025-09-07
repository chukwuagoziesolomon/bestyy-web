import React from 'react';
import { Link } from 'react-router-dom';
import './SecureCompliant.css';

const SecureCompliant = () => {
  return (
    <div className="secure-compliant">
      <div className="secure-compliant__card">
        <div className="secure-compliant__left">
          <h2>
            SECURE, COMPLIANT &<br />
            <span className="secure-compliant__accent">TRUSTWORTHY</span>
          </h2>
          <p className="secure-compliant__description">
            At Bestie, we take your privacy and security seriously. Our platform is built with bank-level encryption and follows strict compliance standards to ensure your data is always protected.
          </p>
          <Link to="/login" className="secure-compliant__cta">
            Get Started
          </Link>
        </div>
        
        <div className="secure-compliant__center">
          <img 
            src="/image4.png" 
            alt="Secure chat interface" 
            className="secure-compliant__phone" 
          />
        </div>
        
        <div className="secure-compliant__right">
          <div className="secure-compliant__tip-card">
            <img 
              src="/emoji.png" 
              alt="Security" 
              className="secure-compliant__emoji" 
            />
            <span>Bestie Protects your info like a true best friend</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureCompliant;
