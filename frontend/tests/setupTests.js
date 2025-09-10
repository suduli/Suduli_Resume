/**
 * Test setup file for Jest
 */

// Adds special assertions like toBeInTheDocument
require('@testing-library/jest-dom');

// Mock animation libraries
jest.mock('animejs');
jest.mock('three');
jest.mock('gsap');
jest.mock('gsap/ScrollTrigger');
jest.mock('tsparticles');

// Mock for IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.observerEntries = [];
  }

  observe = jest.fn((element) => {
    this.elements.add(element);
    
    // Store for later but don't automatically trigger callback
    // This prevents infinite loops in tests
    const entry = {
      isIntersecting: true,
      intersectionRatio: 1,
      target: element,
      time: Date.now(),
      boundingClientRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      intersectionRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      rootBounds: null
    };
    
    this.observerEntries.push(entry);
    
    // Don't call the callback automatically anymore
    // Tests should use simulateIntersection or mockIsIntersecting instead
    
    return this;
  });

  unobserve = jest.fn((element) => {
    this.elements.delete(element);
    return this;
  });

  disconnect = jest.fn(() => {
    this.elements.clear();
    this.observerEntries = [];
    return this;
  });

  takeRecords = jest.fn(() => {
    return this.observerEntries;
  });
  
  // Helper method to manually trigger intersections for testing
  simulateIntersection = jest.fn((isIntersecting = true) => {
    const entries = Array.from(this.elements).map(element => ({
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      target: element,
      time: Date.now(),
      boundingClientRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      intersectionRect: isIntersecting && element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      rootBounds: null
    }));
    
    if (entries.length > 0) {
      this.callback(entries, this);
    }
    
    return this;
  });
  
  // Compatibility method used in TextAnimation.test.js
  mockIsIntersecting = jest.fn((isIntersecting = true) => {
    const entries = Array.from(this.elements).map(element => ({
      isIntersecting,
      target: element,
      time: Date.now(),
      boundingClientRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      intersectionRect: element.getBoundingClientRect ? element.getBoundingClientRect() : {},
      rootBounds: null
    }));
    
    if (entries.length > 0) {
      this.callback(entries, this);
    }
  });
}

// Set global IntersectionObserver mock
global.IntersectionObserver = IntersectionObserverMock;

// Mock for window.matchMedia with proper query matching
window.matchMedia = jest.fn().mockImplementation(query => {
  // Default matches to false for any query
  let matches = false;
  let listeners = [];
  
  // Handle specific queries for theme detection
  if (query === '(prefers-color-scheme: dark)') {
    matches = false; // Default to light mode for tests
  }
  
  // Handle reduced motion query
  if (query === '(prefers-reduced-motion: reduce)') {
    matches = false; // Default to no reduced motion for tests
  }
  
  return {
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(callback => {
      listeners.push(callback);
    }),
    removeListener: jest.fn(callback => {
      listeners = listeners.filter(cb => cb !== callback);
    }),
    addEventListener: jest.fn((event, callback) => {
      listeners.push(callback);
    }),
    removeEventListener: jest.fn((event, callback) => {
      listeners = listeners.filter(cb => cb !== callback);
    }),
    dispatchEvent: jest.fn(),
    
    // Helper for tests to trigger events
    _simulateColorSchemeChange(isDarkMode) {
      this.matches = isDarkMode;
      if (listeners.length) {
        listeners.forEach(callback => 
          callback({ matches: isDarkMode, media: query })
        );
      }
    }
  };
});

// Mock for window.localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: jest.fn(() => Object.keys(store).length),
    key: jest.fn(index => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console.error to catch prop-type errors
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Failed prop type/.test(args[0])) {
      throw new Error(args[0]);
    }
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});
