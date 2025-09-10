import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';
import './responsive.css'; // Import responsive styles

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const ProjectsPage = lazy(() => import('./pages/Projects/ProjectsPage'));
const Contact = lazy(() => import('./components/Contact/Contact'));

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
