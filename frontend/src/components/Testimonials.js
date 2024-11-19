// Testimonials.jsx

import React from 'react';
import './Testimonials.css';

const testimonialsData = [
  {
    name: 'John Doe',
    title: 'Product Manager at TechCorp',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment:
      'This website has completely transformed the way I manage my projects. Highly recommended!',
  },
  {
    name: 'Jane Smith',
    title: 'CEO at InnovateX',
    image: 'https://i.pravatar.cc/150?img=2',
    rating: 4,
    comment:
      'An essential tool for our team. The user interface is intuitive and the support is excellent.',
  },
  {
    name: 'Mike Johnson',
    title: 'Developer at WebWorks',
    image: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    comment:
      'A game-changer in our industry. The features are robust and the performance is top-notch.',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <p className="testimonials-description">
          Our users' success stories speak for themselves. Here's how our platform has impacted their work, 
          improved their workflows, and exceeded their expectations. Discover why they trust us to deliver excellence every time.
        </p>
        <div className="testimonials-grid">
          {testimonialsData.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="testimonial-image"
              />
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <p className="testimonial-title">{testimonial.title}</p>
              <div className="testimonial-rating">
                {[...Array(5)].map((star, i) => (
                  <span
                    key={i}
                    className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <p className="testimonial-comment">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
