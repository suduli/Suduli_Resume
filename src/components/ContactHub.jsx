import React from 'react'
import { Sphere, Text } from '@react-three/drei'
import { createPortal } from 'react-dom'

const ContactHub = () => {
  const contactMethods = [
    {
      name: 'Email',
      icon: '✉',
      position: [-2, 0, 0],
      color: '#00f5ff',
      action: () => window.location.href = 'mailto:suduli.office@gmail.com',
      info: 'suduli.office@gmail.com'
    },
    {
      name: 'Phone',
      icon: '📱',
      position: [0, 1, 0],
      color: '#bd00ff',
      action: () => {
        navigator.clipboard.writeText('+919500097614')
        alert('Phone number copied to clipboard!')
      },
      info: '+91 9500097614'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      position: [2, 0, 0],
      color: '#00ff88',
      action: () => window.open('https://linkedin.com/in/suduli-kumar-balabantaray-325765b6/', '_blank'),
      info: 'Professional Profile'
    },
    {
      name: 'GitHub',
      icon: '🔗',
      position: [0, -1, 0],
      color: '#ff6b6b',
      action: () => window.open('https://github.com/suduli', '_blank'),
      info: 'Code Repositories'
    }
  ]

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
        CONTACT HUB
      </Text>

      {/* Contact Methods */}
      {contactMethods.map((contact, index) => (
        <group key={index} position={contact.position}>
          <Sphere
            args={[0.8, 32, 32]}
            onClick={contact.action}
            onPointerOver={(e) => {
              e.object.material.emissive.setHex(0x444444)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.object.material.emissive.setHex(0x000000)
              document.body.style.cursor = 'default'
            }}
          >
            <meshStandardMaterial 
              color={contact.color}
              transparent
              opacity={0.7}
              emissive={contact.color}
              emissiveIntensity={0.1}
            />
          </Sphere>

          <Text
            position={[0, 0, 0.9]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {contact.icon}
          </Text>

          <Text
            position={[0, -1.2, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {contact.name}
          </Text>
        </group>
      ))}

      {/* Central Information Pillar */}
      <group position={[0, 0, -2]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 4]} />
          <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
        
        <Text
          position={[0, 0, 0]}
          fontSize={0.4}
          color="#00f5ff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          Let's Connect
        </Text>
      </group>

      {/* Contact Information Panel */}
      {createPortal(
        <div 
          className="glass-panel content-panel visible"
          style={{
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            maxWidth: '500px'
          }}
        >
          <h2 className="gradient-text">Get In Touch</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Ready to collaborate on automotive software testing projects or discuss 
            innovative AI-powered testing solutions? I'm always open to new opportunities 
            and interesting conversations.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div className="glass" style={{ padding: '1rem', textAlign: 'left' }}>
              <h4 style={{ color: '#00f5ff', marginBottom: '0.5rem' }}>Location</h4>
              <p>Bengaluru, Karnataka, India</p>
            </div>
            
            <div className="glass" style={{ padding: '1rem', textAlign: 'left' }}>
              <h4 style={{ color: '#bd00ff', marginBottom: '0.5rem' }}>Specialization</h4>
              <p>Automotive Software Testing & ADAS Validation</p>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <a 
              href="mailto:suduli.office@gmail.com" 
              className="btn-primary"
              style={{ marginRight: '1rem' }}
            >
              Send Email
            </a>
            <a 
              href="https://linkedin.com/in/suduli-kumar-balabantaray-325765b6/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Connect on LinkedIn
            </a>
          </div>
          
          <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#a0a0a0' }}>
            <p>
              This interactive portfolio was built with React, Three.js, and modern web technologies.
              <br />
              © 2024 Suduli Kumar Balabantaray. All rights reserved.
            </p>
          </div>
        </div>,
        document.getElementById('ui-overlay')
      )}
    </>
  )
}

export default ContactHub