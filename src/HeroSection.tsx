import React from 'react';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import './HeroSection.css';

const phrases = [
  'TURN CHATS INTO BOOKINGS WITH',
  'Chat, Choose, Chew, Deliciously Simple Food Ordering with.',
  'From WhatsApp Wishlist to Your Doorstep , powered by',
  'Turn Your Chats into Taste Buds Delights,Order Smarter with',
  'Your Craving is One Chat Away. Order with',
];

const HeroSection = () => (
  <section className="hero" id="home">
    <div className="hero__content">
      <h1>
        <span className="hero__typewriter" style={{ marginRight: '0.5ch' }}>
          <Typewriter
            words={phrases}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={100}
            deleteSpeed={100}
            delaySpeed={1800}
          />
        </span>
        <span className="hero__gradient-text">Bestyy</span>
      </h1>
      <p>Book with ease using Bestyy's AI chat, fast,<br />affordable and convenient.</p>
      <Link to="/login/user" className="hero__cta">Get Started</Link>
    </div>
    <div className="hero__image">
      <img src="/image1.png" alt="Phone Mockup" className="hero__phone-mockup" />
      <img src="/image2.png" alt="Chat Bubble" className="hero__chat-bubble hero__chat-bubble--white" />
      <img src="/image3.png" alt="Green Chat Bubble" className="hero__chat-bubble hero__chat-bubble--green" />
    </div>
  </section>
);

export default HeroSection; 