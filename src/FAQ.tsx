import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    q: 'What is Bestie?',
    a: 'Bestie is an AI-powered food ordering platform that turns your chats into bookings. Simply message Bestie on WhatsApp or our platform, tell us what you\'re craving, and we\'ll connect you with the best restaurants near you. From pizza to jollof rice to shawarma, Bestie makes food ordering as easy as having a conversation with your best friend.',
  },
  {
    q: 'How can I use Bestie?',
    a: 'Using Bestie is simple! Just start a chat with us on WhatsApp or through our web platform. Tell us what you\'re craving, your location, and any dietary preferences. Our AI will curate a list of the best restaurants near you, show you their menus, and handle the entire ordering process. You can even split payments with friends and track your delivery in real-time.',
  },
  {
    q: 'Is Bestie safe and secure?',
    a: 'Absolutely! Bestie takes your privacy and security seriously. Our platform is built with bank-level encryption and follows strict compliance standards. Your payment information is processed securely, and we never share your personal data with third parties. We work with trusted couriers and verified restaurants to ensure your orders are handled safely.',
  },
  {
    q: 'How does payment splitting work?',
    a: 'Bestie makes group orders easy with transparent payment splitting. When you order with friends, we automatically calculate each person\'s share including their items, delivery fees, and service charges. Everyone can pay their portion directly through the platform, and the restaurant, courier, and Bestie all get paid instantly and fairly. No more awkward bill splitting!',
  },
  {
    q: 'When will Bestie be available on mobile apps?',
    a: 'We\'re currently working on our mobile apps for iOS and Android! While we don\'t have an exact release date yet, you can use Bestie right now through our web platform and WhatsApp integration. Sign up for our newsletter to be the first to know when our mobile apps launch.',
  },
  {
    q: 'How can I become a vendor or courier with Bestie?',
    a: 'We\'d love to have you join the Bestie community! If you\'re a restaurant owner, you can sign up as a vendor to reach more customers and grow your business. If you\'re interested in delivery, you can become a courier and earn money by delivering orders. Visit our signup page to get started, and our team will help you through the onboarding process.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number>(0); // First question open by default
  return (
    <section className="faq" id="faq" data-aos="fade-up">
      <div className="faq__badge">Frequently Asked Questions</div>
      <h2 className="faq__heading">Got Questions?<br />We’ve Got Answers!</h2>
      <div className="faq__list">
        {faqs.map((item, idx) => (
          <div className={`faq__item${open === idx ? ' faq__item--open' : ''}`} key={idx} data-aos="fade-up" data-aos-delay={idx * 120}>
            <button className="faq__question" onClick={() => setOpen(open === idx ? -1 : idx)}>
              <span>{item.q}</span>
              <span className="faq__toggle">{open === idx ? '▲' : '▼'}</span>
            </button>
            {open === idx && <div className="faq__answer">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ; 