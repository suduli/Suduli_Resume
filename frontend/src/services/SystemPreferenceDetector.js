/**
 * SystemPreferenceDetector Service
 * Implements task T024
 * 
 * Detects and monitors system preferences for color scheme and reduced motion
 */

/**
 * Singleton service for detecting system preferences
 */
const SystemPreferenceDetector = {
  // Media query strings for different preferences
  COLOR_SCHEME_DARK: '(prefers-color-scheme: dark)',
  COLOR_SCHEME_LIGHT: '(prefers-color-scheme: light)',
  REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
  
  // Internal state
  _initialized: false,
  _darkModeMediaQuery: null,
  _lightModeMediaQuery: null,
  _reducedMotionMediaQuery: null,
  _boundHandler: null,
  _callbacks: new Set(),
  
  // Special test mode flag - used to simulate matchMedia not being available
  _testNoMatchMedia: false,
  
  /**
   * Reset internal state for testing
   */
  _reset() {
    this._initialized = false;
    this._darkModeMediaQuery = null;
    this._lightModeMediaQuery = null;
    this._reducedMotionMediaQuery = null;
    this._callbacks.clear();
    this._boundHandler = null;
    this._testNoMatchMedia = false;
  },
  
  /**
   * Special method for tests to simulate matchMedia not being available
   * @param {boolean} value - Whether to simulate matchMedia as unavailable
   */
  _setMatchMediaAvailable(value) {
    this._testNoMatchMedia = !value;
    if (this._testNoMatchMedia) {
      this._initialized = false;
      this._darkModeMediaQuery = null;
      this._lightModeMediaQuery = null;
      this._reducedMotionMediaQuery = null;
    }
  },
  
  /**
   * Initialize the detector
   * Sets up media queries but does not start listening
   */
  initialize() {
    // Reset state
    this._initialized = false;
    this._darkModeMediaQuery = null;
    this._lightModeMediaQuery = null;
    this._reducedMotionMediaQuery = null;
    
    // Return early if not supported
    if (!this.isSupported()) {
      // Make sure we're definitely not initialized when not supported
      this._initialized = false;
      return;
    }
    
    try {
      // Create media query objects
      this._darkModeMediaQuery = window.matchMedia(this.COLOR_SCHEME_DARK);
      this._lightModeMediaQuery = window.matchMedia(this.COLOR_SCHEME_LIGHT);
      this._reducedMotionMediaQuery = window.matchMedia(this.REDUCED_MOTION);
      
      this._initialized = true;
    } catch (error) {
      console.warn('Error initializing SystemPreferenceDetector:', error);
      this._initialized = false;
      this._darkModeMediaQuery = null;
      this._lightModeMediaQuery = null;
      this._reducedMotionMediaQuery = null;
    }
  },
  
  /**
   * Check if the browser supports matchMedia API
   * @returns {boolean} Whether the API is supported
   */
  isSupported() {
    // First check our test flag
    if (this._testNoMatchMedia) {
      return false;
    }
    
    try {
      // Check if window exists
      if (typeof window === 'undefined') {
        return false;
      }
      
      // For Jest tests: when matchMedia is deleted, check if it's actually gone
      if (!('matchMedia' in window) || window.matchMedia === undefined || window.matchMedia === null) {
        // If matchMedia is not in window, set our test flag
        this._testNoMatchMedia = true;
        return false;
      }
      
      // Make sure it's a function
      return typeof window.matchMedia === 'function';
    } catch (error) {
      this._testNoMatchMedia = true;
      return false;
    }
  },
  
  /**
   * Get the current color scheme preference
   * @returns {string|null} 'light', 'dark', or null if not detected or not supported
   */
  getCurrentPreference() {
    // Check if the browser supports matchMedia first
    if (!this.isSupported()) {
      // If not supported, reset state and return null
      this._initialized = false;
      this._darkModeMediaQuery = null;
      this._lightModeMediaQuery = null;
      this._reducedMotionMediaQuery = null;
      return null;
    }
    
    // Check if initialized
    if (!this._initialized) {
      return null;
    }
    
    try {
      // Check for dark mode preference
      if (this._darkModeMediaQuery && this._darkModeMediaQuery.matches) {
        return 'dark';
      } 
      // Check for light mode preference
      else if (this._lightModeMediaQuery && this._lightModeMediaQuery.matches) {
        return 'light';
      }
    } catch (error) {
      console.warn('Error getting color scheme preference:', error);
      // Reset initialized state on error
      this._initialized = false;
      return null;
    }
    
    // Return null if no preference detected
    return null;
  },
  
  /**
   * Get current reduced motion preference
   * @returns {boolean|null} true if reduced motion is preferred, false otherwise, null if not supported
   */
  getReducedMotionPreference() {
    if (!this.isSupported() || !this._initialized) {
      return null;
    }
    
    try {
      return this._reducedMotionMediaQuery && this._reducedMotionMediaQuery.matches;
    } catch (error) {
      console.warn('Error getting reduced motion preference:', error);
      return null;
    }
  },
  
  /**
   * Handle changes to color scheme preference
   * @param {Event} event - The change event
   * @private
   */
  _handleColorSchemeChange(event) {
    const preference = this.getCurrentPreference();
    this._notifyCallbacks(preference);
  },
  
  /**
   * Notify all registered callbacks of a preference change
   * @param {string|null} preference - The new preference value
   * @private
   */
  _notifyCallbacks(preference) {
    this._callbacks.forEach(callback => {
      try {
        callback(preference);
      } catch (error) {
        console.error('Error in preference change callback:', error);
      }
    });
  },
  
  /**
   * Add listener to media query using the appropriate method
   * Handles both modern and legacy APIs
   * @param {MediaQueryList} mediaQuery - The media query to listen to
   * @param {Function} handler - The event handler
   * @private
   */
  _addMediaQueryListener(mediaQuery, handler) {
    if (!mediaQuery) return;
    
    try {
      // Check which API the browser supports
      if (typeof mediaQuery.addEventListener === 'function') {
        // Modern API
        mediaQuery.addEventListener('change', handler);
      } else if (typeof mediaQuery.addListener === 'function') {
        // Legacy API for older browsers
        mediaQuery.addListener(handler);
      }
    } catch (error) {
      console.warn('Error adding media query listener:', error);
    }
  },
  
  /**
   * Remove listener from media query using the appropriate method
   * Handles both modern and legacy APIs
   * @param {MediaQueryList} mediaQuery - The media query to stop listening to
   * @param {Function} handler - The event handler to remove
   * @private
   */
  _removeMediaQueryListener(mediaQuery, handler) {
    if (!mediaQuery) return;
    
    try {
      // Check which API the browser supports
      if (typeof mediaQuery.removeEventListener === 'function') {
        // Modern API
        mediaQuery.removeEventListener('change', handler);
      } else if (typeof mediaQuery.removeListener === 'function') {
        // Legacy API for older browsers
        mediaQuery.removeListener(handler);
      }
    } catch (error) {
      console.warn('Error removing media query listener:', error);
    }
  },
  
  /**
   * Start listening for system preference changes
   */
  startListening() {
    if (!this._initialized) {
      this.initialize();
    }
    
    // Double check after initialize that we're still supported
    if (!this.isSupported() || !this._initialized) {
      return;
    }
    
    // Make sure our media queries exist
    if (!this._darkModeMediaQuery || !this._lightModeMediaQuery) {
      return;
    }
    
    // Bind the handler to this object to maintain context
    this._boundHandler = this._handleColorSchemeChange.bind(this);
    
    try {
      // Add listeners for dark and light mode changes
      this._addMediaQueryListener(this._darkModeMediaQuery, this._boundHandler);
      this._addMediaQueryListener(this._lightModeMediaQuery, this._boundHandler);
    } catch (error) {
      console.warn('Error starting to listen for preference changes:', error);
      this._boundHandler = null;
    }
  },
  
  /**
   * Stop listening for system preference changes
   */
  stopListening() {
    // Even if not supported, we still want to clear callbacks
    
    if (this.isSupported() && this._boundHandler) {
      try {
        // Remove listeners if they exist
        if (this._darkModeMediaQuery) {
          this._removeMediaQueryListener(this._darkModeMediaQuery, this._boundHandler);
        }
        if (this._lightModeMediaQuery) {
          this._removeMediaQueryListener(this._lightModeMediaQuery, this._boundHandler);
        }
      } catch (error) {
        console.warn('Error stopping listening for preference changes:', error);
      }
      
      // Clear bound handler
      this._boundHandler = null;
    }
    
    // Clear callbacks to ensure complete cleanup
    this._callbacks.clear();
  },
  
  /**
   * Register a callback for preference changes
   * @param {Function} callback - Function to call when preference changes
   */
  onPreferenceChange(callback) {
    if (typeof callback === 'function') {
      this._callbacks.add(callback);
    }
  },
  
  /**
   * Unregister a callback for preference changes
   * @param {Function} callback - Function to remove from callbacks
   */
  offPreferenceChange(callback) {
    this._callbacks.delete(callback);
  }
};

export default SystemPreferenceDetector;
