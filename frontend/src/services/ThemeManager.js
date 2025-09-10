import { availableThemes, getDefaultTheme, getThemeById } from '../models/theme';
import ThemeStorage from './ThemeStorage';
import BrowserDetection from '../utils/BrowserDetection';



/**
 * Theme Manager Service
 * Implements the ThemeManager contract from specs/001-portfolio-website/contracts/theme-manager.md
 * Updated for task T055 - Create prefers-reduced-motion support
 */

// Create a simple event system
const events = {};

// Local state
let currentTheme = getDefaultTheme();
let systemPreferenceDetectionEnabled = false;
let reducedMotionEnabled = false;

/**
 * Theme Manager Service
 * Responsible for managing themes across the website
 */
const ThemeManager = {
  /**
   * Initialize the theme manager
   */
  initialize() {
    // Try to load saved preference
    const savedThemeId = this.loadThemePreference();
    
    if (savedThemeId) {
      // If we have a saved preference, use it
      this.setTheme(savedThemeId);
    } else if (systemPreferenceDetectionEnabled) {
      // Otherwise check system preference if enabled
      const systemPreference = this.detectSystemPreference();
      // Find a theme matching the system preference
      const matchingTheme = availableThemes.find(t => t.variant === systemPreference);
      if (matchingTheme) {
        this.setTheme(matchingTheme.id);
      }
    }
    
    // Set up system preference change listener if needed
    if (systemPreferenceDetectionEnabled) {
      this._setupSystemPreferenceListener();
    }
    
    // Initialize reduced motion state
    this._detectReducedMotionPreference();
  },
  
  /**
   * Get all available themes
   * @returns {Array<Theme>} List of all available themes
   */
  getAvailableThemes() {
    return availableThemes;
  },
  
  /**
   * Get the current theme
   * @returns {Theme} Current theme object
   */
  getCurrentTheme() {
    return currentTheme;
  },
  
  /**
   * Set the theme by ID
   * @param {string} themeId - Theme identifier
   */
  setTheme(themeId) {
    const theme = getThemeById(themeId);
    if (theme) {
      // Create a backup of the current theme for error handling
      const previousTheme = currentTheme;
      
      try {
        currentTheme = theme;
        
        // Save theme preference before applying it
        // This ensures the preference is saved even if applying fails
        this.saveThemePreference(themeId);
        
        // Use browser detection utility for consistent browser detection
        const isChrome = BrowserDetection.isChrome();
        const isEdge = BrowserDetection.isEdge();
        const isSafariMobile = BrowserDetection.isSafariMobile();
        
        if (isEdge) {
          // Special handling for Edge
          // Set a class first to notify that theme change is in progress
          document.documentElement.classList.add('theme-transition');
          
          // For Edge, ensure state updates are completed before DOM updates
          setTimeout(() => {
            document.documentElement.setAttribute('data-theme', themeId);
            
            // Apply any additional CSS properties for specific themes if needed
            if (theme.customProperties) {
              Object.entries(theme.customProperties).forEach(([property, value]) => {
                document.documentElement.style.setProperty(`--${property}`, value);
              });
            }
            
            // Wait for style calculations to complete
            setTimeout(() => {
              document.documentElement.classList.remove('theme-transition');
              // Trigger the event after transition is complete
              this.trigger('themeChanged', { themeId });
            }, 150);
          }, 50);
        } else if (isSafariMobile) {
          // Special handling for Safari Mobile
          
          // First, remove transitions to ensure immediate application
          document.documentElement.classList.remove('safari-transitions-enabled');
          
          setTimeout(() => {
            document.documentElement.setAttribute('data-theme', themeId);
            
            // Apply any additional CSS properties for specific themes if needed
            if (theme.customProperties) {
              Object.entries(theme.customProperties).forEach(([property, value]) => {
                document.documentElement.style.setProperty(`--${property}`, value);
              });
            }
            
            // Force repaint the entire document for Safari Mobile
            const body = document.body;
            const oldDisplay = body.style.display;
            body.style.display = 'none';
            void body.offsetHeight; // Force reflow
            body.style.display = oldDisplay;
            
            // Also force repaint specific elements that might have transition issues
            const elementsToRepaint = [
              ...document.querySelectorAll('.toggle'),
              ...document.querySelectorAll('button'),
              ...document.querySelectorAll('nav'),
              ...document.querySelectorAll('header'),
              ...document.querySelectorAll('footer')
            ];
            
            elementsToRepaint.forEach(el => {
              if (el) {
                const display = el.style.display;
                el.style.display = 'none';
                void el.offsetHeight; // Trigger reflow
                el.style.display = display;
              }
            });
            
            // Enable transitions after theme is applied
            setTimeout(() => {
              document.documentElement.classList.add('safari-transitions-enabled');
              
              // Trigger the event after transitions are re-enabled
              setTimeout(() => {
                this.trigger('themeChanged', { themeId });
              }, 50);
            }, 100);
          }, 50);
        } else if (isChrome) {
          // Apply the theme with a small delay for Chrome
          setTimeout(() => {
            document.documentElement.setAttribute('data-theme', themeId);
            
            // Force a repaint in Chrome to prevent rendering issues
            document.body.style.display = 'none';
            // This will force a repaint
            void document.body.offsetHeight;
            document.body.style.display = '';
            
            // Apply any additional CSS properties for specific themes if needed
            if (theme.customProperties) {
              Object.entries(theme.customProperties).forEach(([property, value]) => {
                document.documentElement.style.setProperty(`--${property}`, value);
              });
            }
            
            // Trigger the event after a slight delay to ensure DOM is updated
            setTimeout(() => {
              this.trigger('themeChanged', { themeId });
            }, 50);
          }, 10);
        } else {
          // Standard approach for other browsers
          document.documentElement.setAttribute('data-theme', themeId);
          
          // Apply any additional CSS properties for specific themes if needed
          if (theme.customProperties) {
            Object.entries(theme.customProperties).forEach(([property, value]) => {
              document.documentElement.style.setProperty(`--${property}`, value);
            });
          }
          
          // Create a small delay to ensure browser rendering catches up (helps on mobile)
          setTimeout(() => {
            this.trigger('themeChanged', { themeId });
          }, 50);
        }
      } catch (error) {
        console.error(`Error applying theme "${themeId}":`, error);
        
        // Rollback to the previous theme if there was an error
        currentTheme = previousTheme;
        
        // Edge-specific error handling
        const isEdge = /Edg/.test(navigator.userAgent);
        if (isEdge) {
          setTimeout(() => {
            try {
              // Remove transition class first
              document.documentElement.classList.remove('theme-transition');
              // Then reapply the previous theme
              document.documentElement.setAttribute('data-theme', previousTheme.id);
            } catch (rollbackError) {
              console.error('Failed to rollback theme:', rollbackError);
            }
          }, 50);
        } else {
          // Try to reapply the previous theme
          try {
            document.documentElement.setAttribute('data-theme', previousTheme.id);
          } catch (rollbackError) {
            console.error('Failed to rollback theme:', rollbackError);
          }
        }
      }
    } else {
      console.error(`Theme with ID "${themeId}" not found`);
    }
  },
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const currentVariant = currentTheme.variant;
    const targetVariant = currentVariant === 'light' ? 'dark' : 'light';
    
    try {
      // Find a theme matching the target variant
      const targetTheme = availableThemes.find(t => t.variant === targetVariant);
      
      // Use browser detection utility for consistent browser detection
      const isEdge = BrowserDetection.isEdge();
      const isSafariMobile = BrowserDetection.isSafariMobile();
      
      if (targetTheme) {
        if (isEdge) {
          // Special handling for Edge
          // Set transition in progress flag
          document.documentElement.classList.add('theme-transition');
          
          // Add a longer delay for Edge to ensure the DOM is ready
          setTimeout(() => {
            this.setTheme(targetTheme.id);
            
            // Remove transition class after theme change is complete
            setTimeout(() => {
              document.documentElement.classList.remove('theme-transition');
            }, 300);
          }, 50);
        } else if (isSafariMobile) {
          // Enhanced handling for Safari Mobile
          
          // First, remove transitions to ensure immediate application
          document.documentElement.classList.remove('safari-transitions-enabled');
          
          setTimeout(() => {
            this.setTheme(targetTheme.id);
            
            // Force global repaint for Safari Mobile
            const body = document.body;
            const oldDisplay = body.style.display;
            body.style.display = 'none';
            void body.offsetHeight; // Force reflow
            body.style.display = oldDisplay;
            
            // Additionally force repaint on specific elements that might have issues
            const elementsToRepaint = [
              ...document.querySelectorAll('.toggle'),
              ...document.querySelectorAll('button'),
              ...document.querySelectorAll('nav'),
              ...document.querySelectorAll('header'),
              ...document.querySelectorAll('footer')
            ];
            
            elementsToRepaint.forEach(el => {
              if (el) {
                const display = el.style.display;
                el.style.display = 'none';
                void el.offsetHeight; // Force reflow
                el.style.display = display;
              }
            });
            
            // Re-enable transitions after theme change
            setTimeout(() => {
              document.documentElement.classList.add('safari-transitions-enabled');
            }, 100);
          }, 50);
        } else {
          // Standard approach for other browsers
          this.setTheme(targetTheme.id);
        }
      } else {
        console.warn(`No theme found for variant: ${targetVariant}`);
      }
    } catch (error) {
      console.error('Error toggling theme:', error);
      // Force reload styles as a fallback for Safari
      const stylesheet = document.getElementById('theme-stylesheet');
      if (stylesheet) {
        const href = stylesheet.getAttribute('href');
        if (href) {
          stylesheet.setAttribute('href', href.split('?')[0] + '?' + new Date().getTime());
        }
      }
    }
  },
  
  /**
   * Detect system color scheme preference
   * @returns {'light'|'dark'} System preference or 'light' as default if not supported/detected
   */
  detectSystemPreference() {
    try {
      if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeQuery && typeof darkModeQuery.matches !== 'undefined') {
          return darkModeQuery.matches ? 'dark' : 'light';
        }
      }
    } catch (error) {
      console.error('Error detecting system preference:', error);
    }
    // Default to light theme if detection fails
    return 'light';
  },
  
  /**
   * Enable automatic system preference detection
   */
  enableSystemPreferenceDetection() {
    systemPreferenceDetectionEnabled = true;
    this._setupSystemPreferenceListener();
    
    // Apply system preference immediately if we don't have a saved preference
    if (!this.loadThemePreference()) {
      const systemPreference = this.detectSystemPreference();
      const matchingTheme = availableThemes.find(t => t.variant === systemPreference);
      if (matchingTheme) {
        this.setTheme(matchingTheme.id);
      }
    }
  },
  
  /**
   * Disable automatic system preference detection
   */
  disableSystemPreferenceDetection() {
    systemPreferenceDetectionEnabled = false;
    this._removeSystemPreferenceListener();
  },
  
  /**
   * Save user theme preference
   * @param {string} themeId - Theme identifier to save
   */
  saveThemePreference(themeId) {
    ThemeStorage.saveTheme(themeId);
  },
  
  /**
   * Load user theme preference
   * @returns {string|null} Saved theme ID or null if not found
   */
  loadThemePreference() {
    return ThemeStorage.getTheme();
  },
  
  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  },
  
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback to remove
   */
  off(event, callback) {
    if (events[event]) {
      events[event] = events[event].filter(cb => cb !== callback);
    }
  },
  
  /**
   * Trigger an event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  trigger(event, data) {
    if (events[event]) {
      events[event].forEach(callback => callback(data));
    }
  },
  
  /**
   * Check if reduced motion is enabled
   * @returns {boolean} True if reduced motion is enabled
   */
  isReducedMotionEnabled() {
    return reducedMotionEnabled;
  },
  
  /**
   * Set reduced motion state
   * @param {boolean} enabled - Whether reduced motion should be enabled
   */
  setReducedMotion(enabled) {
    if (reducedMotionEnabled !== enabled) {
      reducedMotionEnabled = enabled;
      
      // Update the document attribute for CSS targeting
      if (reducedMotionEnabled) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
      
      // Trigger an event so components can adapt
      this.trigger('reducedMotionChanged', { reducedMotion: reducedMotionEnabled });
    }
  },
  
  /**
   * Detect user's reduced motion preference
   * @private
   */
  _detectReducedMotionPreference() {
    try {
      if (window.matchMedia) {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        // Make sure reducedMotionQuery is not null or undefined before accessing matches
        if (reducedMotionQuery && typeof reducedMotionQuery.matches !== 'undefined') {
          const prefersReducedMotion = reducedMotionQuery.matches;
          
          // Set initial state
          this.setReducedMotion(prefersReducedMotion);
          
          // Set up listener for changes
          if (reducedMotionQuery.addEventListener) {
            reducedMotionQuery.addEventListener('change', this._handleReducedMotionChange);
          } else if (reducedMotionQuery.addListener) {
            reducedMotionQuery.addListener(this._handleReducedMotionChange);
          }
        } else {
          // Fallback to default (no reduced motion) if query or matches is undefined
          this.setReducedMotion(false);
        }
      } else {
        // Fallback to default (no reduced motion) if matchMedia is not available
        this.setReducedMotion(false);
      }
    } catch (error) {
      // If anything goes wrong, fallback to default (no reduced motion)
      console.error('Error detecting reduced motion preference:', error);
      this.setReducedMotion(false);
    }
  },
  
  /**
   * Handle reduced motion preference change
   * @param {MediaQueryListEvent} event - Media query change event
   * @private
   */
  _handleReducedMotionChange(event) {
    ThemeManager.setReducedMotion(event.matches);
  },
  
  /**
   * Set up system preference change listener
   * @private
   */
  _setupSystemPreferenceListener() {
    try {
      if (window.matchMedia) {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (darkModeMediaQuery && typeof darkModeMediaQuery.matches !== 'undefined') {
          // Use the modern event listener if available
          if (darkModeMediaQuery.addEventListener) {
            darkModeMediaQuery.addEventListener('change', this._handleSystemPreferenceChange);
          } else if (darkModeMediaQuery.addListener) {
            // Fallback for older browsers
            darkModeMediaQuery.addListener(this._handleSystemPreferenceChange);
          }
        }
      }
    } catch (error) {
      console.error('Error setting up system preference listener:', error);
    }
  },
  
  /**
   * Remove system preference change listener
   * @private
   */
  _removeSystemPreferenceListener() {
    try {
      if (window.matchMedia) {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (darkModeMediaQuery && typeof darkModeMediaQuery.matches !== 'undefined') {
          if (darkModeMediaQuery.removeEventListener) {
            darkModeMediaQuery.removeEventListener('change', this._handleSystemPreferenceChange);
          } else if (darkModeMediaQuery.removeListener) {
            darkModeMediaQuery.removeListener(this._handleSystemPreferenceChange);
          }
        }
      }
    } catch (error) {
      console.error('Error removing system preference listener:', error);
    }
  },
  
  /**
   * Handle system preference change
   * @private
   */
  _handleSystemPreferenceChange(event) {
    if (systemPreferenceDetectionEnabled) {
      const newVariant = event.matches ? 'dark' : 'light';
      const matchingTheme = availableThemes.find(t => t.variant === newVariant);
      if (matchingTheme) {
        ThemeManager.setTheme(matchingTheme.id);
      }
    }
  }
};

// Backwards-compatible aliases for tests and older code that expect subscribe/unsubscribe
ThemeManager.subscribe = ThemeManager.on;
ThemeManager.unsubscribe = ThemeManager.off;

// Also expose as a named export to satisfy tests that import { ThemeManager }
export { ThemeManager };

export default ThemeManager;
