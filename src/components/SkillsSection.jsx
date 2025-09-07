import React from 'react'

const SkillsSection = () => {
  const skillCategories = [
    {
      name: 'Testing & Validation',
      color: '#00f5ff',
      skills: [
        'System Testing',
        'Unit Testing', 
        'Integration Testing',
        'White/Black Box Testing',
        'Functional Testing',
        'Regression Testing',
        'HIL/SIL Testing',
        'ADAS Testing'
      ]
    },
    {
      name: 'Tools & Software',
      color: '#bd00ff',
      skills: [
        'VectorCAST',
        'CANoe',
        'dSPACE',
        'ECU-Test Tool',
        'Jira',
        'IBM ALM/RQM/DOORS',
        'Trace32',
        'VtestStudio'
      ]
    },
    {
      name: 'Languages & Protocols',
      color: '#00ff88',
      skills: [
        'Embedded C',
        'Python',
        'CAPL',
        'CAN (ISO-11898)',
        'UDS (ISO-14229)',
        'ISO-26262',
        'AUTOSAR',
        'JavaScript'
      ]
    },
    {
      name: 'Automotive Domains',
      color: '#ff6b6b',
      skills: [
        'BCM Systems',
        'Domain Control Unit (DCU)',
        'ADAS Components',
        'Embedded Software',
        'Safety-Critical Systems',
        'OEM Projects',
        'Validation Plans',
        'Requirement Traceability'
      ]
    }
  ]

  return (
    <div className="skills-section">
      <div className="section-header">
        <h2 className="section-title gradient-text">Skills Galaxy</h2>
        <p className="section-subtitle">
          Technical expertise across automotive software testing and validation
        </p>
      </div>

      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <div key={index} className="skill-category glass">
            <h3 style={{ color: category.color }}>{category.name}</h3>
            <div className="skills-list">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="skill-tag" style={{
                  background: `${category.color}20`,
                  borderColor: category.color
                }}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsSection