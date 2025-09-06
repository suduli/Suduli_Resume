import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import './styles/App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      setHasWebGL(false)
    }
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!hasWebGL) {
    return (
      <div className="app">
        <div className="fallback-content">
          <h1 className="gradient-text">Suduli Kumar Balabantaray</h1>
          <h2>Specialist Engineer | Automotive Software & Systems Validation</h2>
          <p>Your browser doesn't support WebGL. Please use a modern browser to view the 3D portfolio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
      
      {/* Navigation */}
      <Navigation />
      
      {/* 3D Scene Canvas */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          className="canvas"
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          onCreated={({ gl }) => {
            gl.setSize(window.innerWidth, window.innerHeight)
          }}
          fallback={
            <div className="fallback-content">
              <h1 className="gradient-text">Suduli Kumar Balabantaray</h1>
              <p>Loading 3D portfolio...</p>
            </div>
          }
        >
          <Scene />
        </Canvas>
      </Suspense>
      
      {/* UI Overlays */}
      <div id="ui-overlay" className="ui-overlay">
        {/* Content panels will be rendered here by the Scene component */}
      </div>
    </div>
  )
}

export default App