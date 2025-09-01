import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Silver Snow',
    review: 'Highly Recommend! Used  Bestyy Delivery for a last-minute delivery. They were quick to respond, affordable, and handled my packages with care. Will be my go-to delivery service from now on! 5 stars.',
    avatar: 'https://via.placeholder.com/64?text=SS',
    rating: 5,
  },
  {
    name: 'Silver Snow',
    review: 'Simple, fast, and reliable, this app makes delivery easy and even brings access to essentials in rural areas.Also stress free.',
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