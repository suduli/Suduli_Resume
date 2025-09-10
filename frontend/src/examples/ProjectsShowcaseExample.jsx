/**
 * Example of how to use the Projects model in a component
 * 
 * This is for demonstration purposes only and is not meant to be included in the actual project.
 */

import React, { useState, useEffect } from 'react';
import { 
  sampleProjects, 
  sortProjects,
  filterProjectsBySearchTerm,
  filterProjectsByTechnology,
  getUniqueTechnologies
} from './models/Projects';

/**
 * ProjectsShowcase component that displays project entries with filtering and sorting
 */
const ProjectsShowcase = () => {
  // Using projects directly from sampleProjects
  const projects = sampleProjects;
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [sortField, setSortField] = useState('title');
  const [sortAscending, setSortAscending] = useState(true);
  
  // Get all unique technologies for filter options
  const allTechnologies = getUniqueTechnologies(projects);
  
  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let result = [...projects];
    
    // Apply technology filter if any technologies are selected
    if (selectedTechnologies.length > 0) {
      result = filterProjectsByTechnology(result, selectedTechnologies);
    }
    
    // Apply search term filter if search term exists
    if (searchTerm) {
      result = filterProjectsBySearchTerm(result, searchTerm);
    }
    
    // Apply sorting
    result = sortProjects(result, sortField, sortAscending);
    
    setFilteredProjects(result);
  }, [projects, searchTerm, selectedTechnologies, sortField, sortAscending]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle technology selection change
  const handleTechnologyChange = (tech) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (field === sortField) {
      // If clicking the same field, toggle sort direction
      setSortAscending(!sortAscending);
    } else {
      // If clicking a new field, set it and default to ascending
      setSortField(field);
      setSortAscending(true);
    }
  };
  
  return (
    <div className="projects-showcase">
      <h2>Projects</h2>
      
      {/* Search and filters */}
      <div className="projects-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="technology-filters">
          <h4>Filter by Technology:</h4>
          <div className="technology-options">
            {allTechnologies.map(tech => (
              <label key={tech} className="technology-option">
                <input
                  type="checkbox"
                  checked={selectedTechnologies.includes(tech)}
                  onChange={() => handleTechnologyChange(tech)}
                />
                {tech}
              </label>
            ))}
          </div>
        </div>
        
        <div className="sort-options">
          <h4>Sort by:</h4>
          <button 
            className={sortField === 'title' ? 'active' : ''}
            onClick={() => handleSortChange('title')}
          >
            Title {sortField === 'title' && (sortAscending ? '↑' : '↓')}
          </button>
          <button 
            className={sortField === 'technologies' ? 'active' : ''}
            onClick={() => handleSortChange('technologies')}
          >
            Technologies {sortField === 'technologies' && (sortAscending ? '↑' : '↓')}
          </button>
        </div>
      </div>
      
      {/* Projects grid */}
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="project-card">
              {project.image && (
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
              )}
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                
                {project.role && (
                  <div className="project-role">Role: {project.role}</div>
                )}
                
                <p className="project-description">{project.description}</p>
                
                {project.achievements && project.achievements.length > 0 && (
                  <div className="project-achievements">
                    <h4>Key Achievements:</h4>
                    <ul>
                      {project.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-technologies">
                    <h4>Technologies:</h4>
                    <div className="technology-tags">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="technology-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.collaboration && project.collaboration.length > 0 && (
                  <div className="project-collaboration">
                    <h4>Collaboration:</h4>
                    <ul>
                      {project.collaboration.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.links && project.links.length > 0 && (
                  <div className="project-links">
                    {project.links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`project-link project-link-${link.type}`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <p>No projects match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsShowcase;
