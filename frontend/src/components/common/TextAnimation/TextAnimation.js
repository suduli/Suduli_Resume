import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeAnimationAdapter from '../../../services/ThemeAnimationAdapter';
import styles from './TextAnimation.module.css';

/**
 * Text animation component for animated text effects
 * @param {Object} props - Component props
 * @param {string} props.text - Text to animate
 * @param {string} props.element - HTML element to render ('h1', 'h2', 'p', 'span', 'div')
 * @param {string} props.animation - Animation type ('fadeIn', 'fadeInUp', 'typewriter', 'slideIn')
 * @param {number} props.delay - Delay before starting animation (ms)
 * @param {number} props.duration - Animation duration (ms)
 * @param {boolean} props.once - Whether animation should only play once
 * @param {React.ReactNode} props.children - Children to render instead of text
 * @returns {JSX.Element} Rendered TextAnimation component
 */
const TextAnimation = ({
  text,
  element = 'div',
  animation = 'fadeIn',
  delay = 0,
  duration = 1000,
  once = true,
  children,
  className,
  // For testing only
  __testingForceVisible = false,
  ...props
}) => {
  const { theme, themeAnimations } = useTheme();
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(__testingForceVisible);
  // Track animation completion for potential future use
  const [, setIsAnimationComplete] = useState(false);
  
  // For typewriter animation
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Apply theme-based animation settings
  useEffect(() => {
    if (!elementRef.current || !theme) return;
    
    // Get text effect settings from ThemeAnimationAdapter
    const textSettings = ThemeAnimationAdapter.getTextEffectSettings(theme);
    
    // Apply text effect settings as CSS variables
    if (textSettings) {
      elementRef.current.style.setProperty('--text-glow', textSettings.textGlow || 'none');
      elementRef.current.style.setProperty('--text-animation-speed', 
        `${textSettings.textAnimationSpeed || 1}s`);
      elementRef.current.style.setProperty('--text-shadow', textSettings.textShadow || 'none');
      
      // Adjust typewriter speed if applicable
      if (animation === 'typewriter' && text) {
        // Reset typing if needed
        if (currentIndex < text.length) {
          setDisplayText('');
          setCurrentIndex(0);
        }
      }
    }
  }, [theme, themeAnimations, animation, currentIndex, text]);

  // Determine animation class
  const getAnimationClass = () => {
    if (!isVisible) return '';
    
    switch (animation) {
    case 'fadeIn':
      return styles.fadeIn;
    case 'fadeInUp':
      return styles.fadeInUp;
    case 'slideIn':
      return styles.slideIn;
    case 'typewriter':
      return ''; // Typewriter has its own logic
    default:
      return '';
    }
  };

  // Handle typewriter animation
  useEffect(() => {
    if (animation !== 'typewriter' || !isVisible || !text) return;
    
    // Reset display text when visibility changes
    if (isVisible && currentIndex === 0) {
      setDisplayText('');
    }
    
    if (currentIndex < text.length) {
      const typeTimeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Speed of typing
      
      return () => clearTimeout(typeTimeout);
    } else {
      setIsAnimationComplete(true);
    }
  }, [animation, isVisible, text, currentIndex]);

  // Set up intersection observer for triggering animations
  useEffect(() => {
    // Skip if testing override is active
    if (__testingForceVisible) return;
    
    if (!elementRef.current) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    
    const currentRef = elementRef.current;
    
    // Create observer if available and has expected API
    let observer;
    try {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Delay the animation start
            setTimeout(() => {
              setIsVisible(true);
            }, delay);

            // Unobserve if animation only happens once and API exists
            if (once && observer && typeof observer.unobserve === 'function') {
              try { observer.unobserve(entry.target); } catch (e) { /* ignore */ }
            }
          } else if (!once) {
            // Reset animation if not 'once'
            setIsVisible(false);
            if (animation === 'typewriter') {
              setDisplayText('');
              setCurrentIndex(0);
              setIsAnimationComplete(false);
            }
          }
        });
      }, options);
    } catch (e) {
      // If IntersectionObserver isn't supported or mock is malformed, fallback to immediate visibility
      observer = null;
    }

    if (observer && typeof observer.observe === 'function') {
      observer.observe(currentRef);
    } else {
      // Fallback: mark visible immediately in test environments that don't provide a valid observer
      setIsVisible(true);
    }
    
    return () => {
      try {
        if (observer && typeof observer.unobserve === 'function') {
          observer.unobserve(currentRef);
        } else if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
        }
      } catch (e) {
        // ignore any errors during cleanup
      }
    };
  }, [delay, once, animation, __testingForceVisible]);

  // Set animation duration
  const animationStyle = {
    '--animation-duration': `${duration}ms`,
  };

  // Generate container classes
  const containerClasses = [
    styles.container,
    getAnimationClass(),
    className
  ].filter(Boolean).join(' ');

  // Define custom element
  const CustomTag = element;

  return (
    <CustomTag
      ref={elementRef}
      className={containerClasses}
      style={animationStyle}
      data-testid="text-animation"
      data-animation={animation}
      data-theme={theme}
      data-visible={isVisible ? 'true' : 'false'}
      {...props}
    >
      {animation === 'typewriter' ? displayText : (text || children)}
    </CustomTag>
  );
};

TextAnimation.propTypes = {
  text: PropTypes.string,
  element: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div']),
  animation: PropTypes.oneOf(['fadeIn', 'fadeInUp', 'typewriter', 'slideIn']),
  delay: PropTypes.number,
  duration: PropTypes.number,
  once: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  __testingForceVisible: PropTypes.bool
};

export default TextAnimation;
