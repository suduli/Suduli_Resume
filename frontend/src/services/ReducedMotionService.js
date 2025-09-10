/**
 * Reduced Motion Service
 * Implementation for task T055
 * 
 * This service handles detection and adaptation for users who prefer reduced motion
 * by checking the prefers-reduced-motion media query and providing utilities to
 * adjust animations accordingly.
 */

import ThemeManager from './ThemeManager';

class ReducedMotionService {
  constructor() {
    this.prefersReducedMotion = false;
    this.listeners = new Set();
    this.mediaQuery = null;
    this.initialized = false;
  }

  /**
   * Initialize the service and set up media query listeners
   */
  initialize() {
    if (this.initialized) return;
    
    // Check if matchMedia is available (for SSR compatibility)
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = this.mediaQuery.matches;
      
      // Modern API (addEventListener)
      if (typeof this.mediaQuery.addEventListener === 'function') {
        this.mediaQuery.addEventListener('change', this.handleMediaQueryChange);
      } 
      // Legacy API (addListener)
      else if (typeof this.mediaQuery.addListener === 'function') {
        this.mediaQuery.addListener(this.handleMediaQueryChange);
      }
    } else {
      // Default to false if matchMedia is not available
      this.prefersReducedMotion = false;
    }
    
    // Notify ThemeManager about reduced motion preference
    this.notifyThemeManager();
    
    this.initialized = true;
    return this;
  }

  /**
   * Handle changes to the prefers-reduced-motion media query
   * @param {MediaQueryListEvent} event - The media query change event
   */
  handleMediaQueryChange = (event) => {
    this.prefersReducedMotion = event.matches;
    this.notifyThemeManager();
    this.notifyListeners();
  };

  /**
   * Notify ThemeManager about reduced motion preference
   */
  notifyThemeManager() {
    if (ThemeManager && ThemeManager.setReducedMotion) {
      ThemeManager.setReducedMotion(this.prefersReducedMotion);
    }
  }

  /**
   * Check if reduced motion is preferred
   * @returns {boolean} True if reduced motion is preferred
   */
  isReducedMotionPreferred() {
    return this.prefersReducedMotion;
  }

  /**
   * Add a listener for reduced motion preference changes
   * @param {Function} listener - The listener function to call when preference changes
   */
  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.add(listener);
      
      // Immediately call the listener with the current state
      listener(this.prefersReducedMotion);
    }
  }

  /**
   * Remove a listener for reduced motion preference changes
   * @param {Function} listener - The listener function to remove
   */
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners about a preference change
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.prefersReducedMotion);
      } catch (error) {
        console.error('Error in reduced motion listener:', error);
      }
    });
  }

  /**
   * Manually override the reduced motion preference
   * Useful for testing or providing a user toggle
   * @param {boolean} preferReducedMotion - Whether to prefer reduced motion
   */
  setOverride(preferReducedMotion) {
    const changed = this.prefersReducedMotion !== preferReducedMotion;
    this.prefersReducedMotion = preferReducedMotion;
    
    if (changed) {
      this.notifyThemeManager();
      this.notifyListeners();
    }
  }

  /**
   * Get animation options based on reduced motion preference
   * @param {Object} standardOptions - The standard animation options
   * @param {Object} reducedOptions - The reduced motion animation options
   * @returns {Object} The appropriate animation options
   */
  getAnimationOptions(standardOptions, reducedOptions) {
    return this.prefersReducedMotion ? reducedOptions : standardOptions;
  }

  /**
   * Clean up event listeners when the service is no longer needed
   */
  cleanup() {
    if (this.mediaQuery) {
      if (typeof this.mediaQuery.removeEventListener === 'function') {
        this.mediaQuery.removeEventListener('change', this.handleMediaQueryChange);
      } else if (typeof this.mediaQuery.removeListener === 'function') {
        this.mediaQuery.removeListener(this.handleMediaQueryChange);
      }
    }
    
    this.listeners.clear();
    this.initialized = false;
  }
}

// Create and export a singleton instance
const reducedMotionService = new ReducedMotionService();

export default reducedMotionService;
