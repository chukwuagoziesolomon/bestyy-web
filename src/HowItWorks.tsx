import React, { useEffect } from 'react';
import HowItWorksStep from './HowItWorksStep';
import './HowItWorks.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({ once: false, duration: 1200, offset: 120 });
  }, []);

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works__title" data-aos="fade-up">
        <span>How </span>
        <span className="how-it-works__title-accent">Bestyy</span>
        <span> Works</span>
      </div>
      <div data-aos="fade-up" data-aos-delay="0">
        <HowItWorksStep
          title={<><span>SMART AI CHATS FOR SEARCH<br /></span><span className="how-it-works__accent">AND BOOKING</span></>}
          description={"Craving pizza, jollof rice, or shawarma? Just message Bestie and get a curated list of the best restaurants near you with delivery sorted too."}
          buttonText="Get Started"
          phoneImage="/image4.png"
          tipEmoji="🫱"
          tipText="Just tell bestie what you need"
        />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <HowItWorksStep
          title={<><span>TRANSPARENT<br /></span><span className="how-it-works__accent">PAYMENT SPLITTING</span></>}
          description={"No confusing totals or hidden charges here. Bestie combines the item price, delivery cost, and its service fee into one simple amount. Then, it automatically splits that total at checkout so the vendor, courier, and Bestie all get paid instantly and fairly. You get clarity and peace of mind with every order."}
          buttonText="Get Started"
          phoneImage="/image4.png"
          tipEmoji="🫱"
          tipText="Bestie breaks it down so you never overpay"
          reverse
        />
      </div>
    </section>
  );
};

export default HowItWorks; 