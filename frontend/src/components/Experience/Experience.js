import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import TextAnimation from '../common/TextAnimation';
import styles from './Experience.module.css';

/**
 * Experience component with animated timeline and awards
 * @param {Object} props - Component props
 * @param {Array} props.experiences - Array of experience objects
 * @param {Array} props.awards - Array of award objects
 * @returns {JSX.Element} Rendered Experience component
 */
const Experience = ({ experiences = [], awards = [], className }) => {
  const { theme } = useTheme();
  const [visibleItems, setVisibleItems] = useState({});
  const timelineRef = useRef(null);
  const awardsRef = useRef(null);
  
  const containerClasses = [
    styles.experienceSection,
    styles[`experience-${theme}`],
    className
  ].filter(Boolean).join(' ');

  // Setup Intersection Observer for animation on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const itemId = entry.target.getAttribute('data-id');
          setVisibleItems((prev) => ({ ...prev, [itemId]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all timeline items
    const timelineItems = timelineRef.current?.querySelectorAll(`.${styles.timelineItem}`);
    if (timelineItems) {
      timelineItems.forEach((item) => observer.observe(item));
    }

    // Observe award items
    const awardItems = awardsRef.current?.querySelectorAll(`.${styles.awardItem}`);
    if (awardItems) {
      awardItems.forEach((item) => observer.observe(item));
    }

    return () => {
      if (timelineItems) {
        timelineItems.forEach((item) => observer.unobserve(item));
      }
      if (awardItems) {
        awardItems.forEach((item) => observer.unobserve(item));
      }
    };
  }, [experiences, awards]);

  // Format date range
  const formatDateRange = (startDate, endDate) => {
    return `${startDate}${endDate ? ` - ${endDate}` : ' - Present'}`;
  };

  return (
    <section 
      className={containerClasses} 
      id="experience"
      data-testid="experience-section"
    >
      <div className={styles.container}>
        <TextAnimation
          element="h2"
          text="Experience"
          className={styles.sectionTitle}
          animation="fadeInUp"
          delay={200}
        />
        
        <div className={styles.timeline} ref={timelineRef}>
          {experiences.map((experience, index) => (
            <div 
              key={index}
              className={`${styles.timelineItem} ${visibleItems[`exp-${index}`] ? styles.visible : ''}`}
              data-id={`exp-${index}`}
              data-testid={`timeline-item-${index}`}
            >
              <div className={styles.timelineContent}>
                <div className={styles.dateRange}>
                  {formatDateRange(experience.startDate, experience.endDate)}
                </div>
                
                <h3 className={styles.jobTitle}>
                  {experience.position || experience.title}
                </h3>
                
                <div className={styles.companyInfo}>
                  <span className={styles.companyName}>{experience.company}</span>
                  {experience.location && (
                    <span className={styles.location}>{experience.location}</span>
                  )}
                </div>
                
                {experience.description && (
                  <p className={styles.description}>{experience.description}</p>
                )}
                
                {experience.responsibilities && experience.responsibilities.length > 0 && (
                  <ul className={styles.responsibilitiesList}>
                    {experience.responsibilities.map((responsibility, respIndex) => (
                      <li key={respIndex} className={styles.responsibilityItem}>
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                )}
                
                {experience.technologies && experience.technologies.length > 0 && (
                  <div className={styles.technologies}>
                    {experience.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className={styles.technologyTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles.timelineMarker}>
                <div className={styles.timelineDot}></div>
              </div>
            </div>
          ))}
        </div>
        
        {experiences.length === 0 && (
          <p className={styles.noExperience}>No experience data available.</p>
        )}
        
        {/* Awards Section */}
        {awards && awards.length > 0 && (
          <div className={styles.awardsSection} ref={awardsRef}>
            <TextAnimation
              element="h3"
              text="Awards & Recognition"
              className={styles.awardsTitle}
              animation="fadeInUp"
              delay={200}
            />
            
            <div className={styles.awardsGrid}>
              {awards.map((award, index) => (
                <div 
                  key={index}
                  className={`${styles.awardItem} ${visibleItems[`award-${index}`] ? styles.visible : ''}`}
                  data-id={`award-${index}`}
                  data-testid={`award-item-${index}`}
                >
                  <div className={styles.awardDate}>{award.date}</div>
                  <h4 className={styles.awardTitle}>{award.title}</h4>
                  <div className={styles.awardIssuer}>{award.issuer}</div>
                  {award.description && (
                    <p className={styles.awardDescription}>{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

Experience.propTypes = {
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
  title: PropTypes.string,
  position: PropTypes.string,
      company: PropTypes.string.isRequired,
      location: PropTypes.string,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string,
      description: PropTypes.string,
      responsibilities: PropTypes.arrayOf(PropTypes.string),
      technologies: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  awards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string.isRequired,
      issuer: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ),
  className: PropTypes.string
};

export default Experience;
