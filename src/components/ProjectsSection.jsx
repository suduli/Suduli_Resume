import React from 'react'

const ProjectsSection = () => {
  const projects = [
    {
      name: 'AI-ASIL Analyser',
      type: 'Web Application',
      color: '#00f5ff',
      description: 'Cutting-edge web application combining traditional ISO 26262 ASIL determination with AI-powered validation for automotive safety analysis.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'AI Integration', 'ISO 26262'],
      features: [
        'Dual validation system (Traditional + AI)',
        'Glassmorphism UI design',
        'Real-time reasoning display',
        'Comprehensive safety analysis'
      ],
      liveUrl: 'https://suduli.github.io/AI-ASIL-Analyser/',
      githubUrl: 'https://github.com/suduli/AI-ASIL-Analyser'
    },
    {
      name: 'CAnalyzerAI',
      type: 'Code Analysis Tool',
      color: '#bd00ff',
      description: 'AI-powered C code complexity analyzer featuring stunning visual effects and advanced code metrics analysis.',
      technologies: ['JavaScript', 'AI APIs', 'Particle Systems', 'Code Analysis'],
      features: [
        'Cyclomatic complexity analysis',
        'AI-enhanced code insights',
        'Interactive particle effects',
        'Real-time code metrics'
      ],
      liveUrl: 'https://suduli.github.io/CAnalyzerAI/',
      githubUrl: 'https://github.com/suduli/CAnalyzerAI'
    },
    {
      name: 'BCM-Systems Validation',
      type: 'Automotive Testing',
      color: '#00ff88',
      description: 'Comprehensive automotive software validation project for Stellantis OEM, focusing on Body Control Module systems.',
      technologies: ['IBM RQM', 'DOORS DNG', 'ECU-Test', 'dSPACE'],
      features: [
        'Reduced manual testing by 40%',
        'Achieved 95% requirement traceability',
        'Comprehensive test automation',
        'OEM-grade validation processes'
      ],
      achievements: [
        'Led debugging of 200+ defects',
        'Established automated testing framework',
        'Delivered project ahead of schedule'
      ]
    }
  ]

  return (
    <div className="projects-section">
      <div className="section-header">
        <h2 className="section-title gradient-text">Project Showcase</h2>
        <p className="section-subtitle">
          Featured projects demonstrating expertise in automotive software testing and AI integration
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card glass">
            <div className="project-header">
              <h3 style={{ color: project.color }}>{project.name}</h3>
              <span className="project-type">{project.type}</span>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-technologies">
              <h4>Technologies:</h4>
              <div className="tech-tags">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-features">
              <h4>Key Features:</h4>
              <ul>
                {project.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </div>

            {project.achievements && (
              <div className="project-achievements">
                <h4>Achievements:</h4>
                <ul>
                  {project.achievements.map((achievement, achievementIndex) => (
                    <li key={achievementIndex}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="project-actions">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  View Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="github-cta glass">
        <h3>Explore All Projects</h3>
        <p>Visit my GitHub profile to see all repositories and contributions</p>
        <a 
          href="https://github.com/suduli" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
        >
          View GitHub Profile
        </a>
      </div>
    </div>
  )
}

export default ProjectsSection