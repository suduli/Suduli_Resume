/**
 * Mock for TextAnimation component
 * Use this in tests for components that use TextAnimation
 */

import React from 'react';

const MockTextAnimation = ({ 
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
  // Create a data-testid that includes animation type and delay for easier testing
  const testId = `mock-text-animation-${animation}-${delay}`;
  
  // Determine which element type to render
  const CustomTag = element;
  
  return (
    <CustomTag 
      data-testid={testId}
      data-animation={animation}
      data-delay={delay}
      data-duration={duration}
      className={className}
      {...props}
    >
      {text || children}
    </CustomTag>
  );
};

export default MockTextAnimation;
