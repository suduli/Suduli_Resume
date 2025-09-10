import React from 'react';
import './About.css';
import LazyImage from '../common/LazyImage';

const About = ({ data }) => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-image">
          <LazyImage 
            src="/images/profile-large.jpg" 
            alt={data.name} 
            width="450"
            height="500"
            placeholder="/images/profile-placeholder.jpg"
          />
        </div>
        
        <div className="about-content">
          <h1>{data.name}</h1>
          <h2 className="about-title">{data.title}</h2>
          
          <div className="about-summary">
            <p className="summary-text">{data.summary}</p>
          </div>
          
          <div className="about-description">
            {data.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="about-highlights">
            <h3>Career Highlights</h3>
            <ul className="highlights-list">
              {data.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
          
          <div className="about-cta">
            <a href="/contact" className="btn btn-primary">Get In Touch</a>
            <a href="/projects" className="btn btn-secondary">View Projects</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
