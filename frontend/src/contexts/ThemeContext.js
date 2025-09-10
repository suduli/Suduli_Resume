/**
 * ThemeContext
 * 
 * This file creates a React context for theme management.
 * It provides a context provider and a useTheme hook for consuming components.
 */

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import ThemeManager from '../services/ThemeManager';
import ThemeStorage from '../services/ThemeStorage';
import BrowserDetection from '../utils/BrowserDetection';
import '../styles/theme-variables.css'; // Import the theme variables CSS

// Create context with default values
export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  themes: [],
  toggleTheme: () => {},
  themePreferences: {
    detectSystemTheme: true,
    fallbackTheme: 'dark',
    enableAnimations: true,
    reducedMotion: false,
    transitionSpeed: 300
  },
  setThemePreferences: () => {},
  themeColors: {},
  themeFonts: {},
  themeAnimations: {}
});

/**
 * Theme Provider Component
 * Provides theme context to all children components
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');
  const [themePreferences, setThemePreferences] = useState({
    detectSystemTheme: true,
    fallbackTheme: 'dark',
    enableAnimations: true,
    reducedMotion: false,
    transitionSpeed: 300
  });
  
  // Get current theme details
  const currentThemeDetails = ThemeManager.getCurrentTheme();
  
  // Initialize theme on mount
  useEffect(() => {
    // Get theme from localStorage or system preference
    let savedThemeId = ThemeManager.loadThemePreference();
    
    // Safely check system preference if localStorage doesn't have a theme
    if (!savedThemeId) {
      try {
        // Check if matchMedia exists and handle the case where it's undefined or doesn't work in test env
        const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
        savedThemeId = mediaQuery && mediaQuery.matches ? 'dark' : 'light';
      } catch (error) {
        // Fallback to light theme if there's an error
        savedThemeId = 'light';
      }
    }
    
    // Initialize the ThemeManager
    ThemeManager.initialize();
    
    // Set the initial theme
    setThemeState(savedThemeId);
    
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', savedThemeId);
    
    // Listen for theme changes from ThemeManager
    const handleThemeChange = (data) => {
      setThemeState(data.themeId);
    };
    
    ThemeManager.on('themeChanged', handleThemeChange);
    
    // Listen for system preference changes if enabled
    if (themePreferences.detectSystemTheme) {
      ThemeManager.enableSystemPreferenceDetection();
    }
    
    // Cleanup
    return () => {
      ThemeManager.off('themeChanged', handleThemeChange);
    };
  }, [themePreferences.detectSystemTheme]);
  
  // Set theme with proper handling
  const setTheme = useCallback((themeId) => {
    ThemeManager.setTheme(themeId);
    setThemeState(themeId);
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const currentVariant = currentThemeDetails.variant;
    const targetVariant = currentVariant === 'light' ? 'dark' : 'light';
    
    // Find a theme matching the target variant
    const availableThemes = ThemeManager.getAvailableThemes();
    const targetTheme = availableThemes.find(t => t.variant === targetVariant);
    
    // Use the BrowserDetection utility for consistent browser detection
    const isEdge = BrowserDetection.isEdge();
    const isSafariMobile = BrowserDetection.isSafariMobile();
    
    if (targetTheme) {
      if (isEdge) {
        // Enhanced Edge handling in ThemeContext
        // First add transition class
        document.documentElement.classList.add('theme-transition');
        
        // Delay to ensure transition class is applied
        setTimeout(() => {
          ThemeManager.setTheme(targetTheme.id);
          
          // Remove transition class after theme change is complete
          setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
          }, 350);
        }, 50);
      } else if (isSafariMobile) {
        // Special handling for Safari Mobile
        // First, remove transitions to ensure immediate application
        document.documentElement.classList.remove('safari-transitions-enabled');
        
        // Add a delay to ensure UI is ready for theme change
        setTimeout(() => {
          ThemeManager.setTheme(targetTheme.id);
          
          // Force repaint for Safari Mobile
          const body = document.body;
          const oldDisplay = body.style.display;
          body.style.display = 'none';
          void body.offsetHeight; // Force reflow
          body.style.display = oldDisplay;
          
          // Force repainting on additional elements where theme changes might not be visible
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
          
          // Re-enable transitions after theme change
          setTimeout(() => {
            document.documentElement.classList.add('safari-transitions-enabled');
          }, 100);
        }, 50);
      } else {
        ThemeManager.setTheme(targetTheme.id);
      }
    }
  }, [currentThemeDetails.variant]);
  
  // Update theme preferences
  const updateThemePreferences = useCallback((newPreferences) => {
    const updatedPreferences = { ...themePreferences, ...newPreferences };
    setThemePreferences(updatedPreferences);
    
    // Apply system preference detection if changed
    if (newPreferences.detectSystemTheme !== undefined) {
      if (newPreferences.detectSystemTheme) {
        ThemeManager.enableSystemPreferenceDetection();
      } else {
        ThemeManager.disableSystemPreferenceDetection();
      }
    }
    
    // Apply reduced motion preference
    if (newPreferences.reducedMotion !== undefined) {
      document.documentElement.style.setProperty(
        '--animation-duration', 
        newPreferences.reducedMotion ? '0.001ms' : `${updatedPreferences.transitionSpeed}ms`
      );
    }
    
    // Apply transition speed
    if (newPreferences.transitionSpeed !== undefined && !updatedPreferences.reducedMotion) {
      document.documentElement.style.setProperty(
        '--animation-duration', 
        `${newPreferences.transitionSpeed}ms`
      );
    }
    
    // Save preferences to localStorage using ThemeStorage
    ThemeStorage.savePreferences(updatedPreferences);
  }, [themePreferences]);
  
  // Load theme preferences on mount
  useEffect(() => {
    const savedPreferences = ThemeStorage.getPreferences();
    if (savedPreferences) {
      setThemePreferences(savedPreferences);
    }
  }, []);
  
  // Apply reduced motion preference if system preference changes
  useEffect(() => {
    try {
      // Check if matchMedia exists and handle the case where it's undefined
      const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      
      const handleReducedMotionChange = (e) => {
        if (e.matches) {
          updateThemePreferences({ reducedMotion: true });
        }
      };
      
      if (mediaQuery) {
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleReducedMotionChange);
        } else if (mediaQuery.addListener) {
          mediaQuery.addListener(handleReducedMotionChange);
        }
        
        // Initial check
        if (mediaQuery.matches) {
          updateThemePreferences({ reducedMotion: true });
        }
      }
      
      return () => {
        if (mediaQuery) {
          if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', handleReducedMotionChange);
          } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(handleReducedMotionChange);
          }
        }
      };
    } catch (error) {
      // Fallback to no reduced motion if there's an error
      console.error('Error setting up reduced motion detection:', error);
    }
  }, [updateThemePreferences]);
  
  // Get all available themes
  const themes = ThemeManager.getAvailableThemes();

  // Context value
  const contextValue = {
    theme,
    setTheme,
    themes,
    toggleTheme,
    themePreferences,
    setThemePreferences: updateThemePreferences,
    themeColors: currentThemeDetails.colors,
    themeFonts: currentThemeDetails.fonts,
    themeAnimations: currentThemeDetails.animations
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme context
 * @returns {Object} Theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
