/**
 * Mock for ThemeManager
 */

// Simple event system
const events = {};

// Mock theme data
const mockThemes = [
  {
    id: 'light',
    name: 'Light',
    variant: 'light',
    colors: {
      primary: '#1e88e5',
      secondary: '#6c757d',
      text: '#212529',
      background: '#ffffff',
      surface: '#f8f9fa'
    },
    fonts: {
      primary: 'Roboto, sans-serif',
      secondary: 'Open Sans, sans-serif'
    },
    animations: {
      textGlow: 'none',
      textAnimationSpeed: 1,
      textShadow: 'none'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    variant: 'dark',
    colors: {
      primary: '#90caf9',
      secondary: '#a0aec0',
      text: '#e5e5e5',
      background: '#121212',
      surface: '#1e1e1e'
    },
    fonts: {
      primary: 'Roboto, sans-serif',
      secondary: 'Open Sans, sans-serif'
    },
    animations: {
      textGlow: '0 0 10px rgba(144, 202, 249, 0.5)',
      textAnimationSpeed: 1.2,
      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
    }
  }
];

// Local state
let currentTheme = mockThemes[0]; // Default to light theme
let systemPreferenceDetectionEnabled = false;
let reducedMotionEnabled = false;

/**
 * Mock Theme Manager Service
 */
const ThemeManager = {
  initialize: jest.fn(() => {
    // No-op in tests
  }),
  
  getAvailableThemes: jest.fn(() => mockThemes),
  
  getCurrentTheme: jest.fn(() => currentTheme),
  
  setTheme: jest.fn((themeId) => {
    const theme = mockThemes.find(t => t.id === themeId);
    if (theme) {
      currentTheme = theme;
      ThemeManager.trigger('themeChanged', { themeId });
    }
  }),
  
  toggleTheme: jest.fn(() => {
    const currentVariant = currentTheme.variant;
    const targetVariant = currentVariant === 'light' ? 'dark' : 'light';
    const targetTheme = mockThemes.find(t => t.variant === targetVariant);
    if (targetTheme) {
      ThemeManager.setTheme(targetTheme.id);
    }
  }),
  
  detectSystemPreference: jest.fn(() => {
    // Mock for tests - just return 'light' as default
    return 'light';
  }),
  
  enableSystemPreferenceDetection: jest.fn(() => {
    systemPreferenceDetectionEnabled = true;
  }),
  
  disableSystemPreferenceDetection: jest.fn(() => {
    systemPreferenceDetectionEnabled = false;
  }),
  
  saveThemePreference: jest.fn(() => {
    // No-op in tests
  }),
  
  loadThemePreference: jest.fn(() => {
    return 'light'; // Default for tests
  }),
  
  on: jest.fn((event, callback) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  }),
  
  off: jest.fn((event, callback) => {
    if (events[event]) {
      events[event] = events[event].filter(cb => cb !== callback);
    }
  }),
  
  trigger: jest.fn((event, data) => {
    if (events[event]) {
      events[event].forEach(callback => callback(data));
    }
  }),
  
  isReducedMotionEnabled: jest.fn(() => reducedMotionEnabled),
  
  setReducedMotion: jest.fn((enabled) => {
    reducedMotionEnabled = enabled;
    ThemeManager.trigger('reducedMotionChanged', { reducedMotion: reducedMotionEnabled });
  }),
  
  // Helper methods for tests
  _setCurrentThemeForTest(theme) {
    currentTheme = theme;
  },
  
  _simulateSystemPreference(variant) {
    const matchingTheme = mockThemes.find(t => t.variant === variant);
    if (matchingTheme && systemPreferenceDetectionEnabled) {
      ThemeManager.setTheme(matchingTheme.id);
    }
  }
};

export default ThemeManager;
