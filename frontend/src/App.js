import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import './styles/responsive.css';
import './styles/browser-detection.css';

// Context providers
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider, useData } from './contexts/DataContext';

// Import services
import ThemeManager from './services/ThemeManager';
import ThemeAnimationAdapter from './services/ThemeAnimationAdapter';
import ScrollAnimationService from './services/ScrollAnimationService';
import PerformanceMonitor from './utils/PerformanceMonitor';

// Import critical components (not lazy loaded)
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Loading from './components/common/Loading';

// Lazy load non-critical components
const Landing = lazy(() => import('./components/Landing/Landing'));
const About = lazy(() => import('./components/About/About'));
const Experience = lazy(() => import('./components/Experience/Experience'));
const Skills = lazy(() => import('./components/Skills/Skills'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const Contact = lazy(() => import('./components/Contact/Contact'));

// Initialize animation services
ThemeAnimationAdapter.initialize(ThemeManager);
ScrollAnimationService.initialize(ThemeManager);

// Main application content
function AppContent() {
  // Get data from context
  const { 
    profile, 
    experience, 
    projects, 
    skills, 
    education, 
    awards, 
    languages,
  contactForm,
    loading, 
    error 
  } = useData();
  
  // Use performance tracking in development mode
  PerformanceMonitor.usePerformanceTracking('AppContent');
  
  // Refs for section scrolling
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    experience: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    contact: useRef(null)
  };
  
  // Initialize animations with current theme on mount
  useEffect(() => {
    const currentTheme = ThemeManager.getCurrentTheme();
    if (currentTheme) {
      // Trigger a theme change to update all animations
      ThemeManager.trigger('themeChanged', { themeId: currentTheme.id });
    }
    
    return () => {
      // Clean up animations when App unmounts
      if (ScrollAnimationService.clearAllAnimations) {
        ScrollAnimationService.clearAllAnimations();
      }
    };
  }, []);
  
  // Handle navigation
  const handleNavigate = (sectionId) => {
    const sectionRef = sectionRefs[sectionId];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Create navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  // Show loading state
  if (loading) {
    return <Loading message="Loading portfolio data..." size="large" fullScreen={true} />;
  }

  // Show error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header profile={profile} onNavigate={handleNavigate} />
        <Navigation navItems={navItems} onNavigate={handleNavigate} />
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={
              <>
                <section id="home" ref={sectionRefs.home}>
                  <Suspense fallback={<Loading message="Loading Home..." />}>
                    <Landing 
                      title={profile?.name || 'I\'m John Doe'}
                      subtitle={profile?.title || 'Full Stack Developer'}
                      description={profile?.shortBio || 'I build beautiful, responsive web applications with modern technologies.'}
                    />
                  </Suspense>
                </section>
                
                <section id="about" ref={sectionRefs.about}>
                  <Suspense fallback={<Loading message="Loading About..." />}>
                    <About 
                      profile={profile}
                      education={education}
                      languages={languages}
                    />
                  </Suspense>
                </section>
                
                <section id="experience" ref={sectionRefs.experience}>
                  <Suspense fallback={<Loading message="Loading Experience..." />}>
                    <Experience 
                      experiences={experience || []}
                      awards={awards || []}
                    />
                  </Suspense>
                </section>
                
                <section id="skills" ref={sectionRefs.skills}>
                  <Suspense fallback={<Loading message="Loading Skills..." />}>
                    <Skills 
                      skills={skills || []}
                    />
                  </Suspense>
                </section>
                
                <section id="projects" ref={sectionRefs.projects}>
                  <Suspense fallback={<Loading message="Loading Projects..." />}>
                    <Projects 
                      projects={projects || []}
                    />
                  </Suspense>
                </section>
                
                <section id="contact" ref={sectionRefs.contact}>
                  <Suspense fallback={<Loading message="Loading Contact..." />}>
                    <Contact 
                      contactInfo={profile?.contact || {}}
                      contactForm={contactForm || null}
                    />
                  </Suspense>
                </section>
              </>
            } />
            
            {/* Additional routes can be added here */}
            <Route path="/projects/:id" element={
              <Suspense fallback={<Loading message="Loading Project Details..." />}>
                <Projects />
              </Suspense>
            } />
            <Route path="*" element={<div className="not-found">Page Not Found</div>} />
          </Routes>
        </main>
        
        <Footer 
          copyright={`© ${new Date().getFullYear()} ${profile?.name || 'Portfolio'}. All rights reserved.`}
          socialLinks={profile?.socialLinks || []}
        />
      </div>
    </Router>
  );
}

// Root App component with providers
function App() {
  // Initialize performance monitoring in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Start monitoring resource loading
      const cleanup = PerformanceMonitor.monitorResourceLoading();
      
      // Log performance stats when the app is closed or refreshed
      window.addEventListener('beforeunload', () => {
        PerformanceMonitor.logPerformanceStats();
      });
      
      return () => {
        if (cleanup) cleanup();
        PerformanceMonitor.logPerformanceStats();
      };
    }
  }, []);
  
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
