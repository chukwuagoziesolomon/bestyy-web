import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

interface HowItWorksStepProps {
  title: React.ReactNode;
  description: string;
  buttonText: string;
  phoneImage: string;
  tipEmoji: string;
  tipText: string;
  reverse?: boolean;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({
  title,
  description,
  buttonText,
  phoneImage,
  tipEmoji,
  tipText,
  reverse = false,
}) => (
  <div className={`how-it-works__card${reverse ? ' how-it-works__card--reverse' : ''}`}>
    <div className="how-it-works__left">
      <h2>{title}</h2>
      <p>{description}</p>
      <Link to="/login" className="how-it-works__cta">{buttonText}</Link>
    </div>
    <div className="how-it-works__center">
      <img src={phoneImage} alt="Phone Chat Demo" className="how-it-works__phone" />
    </div>
    <div className="how-it-works__right">
      <div className="how-it-works__tip-card">
        <img src={tipEmoji} alt="Emoji" className="how-it-works__tip-emoji" />
        <span>{tipText}</span>
      </div>
    </div>
  </div>
);

export default HowItWorksStep;