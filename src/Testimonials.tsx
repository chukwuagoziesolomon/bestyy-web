import React from 'react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Marcus Johnson',
    review: 'Highly Recommend! Used  Bestyy Delivery for a last-minute delivery. They were quick to respond, affordable, and handled my packages with care. Will be my go-to delivery service from now on! 5 stars.',
    avatar: '/review1.jpg',
    rating: 5,
  },
  {
    name: 'Aisha Williams',
    review: 'Simple, fast, and reliable, this app makes delivery easy and even brings access to essentials in rural areas.Also stress free.',
    avatar: '/review2.jpg',
    rating: 5,
  },
  {
    name: 'David Thompson',
    review: 'Bestie has made my life so much easier. I can order food from my favorite restaurants and have it delivered to my door in no time. I highly recommend it to anyone looking for a hassle-free food ordering experience.',
    avatar: '/1000121265.jpg',
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