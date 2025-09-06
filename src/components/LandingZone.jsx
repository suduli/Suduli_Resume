import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box } from '@react-three/drei'

const LandingZone = () => {
  const titleRef = useRef()
  const subtitleRef = useRef()

  useFrame((state) => {
    if (titleRef.current) {
      titleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  useEffect(() => {
    // Create the UI panel using DOM manipulation
    const uiOverlay = document.getElementById('ui-overlay')
    if (uiOverlay) {
      const panel = document.createElement('div')
      panel.className = 'glass-panel content-panel visible'
      panel.style.cssText = `
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        max-width: 500px;
        position: absolute;
      `
      panel.innerHTML = `
        <h3 class="gradient-text">Welcome to My Interactive Portfolio</h3>
        <p>
          Experienced in automotive embedded systems testing, ADAS validation, 
          and AI-powered software testing tools. Navigate through my professional 
          journey in this immersive 3D experience.
        </p>
        <div style="margin-top: 1rem;">
          <a href="https://github.com/suduli" target="_blank" rel="noopener noreferrer" class="btn-primary" style="margin-right: 1rem;">
            View GitHub
          </a>
          <a href="https://suduli.github.io/AI-ASIL-Analyser/" target="_blank" rel="noopener noreferrer" class="btn-primary">
            AI-ASIL Analyser
          </a>
        </div>
      `
      uiOverlay.appendChild(panel)

      return () => {
        if (uiOverlay.contains(panel)) {
          uiOverlay.removeChild(panel)
        }
      }
    }
  }, [])

  return (
    <>
      {/* 3D Name Title */}
      <Text
        ref={titleRef}
        position={[0, 2, 0]}
        fontSize={1.5}
        color="#00f5ff"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        lineHeight={1}
      >
        SUDULI KUMAR{'\n'}BALABANTARAY
      </Text>

      {/* Professional Title */}
      <Text
        ref={subtitleRef}
        position={[0, 0, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={15}
        lineHeight={1.2}
      >
        Specialist Engineer | Automotive Software & Systems Validation
      </Text>

      {/* Floating geometric elements */}
      <Box position={[-3, 1, -2]} args={[0.5, 0.5, 0.5]} rotation={[0.5, 0.5, 0]}>
        <meshStandardMaterial color="#bd00ff" wireframe />
      </Box>
      
      <Box position={[3, -1, -2]} args={[0.3, 0.3, 0.3]} rotation={[0.3, 0.8, 0.2]}>
        <meshStandardMaterial color="#00ff88" wireframe />
      </Box>
    </>
  )
}

export default LandingZone