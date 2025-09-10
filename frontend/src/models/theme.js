/**
 * Theme models based on the contracts/theme-manager.md specification
 */

/**
 * @typedef {Object} ThemeColors
 * @property {string} primary - Primary brand color
 * @property {string} secondary - Secondary brand color
 * @property {string} accent - Accent color for highlights
 * @property {string} background - Page background
 * @property {string} surface - Component surface background
 * @property {string} text - Primary text color
 * @property {string} textSecondary - Secondary text color
 * @property {string} border - Border color
 * @property {string} shadow - Shadow color (with alpha)
 * @property {string} success - Success state color
 * @property {string} warning - Warning state color
 * @property {string} error - Error state color
 * @property {string} info - Info state color
 */

/**
 * @typedef {Object} ThemeFonts
 * @property {string} heading - Heading font family
 * @property {string} body - Body text font family
 * @property {string} code - Code font family
 */

/**
 * @typedef {Object} ThemeAnimations
 * @property {string} particleColor - Color for particles
 * @property {number} particleOpacity - Opacity for particles
 * @property {string} backgroundGradient - Background gradient
 * @property {string} cardGlow - Glow effect for cards
 */

/**
 * @typedef {Object} Theme
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {boolean} isDefault - Whether this is the default theme
 * @property {ThemeColors} colors - Color scheme
 * @property {ThemeFonts} fonts - Typography
 * @property {ThemeAnimations} animations - Animation settings
 * @property {'light' | 'dark' | 'custom'} variant - Base theme variant
 */

/**
 * @typedef {Object} ThemePreferences
 * @property {boolean} detectSystemTheme - Whether to auto-detect system theme
 * @property {string} fallbackTheme - Theme to use when system preference unavailable
 * @property {boolean} enableAnimations - Whether animations are enabled
 * @property {boolean} reducedMotion - Whether reduced motion is enabled
 * @property {number} transitionSpeed - Speed of theme transitions in ms
 */

/**
 * Default Light Theme
 * @type {Theme}
 */
export const lightTheme = {
  id: 'light',
  name: 'Light Theme',
  isDefault: true,
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    accent: '#e74c3c',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8'
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Roboto, sans-serif',
    code: 'Fira Code, monospace'
  },
  animations: {
    particleColor: '#3498db',
    particleOpacity: 0.7,
    backgroundGradient: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    cardGlow: '0 0 15px rgba(52, 152, 219, 0.5)'
  },
  variant: 'light'
};

/**
 * Default Dark Theme
 * @type {Theme}
 */
export const darkTheme = {
  id: 'dark',
  name: 'Dark Theme',
  isDefault: false,
  colors: {
    primary: '#6c5ce7',
    secondary: '#00b894',
    accent: '#e84393',
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#f1f2f6',
    textSecondary: '#a5b1c2',
    border: '#273c75',
    shadow: 'rgba(0, 0, 0, 0.3)',
    success: '#1dd1a1',
    warning: '#feca57',
    error: '#ff6b6b',
    info: '#54a0ff'
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Roboto, sans-serif',
    code: 'Fira Code, monospace'
  },
  animations: {
    particleColor: '#6c5ce7',
    particleOpacity: 0.8,
    backgroundGradient: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
    cardGlow: '0 0 15px rgba(108, 92, 231, 0.7)'
  },
  variant: 'dark'
};

/**
 * High Contrast Theme
 * @type {Theme}
 */
export const highContrastTheme = {
  id: 'high-contrast',
  name: 'High Contrast',
  isDefault: false,
  colors: {
    primary: '#f1c40f',
    secondary: '#2ecc71',
    accent: '#e74c3c',
    background: '#000000',
    surface: '#121212',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#f1c40f',
    shadow: 'rgba(241, 196, 15, 0.3)',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db'
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Roboto, sans-serif',
    code: 'Fira Code, monospace'
  },
  animations: {
    particleColor: '#f1c40f',
    particleOpacity: 0.9,
    backgroundGradient: 'linear-gradient(to bottom, #000000, #121212)',
    cardGlow: '0 0 15px rgba(241, 196, 15, 0.8)'
  },
  variant: 'dark'
};

/**
 * Custom Twilight Theme
 * @type {Theme}
 */
export const twilightTheme = {
  id: 'twilight',
  name: 'Twilight',
  isDefault: false,
  colors: {
    primary: '#a29bfe',
    secondary: '#55efc4',
    accent: '#fd79a8',
    background: '#2d3436',
    surface: '#3d4852',
    text: '#dfe6e9',
    textSecondary: '#b2bec3',
    border: '#636e72',
    shadow: 'rgba(0, 0, 0, 0.2)',
    success: '#55efc4',
    warning: '#fdcb6e',
    error: '#ff7675',
    info: '#74b9ff'
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Roboto, sans-serif',
    code: 'Fira Code, monospace'
  },
  animations: {
    particleColor: '#a29bfe',
    particleOpacity: 0.75,
    backgroundGradient: 'linear-gradient(135deg, #2d3436 0%, #4b6584 100%)',
    cardGlow: '0 0 15px rgba(162, 155, 254, 0.6)'
  },
  variant: 'dark'
};

/**
 * Default theme preferences
 * @type {ThemePreferences}
 */
export const defaultThemePreferences = {
  detectSystemTheme: true,
  fallbackTheme: 'light',
  enableAnimations: true,
  reducedMotion: false,
  transitionSpeed: 300
};

/**
 * All available themes
 * @type {Theme[]}
 */
export const availableThemes = [
  lightTheme,
  darkTheme,
  highContrastTheme,
  twilightTheme
];

/**
 * Gets a theme by ID
 * @param {string} themeId - The ID of the theme to get
 * @returns {Theme|undefined} The theme with the specified ID, or undefined if not found
 */
export const getThemeById = (themeId) => {
  return availableThemes.find(theme => theme.id === themeId);
};

/**
 * Gets the default theme
 * @returns {Theme} The default theme
 */
export const getDefaultTheme = () => {
  return availableThemes.find(theme => theme.isDefault) || lightTheme;
};

/**
 * Creates a custom theme
 * @param {string} id - Unique identifier for the custom theme
 * @param {string} name - Display name for the custom theme
 * @param {Partial<ThemeColors>} colors - Color overrides
 * @param {Partial<ThemeFonts>} fonts - Font overrides
 * @param {Partial<ThemeAnimations>} animations - Animation overrides
 * @param {'light' | 'dark' | 'custom'} variant - Base theme variant
 * @param {Theme} baseTheme - Base theme to extend (optional)
 * @returns {Theme} A new custom theme
 */
export const createCustomTheme = (
  id,
  name,
  colors = {},
  fonts = {},
  animations = {},
  variant = 'custom',
  baseTheme = lightTheme
) => {
  return {
    id,
    name,
    isDefault: false,
    colors: { ...baseTheme.colors, ...colors },
    fonts: { ...baseTheme.fonts, ...fonts },
    animations: { ...baseTheme.animations, ...animations },
    variant
  };
};
