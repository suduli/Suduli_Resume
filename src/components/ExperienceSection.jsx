import React from 'react'

const ExperienceSection = () => {
  const companies = [
    {
      name: 'KPIT Technologies',
      position: 'Test Lead',
      duration: '10/2023 - Present',
      location: 'Bengaluru, India',
      color: '#00f5ff',
      achievements: [
        'Developed validation plans using IBM RQM for automotive OEM projects',
        'Designed and executed test cases for embedded software systems',
        'Reduced manual testing efforts by 40% through automation',
        'Led system, HIL, and SIL testing initiatives for ADAS components'
      ]
    },
    {
      name: 'HL Klemove India',
      position: 'Specialist Engineer',
      duration: '02/2022 - 11/2023',
      location: 'Bengaluru, India',
      color: '#bd00ff',
      achievements: [
        'Performed system testing for DCU (Domain Control Unit) projects',
        'Managed ECU configurations using Trace32 debugger',
        'Established Zero DTC environment for reliable testing',
        'Received Spotlight Award for outstanding project delivery'
      ]
    },
    {
      name: 'Mando Softtech India',
      position: 'Senior Engineer',
      duration: '03/2020 - 01/2022',
      location: 'Bengaluru, India / Korea (Onsite)',
      color: '#00ff88',
      achievements: [
        'Conducted unit testing and integration testing for embedded software',
        'Managed defect lifecycle using Jira and IBM ALM tools',
        'Achieved 95% code coverage using VectorCAST testing tools',
        'Worked onsite in Korea for DCU 20 project development'
      ]
    },
    {
      name: 'Binsoft Techno Solutions',
      position: 'Engineer',
      duration: '08/2017 - 01/2020',
      location: 'Bengaluru, India',
      color: '#ff6b6b',
      achievements: [
        'Performed unit testing for automotive embedded software modules',
        'Conducted code coverage analysis and reporting',
        'Collaborated with development teams for defect resolution',
        'Gained expertise in embedded C and testing methodologies'
      ]
    }
  ]

  return (
    <div className="experience-section">
      <div className="section-header">
        <h2 className="section-title gradient-text">Experience Expressway</h2>
        <p className="section-subtitle">
          Professional journey through automotive software testing and validation
        </p>
      </div>

      <div className="experience-timeline">
        {companies.map((company, index) => (
          <div key={index} className="experience-card glass">
            <div className="experience-header">
              <div className="company-info">
                <h3 style={{ color: company.color }}>{company.name}</h3>
                <h4>{company.position}</h4>
                <div className="experience-meta">
                  <span className="duration">{company.duration}</span>
                  <span className="location">{company.location}</span>
                </div>
              </div>
              <div className="company-indicator" style={{ backgroundColor: company.color }}></div>
            </div>
            
            <div className="achievements">
              <h5>Key Achievements:</h5>
              <ul>
                {company.achievements.map((achievement, achievementIndex) => (
                  <li key={achievementIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="experience-summary glass">
        <h3>Professional Summary</h3>
        <p>
          <strong>5+ years</strong> of experience in automotive embedded software testing, 
          specializing in <strong>ADAS validation</strong>, <strong>HIL/SIL testing</strong>, 
          and <strong>safety-critical systems</strong>. Expert in <strong>ISO 26262</strong> 
          standards and automotive OEM project delivery.
        </p>
        
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-number">200+</span>
            <span className="stat-label">Defects Debugged</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">95%</span>
            <span className="stat-label">Test Coverage Achieved</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">40%</span>
            <span className="stat-label">Testing Efficiency Improved</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperienceSection