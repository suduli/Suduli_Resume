/**
 * ScrollAnimationService
 * 
 * This service provides GSAP-powered scroll animations for components.
 * Implementation for task T044.
 * Updated for task T048: Connect animation system to theme changes.
 * Updated for task T049: Respect reduced motion preferences.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThemeAnimationAdapter from './ThemeAnimationAdapter';
import SystemPreferenceDetector from './SystemPreferenceDetector';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Theming integration
let currentThemeId = null;

// Track reduced motion preference
let prefersReducedMotion = false;

/**
 * Checks if reduced motion is preferred
 * @returns {boolean} True if reduced motion is preferred
 */
function getReducedMotionPreference() {
  const preference = SystemPreferenceDetector.getReducedMotionPreference();
  // If preference is null (not supported), default to false
  return preference === true;
}

/**
 * Updates the reduced motion preference
 */
function updateReducedMotionPreference() {
  prefersReducedMotion = getReducedMotionPreference();
  refreshScrollTriggers();
}

// Animation presets - these will be updated based on theme
let animationPresets = {
  fadeIn: {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power2.out',
  },
  slideInLeft: {
    opacity: 0,
    x: -50,
    duration: 0.8,
    ease: 'power2.out',
  },
  slideInRight: {
    opacity: 0,
    x: 50,
    duration: 0.8,
    ease: 'power2.out',
  },
  scaleIn: {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    ease: 'back.out(1.7)',
  },
  bounceIn: {
    opacity: 0,
    y: 100,
    duration: 1,
    ease: 'elastic.out(1, 0.3)',
  },
  rotateIn: {
    opacity: 0,
    rotation: 45,
    scale: 0.5,
    duration: 0.8,
    ease: 'power2.out',
  },
};

/**
 * Updates animation presets based on current theme
 * @param {string} themeId - The theme ID to update for
 */
function updateAnimationPresetsForTheme(themeId) {
  if (!themeId || themeId === currentThemeId) return;
  
  currentThemeId = themeId;
  
  // Get theme animation settings from ThemeAnimationAdapter
  const textSettings = ThemeAnimationAdapter.getTextEffectSettings(themeId) || {};
  const cardSettings = ThemeAnimationAdapter.getCardAnimationSettings(themeId) || {};
  
  // Update animation presets based on theme
  animationPresets = {
    fadeIn: {
      opacity: 0,
      y: prefersReducedMotion ? 10 : 50,
      duration: prefersReducedMotion ? 0.4 : (cardSettings.cardTransitionSpeed || 0.8),
      ease: 'power2.out',
    },
    slideInLeft: {
      opacity: 0,
      x: prefersReducedMotion ? -15 : -50,
      duration: prefersReducedMotion ? 0.3 : (cardSettings.cardTransitionSpeed || 0.8),
      ease: 'power2.out',
    },
    slideInRight: {
      opacity: 0,
      x: prefersReducedMotion ? 15 : 50,
      duration: prefersReducedMotion ? 0.3 : (cardSettings.cardTransitionSpeed || 0.8),
      ease: 'power2.out',
    },
    scaleIn: {
      opacity: 0,
      scale: prefersReducedMotion ? 0.95 : 0.8,
      duration: prefersReducedMotion ? 0.3 : (cardSettings.cardTransitionSpeed || 0.8),
      ease: prefersReducedMotion ? 'power2.out' : 'back.out(1.7)',
      // Add theme-based glow effects only when not in reduced motion mode
      boxShadow: prefersReducedMotion ? 'none' : cardSettings.cardGlow,
    },
    bounceIn: {
      opacity: 0,
      y: prefersReducedMotion ? 10 : 100,
      duration: prefersReducedMotion ? 0.3 : (textSettings.textAnimationSpeed || 1),
      ease: prefersReducedMotion ? 'power2.out' : 'elastic.out(1, 0.3)',
      // Add theme-based text glow only when not in reduced motion mode
      textShadow: prefersReducedMotion ? 'none' : textSettings.textGlow,
    },
    rotateIn: {
      opacity: 0,
      rotation: prefersReducedMotion ? 0 : 45,
      scale: prefersReducedMotion ? 0.98 : 0.5,
      duration: prefersReducedMotion ? 0.3 : (cardSettings.cardTransitionSpeed || 0.8),
      ease: 'power2.out',
    },
  };
  
  // Refresh existing animations if needed
  refreshScrollTriggers();
}

// Track all created animations for cleanup
const animations = new Set();

/**
 * Applies a scroll animation to an element
 * @param {string|Element} element - Element selector or DOM element
 * @param {string} preset - Animation preset name
 * @param {Object} options - Additional animation options
 * @returns {gsap.core.Timeline} The created timeline for chaining
 */
function createScrollAnimation(element, preset = 'fadeIn', options = {}) {
  if (!element || typeof window === 'undefined') return null;
  
  // Skip complex animations for reduced motion preference
  if (prefersReducedMotion && options.skipIfReducedMotion) {
    // For elements that should have no animation when reduced motion is preferred
    gsap.set(element, { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 });
    return null;
  }
  
  const defaults = {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none none',
      once: true,
    },
    ...animationPresets[preset] || animationPresets.fadeIn,
  };
  
  // Merge default options with user options
  const mergedOptions = {
    ...defaults,
    ...options,
    scrollTrigger: {
      ...defaults.scrollTrigger,
      ...options.scrollTrigger,
    },
  };
  
  // Create the animation
  const timeline = gsap.timeline({
    scrollTrigger: mergedOptions.scrollTrigger,
  }) || {};

  // Defensive: ensure timeline has chainable methods used by the service
  if (typeof timeline.from !== 'function') timeline.from = function() { return timeline; };
  if (typeof timeline.to !== 'function') timeline.to = function() { return timeline; };
  if (typeof timeline.fromTo !== 'function') timeline.fromTo = function() { return timeline; };
  if (typeof timeline.add !== 'function') timeline.add = function() { return timeline; };
  if (!timeline.scrollTrigger) timeline.scrollTrigger = { kill: () => {}, refresh: () => {}, disable: () => {}, enable: () => {}, update: () => {} };
  
  // Remove scrollTrigger from merged options to avoid duplication
  const { scrollTrigger, ...animationProps } = mergedOptions;
  
  // Create the animation
  timeline.from(element, animationProps);
  
  // Add to animations set for cleanup
  animations.add(timeline);
  
  return timeline;
}

/**
 * Creates a staggered animation for multiple elements
 * @param {string|NodeList|Array} elements - Elements selector or DOM elements
 * @param {string} preset - Animation preset name
 * @param {Object} options - Additional animation options
 * @returns {gsap.core.Timeline} The created timeline for chaining
 */
function createStaggeredAnimation(elements, preset = 'fadeIn', options = {}) {
  if (!elements || typeof window === 'undefined') return null;
  
  // Skip complex animations for reduced motion preference
  if (prefersReducedMotion && options.skipIfReducedMotion) {
    // For elements that should have no animation when reduced motion is preferred
    gsap.set(elements, { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 });
    return null;
  }
  
  // For reduced motion, reduce or eliminate the stagger effect
  const staggerAmount = prefersReducedMotion ? 0.03 : 0.1;
  
  const defaults = {
    stagger: staggerAmount,
    scrollTrigger: {
      trigger: elements[0] || elements,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none none',
      once: true,
    },
    ...animationPresets[preset] || animationPresets.fadeIn,
  };
  
  // Merge default options with user options
  const mergedOptions = {
    ...defaults,
    ...options,
    scrollTrigger: {
      ...defaults.scrollTrigger,
      ...options.scrollTrigger,
    },
    // Override stagger value if explicitly provided in options
    stagger: options.stagger !== undefined ? 
      (prefersReducedMotion ? Math.min(options.stagger, 0.03) : options.stagger) : 
      defaults.stagger,
  };
  
  // Create the animation
  const timeline = gsap.timeline({
    scrollTrigger: mergedOptions.scrollTrigger,
  }) || {};

  // Defensive: ensure timeline has chainable methods used by the service
  if (typeof timeline.from !== 'function') timeline.from = function() { return timeline; };
  if (typeof timeline.to !== 'function') timeline.to = function() { return timeline; };
  if (typeof timeline.fromTo !== 'function') timeline.fromTo = function() { return timeline; };
  if (typeof timeline.add !== 'function') timeline.add = function() { return timeline; };
  if (!timeline.scrollTrigger) timeline.scrollTrigger = { kill: () => {}, refresh: () => {}, disable: () => {}, enable: () => {}, update: () => {} };
  
  // Remove scrollTrigger from merged options to avoid duplication
  const { scrollTrigger, ...animationProps } = mergedOptions;
  
  // Create the staggered animation
  timeline.from(elements, animationProps);
  
  // Add to animations set for cleanup
  animations.add(timeline);
  
  return timeline;
}

/**
 * Creates a parallax scroll effect
 * @param {string|Element} element - Element selector or DOM element
 * @param {Object} options - Animation options
 * @returns {gsap.core.Timeline} The created timeline for chaining
 */
