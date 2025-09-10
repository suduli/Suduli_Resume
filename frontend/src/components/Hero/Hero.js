import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Button/Button';
import styles from './Hero.module.css';

/**
 * Hero component for the landing page
 * @param {Object} props - Component props
 * @param {string} props.title - Main title for the hero section
 * @param {string} props.subtitle - Subtitle or tagline
 * @param {string} props.description - Longer description text
 * @param {Array} props.buttons - Array of button configurations
 * @param {string} props.imageSrc - Source URL for the hero image
 * @param {string} props.imageAlt - Alt text for the hero image
 * @param {string} props.backgroundColor - Optional background color
 * @returns {JSX.Element} Rendered Hero component
 */
const Hero = ({
  title,
  subtitle,
  description,
  buttons,
  imageSrc,
  imageAlt,
  backgroundColor
}) => {
  const { theme } = useTheme();

  return (
    <section 
      className={`${styles.hero} ${styles[`hero-${theme}`]}`}
      style={backgroundColor ? { backgroundColor } : {}}
      role="banner"
      aria-label="Hero section"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
          {description && <p className={styles.description}>{description}</p>}
          
          {buttons && buttons.length > 0 && (
            <div className={styles.buttonGroup}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  label={button.label}
                  href={button.href}
                  onClick={button.onClick}
                  variant={button.variant || 'primary'}
                  size={button.size || 'medium'}
                />
              ))}
            </div>
          )}
        </div>
        
        {imageSrc && (
          <div className={styles.imageContainer}>
            <img 
              src={imageSrc} 
              alt={imageAlt || 'Hero image'} 
              className={styles.image} 
            />
          </div>
        )}
      </div>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
      variant: PropTypes.string,
      size: PropTypes.string
    })
  ),
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default Hero;
