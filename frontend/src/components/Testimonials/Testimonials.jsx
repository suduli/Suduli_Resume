import React from 'react';
import './Testimonials.css';
import LazyImage from '../common/LazyImage';
import LazyLoad from '../common/LazyLoad';

const Testimonials = ({ data }) => {
  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2>{data.title}</h2>
        {data.description && <p>{data.description}</p>}
      </div>
      
      <div className="testimonials-container">
        {data.testimonials.map(testimonial => (
          <LazyLoad key={testimonial.id}>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <LazyImage 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    width="60"
                    height="60"
                  />
                </div>
                <div className="author-info">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.position}</p>
                </div>
              </div>
            </div>
          </LazyLoad>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