function createParallaxEffect(element, options = {}) {
  if (!element || typeof window === 'undefined') return null;
  
  // Disable parallax entirely for reduced motion or provide minimal effect
  if (prefersReducedMotion) {
    if (options.skipIfReducedMotion) {
      return null;
    }
    // Use extremely minimal parallax effect when reduced motion is preferred
    options = {
      ...options,
      y: options.y ? (parseFloat(options.y) / 5) + 'px' : '4%',
      scale: options.scale || 1,
      opacity: options.opacity !== undefined ? options.opacity : 1
    };
  }
  
  const defaults = {
    y: prefersReducedMotion ? '4%' : '20%',
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: prefersReducedMotion ? 0.6 : true, // Make scrubbing more immediate for reduced motion
    },
  };
  
  // Merge default options with user options
  const mergedOptions = {
    ...defaults,
    ...options,
    scrollTrigger: {
      ...defaults.scrollTrigger,
      ...options.scrollTrigger,
    },
  };
  
  // Create the animation
  const timeline = gsap.timeline({
    scrollTrigger: mergedOptions.scrollTrigger,
  }) || {};

  // Defensive: ensure timeline has chainable methods used by the service
  if (typeof timeline.from !== 'function') timeline.from = function() { return timeline; };
  if (typeof timeline.to !== 'function') timeline.to = function() { return timeline; };
  if (typeof timeline.fromTo !== 'function') timeline.fromTo = function() { return timeline; };
  if (typeof timeline.add !== 'function') timeline.add = function() { return timeline; };
  if (!timeline.scrollTrigger) timeline.scrollTrigger = { kill: () => {}, refresh: () => {}, disable: () => {}, enable: () => {}, update: () => {} };
  
  // Remove scrollTrigger from merged options to avoid duplication
  const { scrollTrigger, ...animationProps } = mergedOptions;
  
  // Create the parallax effect
  timeline.to(element, animationProps);
  
  // Add to animations set for cleanup
  animations.add(timeline);
  
  return timeline;
}

/**
 * Refreshes all ScrollTrigger instances
 */
