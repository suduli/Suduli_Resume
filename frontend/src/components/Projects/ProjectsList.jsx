import React, { lazy, Suspense } from 'react';
import './ProjectsList.css';

// Lazy load the ProjectCard component
const ProjectCard = lazy(() => import('./ProjectCard'));

const ProjectsList = ({ projects }) => {
  return (
    <div className="projects-list">
      {projects.length === 0 ? (
        <div className="no-projects">
          <p>No projects found matching the selected filter.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <Suspense key={project.id} fallback={<div className="project-card-placeholder"></div>}>
              <ProjectCard project={project} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
