import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import ParticleField from './ParticleField'
import LandingZone from './LandingZone'

const Scene = () => {
  const cameraRef = useRef()
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    console.log('Scene component mounted')
  }, [])

  useFrame((state, delta) => {
    // Smooth camera movement based on scroll or navigation
    if (cameraRef.current) {
      const targetZ = 5 - currentSection * 10
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.02
    }
  })

  return (
    <>
      {/* Camera Setup */}
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={75} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#bd00ff" />

      {/* Background Elements */}
      <Stars radius={300} depth={60} count={1000} factor={7} saturation={0} fade />
      <ParticleField />

      {/* Main Sections */}
      
      {/* Section 0: Landing Zone */}
      <group position={[0, 0, 0]}>
        <LandingZone />
      </group>

      {/* TODO: Add other sections progressively */}
    </>
  )
}

export default Scene