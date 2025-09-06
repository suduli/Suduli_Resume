import React from 'react'

const Navigation = ({ sections, currentSection, onSectionChange }) => {
  return (
    <nav className="navigation">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`nav-dot ${currentSection === section.id ? 'active' : ''}`}
          onClick={() => onSectionChange(section.id)}
          title={section.name}
        />
      ))}
    </nav>
  )
}

export default Navigation