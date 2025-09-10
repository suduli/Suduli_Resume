import React from 'react';
import PropTypes from 'prop-types';

// Mock implementation of TextAnimation component
const TextAnimation = ({ 
  children, 
  text, 
  as: Component = 'div', 
  animation = 'fadeIn', 
  delay = 0,
  ...props 
}) => {
  const content = text || children;
  
  return (
    <Component 
      data-testid={`mock-text-animation-${animation}-${delay}`} 
      {...props}
    >
      {content}
    </Component>
  );
};

TextAnimation.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  animation: PropTypes.string,
  delay: PropTypes.number,
};

export default TextAnimation;
