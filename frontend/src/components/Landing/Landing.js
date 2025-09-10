import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Button/Button';
import ParticleBackground from '../common/ParticleBackground';
import TextAnimation from '../common/TextAnimation';
import styles from './Landing.module.css';

/**
 * Landing component with particle animation and animated text
 * @param {Object} props - Component props
 * @param {string} props.title - Main title text
 * @param {string} props.subtitle - Subtitle text
 * @param {string} props.description - Longer description text
 * @param {Array} props.buttons - Array of button configurations
 * @param {Object} props.particleConfig - Configuration for particle animation
 * @returns {JSX.Element} Rendered Landing component
 */
const Landing = ({
  title = 'Hi, I\'m John Doe',
  subtitle = 'Full Stack Developer',
  description = 'I build beautiful, responsive web applications with modern technologies.',
  buttons = [
    { label: 'View Projects', href: '#projects', variant: 'primary' },
    { label: 'Contact Me', href: '#contact', variant: 'outline' }
  ],
  particleConfig,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  
  const containerClasses = [
    styles.landing,
    styles[`landing-${theme}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <section 
      className={containerClasses} 
      ref={containerRef}
      data-testid="landing-container"
      {...props}
    >
      <ParticleBackground 
        config={particleConfig} 
        containerId="particle-landing-bg"
      />
      
      <div className={styles.content}>
        <TextAnimation 
          className={styles.title}
          text={title}
          element="h1"
          animation="typewriter"
          delay={300}
        />
        
        <TextAnimation 
          className={styles.subtitle}
          text={subtitle}
          element="h2"
          animation="fadeIn"
          delay={1500}
        />
        
        <TextAnimation 
          className={styles.description}
          text={description}
          element="p"
          animation="fadeIn"
          delay={2000}
        />
        
        <div className={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <TextAnimation
              key={index}
              element="div"
              animation="fadeInUp"
              delay={2500 + (index * 200)}
              className={styles.buttonWrapper}
            >
              <Button
                label={button.label}
                href={button.href}
                variant={button.variant || 'primary'}
                size={button.size || 'medium'}
                onClick={button.onClick}
              />
            </TextAnimation>
          ))}
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll Down</span>
        <span className={styles.scrollArrow}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </span>
      </div>
    </section>
  );
};

Landing.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      variant: PropTypes.string,
      size: PropTypes.string,
      onClick: PropTypes.func
    })
  ),
  particleConfig: PropTypes.object,
  className: PropTypes.string
};

export default Landing;
