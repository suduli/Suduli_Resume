import React from 'react';
import './FeaturedProjects.css';
import LazyImage from '../common/LazyImage';

const FeaturedProjects = ({ data }) => {
  return (
    <section className="featured-projects">
      <div className="section-header">
        <h2>{data.title}</h2>
        <p>{data.description}</p>
      </div>
      
      <div className="featured-projects-grid">
        {data.projects.map(project => (
          <div className="featured-project-card" key={project.id}>
            <div className="project-image">
              <LazyImage 
                src={project.image} 
                alt={project.title} 
                width="400"
                height="250"
              />
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span className="tag" key={index}>{tag}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.link} className="btn btn-small">View Project</a>
                <a href={project.github} className="btn btn-small btn-outline" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="view-all-projects">
        <a href="/projects" className="btn btn-secondary">View All Projects</a>
      </div>
    </section>
  );
};

export default FeaturedProjects;
