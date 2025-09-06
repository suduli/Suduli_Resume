import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Text } from '@react-three/drei'
import { createPortal } from 'react-dom'

const SkillsGalaxy = () => {
  const galaxyRef = useRef()
  const [selectedSkill, setSelectedSkill] = useState(null)

  const skillCategories = [
    {
      name: 'Testing & Validation',
      position: [0, 2, 0],
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
      position: [-3, 0, 2],
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
      position: [3, -1, 1],
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
      position: [0, -2, -1],
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

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const handleSkillClick = (category) => {
    setSelectedSkill(category)
  }

  const closePanel = () => {
    setSelectedSkill(null)
  }

  return (
    <>
      {/* Section Title */}
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SKILLS GALAXY
      </Text>

      {/* Rotating Galaxy Container */}
      <group ref={galaxyRef}>
        {skillCategories.map((category, index) => (
          <group key={index} position={category.position}>
            {/* Main Skill Sphere */}
            <Sphere
              args={[0.8, 32, 32]}
              onClick={() => handleSkillClick(category)}
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
                color={category.color}
                transparent
                opacity={0.7}
                emissive={category.color}
                emissiveIntensity={0.1}
              />
            </Sphere>

            {/* Category Label */}
            <Text
              position={[0, -1.5, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={4}
            >
              {category.name}
            </Text>

            {/* Orbiting Skill Satellites */}
            {category.skills.slice(0, 4).map((skill, skillIndex) => {
              const angle = (skillIndex / 4) * Math.PI * 2
              const radius = 1.5
              const x = Math.cos(angle) * radius
              const z = Math.sin(angle) * radius
              
              return (
                <Sphere
                  key={skillIndex}
                  args={[0.15, 16, 16]}
                  position={[x, 0, z]}
                >
                  <meshStandardMaterial 
                    color={category.color}
                    transparent
                    opacity={0.5}
                  />
                </Sphere>
              )
            })}
          </group>
        ))}

        {/* Connecting Lines */}
        {skillCategories.map((category, index) => (
          <mesh 
            key={`line-${index}`}
            position={[category.position[0] / 2, category.position[1] / 2, category.position[2] / 2]}
            rotation={[0, 0, Math.atan2(category.position[1], category.position[0])]}
          >
            <cylinderGeometry args={[0.02, 0.02, 3]} />
            <meshStandardMaterial color="#ffffff" opacity={0.2} transparent />
          </mesh>
        ))}
      </group>

      {/* Skill Details Panel */}
      {selectedSkill && createPortal(
        <div 
          className="glass-panel content-panel visible"
          style={{
            top: '25%',
            left: '5%',
            maxWidth: '350px'
          }}
        >
          <button className="close-btn" onClick={closePanel}>×</button>
          <h2 style={{ color: selectedSkill.color }}>{selectedSkill.name}</h2>
          <p style={{ marginBottom: '1rem' }}>
            Core competencies and technologies in this domain:
          </p>
          <ul>
            {selectedSkill.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>,
        document.getElementById('ui-overlay')
      )}
    </>
  )
}

export default SkillsGalaxy