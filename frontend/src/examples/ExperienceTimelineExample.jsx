/**
 * Example of how to use the Experience model in a component
 * 
 * This is for demonstration purposes only and is not meant to be included in the actual project.
 */

import React from 'react';
import { 
  sampleExperiences, 
  formatDate, 
  calculateDuration, 
  formatDuration,
  sortExperiencesByDate
} from './models/Experience';

/**
 * ExperienceTimeline component that displays work experience entries
 */
const ExperienceTimeline = () => {
  // Sort experiences with newest first
  const sortedExperiences = sortExperiencesByDate(sampleExperiences);
  
  return (
    <div className="experience-timeline">
      <h2>Professional Experience</h2>
      
      <div className="timeline">
        {sortedExperiences.map(experience => (
          <div key={experience.id} className="timeline-item">
            <div className="timeline-header">
              <h3>{experience.position}</h3>
              <h4>{experience.company}</h4>
              <div className="timeline-meta">
                <span className="timeline-location">{experience.location}</span>
                <span className="timeline-dates">
                  {formatDate(experience.startDate, 'short')} - {formatDate(experience.endDate, 'short')}
                </span>
                <span className="timeline-duration">
                  {formatDuration(calculateDuration(experience.startDate, experience.endDate))}
                </span>
              </div>
            </div>
            
            <p className="timeline-description">{experience.description}</p>
            
            {experience.highlights && experience.highlights.length > 0 && (
              <div className="timeline-highlights">
                <h5>Key Achievements:</h5>
                <ul>
                  {experience.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {experience.technologies && experience.technologies.length > 0 && (
              <div className="timeline-technologies">
                <h5>Technologies:</h5>
                <div className="technology-tags">
                  {experience.technologies.map((tech, index) => (
                    <span key={index} className="technology-tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="experience-summary">
        <p>
          Total Professional Experience: <strong>7+ years</strong> in Embedded Test Engineering
        </p>
      </div>
    </div>
  );
};

export default ExperienceTimeline;
