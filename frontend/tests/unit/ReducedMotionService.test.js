/**
 * Unit tests for ReducedMotionService
 * Part of task T057 - Create unit tests for utility functions
 */

import reducedMotionService from '../../src/services/ReducedMotionService';
import ThemeManager from '../../src/services/ThemeManager';

// Mock ThemeManager
jest.mock('../../src/services/ThemeManager', () => ({
  setReducedMotion: jest.fn()
}));

describe('ReducedMotionService', () => {
  // Original window.matchMedia
  const originalMatchMedia = window.matchMedia;
  
  // Setup and teardown
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset the service
    reducedMotionService.cleanup();
    reducedMotionService.initialized = false;
    reducedMotionService.prefersReducedMotion = false;
    reducedMotionService.listeners = new Set();
    
    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(callback => {
        this.callback = callback;
      }),
      removeListener: jest.fn(),
      addEventListener: jest.fn((_event, callback) => {
        this.callback = callback;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));
  });
  
  afterEach(() => {
    // Restore window.matchMedia
    window.matchMedia = originalMatchMedia;
  });
  
  describe('initialize', () => {
    test('sets up media query listeners', () => {
      reducedMotionService.initialize();
      
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
      expect(reducedMotionService.initialized).toBe(true);
    });
    
    test('does not initialize twice', () => {
      reducedMotionService.initialize();
      const mediaQuery = reducedMotionService.mediaQuery;
      
      reducedMotionService.initialize();
      
      expect(reducedMotionService.mediaQuery).toBe(mediaQuery);
    });
    
    test('notifies ThemeManager on initialization', () => {
      reducedMotionService.initialize();
      
      expect(ThemeManager.setReducedMotion).toHaveBeenCalledWith(false);
    });
    
    test('returns the service instance for chaining', () => {
      const result = reducedMotionService.initialize();
      
      expect(result).toBe(reducedMotionService);
    });
  });
  
  describe('handleMediaQueryChange', () => {
    test('updates preference and notifies listeners', () => {
      reducedMotionService.initialize();
      
      const listener = jest.fn();
      reducedMotionService.addListener(listener);
      
      // Simulate media query change
      reducedMotionService.handleMediaQueryChange({ matches: true });
      
      expect(reducedMotionService.prefersReducedMotion).toBe(true);
      expect(listener).toHaveBeenCalledWith(true);
      expect(ThemeManager.setReducedMotion).toHaveBeenCalledWith(true);
    });
  });
  
  describe('isReducedMotionPreferred', () => {
    test('returns the current preference', () => {
      reducedMotionService.prefersReducedMotion = false;
      expect(reducedMotionService.isReducedMotionPreferred()).toBe(false);
      
      reducedMotionService.prefersReducedMotion = true;
      expect(reducedMotionService.isReducedMotionPreferred()).toBe(true);
    });
  });
  
  describe('addListener', () => {
    test('adds a listener and immediately calls it with current state', () => {
      reducedMotionService.prefersReducedMotion = true;
      
      const listener = jest.fn();
      reducedMotionService.addListener(listener);
      
      expect(reducedMotionService.listeners.size).toBe(1);
      expect(listener).toHaveBeenCalledWith(true);
    });
    
    test('ignores non-function listeners', () => {
      reducedMotionService.addListener('not a function');
      
      expect(reducedMotionService.listeners.size).toBe(0);
    });
  });
  
  describe('removeListener', () => {
    test('removes a listener', () => {
      const listener = jest.fn();
      reducedMotionService.addListener(listener);
      expect(reducedMotionService.listeners.size).toBe(1);
      
      reducedMotionService.removeListener(listener);
      expect(reducedMotionService.listeners.size).toBe(0);
    });
  });
  
  describe('notifyListeners', () => {
    test('notifies all listeners with current preference', () => {
      reducedMotionService.prefersReducedMotion = true;
      
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      reducedMotionService.addListener(listener1);
      reducedMotionService.addListener(listener2);
      
      // Clear initial calls
      listener1.mockClear();
      listener2.mockClear();
      
      reducedMotionService.notifyListeners();
      
      expect(listener1).toHaveBeenCalledWith(true);
      expect(listener2).toHaveBeenCalledWith(true);
    });
    
    test('handles errors in listeners', () => {
      const errorListener = jest.fn().mockImplementation(() => {
        throw new Error('Listener error');
      });
      
      reducedMotionService.addListener(errorListener);
      
      // Mock console.error
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      reducedMotionService.notifyListeners();
      
      expect(console.error).toHaveBeenCalled();
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });
  
  describe('setOverride', () => {
    test('updates preference and notifies if changed', () => {
      reducedMotionService.prefersReducedMotion = false;
      
      const listener = jest.fn();
      reducedMotionService.addListener(listener);
      listener.mockClear(); // Clear initial call
      
      reducedMotionService.setOverride(true);
      
      expect(reducedMotionService.prefersReducedMotion).toBe(true);
      expect(listener).toHaveBeenCalledWith(true);
      expect(ThemeManager.setReducedMotion).toHaveBeenCalledWith(true);
    });
    
    test('does not notify if preference did not change', () => {
      reducedMotionService.prefersReducedMotion = true;
      
      const listener = jest.fn();
      reducedMotionService.addListener(listener);
      listener.mockClear(); // Clear initial call
      
      reducedMotionService.setOverride(true);
      
      expect(listener).not.toHaveBeenCalled();
      expect(ThemeManager.setReducedMotion).not.toHaveBeenCalled();
    });
  });
  
  describe('getAnimationOptions', () => {
    test('returns standard options when reduced motion is not preferred', () => {
      reducedMotionService.prefersReducedMotion = false;
      
      const standardOptions = { duration: 1000 };
      const reducedOptions = { duration: 0 };
      
      const result = reducedMotionService.getAnimationOptions(standardOptions, reducedOptions);
      
      expect(result).toBe(standardOptions);
    });
    
    test('returns reduced options when reduced motion is preferred', () => {
      reducedMotionService.prefersReducedMotion = true;
      
      const standardOptions = { duration: 1000 };
      const reducedOptions = { duration: 0 };
      
      const result = reducedMotionService.getAnimationOptions(standardOptions, reducedOptions);
      
      expect(result).toBe(reducedOptions);
    });
  });
  
  describe('cleanup', () => {
    test('removes event listeners and clears listeners', () => {
      reducedMotionService.initialize();
      
      const listener = jest.fn();
      reducedMotionService.addListener(listener);
      
      reducedMotionService.cleanup();
      
      expect(reducedMotionService.listeners.size).toBe(0);
      expect(reducedMotionService.initialized).toBe(false);
    });
  });
});
