/**
 * Integration test for Theme Switching
 * Implements task T015
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import ThemeManager from '../../src/services/ThemeManager';
import ThemeStylesManager from '../../src/services/ThemeStylesManager';

// Mock any third-party libraries if needed
jest.mock('../../src/services/SystemPreferenceDetector', () => ({
  initialize: jest.fn(),
  getCurrentPreference: jest.fn().mockReturnValue('light'),
  startListening: jest.fn(),
  stopListening: jest.fn(),
  isSupported: jest.fn().mockReturnValue(true),
  onPreferenceChange: jest.fn(),
  offPreferenceChange: jest.fn()
}));

describe('Theme Switching Integration Tests', () => {
  let appContainer;
  let originalDocumentElement;
  
  beforeAll(() => {
    // Save original document element to restore later
    originalDocumentElement = document.documentElement;
  });
  
  beforeEach(() => {
    // Reset DOM and mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh root element for each test
    document.body.innerHTML = '';
    appContainer = document.createElement('div');
    appContainer.id = 'root';
    document.body.appendChild(appContainer);
    
    // Reset localStorage before each test
    localStorage.clear();
  });
  
  afterAll(() => {
    // Restore original document element
    document.documentElement = originalDocumentElement;
  });

  test('should load with default theme on initial app render', async () => {
    // Render the App component
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Get the current theme from ThemeManager
      const currentTheme = ThemeManager.getCurrentTheme();
      
      // Check if the theme classes are applied to the document element
      expect(document.documentElement.classList.contains(`theme-${currentTheme.id}`)).toBe(true);
      
      // Check if CSS variables are set correctly
      const computedStyle = getComputedStyle(document.documentElement);
      expect(computedStyle.getPropertyValue('--color-primary').trim()).toBe(currentTheme.colors.primary);
      expect(computedStyle.getPropertyValue('--color-background').trim()).toBe(currentTheme.colors.background);
    });
  });

  test('should switch theme when theme toggle button is clicked', async () => {
    // Render the App component
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Get the initial theme
      const initialTheme = ThemeManager.getCurrentTheme();
      
      // Find and click the theme toggle button
      const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(themeToggleButton);
      
      // Get the new theme after toggle
      const newTheme = ThemeManager.getCurrentTheme();
      
      // Ensure the theme has changed
      expect(newTheme.id).not.toBe(initialTheme.id);
      
      // Check if the theme classes are updated
      expect(document.documentElement.classList.contains(`theme-${newTheme.id}`)).toBe(true);
      expect(document.documentElement.classList.contains(`theme-${initialTheme.id}`)).toBe(false);
      
      // Check if CSS variables are updated
      const computedStyle = getComputedStyle(document.documentElement);
      expect(computedStyle.getPropertyValue('--color-primary').trim()).toBe(newTheme.colors.primary);
      expect(computedStyle.getPropertyValue('--color-background').trim()).toBe(newTheme.colors.background);
    });
  });

  test('should persist theme selection in localStorage', async () => {
    // Render the App component
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Find and click the theme toggle button
      const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(themeToggleButton);
      
      // Get the theme after toggle
      const selectedTheme = ThemeManager.getCurrentTheme();
      
      // Check if the theme preference is saved to localStorage
      const savedTheme = localStorage.getItem('themePreference');
      expect(savedTheme).toBe(selectedTheme.id);
    });
    
    // Unmount the component to simulate closing the app
    appContainer.innerHTML = '';
    
    // Render the App component again to simulate reopening the app
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Get the current theme
      const currentTheme = ThemeManager.getCurrentTheme();
      
      // Get the saved theme preference from localStorage
      const savedTheme = localStorage.getItem('themePreference');
      
      // Check if the app loaded the saved theme
      expect(currentTheme.id).toBe(savedTheme);
    });
  });

  test('should update all themeable components when theme changes', async () => {
    // Render the App component
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Get the initial theme
      const initialTheme = ThemeManager.getCurrentTheme();
      
      // Find and click the theme toggle button
      const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(themeToggleButton);
      
      // Get the new theme after toggle
      const newTheme = ThemeManager.getCurrentTheme();
      
      // Check specific components for theme-specific styling
      
      // Header component
      const header = screen.getByRole('banner');
      const headerComputedStyle = getComputedStyle(header);
      expect(headerComputedStyle.backgroundColor).toBe(newTheme.colors.surface);
      expect(headerComputedStyle.color).toBe(newTheme.colors.text);
      
      // Navigation component
      const navigation = screen.getByRole('navigation');
      const navComputedStyle = getComputedStyle(navigation);
      expect(navComputedStyle.backgroundColor).toBe(newTheme.colors.surface);
      
      // Main content area
      const main = screen.getByRole('main');
      const mainComputedStyle = getComputedStyle(main);
      expect(mainComputedStyle.backgroundColor).toBe(newTheme.colors.background);
      expect(mainComputedStyle.color).toBe(newTheme.colors.text);
      
      // Footer component
      const footer = screen.getByRole('contentinfo');
      const footerComputedStyle = getComputedStyle(footer);
      expect(footerComputedStyle.backgroundColor).toBe(newTheme.colors.surface);
      expect(footerComputedStyle.color).toBe(newTheme.colors.text);
    });
  });

  test('should apply theme transitions during theme change', async () => {
    // Render the App component
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Get the preferences from ThemeManager
      const transitionSpeed = 300; // Default transition speed in ms
      
      // Spy on ThemeStylesManager.applyTransition method
      const applyTransitionSpy = jest.spyOn(ThemeStylesManager, 'applyTransition');
      const removeTransitionSpy = jest.spyOn(ThemeStylesManager, 'removeTransition');
      
      // Find and click the theme toggle button
      const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(themeToggleButton);
      
      // Check if transitions were applied
      expect(applyTransitionSpy).toHaveBeenCalledWith(transitionSpeed);
      
      // Fast-forward time to after the transition should complete
      jest.advanceTimersByTime(transitionSpeed + 50);
      
      // Check if transitions were removed after completion
      expect(removeTransitionSpy).toHaveBeenCalled();
    });
  });

  test('should respond to system theme preference changes', async () => {
    // Mock SystemPreferenceDetector to simulate a change
    const SystemPreferenceDetector = require('../../src/services/SystemPreferenceDetector');
    let preferenceChangeCallback;
    
    // Store the callback when onPreferenceChange is called
    SystemPreferenceDetector.onPreferenceChange.mockImplementation((callback) => {
      preferenceChangeCallback = callback;
    });
    
    // Render the App component with system theme detection enabled
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Enable system preference detection
      ThemeManager.enableSystemPreferenceDetection();
      
      // Get the initial theme
      const initialTheme = ThemeManager.getCurrentTheme();
      
      // Simulate system preference change
      preferenceChangeCallback('dark');
      
      // Get the new theme after preference change
      const newTheme = ThemeManager.getCurrentTheme();
      
      // Check if theme was updated based on system preference
      expect(newTheme.variant).toBe('dark');
      expect(newTheme.id).not.toBe(initialTheme.id);
      
      // Check if the theme classes are updated
      expect(document.documentElement.classList.contains(`theme-${newTheme.id}`)).toBe(true);
    });
  });

  test('should maintain custom theme when switching between system themes', async () => {
    // First, ensure we have a custom theme available
    const customTheme = {
      id: 'custom-theme',
      name: 'Custom Theme',
      isDefault: false,
      colors: {
        primary: '#ff00ff',
        secondary: '#00ffff',
        accent: '#ffff00',
        background: '#222222',
        surface: '#333333',
        text: '#ffffff',
        textSecondary: '#cccccc',
        border: '#444444',
        shadow: 'rgba(0,0,0,0.5)',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        info: '#0000ff'
      },
      fonts: {
        heading: 'Orbitron, sans-serif',
        body: 'Roboto, sans-serif',
        code: 'Fira Code, monospace'
      },
      animations: {
        particleColor: '#ff00ff',
        particleOpacity: 0.7,
        backgroundGradient: 'linear-gradient(to right, #222222, #333333)',
        cardGlow: '0 0 15px rgba(255,0,255,0.5)'
      },
      variant: 'custom'
    };
    
    // Mock methods to test custom theme persistence
    const getAllCustomThemesSpy = jest.spyOn(ThemeManager, 'getAvailableThemes')
      .mockImplementation(() => {
        return [
          ...ThemeManager.getAvailableThemes(),
          customTheme
        ];
      });
    
    // Render the App component
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Set the custom theme
      ThemeManager.setTheme(customTheme.id);
      
      // Get the current theme
      const currentTheme = ThemeManager.getCurrentTheme();
      expect(currentTheme.id).toBe(customTheme.id);
      
      // Toggle theme (which should toggle between light and dark, not affecting custom)
      ThemeManager.toggleTheme();
      
      // Ensure we're still on the custom theme
      const themeAfterToggle = ThemeManager.getCurrentTheme();
      expect(themeAfterToggle.id).toBe(customTheme.id);
      
      // Reset the spy
      getAllCustomThemesSpy.mockRestore();
    });
  });

  test('should update animations with theme-specific settings when theme changes', async () => {
    // Mock ThemeAnimationAdapter
    const mockUpdateAnimationSettings = jest.fn();
    jest.mock('../../src/services/ThemeAnimationAdapter', () => ({
      initialize: jest.fn(),
      getAnimationSettings: jest.fn(),
      updateAnimationSettings: mockUpdateAnimationSettings,
      getParticleSettings: jest.fn(),
      getBackgroundSettings: jest.fn(),
      getTextEffectSettings: jest.fn(),
      get3DEffectSettings: jest.fn()
    }));
    
    // Render the App component
    render(<App />, { container: appContainer });
    
    // Wait for app to initialize
    await waitFor(() => {
      // Find and click the theme toggle button
      const themeToggleButton = screen.getByRole('button', { name: /toggle theme/i });
      fireEvent.click(themeToggleButton);
      
      // Get the new theme after toggle
      const newTheme = ThemeManager.getCurrentTheme();
      
      // Check if ThemeAnimationAdapter.updateAnimationSettings was called with the new theme
      expect(mockUpdateAnimationSettings).toHaveBeenCalledWith(expect.anything(), newTheme.id);
    });
  });
});
