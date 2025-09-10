import React from 'react';
import './Skills.css';
import LazyLoad from '../common/LazyLoad';

const Skills = ({ data }) => {
  return (
    <section className="skills-section">
      <div className="section-header">
        <h2>{data.title || 'Skills'}</h2>
        <p>{data.description || 'My technical expertise and competencies'}</p>
      </div>
      
      {data.categories ? (
        // For About page - categories format
        <div className="skills-categories">
          {data.categories.map((category, index) => (
            <div className="skill-category" key={index}>
              <h3>{category.name}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <LazyLoad key={skillIndex}>
                    <div className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className="skill-progress" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  </LazyLoad>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // For Home page - simple list format
        <div className="skills-grid">
          {data.skills.map((skill, index) => (
            <LazyLoad key={index}>
              <div className="skill-card">
                {skill.icon && (
                  <div className="skill-icon">
                    <i className={`fab fa-${skill.icon}`}></i>
                  </div>
                )}
                <h3>{skill.name}</h3>
                {skill.level && (
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </LazyLoad>
          ))}
        </div>
      )}
    </section>
  );
};

export default Skills;
