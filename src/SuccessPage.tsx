import React from 'react';
import './SuccessPage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Determine user type from location state or default to vendor
  const userType = location.state?.userType || 'vendor';
  const dashboardRoute = userType === 'courier' ? '/courier/dashboard' : '/dashboard';
  return (
    <div className="success-bg">
      <div className="success-card">
        <img src="confetti.svg" alt="Confetti" className="success-confetti" />
        <div className="success-checkmark-wrapper">
          <div className="success-checkmark-circle">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="12" fill="#10b981" />
              <path d="M8 12.5l3 3 5-5" stroke="#fff" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
        </div>
        <div className="success-title">
          You’re All Set !
        </div>
        <div className="success-subtext">
          Thanks for signing up with bestie. We’re reviewing your information and will notify you as soon as your account is approved.
        </div>
        <div className="success-buttons">
          <button className="success-btn dashboard-btn" onClick={() => navigate(dashboardRoute)}>
            Continue to Dashboard
          </button>
          <button className="success-btn whatsapp-btn" onClick={() => window.open('https://wa.me/', '_blank')}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M23.47 19.37c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.06-2.54-.28-.68-.57-.59-.77-.6-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.54.17.23 2.42 3.7 5.87 5.04.82.32 1.46.51 1.96.65.82.26 1.57.22 2.16.13.66-.1 2.01-.82 2.3-1.61.28-.79.28-1.47.2-1.61-.08-.14-.31-.23-.65-.4z" fill="white"/></svg>
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage; 