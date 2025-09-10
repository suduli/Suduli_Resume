/**
 * ThemePreferences Service
 * Manages user theme preferences and settings
 * Implements task T021
 */

/**
 * ThemePreferences singleton service
 * Manages user preferences for theming and animations
 */
const ThemePreferences = {
  // Core properties with default values
  detectSystemTheme: true,
  fallbackTheme: 'light',
  enableAnimations: true,
  reducedMotion: false,
  transitionSpeed: 300,

  // Storage key
  STORAGE_KEY: 'portfolio-theme-preferences',

  /**
   * Set whether to auto-detect system theme
   * @param {boolean} enabled - Whether system detection is enabled
   */
  setDetectSystemTheme(enabled) {
    this.detectSystemTheme = Boolean(enabled);
  },

  /**
   * Set the fallback theme to use when system preference is unavailable
   * @param {string} themeId - ID of fallback theme
   */
  setFallbackTheme(themeId) {
    if (typeof themeId === 'string' && themeId.length > 0) {
      this.fallbackTheme = themeId;
    }
  },

  /**
   * Set whether animations are enabled
   * @param {boolean} enabled - Whether animations are enabled
   */
  setEnableAnimations(enabled) {
    this.enableAnimations = Boolean(enabled);
  },

  /**
   * Set whether reduced motion is enabled
   * @param {boolean} enabled - Whether reduced motion is enabled
   */
  setReducedMotion(enabled) {
    this.reducedMotion = Boolean(enabled);
  },

  /**
   * Set the transition speed in milliseconds
   * @param {number} speed - Transition speed in ms
   */
  setTransitionSpeed(speed) {
    if (typeof speed === 'number' && speed >= 0) {
      this.transitionSpeed = speed;
    }
  },

  /**
   * Save preferences to localStorage
   */
  save() {
    try {
      const preferences = {
        detectSystemTheme: this.detectSystemTheme,
        fallbackTheme: this.fallbackTheme,
        enableAnimations: this.enableAnimations,
        reducedMotion: this.reducedMotion,
        transitionSpeed: this.transitionSpeed
      };

      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save theme preferences to localStorage:', error);
    }
  },

  /**
   * Load preferences from localStorage
   */
  load() {
    try {
      const savedPreferences = window.localStorage.getItem(this.STORAGE_KEY);
      
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        
        // Only update properties that exist in the saved preferences
        if (preferences.detectSystemTheme !== undefined) {
          this.setDetectSystemTheme(preferences.detectSystemTheme);
        }
        
        if (preferences.fallbackTheme) {
          this.setFallbackTheme(preferences.fallbackTheme);
        }
        
        if (preferences.enableAnimations !== undefined) {
          this.setEnableAnimations(preferences.enableAnimations);
        }
        
        if (preferences.reducedMotion !== undefined) {
          this.setReducedMotion(preferences.reducedMotion);
        }
        
        if (preferences.transitionSpeed !== undefined) {
          this.setTransitionSpeed(preferences.transitionSpeed);
        }
      }
    } catch (error) {
      console.error('Failed to load theme preferences from localStorage:', error);
      // Fall back to defaults (which are already set)
    }
  },

  /**
   * Reset preferences to defaults
   */
  reset() {
    this.detectSystemTheme = true;
    this.fallbackTheme = 'light';
    this.enableAnimations = true;
    this.reducedMotion = false;
    this.transitionSpeed = 300;
  }
};

export default ThemePreferences;
