import React from 'react';
import './Hero.css';
import LazyImage from '../common/LazyImage';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">John Doe</h1>
        <h2 className="hero-subtitle">Full Stack Developer</h2>
        <p className="hero-description">
          Building modern web applications with a focus on performance and user experience
        </p>
        <div className="hero-cta">
          <a href="/projects" className="btn btn-primary">View My Work</a>
          <a href="/contact" className="btn btn-secondary">Contact Me</a>
        </div>
      </div>
      <div className="hero-image">
        <LazyImage 
          src="/images/profile.jpg" 
          alt="John Doe - Full Stack Developer" 
          width="400"
          height="400"
          placeholder="/images/profile-placeholder.jpg"
        />
      </div>
    </section>
  );
};

export default Hero;
