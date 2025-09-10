/**
 * ThemeStorage Service
 * Implements task T023
 * 
 * Provides functionality to store and retrieve theme-related data from localStorage
 */

/**
 * Singleton service for theme storage operations
 */
const ThemeStorage = {
  // Key prefix used for all theme-related storage
  keyPrefix: 'theme-',
  
  /**
   * Get storage key for a theme ID
   * @param {string} themeId - The ID of the theme
   * @returns {string} The storage key for the theme
   */
  getThemeKey(themeId) {
    return `${this.keyPrefix}${themeId}`;
  },
  
  /**
   * Get preferences key
   * @returns {string} The storage key for theme preferences
   */
  getPreferencesKey() {
    return `${this.keyPrefix}preferences`;
  },
  
  /**
   * Safely execute localStorage operations
   * @param {Function} operation - The localStorage operation to execute
   * @param {*} fallback - The fallback value to return if the operation fails
   * @returns {*} The result of the operation or the fallback value
   */
  safeStorage(operation, fallback = null) {
    try {
      return operation();
    } catch (error) {
      console.warn('localStorage operation failed:', error);
      return fallback;
    }
  },
  
  /**
   * Save the current theme preference to localStorage
   * @param {string} themeId - The ID of the theme to save
   */
  saveTheme(themeId) {
    this.safeStorage(() => {
      localStorage.setItem(this.getThemeKey('current'), themeId);
    });
  },
  
  /**
   * Get the current theme preference from localStorage
   * @returns {string|null} The saved theme ID or null if not found
   */
  getTheme() {
    return this.safeStorage(() => {
      return localStorage.getItem(this.getThemeKey('current'));
    });
  },
  
  /**
   * Clear the current theme preference from localStorage
   */
  clearTheme() {
    this.safeStorage(() => {
      localStorage.removeItem(this.getThemeKey('current'));
    });
  },
  
  /**
   * Save theme preferences to localStorage
   * @param {Object} preferences - The ThemePreferences object to save
   */
  savePreferences(preferences) {
    this.safeStorage(() => {
      const prefsToSave = {
        detectSystemTheme: preferences.detectSystemTheme,
        fallbackTheme: preferences.fallbackTheme,
        enableAnimations: preferences.enableAnimations,
        reducedMotion: preferences.reducedMotion,
        transitionSpeed: preferences.transitionSpeed
      };
      
      localStorage.setItem(
        this.getPreferencesKey(),
        JSON.stringify(prefsToSave)
      );
    });
  },
  
  /**
   * Get theme preferences from localStorage
   * @returns {Object|null} The saved preferences or null if not found or invalid
   */
  getPreferences() {
    return this.safeStorage(() => {
      const prefsJson = localStorage.getItem(this.getPreferencesKey());
      if (!prefsJson) return null;
      
      return JSON.parse(prefsJson);
    });
  },
  
  /**
   * Clear theme preferences from localStorage
   */
  clearPreferences() {
    this.safeStorage(() => {
      localStorage.removeItem(this.getPreferencesKey());
    });
  },
  
  /**
   * Save a custom theme to localStorage
   * @param {Object} theme - The custom theme object to save
   */
  saveCustomTheme(theme) {
    this.safeStorage(() => {
      localStorage.setItem(
        this.getThemeKey(theme.id),
        JSON.stringify(theme)
      );
    });
  },
  
  /**
   * Get a custom theme from localStorage
   * @param {string} themeId - The ID of the custom theme to retrieve
   * @returns {Object|null} The custom theme or null if not found or invalid
   */
  getCustomTheme(themeId) {
    return this.safeStorage(() => {
      const themeJson = localStorage.getItem(this.getThemeKey(themeId));
      if (!themeJson) return null;
      
      return JSON.parse(themeJson);
    });
  },
  
  /**
   * Get all custom themes from localStorage
   * @returns {Array} Array of custom theme objects
   */
  getAllCustomThemes() {
    return this.safeStorage(() => {
      const themes = [];
      const prefix = this.keyPrefix;
      
      // Scan localStorage for all custom theme entries
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Check if this is a theme key (but not current theme or preferences)
        if (key && key.startsWith(prefix) && 
            key !== this.getThemeKey('current') && 
            key !== this.getPreferencesKey()) {
          
          try {
            const theme = JSON.parse(localStorage.getItem(key));
            if (theme && theme.id && theme.variant === 'custom') {
              themes.push(theme);
            }
          } catch (e) {
            console.warn(`Failed to parse theme from localStorage key: ${key}`, e);
          }
        }
      }
      
      return themes;
    }, []);
  },
  
  /**
   * Delete a custom theme from localStorage
   * @param {string} themeId - The ID of the custom theme to delete
   */
  deleteCustomTheme(themeId) {
    this.safeStorage(() => {
      localStorage.removeItem(this.getThemeKey(themeId));
    });
  }
};

export default ThemeStorage;
