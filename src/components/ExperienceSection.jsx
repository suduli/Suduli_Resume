import React, { useState } from 'react'
import { Box, Text } from '@react-three/drei'
import { createPortal } from 'react-dom'

const ExperienceSection = () => {
  const [selectedCompany, setSelectedCompany] = useState(null)

  const companies = [
    {
      name: 'KPIT Technologies',
      position: 'Test Lead',
      duration: '10/2023 - Present',
      location: [-4, 2, 0],
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
      location: [-1, 1, 0],
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
      location: [2, 0, 0],
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
      location: [4, -1, 0],
      color: '#ff6b6b',
      achievements: [
        'Performed unit testing for automotive embedded software modules',
        'Conducted code coverage analysis and reporting',
        'Collaborated with development teams for defect resolution',
        'Gained expertise in embedded C and testing methodologies'
      ]
    }
  ]

  const handleCompanyClick = (company) => {
    setSelectedCompany(company)
  }

  const closePanel = () => {
    setSelectedCompany(null)
  }

  return (
    <>
      {/* Section Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        EXPERIENCE EXPRESSWAY
      </Text>

      {/* Company Representations */}
      {companies.map((company, index) => (
        <group key={index} position={company.location}>
          <Box
            args={[1, 1.5, 0.5]}
            onClick={() => handleCompanyClick(company)}
            onPointerOver={(e) => {
              e.object.material.emissive.setHex(0x444444)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
              e.object.material.emissive.setHex(0x000000)
              document.body.style.cursor = 'default'
            }}
          >
            <meshStandardMaterial color={company.color} />
          </Box>
          
          <Text
            position={[0, -1, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={3}
          >
            {company.name}
          </Text>
        </group>
      ))}

      {/* Connection Path */}
      <mesh position={[0, 0.5, -0.5]}>
        <boxGeometry args={[10, 0.1, 0.1]} />
        <meshStandardMaterial color="#00f5ff" opacity={0.3} transparent />
      </mesh>

      {/* Content Panel */}
      {selectedCompany && createPortal(
        <div 
          className="glass-panel content-panel visible"
          style={{
            top: '20%',
            right: '5%',
            maxWidth: '400px'
          }}
        >
          <button className="close-btn" onClick={closePanel}>×</button>
          <h2>{selectedCompany.name}</h2>
          <h3>{selectedCompany.position}</h3>
          <p style={{ color: '#00f5ff', marginBottom: '1rem' }}>
            {selectedCompany.duration}
          </p>
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
            Key Achievements:
          </h4>
          <ul>
            {selectedCompany.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>,
        document.getElementById('ui-overlay')
      )}
    </>
  )
}

export default ExperienceSection