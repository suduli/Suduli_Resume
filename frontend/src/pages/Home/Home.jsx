import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LazyLoad from '../../components/common/LazyLoad';

// Lazy load components
const HeroSection = lazy(() => import('../../components/Hero/Hero'));
const FeaturedProjects = lazy(() => import('../../components/Projects/FeaturedProjects'));
const Skills = lazy(() => import('../../components/Skills/Skills'));
const Testimonials = lazy(() => import('../../components/Testimonials/Testimonials'));

const Home = () => {
  const featuredProjectsData = {
    // This would come from your data service in a real app
    title: 'Featured Projects',
    description: 'Here are some of my most notable works',
    projects: [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'A full-featured online store with cart, payments, and admin dashboard',
        image: '/images/projects/ecommerce.jpg',
        tags: ['React', 'Node.js', 'MongoDB'],
        link: '/projects/ecommerce',
        github: 'https://github.com/yourusername/ecommerce'
      },
      {
        id: 2,
        title: 'Portfolio CMS',
        description: 'A content management system for creators to showcase their work',
        image: '/images/projects/portfolio-cms.jpg',
        tags: ['React', 'Firebase', 'Material UI'],
        link: '/projects/portfolio-cms',
        github: 'https://github.com/yourusername/portfolio-cms'
      }
    ]
  };

  const skillsData = {
    title: 'Core Skills',
    description: 'Technologies I work with regularly',
    skills: [
      { name: 'React', level: 90, icon: 'react' },
      { name: 'JavaScript', level: 85, icon: 'javascript' },
      { name: 'Node.js', level: 80, icon: 'nodejs' },
      { name: 'HTML/CSS', level: 90, icon: 'html5' }
    ]
  };

  const testimonialsData = {
    title: 'Testimonials',
    testimonials: [
      {
        id: 1,
        text: 'Working with John was a fantastic experience. He delivered a high-quality website that exceeded our expectations.',
        author: 'Jane Smith',
        position: 'CEO, TechStart',
        avatar: '/images/testimonials/jane.jpg'
      },
      {
        id: 2,
        text: 'John is a talented developer who consistently delivers excellent work. His attention to detail and problem-solving skills are outstanding.',
        author: 'Michael Johnson',
        position: 'Product Manager, WebSolutions',
        avatar: '/images/testimonials/michael.jpg'
      }
    ]
  };

  return (
    <div className="home-page">
      {/* Hero section - loads immediately */}
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
      </Suspense>
      
      {/* Featured projects - lazy loaded when scrolled into view */}
      <LazyLoad>
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedProjects data={featuredProjectsData} />
        </Suspense>
      </LazyLoad>
      
      {/* Skills section - lazy loaded when scrolled into view */}
      <LazyLoad>
        <Suspense fallback={<LoadingSpinner />}>
          <Skills data={skillsData} />
        </Suspense>
      </LazyLoad>
      
      {/* Testimonials - lazy loaded when scrolled into view */}
      <LazyLoad>
        <Suspense fallback={<LoadingSpinner />}>
          <Testimonials data={testimonialsData} />
        </Suspense>
      </LazyLoad>
    </div>
  );
};

export default Home;
