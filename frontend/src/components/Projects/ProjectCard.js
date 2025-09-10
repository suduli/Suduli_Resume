import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeAnimationAdapter from '../../services/ThemeAnimationAdapter';
import styles from './ProjectCard.module.css';

/**
 * ProjectCard component displays individual project information with 
 * interactive hover effects and animations.
 * Implementation for task T046.
 * 
 * Performance optimized with:
 * - useCallback for event handlers
 * - React.memo to prevent unnecessary re-renders
 */
const ProjectCard = ({ project }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [cardAnimation, setCardAnimation] = useState({
    maxTilt: 8,
    glowColor: '',
    transitionSpeed: 0.4,
    hoverScale: 1.02
  });
  
  // Register with ThemeAnimationAdapter on mount
  useEffect(() => {
    if (!theme) return;
    
    const cardSettings = ThemeAnimationAdapter.getCardAnimationSettings(theme);
    if (cardSettings) {
      setCardAnimation({
        maxTilt: 8,
        glowColor: cardSettings.cardGlow || '0 0 15px 2px var(--color-accent-primary)',
        transitionSpeed: cardSettings.cardTransitionSpeed || 0.4,
        hoverScale: cardSettings.cardHoverEffect === 'scale' ? 1.05 : 1.02
      });
      
      // Register this component with ThemeAnimationAdapter for future updates
      ThemeAnimationAdapter.registerAnimation({
        type: 'projectCard',
        element: cardRef.current,
        theme
      }, theme);
    }
  }, [theme]);

  // Calculate tilt transform based on mouse position
  const getTiltTransform = useCallback(() => {
    // For keyboard accessibility, no tilt is applied
    return isHovered ? `scale(${cardAnimation.hoverScale})` : '';
  }, [isHovered, cardAnimation.hoverScale]);

  // Memoized event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  const handleFocus = useCallback(() => setIsHovered(true), []);
  
  const handleBlur = useCallback((e) => {
    // Only set isHovered to false if focus is leaving the card and not going to a child element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsHovered(false);
    }
  }, []);
  
  const handleKeyDown = useCallback((e) => {
    // Show overlay on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsHovered(true);
    }
  }, []);

  return (
    <article 
      ref={cardRef}
      className={`${styles.projectCard} ${isHovered ? styles.hovered : ''} ${project.featured ? styles.featured : ''}`}
      style={{ 
        transform: getTiltTransform(),
        transition: `all ${cardAnimation.transitionSpeed}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`
      }}
      data-testid={`project-card-${project.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={styles.glowBorder}
        style={{
          boxShadow: cardAnimation.glowColor,
          transition: `opacity ${cardAnimation.transitionSpeed}s ease`
        }}
      ></div>
      
      {/* Featured Badge */}
      {project.featured && (
        <div 
          className={styles.featuredBadge} 
          aria-hidden="true" 
        >
          <span>Featured</span>
        </div>
      )}
      
      {/* Project Image with Overlay */}
      <div 
        className={styles.imageContainer}
        tabIndex="0"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        role="button"
        aria-label={`View project details for ${project.title}`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} project screenshot`}
            className={styles.projectImage}
            loading="lazy" // Add lazy loading for images
          />
        ) : (
          <div className={styles.placeholderImage}>
            <span className={styles.projectInitial}>
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className={`${styles.overlay} ${isHovered ? styles.showOverlay : ''}`}>
          <div className={styles.overlayContent}>
            <div className={styles.buttons}>
              {project.links && project.links.demo && (
                <a 
                  href={project.links.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.button}
                  data-testid={`demo-link-${project.id}`}
                  aria-label={`View live demo of ${project.title}`}
                  onFocus={handleFocus}
                >
                  Live Demo
                </a>
              )}
              {project.links && project.links.github && (
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.button}
                  data-testid={`code-link-${project.id}`}
                  aria-label={`View source code for ${project.title}`}
                  onFocus={handleFocus}
                >
                  View Code
                </a>
              )}
              {project.links && project.links.documentation && (
                <a 
                  href={project.links.documentation} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.button}
                  data-testid={`documentation-link-${project.id}`}
                  aria-label={`Read documentation for ${project.title}`}
                  onFocus={handleFocus}
                >
                  Documentation
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className={styles.projectInfo}>
        <h3 className={styles.projectTitle} id={`project-title-${project.id}`}>{project.title}</h3>
        
        {/* Tags/Technologies */}
        <div 
          className={styles.tags}
          role="list"
          aria-label={`Technologies used in ${project.title}`}
        >
          {project.technologies.map((tech, index) => (
            <span 
              key={`${project.id}-tech-${index}`} 
              className={styles.tag}
              role="listitem"
              style={{
                animationDelay: `${index * 0.1}s`,
                backgroundColor: theme === 'cyberpunk' 
                  ? `hsl(${(index * 40) % 360}, 80%, 60%)` 
                  : undefined
              }}
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Project Description */}
        <p className={styles.projectDescription}>{project.description}</p>
        
        {/* Additional Info that shows on hover */}
        <div className={`${styles.additionalInfo} ${isHovered ? styles.showInfo : ''}`}>
          {project.highlights && project.highlights.length > 0 && (
            <div className={styles.highlights}>
              <h4 className={styles.highlightsTitle} id={`highlights-title-${project.id}`}>Key Features:</h4>
              <ul 
                className={styles.highlightsList}
                aria-labelledby={`highlights-title-${project.id}`}
              >
                {project.highlights.map((highlight, index) => (
                  <li 
                    key={`${project.id}-highlight-${index}`}
                    className={styles.highlightItem}
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Date Information */}
          {project.date && (
            <div className={styles.dateInfo}>
              <span className={styles.date}>{project.date}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    links: PropTypes.shape({
      demo: PropTypes.string,
      github: PropTypes.string,
      documentation: PropTypes.string
    }),
    highlights: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
    featured: PropTypes.bool
  }).isRequired,
};

// Using React.memo to prevent unnecessary re-renders
export default React.memo(ProjectCard, (prevProps, nextProps) => {
  // Only re-render if the project id changes
  return prevProps.project.id === nextProps.project.id;
});
