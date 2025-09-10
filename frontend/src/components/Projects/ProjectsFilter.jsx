import React from 'react';
import './ProjectsFilter.css';

const ProjectsFilter = ({ categories, currentFilter, onFilterChange }) => {
  return (
    <div className="projects-filter">
      <div className="filter-options">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-button ${currentFilter === category.id ? 'active' : ''}`}
            onClick={() => onFilterChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectsFilter;
