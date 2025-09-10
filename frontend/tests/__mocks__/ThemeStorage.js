/**
 * Mock for ThemeStorage
 */

let storedTheme = 'light';
let storedPreferences = {
  detectSystemTheme: true,
  fallbackTheme: 'dark',
  enableAnimations: true,
  reducedMotion: false,
  transitionSpeed: 300
};

const ThemeStorage = {
  saveTheme: jest.fn((themeId) => {
    storedTheme = themeId;
  }),
  
  getTheme: jest.fn(() => storedTheme),
  
  clearTheme: jest.fn(() => {
    storedTheme = null;
  }),
  
  savePreferences: jest.fn((preferences) => {
    storedPreferences = { ...storedPreferences, ...preferences };
  }),
  
  getPreferences: jest.fn(() => storedPreferences),
  
  clearPreferences: jest.fn(() => {
    storedPreferences = null;
  }),
  
  // Helper methods for tests
  _setStoredThemeForTest(themeId) {
    storedTheme = themeId;
  },
  
  _setStoredPreferencesForTest(preferences) {
    storedPreferences = { ...storedPreferences, ...preferences };
  }
};

export default ThemeStorage;
