import React, { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import LandingSection from './components/LandingSection'
import ExperienceSection from './components/ExperienceSection'
import SkillsSection from './components/SkillsSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import ParticlesBackground from './components/ParticlesBackground'
import './styles/App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const sections = [
    { id: 0, name: 'Landing', component: <LandingSection /> },
    { id: 1, name: 'Experience', component: <ExperienceSection /> },
    { id: 2, name: 'Skills', component: <SkillsSection /> },
    { id: 3, name: 'Projects', component: <ProjectsSection /> },
    { id: 4, name: 'Contact', component: <ContactSection /> }
  ]

  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId)
  }

  return (
    <div className="app">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
      
      {/* Particles Background */}
      <ParticlesBackground />
      
      {/* Navigation */}
      <Navigation 
        sections={sections}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Main Content */}
      <main className="main-content">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className={`portfolio-section ${
              currentSection === section.id ? 'active' : ''
            }`}
            id={`section-${section.id}`}
          >
            {section.component}
          </section>
        ))}
      </main>
    </div>
  )
}

export default App