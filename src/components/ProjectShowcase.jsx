import React, { useState } from 'react'
import { Box, Text, Cylinder } from '@react-three/drei'
import { createPortal } from 'react-dom'

const ProjectShowcase = () => {
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      name: 'AI-ASIL Analyser',
      type: 'Web Application',
      position: [-3, 1, 0],
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
      position: [0, 0, 0],
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
      position: [3, -1, 0],
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

  const handleProjectClick = (project) => {
    setSelectedProject(project)
  }

  const closePanel = () => {
    setSelectedProject(null)
  }

  return (
    <>
      {/* Section Title */}
      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        PROJECT SHOWCASE
      </Text>

      {/* Project Exhibits */}
      {projects.map((project, index) => (
        <group key={index} position={project.position}>
          {/* Project Base */}
          <Cylinder
            args={[1, 1.2, 0.3, 8]}
            position={[0, -0.5, 0]}
            onClick={() => handleProjectClick(project)}
            onPointerOver={(e) => {
              e.object.material.emissive.setHex(0x333333)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.object.material.emissive.setHex(0x000000)
              document.body.style.cursor = 'default'
            }}
          >
            <meshStandardMaterial 
              color={project.color}
              transparent
              opacity={0.8}
            />
          </Cylinder>

          {/* Project Monument */}
          <Box
            args={[1.5, 2, 0.5]}
            position={[0, 0.5, 0]}
            onClick={() => handleProjectClick(project)}
            onPointerOver={(e) => {
              e.object.material.emissive.setHex(0x222222)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.object.material.emissive.setHex(0x000000)
              document.body.style.cursor = 'default'
            }}
          >
            <meshStandardMaterial 
              color={project.color}
              wireframe
            />
          </Box>

          {/* Project Name */}
          <Text
            position={[0, -1.2, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
          >
            {project.name}
          </Text>

          {/* Project Type */}
          <Text
            position={[0, -1.6, 0]}
            fontSize={0.2}
            color={project.color}
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
          >
            {project.type}
          </Text>
        </group>
      ))}

      {/* GitHub Profile Link */}
      <group position={[0, -3, 0]}>
        <Box
          args={[2, 0.5, 0.5]}
          onClick={() => window.open('https://github.com/suduli', '_blank')}
          onPointerOver={(e) => {
            e.object.material.emissive.setHex(0x333333)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.object.material.emissive.setHex(0x000000)
            document.body.style.cursor = 'default'
          }}
        >
          <meshStandardMaterial color="#ffffff" />
        </Box>
        
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.3}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          VIEW ALL PROJECTS
        </Text>
      </group>

      {/* Project Details Panel */}
      {selectedProject && createPortal(
        <div 
          className="glass-panel content-panel visible"
          style={{
            top: '15%',
            right: '5%',
            maxWidth: '450px'
          }}
        >
          <button className="close-btn" onClick={closePanel}>×</button>
          <h2 style={{ color: selectedProject.color }}>{selectedProject.name}</h2>
          <h3>{selectedProject.type}</h3>
          <p>{selectedProject.description}</p>
          
          <h4 style={{ color: '#ffffff', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Technologies:
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {selectedProject.technologies.map((tech, index) => (
              <span 
                key={index}
                style={{
                  background: 'rgba(0, 245, 255, 0.2)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  color: '#00f5ff'
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
            Key Features:
          </h4>
          <ul style={{ marginBottom: '1rem' }}>
            {selectedProject.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {selectedProject.achievements && (
            <>
              <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
                Achievements:
              </h4>
              <ul style={{ marginBottom: '1rem' }}>
                {selectedProject.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            {selectedProject.liveUrl && (
              <a 
                href={selectedProject.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ marginRight: '1rem' }}
              >
                Live Demo
              </a>
            )}
            {selectedProject.githubUrl && (
              <a 
                href={selectedProject.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View Code
              </a>
            )}
          </div>
        </div>,
        document.getElementById('ui-overlay')
      )}
    </>
  )
}

export default ProjectShowcase