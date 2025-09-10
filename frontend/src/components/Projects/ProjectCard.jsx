import React from 'react';
import { motion } from 'framer-motion';
import LazyImage from '../common/LazyImage';

const ProjectCard = ({ project }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="project-card"
      variants={itemVariants}
    >
      <div className="project-image-container">
        <LazyImage 
          src={project.image} 
          alt={project.title} 
          className="project-image"
        />
        <div className="project-overlay">
          <a 
            href={project.link} 
            className="project-link"
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`View ${project.title} project`}
          >
            View Project
          </a>
        </div>
      </div>
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tech">
          {project.technologies.map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
