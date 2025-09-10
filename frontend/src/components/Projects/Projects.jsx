import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import './Projects.css';

// Lazy load ProjectCard component
const ProjectCard = lazy(() => import('./ProjectCard'));

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Website',
      description: 'A full-stack e-commerce website with React, Node.js and MongoDB.',
      image: '/images/projects/ecommerce.jpg',
      category: 'web',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: 'https://example.com/ecommerce'
    },
    {
      id: 2,
      title: 'Mobile Fitness App',
      description: 'A fitness tracking app built with React Native and Firebase.',
      image: '/images/projects/fitness-app.jpg',
      category: 'mobile',
      technologies: ['React Native', 'Firebase', 'Redux'],
      link: 'https://example.com/fitness-app'
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'A responsive portfolio website built with React and styled components.',
      image: '/images/projects/portfolio.jpg',
      category: 'web',
      technologies: ['React', 'CSS', 'Framer Motion'],
      link: 'https://example.com/portfolio'
    },
    {
      id: 4,
      title: 'Weather Dashboard',
      description: 'A weather dashboard that displays real-time weather data.',
      image: '/images/projects/weather.jpg',
      category: 'web',
      technologies: ['JavaScript', 'OpenWeather API', 'HTML/CSS'],
      link: 'https://example.com/weather'
    },
    {
      id: 5,
      title: 'Machine Learning Model',
      description: 'An ML model for predicting customer behavior based on historical data.',
      image: '/images/projects/ml-project.jpg',
      category: 'data',
      technologies: ['Python', 'TensorFlow', 'Pandas', 'Matplotlib'],
      link: 'https://example.com/ml-project'
    },
    {
      id: 6,
      title: 'Task Management App',
      description: 'A task management application with drag and drop functionality.',
      image: '/images/projects/task-app.jpg',
      category: 'web',
      technologies: ['React', 'Firebase', 'DnD Kit'],
      link: 'https://example.com/task-app'
    }
  ];

  const filters = [
    { name: 'All', value: 'all' },
    { name: 'Web', value: 'web' },
    { name: 'Mobile', value: 'mobile' },
    { name: 'Data', value: 'data' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        
        <div className="filters">
          {filters.map(filter => (
            <button
              key={filter.value}
              className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.name}
            </button>
          ))}
        </div>
        
        <motion.div 
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.map(project => (
            <Suspense key={project.id} fallback={<div className="project-card loading"><LoadingSpinner /></div>}>
              <ProjectCard project={project} />
            </Suspense>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
