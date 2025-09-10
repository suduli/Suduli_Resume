import React, { lazy, Suspense, useState } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LazyLoad from '../../components/common/LazyLoad';

// Lazy load components
const ProjectsFilter = lazy(() => import('../../components/Projects/ProjectsFilter'));
const ProjectsList = lazy(() => import('../../components/Projects/ProjectsList'));
const ProjectsPagination = lazy(() => import('../../components/Projects/ProjectsPagination'));

const ProjectsPage = () => {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Sample data - in a real app, this would come from an API or data service
  const allProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-featured online store with cart, payments, and admin dashboard',
      image: '/images/projects/ecommerce.jpg',
      tags: ['React', 'Node.js', 'MongoDB'],
      category: 'web',
      link: '/projects/ecommerce',
      github: 'https://github.com/yourusername/ecommerce',
      featured: true
    },
    {
      id: 2,
      title: 'Portfolio CMS',
      description: 'A content management system for creators to showcase their work',
      image: '/images/projects/portfolio-cms.jpg',
      tags: ['React', 'Firebase', 'Material UI'],
      category: 'web',
      link: '/projects/portfolio-cms',
      github: 'https://github.com/yourusername/portfolio-cms',
      featured: true
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'A productivity app for managing tasks and projects with team collaboration features',
      image: '/images/projects/task-app.jpg',
      tags: ['React', 'Redux', 'Express'],
      category: 'web',
      link: '/projects/task-app',
      github: 'https://github.com/yourusername/task-app',
      featured: false
    },
    {
      id: 4,
      title: 'Weather Dashboard',
      description: 'A real-time weather tracking application with interactive maps',
      image: '/images/projects/weather-app.jpg',
      tags: ['JavaScript', 'API Integration', 'CSS'],
      category: 'web',
      link: '/projects/weather-app',
      github: 'https://github.com/yourusername/weather-app',
      featured: false
    },
    {
      id: 5,
      title: 'Mobile Fitness Tracker',
      description: 'A cross-platform mobile app for tracking workouts and fitness progress',
      image: '/images/projects/fitness-app.jpg',
      tags: ['React Native', 'Firebase', 'Health API'],
      category: 'mobile',
      link: '/projects/fitness-app',
      github: 'https://github.com/yourusername/fitness-app',
      featured: false
    },
    {
      id: 6,
      title: 'Recipe Finder',
      description: 'A web app that helps users find recipes based on available ingredients',
      image: '/images/projects/recipe-app.jpg',
      tags: ['Vue.js', 'Node.js', 'MongoDB'],
      category: 'web',
      link: '/projects/recipe-app',
      github: 'https://github.com/yourusername/recipe-app',
      featured: false
    },
    {
      id: 7,
      title: 'Social Media Dashboard',
      description: 'An analytics dashboard for tracking social media performance',
      image: '/images/projects/social-dashboard.jpg',
      tags: ['React', 'D3.js', 'REST API'],
      category: 'web',
      link: '/projects/social-dashboard',
      github: 'https://github.com/yourusername/social-dashboard',
      featured: false
    },
    {
      id: 8,
      title: 'Inventory Management System',
      description: 'A desktop application for managing inventory and sales for small businesses',
      image: '/images/projects/inventory-system.jpg',
      tags: ['Electron', 'React', 'SQLite'],
      category: 'desktop',
      link: '/projects/inventory-system',
      github: 'https://github.com/yourusername/inventory-system',
      featured: false
    }
  ];

  // Filter projects based on the current filter
  const filteredProjects = currentFilter === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === currentFilter);

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of projects section
    window.scrollTo({
      top: document.querySelector('.projects-page').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Applications' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'desktop', name: 'Desktop Software' }
  ];

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>My Projects</h1>
        <p>A collection of my work across various technologies and platforms</p>
      </div>

      {/* Projects filter - loads with the page */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectsFilter 
          categories={categories} 
          currentFilter={currentFilter} 
          onFilterChange={handleFilterChange} 
        />
      </Suspense>

      {/* Projects list - lazy loaded but high priority */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectsList projects={currentProjects} />
      </Suspense>

      {/* Pagination - lazy loaded when scrolled to bottom */}
      <LazyLoad>
        <Suspense fallback={<LoadingSpinner />}>
          <ProjectsPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </Suspense>
      </LazyLoad>
    </div>
  );
};

export default ProjectsPage;
