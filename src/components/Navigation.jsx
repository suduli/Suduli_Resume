import React, { useState } from 'react'

const Navigation = () => {
  const [activeSection, setActiveSection] = useState(0)

  const sections = [
    { id: 0, name: 'Landing' },
    { id: 1, name: 'Experience' },
    { id: 2, name: 'Skills' },
    { id: 3, name: 'Projects' },
    { id: 4, name: 'Contact' }
  ]

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
    // TODO: Implement camera movement to section
    console.log(`Navigate to section: ${sectionId}`)
  }

  return (
    <nav className="navigation">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`nav-dot ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => handleNavClick(section.id)}
          title={section.name}
        />
      ))}
    </nav>
  )
}

export default Navigation