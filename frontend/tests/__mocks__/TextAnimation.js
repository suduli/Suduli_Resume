/**
 * Mock implementation for TextAnimation component
 * This allows tests to run without the need for actual animation logic
 */

import React from 'react';
import PropTypes from 'prop-types';

const TextAnimation = ({ 
  text, 
  element = 'div', 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 1000, 
  once = true, 
  children, 
  className, 
  ...props 
}) => {
  // Create a test ID that includes the animation type and delay for easier test selection
  const testId = `mock-text-animation-${animation}-${delay}`;
  
  // Use the appropriate HTML element
  const CustomTag = element;
  
  // Simple mock that renders the content without animation
  return (
    <CustomTag 
      data-testid={testId} 
      className={className} 
      data-animation={animation}
      data-once={once}
      data-duration={duration}
      {...props}
    >
      {text || children}
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
  className: PropTypes.string
};

export default TextAnimation;
