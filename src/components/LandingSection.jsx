import React from 'react'

const LandingSection = () => {
  return (
    <div className="landing-section">
      <div className="hero-content">
        <h1 className="hero-title gradient-text">
          SUDULI KUMAR BALABANTARAY
        </h1>
        <h2 className="hero-subtitle">
          Specialist Engineer | Automotive Software & Systems Validation
        </h2>
        <p className="hero-description">
          Experienced in automotive embedded systems testing, ADAS validation, 
          and AI-powered software testing tools. Specializing in safety-critical 
          automotive software with expertise in ISO 26262 standards.
        </p>
        
        <div className="hero-actions">
          <a 
            href="https://github.com/suduli" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            View GitHub
          </a>
          <a 
            href="https://suduli.github.io/AI-ASIL-Analyser/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            AI-ASIL Analyser
          </a>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item glass">
          <h3>5+</h3>
          <p>Years Experience</p>
        </div>
        <div className="stat-item glass">
          <h3>200+</h3>
          <p>Defects Debugged</p>
        </div>
        <div className="stat-item glass">
          <h3>95%</h3>
          <p>Test Coverage</p>
        </div>
      </div>
    </div>
  )
}

export default LandingSection