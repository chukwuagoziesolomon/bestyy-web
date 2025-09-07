import React from 'react';
import { Link } from 'react-router-dom';
import './TransparentSplitting.css';

const TransparentSplitting = () => {
  return (
    <div className="transparent-splitting">
      <div className="transparent-splitting__card">
        <div className="transparent-splitting__left">
          <h2>
            REAL-TIME 
            <span className="transparent-splitting__accent">FULLFILMENT</span>
          </h2>
          <h4 className="transparent-splitting__description">
          Once your booking is confirmed, Bestie connects with trusted couriers like Preshempire or Jennifer Adannaya to handle delivery. You’ll receive real-time updates, name of the rider, and how long it’ll take just like ordering from a premium delivery app, but it all happens in chat.

          </h4>
          <Link to="/login" className="transparent-splitting__cta">
            Get Started
          </Link>
        </div>
        
        <div className="transparent-splitting__center">
          <img 
            src="/image4.png" 
            alt="Payment splitting" 
            className="transparent-splitting__phone" 
          />
        </div>
        
        <div className="transparent-splitting__right">
          <div className="transparent-splitting__tip-card">
            <img 
              src="/emoji.png" 
              alt="Payment" 
              className="transparent-splitting__emoji" 
            />
            <span>Bestie breaks it down so you never overpay</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparentSplitting;
