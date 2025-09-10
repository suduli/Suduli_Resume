import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeAnimationAdapter from '../../services/ThemeAnimationAdapter';
import styles from './ProjectCard.module.css';

/**
 * ProjectCard component displays individual project information with 
 * interactive hover effects and animations.
 * Implementation for task T046.
 */
const ProjectCard = ({ project }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const [cardAnimation, setCardAnimation] = useState({
    maxTilt: 8,
    glowColor: '',
    transitionSpeed: 0.4,
    hoverScale: 1.02
  });
  
  // Get animation settings from ThemeAnimationAdapter
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
  
  // Detect touch devices on mount
  useEffect(() => {
    const isTouchCapable = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      navigator.msMaxTouchPoints > 0;
    
    setIsTouchDevice(isTouchCapable);
  }, []);

  // Handle mouse position for tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current || isTouchDevice) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  // Handler for mouse enter event
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Handler for mouse leave event
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0.5, y: 0.5 }); // Reset to center
  };
  
  // Calculate tilt transform based on mouse position
  const getTiltTransform = () => {
    if (isTouchDevice || !isHovered) return '';
    
    const xTilt = (mousePosition.x - 0.5) * cardAnimation.maxTilt;
    const yTilt = (mousePosition.y - 0.5) * -cardAnimation.maxTilt;
    
    return `perspective(1000px) rotateX(${yTilt}deg) rotateY(${xTilt}deg) scale(${cardAnimation.hoverScale})`;
  };

  return (
    <article 
      ref={cardRef}
      className={`${styles.projectCard} ${isHovered ? styles.hovered : ''} ${project.featured ? styles.featured : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ 
        transform: getTiltTransform(),
        transition: `all ${cardAnimation.transitionSpeed}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`
      }}
      data-testid={`project-card-${project.id}`}
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
        <div className={styles.featuredBadge} title="Featured Project">
          <span>Featured</span>
        </div>
      )}
      
      {/* Project Image with Overlay */}
      <div className={styles.imageContainer}>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} project screenshot`}
            className={styles.projectImage}
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
        <h3 className={styles.projectTitle}>{project.title}</h3>
        
        {/* Tags/Technologies */}
        <div className={styles.tags}>
          {project.technologies.map((tech, index) => (
            <span 
              key={`${project.id}-tech-${index}`} 
              className={styles.tag}
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
              <h4 className={styles.highlightsTitle}>Key Features:</h4>
              <ul className={styles.highlightsList}>
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

export default ProjectCard;
