/**
 * Mock implementation for ParticleBackground component
 */

import React from 'react';
import PropTypes from 'prop-types';

const ParticleBackground = ({ 
  containerId = 'particles-background', 
  className = '', 
  config = null,
  ...props 
}) => {
  // Simple mock that just renders a container div
  return (
    <div 
      id={containerId}
      data-testid="particle-background" 
      className={className}
      {...props}
    />
  );
};

ParticleBackground.propTypes = {
  containerId: PropTypes.string,
  className: PropTypes.string,
  config: PropTypes.object
};

export default ParticleBackground;
