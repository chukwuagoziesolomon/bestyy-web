import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    q: 'What is Bestie?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat dui a lacus congue, vitae porta orci hendrerit. Sed euismod, purus ornare efficitur laoreet, ipsum elit commodo leo, et volutpat magna arcu nec mauris. Nullam condimentum mollis eros sit amet ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    q: 'How can I use Bestie ?',
    a: '',
  },
  {
    q: 'Is Bestie safe?',
    a: '',
  },
  {
    q: 'Is Bestie safe?',
    a: '',
  },
  {
    q: 'When will Bestie be released on Mobile Apps?',
    a: '',
  },
  {
    q: 'How can I contribute to the Bestie community?',
    a: '',
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