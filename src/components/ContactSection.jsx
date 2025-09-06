import React from 'react'

const ContactSection = () => {
  const contactMethods = [
    {
      name: 'Email',
      icon: '✉️',
      info: 'suduli.office@gmail.com',
      action: () => window.location.href = 'mailto:suduli.office@gmail.com',
      color: '#00f5ff'
    },
    {
      name: 'Phone',
      icon: '📱',
      info: '+91 9500097614',
      action: () => {
        navigator.clipboard.writeText('+919500097614')
        alert('Phone number copied to clipboard!')
      },
      color: '#bd00ff'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      info: 'Professional Profile',
      action: () => window.open('https://linkedin.com/in/suduli-kumar-balabantaray-325765b6/', '_blank'),
      color: '#00ff88'
    },
    {
      name: 'GitHub',
      icon: '🔗',
      info: 'Code Repositories',
      action: () => window.open('https://github.com/suduli', '_blank'),
      color: '#ff6b6b'
    }
  ]

  return (
    <div className="contact-section">
      <div className="section-header">
        <h2 className="section-title gradient-text">Contact Hub</h2>
        <p className="section-subtitle">
          Ready to collaborate on automotive software testing projects or discuss innovative AI-powered testing solutions?
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info glass">
          <h3>Get In Touch</h3>
          <p>
            I'm always open to new opportunities and interesting conversations about 
            automotive software testing, ADAS validation, and AI-powered testing solutions.
          </p>
          
          <div className="contact-details">
            <div className="detail-item">
              <h4 style={{ color: '#00f5ff' }}>Location</h4>
              <p>Bengaluru, Karnataka, India</p>
            </div>
            
            <div className="detail-item">
              <h4 style={{ color: '#bd00ff' }}>Specialization</h4>
              <p>Automotive Software Testing & ADAS Validation</p>
            </div>
            
            <div className="detail-item">
              <h4 style={{ color: '#00ff88' }}>Experience</h4>
              <p>5+ Years in Automotive Embedded Systems</p>
            </div>
          </div>
        </div>

        <div className="contact-methods">
          {contactMethods.map((contact, index) => (
            <div 
              key={index} 
              className="contact-method glass"
              onClick={contact.action}
              style={{ cursor: 'pointer' }}
            >
              <div className="contact-icon" style={{ color: contact.color }}>
                {contact.icon}
              </div>
              <h4>{contact.name}</h4>
              <p>{contact.info}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-footer glass">
        <div className="footer-content">
          <p>
            This interactive portfolio was built with React and modern web technologies.
            <br />
            © 2024 Suduli Kumar Balabantaray. All rights reserved.
          </p>
          
          <div className="footer-links">
            <a 
              href="mailto:suduli.office@gmail.com" 
              className="btn-primary"
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
        </div>
      </div>
    </div>
  )
}

export default ContactSection