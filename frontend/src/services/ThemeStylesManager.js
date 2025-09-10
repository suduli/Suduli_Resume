/**
 * Theme Styles Manager Service
 * Implements the ThemeStylesManager contract from specs/001-portfolio-website/contracts/theme-manager.md
 */

// Root element reference
let rootElement = null;

/**
 * Theme Styles Manager
 * Responsible for applying theme styles to the DOM
 */
const ThemeStylesManager = {
  /**
   * Initialize the theme styles manager
   * @param {HTMLElement} element - Root element (defaults to document.documentElement)
   */
  initialize(element = null) {
    rootElement = element || document.documentElement;
  },
  
  /**
   * Apply a theme to the DOM
   * @param {Theme} theme - Theme to apply
   */
  applyTheme(theme) {
    if (!rootElement) {
      this.initialize();
    }
    
    // Remove all existing theme classes first
    this.removeAllThemeClasses();
    
    // Add the new theme class
    this.addThemeClass(theme.id);
    
    // Apply colors as CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      this.setCSSVariable(`--color-${key}`, value);
    });
    
    // Apply fonts as CSS variables
    Object.entries(theme.fonts).forEach(([key, value]) => {
      this.setCSSVariable(`--font-${key}`, value);
    });
    
    // Apply animations as CSS variables
    Object.entries(theme.animations).forEach(([key, value]) => {
      // Handle different types of animation values
      if (typeof value === 'number') {
        this.setCSSVariable(`--animation-${key}`, value.toString());
      } else {
        this.setCSSVariable(`--animation-${key}`, value);
      }
    });
    
    // Set theme variant CSS variable
    this.setCSSVariable('--theme-variant', theme.variant);
  },
  
  /**
   * Apply transition effect for smooth theme changes
   * @param {number} duration - Transition duration in milliseconds
   */
  applyTransition(duration) {
    if (!rootElement) {
      this.initialize();
    }
    
    const properties = [
      'color',
      'background',
      'background-color',
      'border-color',
      'box-shadow',
      'fill',
      'stroke'
    ].join(', ');
    
    rootElement.style.transitionProperty = properties;
    rootElement.style.transitionDuration = `${duration}ms`;
    rootElement.style.transitionTimingFunction = 'ease-in-out';
  },
  
  /**
   * Remove transition effect
   */
  removeTransition() {
    if (!rootElement) {
      this.initialize();
    }
    
    rootElement.style.transitionProperty = '';
    rootElement.style.transitionDuration = '';
    rootElement.style.transitionTimingFunction = '';
  },
  
  /**
   * Set a CSS variable on the root element
   * @param {string} name - CSS variable name
   * @param {string} value - CSS variable value
   */
  setCSSVariable(name, value) {
    if (!rootElement) {
      this.initialize();
    }
    
    // Make sure name has leading --
    const properName = name.startsWith('--') ? name : `--${name}`;
    rootElement.style.setProperty(properName, value);
  },
  
  /**
   * Get a CSS variable from the root element
   * @param {string} name - CSS variable name
   * @returns {string} CSS variable value
   */
  getCSSVariable(name) {
    if (!rootElement) {
      this.initialize();
    }
    
    // Make sure name has leading --
    const properName = name.startsWith('--') ? name : `--${name}`;
    // Get computed style and extract the variable value
    const computedStyle = window.getComputedStyle(rootElement);
    return computedStyle.getPropertyValue(properName).trim();
  },
  
  /**
   * Remove a CSS variable from the root element
   * @param {string} name - CSS variable name
   */
  removeCSSVariable(name) {
    if (!rootElement) {
      this.initialize();
    }
    
    // Make sure name has leading --
    const properName = name.startsWith('--') ? name : `--${name}`;
    rootElement.style.removeProperty(properName);
  },
  
  /**
   * Add a theme class to the root element
   * @param {string} themeId - Theme identifier
   */
  addThemeClass(themeId) {
    if (!rootElement) {
      this.initialize();
    }
    
    // Add class with theme- prefix
    const className = themeId.startsWith('theme-') ? themeId : `theme-${themeId}`;
    rootElement.classList.add(className);
  },
  
  /**
   * Remove a theme class from the root element
   * @param {string} themeId - Theme identifier
   */
  removeThemeClass(themeId) {
    if (!rootElement) {
      this.initialize();
    }
    
    // Remove class with theme- prefix
    const className = themeId.startsWith('theme-') ? themeId : `theme-${themeId}`;
    rootElement.classList.remove(className);
  },
  
  /**
   * Remove all theme classes from the root element
   */
  removeAllThemeClasses() {
    if (!rootElement) {
      this.initialize();
    }
    
    // Get all classes
    const classes = [...rootElement.classList];
    
    // Filter for theme classes and remove them
    classes
      .filter(className => className.startsWith('theme-'))
      .forEach(className => rootElement.classList.remove(className));
  }
};

export default ThemeStylesManager;
