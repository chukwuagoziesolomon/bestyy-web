import React, { useState } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
    localStorage.setItem('cookieConsent', 'true');
  };

  if (!isVisible || localStorage.getItem('cookieConsent') === 'true') {
    return null;
  }

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <p>We use cookies to improve your experience. By using our site, you agree to our use of cookies.</p>
        <button onClick={handleAccept} className="cookie-consent__button">Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;