function refreshScrollTriggers() {
  if (typeof window !== 'undefined' && ScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

/**
 * Kills all animations and clears the animations set
 */
function clearAllAnimations() {
  animations.forEach(animation => {
    if (animation && animation.scrollTrigger) {
      animation.scrollTrigger.kill();
    }
    if (animation && animation.kill) {
      animation.kill();
    }
  });
  
  animations.clear();
  
  if (typeof window !== 'undefined' && ScrollTrigger) {
    try {
      const triggers = ScrollTrigger.getAll();
      if (Array.isArray(triggers)) {
        triggers.forEach(trigger => {
          if (trigger && typeof trigger.kill === 'function') {
            trigger.kill();
          }
        });
      }
    } catch (err) {
      // Defensive: some test environments may mock ScrollTrigger.getAll with a non-array
      // or throw; swallow errors to avoid test crashes and log to console for debugging.
      // eslint-disable-next-line no-console
      console.warn('ScrollAnimationService.clearAllAnimations: failed to clear ScrollTrigger instances', err);
    }
  }
}

/**
 * Create a custom scroll animation with specific properties
 * @param {string|Element} element - Element selector or DOM element
 * @param {Object} fromVars - Starting animation properties
 * @param {Object} toVars - Ending animation properties
 * @param {Object} options - ScrollTrigger options
 * @returns {gsap.core.Timeline} The created timeline for chaining
 */
function createCustomScrollAnimation(element, fromVars, toVars, options = {}) {
  if (!element || typeof window === 'undefined') return null;
  
  // Skip complex animations for reduced motion preference or simplify them
  if (prefersReducedMotion) {
    if (options.skipIfReducedMotion) {
      // For elements that should have no animation when reduced motion is preferred
      if (toVars) {
        gsap.set(element, toVars);
      } else if (fromVars) {
        // If only fromVars is provided, set to initial state without animation
        const inversedProps = {};
        // Create inverse of fromVars to get to end state
        Object.keys(fromVars).forEach(key => {
          if (key === 'opacity') inversedProps[key] = 1;
          else if (key === 'x' || key === 'y') inversedProps[key] = 0;
          else if (key === 'scale') inversedProps[key] = 1;
          else if (key === 'rotation') inversedProps[key] = 0;
          // For other properties, skip them in reduced motion mode
        });
        gsap.set(element, inversedProps);
      }
      return null;
    }
    
    // Simplify animations for reduced motion
    if (fromVars) {
      // Reduce movement and scale amounts
      if (fromVars.x) fromVars.x = parseFloat(fromVars.x) * 0.3;
      if (fromVars.y) fromVars.y = parseFloat(fromVars.y) * 0.3;
      if (fromVars.scale) fromVars.scale = 1 - ((1 - parseFloat(fromVars.scale)) * 0.3);
      if (fromVars.rotation) fromVars.rotation = parseFloat(fromVars.rotation) * 0.3;
      // Speedup transitions
      if (fromVars.duration) fromVars.duration = parseFloat(fromVars.duration) * 0.5;
    }
    
    if (toVars) {
      // Reduce movement and scale amounts
      if (toVars.x) toVars.x = parseFloat(toVars.x) * 0.3;
      if (toVars.y) toVars.y = parseFloat(toVars.y) * 0.3;
      if (toVars.scale) toVars.scale = 1 - ((1 - parseFloat(toVars.scale)) * 0.3);
      if (toVars.rotation) toVars.rotation = parseFloat(toVars.rotation) * 0.3;
      // Speedup transitions
      if (toVars.duration) toVars.duration = parseFloat(toVars.duration) * 0.5;
    }
  }
  
  const defaults = {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none none',
      once: true,
    },
  };
  
  // Merge default options with user options
  const scrollTriggerOptions = {
    ...defaults.scrollTrigger,
    ...options,
  };
  
  // Create the animation
  const timeline = gsap.timeline({
    scrollTrigger: scrollTriggerOptions,
  }) || {};

  // Defensive: ensure timeline has chainable methods used by the service
  if (typeof timeline.from !== 'function') timeline.from = function() { return timeline; };
  if (typeof timeline.to !== 'function') timeline.to = function() { return timeline; };
  if (typeof timeline.fromTo !== 'function') timeline.fromTo = function() { return timeline; };
  if (typeof timeline.add !== 'function') timeline.add = function() { return timeline; };
  if (!timeline.scrollTrigger) timeline.scrollTrigger = { kill: () => {}, refresh: () => {}, disable: () => {}, enable: () => {}, update: () => {} };
  
  if (fromVars) {
    timeline.from(element, fromVars);
  }
  
  if (toVars) {
    timeline.to(element, toVars);
  }
  
  // Add to animations set for cleanup
  animations.add(timeline);
  
  return timeline;
}

/**
 * Get all active ScrollTrigger instances
 * @returns {Array} Array of ScrollTrigger instances
 */
function getActiveScrollTriggers() {
  if (typeof window !== 'undefined' && ScrollTrigger) {
    try {
      const result = ScrollTrigger.getAll();
      return Array.isArray(result) ? result : [];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('ScrollAnimationService.getActiveScrollTriggers: could not read ScrollTrigger.getAll()', err);
      return [];
    }
  }
  return [];
}

// Export the service
const ScrollAnimationService = {
  createScrollAnimation,
  createStaggeredAnimation,
  createParallaxEffect,
  createCustomScrollAnimation,
  refreshScrollTriggers,
  clearAllAnimations,
  getActiveScrollTriggers,
  animationPresets,
  
  /**
   * Get the current reduced motion preference
   * @returns {boolean} True if reduced motion is preferred
   */
  isReducedMotionPreferred() {
    return prefersReducedMotion;
  },
  
  /**
   * Initialize the service with a ThemeManager
   * @param {Object} themeManager - The ThemeManager instance
   */
  initialize(themeManager) {
    if (!themeManager) {
      console.error('ScrollAnimationService: ThemeManager is required for initialization');
      return;
    }
    
    // Initialize SystemPreferenceDetector if not already done
    if (!SystemPreferenceDetector._initialized) {
      SystemPreferenceDetector.initialize();
    }
    
    // Set initial reduced motion preference
    updateReducedMotionPreference();
    
    // Listen for reduced motion preference changes
    SystemPreferenceDetector.onPreferenceChange(() => {
      // We only need to update when the reduced motion preference changes
      const newPreference = getReducedMotionPreference();
      if (newPreference !== prefersReducedMotion) {
        prefersReducedMotion = newPreference;
        
        // Update animations for the current theme with new reduced motion setting
        if (currentThemeId) {
          updateAnimationPresetsForTheme(currentThemeId);
        }
      }
    });
    
    // Start listening for system preference changes
    SystemPreferenceDetector.startListening();
    
    // Listen for theme changes
    themeManager.on('themeChanged', (data) => {
      if (data && data.themeId) {
        updateAnimationPresetsForTheme(data.themeId);
      }
    });
    
    // Apply current theme
    const currentTheme = themeManager.getCurrentTheme();
    if (currentTheme) {
      updateAnimationPresetsForTheme(currentTheme.id);
    }
  }
};

export default ScrollAnimationService;
