import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Silver Snow',
    review: 'Bestie made booking so easy! The AI chat is super smart and fast.',
    avatar: 'https://via.placeholder.com/64?text=SS',
    rating: 5,
  },
  {
    name: 'Silver Snow',
    review: 'Splitting payments with friends was a breeze. Love it!',
    avatar: 'https://via.placeholder.com/64?text=SS',
    rating: 5,
  },
  {
    name: 'Silver Snow',
    review: 'Real-time updates and delivery tracking were spot on.',
    avatar: 'https://via.placeholder.com/64?text=SS',
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="testimonials" id="testimonials" data-aos="fade-up">
    <h2>What People Are Saying About Bestyy!</h2>
    <div className="testimonials__cards">
      {testimonials.map((t, idx) => (
        <div className="testimonial" key={idx} data-aos="fade-up" data-aos-delay={idx * 120}>
          <img className="testimonial__avatar" src={t.avatar} alt={t.name} />
          <div className="testimonial__name">{t.name}</div>
          <div className="testimonial__review">{t.review}</div>
          <div className="testimonial__stars">{'★'.repeat(t.rating)}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials; 