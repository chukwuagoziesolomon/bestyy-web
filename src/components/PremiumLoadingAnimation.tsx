import React from 'react';
import './PremiumLoadingAnimation.css';

interface PremiumLoadingAnimationProps {
  message?: string;
  fullScreen?: boolean;
}

const PremiumLoadingAnimation: React.FC<PremiumLoadingAnimationProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  return (
    <div className={`premium-loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      {/* Animated background orbs */}
      <div className="loading-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Main loading animation */}
      <div className="loading-content">
        {/* Animated ring with gradient */}
        <div className="animated-ring">
          <svg className="ring-svg" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradientRing)"
              strokeWidth="3"
              strokeDasharray="282.74"
              strokeDashoffset="0"
            />
            <defs>
              <linearGradient id="gradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Center dot with pulse */}
        <div className="loading-dot"></div>

        {/* Floating particles */}
        <div className="floating-particles">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                '--particle-delay': `${i * 0.2}s`,
              } as React.CSSProperties}
            ></div>
          ))}
        </div>
      </div>

      {/* Loading text with typing animation */}
      <div className="loading-text">
        <p>{message}</p>
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoadingAnimation;
