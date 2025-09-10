/**
 * Mock theme.js module for tests
 */

/**
 * Default Light Theme
 */
export const lightTheme = {
  id: 'light',
  name: 'Light Theme',
  isDefault: true,
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#212529',
    textSecondary: '#6c757d'
  },
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif'
  },
  animations: {
    particleColor: '#3498db',
    particleOpacity: 0.7,
    textGlow: 'none',
    textAnimationSpeed: 1,
    textShadow: 'none'
  },
  variant: 'light'
};

/**
 * Default Dark Theme
 */
export const darkTheme = {
  id: 'dark',
  name: 'Dark Theme',
  isDefault: false,
  colors: {
    primary: '#6c5ce7',
    secondary: '#00b894',
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#f1f2f6',
    textSecondary: '#a5b1c2'
  },
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif'
  },
  animations: {
    particleColor: '#6c5ce7',
    particleOpacity: 0.8,
    textGlow: '0 0 10px rgba(108, 92, 231, 0.5)',
    textAnimationSpeed: 1.2,
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
  },
  variant: 'dark'
};

/**
 * All available themes
 */
export const availableThemes = [
  lightTheme,
  darkTheme
];

/**
 * Gets a theme by ID
 */
export const getThemeById = jest.fn(themeId => {
  return availableThemes.find(theme => theme.id === themeId);
});

/**
 * Gets the default theme
 */
export const getDefaultTheme = jest.fn(() => {
  return lightTheme;
});

/**
 * Creates a custom theme
 */
export const createCustomTheme = jest.fn((id, name, colors, fonts, animations, variant, baseTheme = lightTheme) => {
  return {
    id,
    name,
    isDefault: false,
    colors: { ...baseTheme.colors, ...colors },
    fonts: { ...baseTheme.fonts, ...fonts },
    animations: { ...baseTheme.animations, ...animations },
    variant: variant || 'custom'
  };
});
