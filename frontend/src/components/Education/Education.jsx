import React from 'react';
import './Education.css';
import LazyLoad from '../common/LazyLoad';

const Education = ({ data }) => {
  return (
    <section className="education-section">
      <div className="section-header">
        <h2>Education & Certifications</h2>
        <p>My academic background and professional certifications</p>
      </div>
      
      <div className="education-container">
        <div className="education-degrees">
          <h3>Academic Degrees</h3>
          <div className="timeline">
            {data.degrees.map((degree, index) => (
              <LazyLoad key={index}>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="degree-header">
                      <h4>{degree.degree}</h4>
                      <span className="degree-period">{degree.period}</span>
                    </div>
                    <div className="institution">
                      <span>{degree.institution}</span>
                      <span className="location">{degree.location}</span>
                    </div>
                    <p className="description">{degree.description}</p>
                  </div>
                </div>
              </LazyLoad>
            ))}
          </div>
        </div>
        
        <div className="education-certifications">
          <h3>Professional Certifications</h3>
          <div className="certifications-grid">
            {data.certifications.map((cert, index) => (
              <LazyLoad key={index}>
                <div className="certification-card">
                  <div className="certification-icon">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div className="certification-details">
                    <h4>{cert.name}</h4>
                    <div className="certification-meta">
                      <span>{cert.issuer}</span>
                      <span className="date">{cert.date}</span>
                    </div>
                  </div>
                </div>
              </LazyLoad>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
