/**
 * Custom hook for accessing the reduced motion preference
 * Part of task T055 - Create prefers-reduced-motion support
 */

import { useState, useEffect } from 'react';
import reducedMotionService from '../services/ReducedMotionService';

/**
 * React hook that returns whether reduced motion is preferred
 * and updates when the preference changes
 * @returns {boolean} True if reduced motion is preferred
 */
export function useReducedMotion() {
  // Initialize the service if not already done
  if (!reducedMotionService.initialized) {
    reducedMotionService.initialize();
  }
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    reducedMotionService.isReducedMotionPreferred()
  );
  
  useEffect(() => {
    // Set up a listener for changes to the reduced motion preference
    const handleReducedMotionChange = (isReducedMotion) => {
      setPrefersReducedMotion(isReducedMotion);
    };
    
    // Add the listener
    reducedMotionService.addListener(handleReducedMotionChange);
    
    // Clean up the listener when the component unmounts
    return () => {
      reducedMotionService.removeListener(handleReducedMotionChange);
    };
  }, []);
  
  return prefersReducedMotion;
}

/**
 * Get animation options based on reduced motion preference
 * @param {Object} standardOptions - The standard animation options
 * @param {Object} reducedOptions - The reduced motion animation options
 * @returns {Object} The appropriate animation options
 */
export function getReducedMotionAnimationOptions(standardOptions, reducedOptions) {
  // Initialize the service if not already done
  if (!reducedMotionService.initialized) {
    reducedMotionService.initialize();
  }
  
  return reducedMotionService.getAnimationOptions(standardOptions, reducedOptions);
}

/**
 * Default export for both functions
 */
const reducedMotionHooks = {
  useReducedMotion,
  getReducedMotionAnimationOptions
};

export default reducedMotionHooks;
