// Placeholder for ProjectCard component
// Will be implemented in task T046
import React from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ project }) => {
  // This will be replaced with actual implementation with hover animations
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    link: PropTypes.string,
    github: PropTypes.string
  }).isRequired
};

export default ProjectCard;
