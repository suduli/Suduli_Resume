/**
 * Central test setup file for Jest
 * This file ensures that all Jest DOM matchers are available globally
 */

// Import Jest DOM to add custom matchers
import '@testing-library/jest-dom';
// Import our custom IntersectionObserver mock
import { IntersectionObserverMock } from './tests/__mocks__/intersectionObserverMock';

// Explicitly extend the expect object with Jest DOM matchers
// This ensures that toBeInTheDocument, toHaveClass, etc. are available
require('@testing-library/jest-dom/extend-expect');

// Global IntersectionObserver mock
global.IntersectionObserver = IntersectionObserverMock;

// Global JSDOM window.matchMedia mock
window.matchMedia = window.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

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

// Mock for GSAP and ScrollTrigger
jest.mock('gsap', () => {
  const timeline = {
    from: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    resume: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
  };
  
  const gsap = {
    to: jest.fn().mockReturnValue({
      pause: jest.fn(),
      resume: jest.fn(),
      kill: jest.fn(),
    }),
    from: jest.fn().mockReturnValue({
      pause: jest.fn(),
      resume: jest.fn(),
      kill: jest.fn(),
    }),
    fromTo: jest.fn().mockReturnValue({
      pause: jest.fn(),
      resume: jest.fn(),
      kill: jest.fn(),
    }),
    timeline: jest.fn().mockReturnValue(timeline),
    registerPlugin: jest.fn(),
    config: jest.fn(),
    set: jest.fn(),
  };

  // ScrollTrigger plugin mock
  gsap.ScrollTrigger = {
    create: jest.fn().mockReturnValue({
      kill: jest.fn(),
      refresh: jest.fn(),
      update: jest.fn(),
    }),
    refresh: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn().mockReturnValue([]),
    killAll: jest.fn(),
    defaults: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    batch: jest.fn(),
    saveStyles: jest.fn(),
    revert: jest.fn(),
    matchMedia: jest.fn(),
    clearMatchMedia: jest.fn(),
    isTouch: false,
    config: {
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    },
  };

  return gsap;
});

// Importantly, we need to hoist this mock to handle the import issue
jest.mock('gsap/ScrollTrigger', () => {
  const ScrollTrigger = {
    create: jest.fn().mockReturnValue({
      kill: jest.fn(),
      refresh: jest.fn(),
      update: jest.fn(),
    }),
    refresh: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn().mockReturnValue([]),
    killAll: jest.fn(),
    defaults: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    batch: jest.fn(),
    saveStyles: jest.fn(),
    revert: jest.fn(),
    matchMedia: jest.fn(),
    clearMatchMedia: jest.fn(),
    isTouch: false,
    config: {
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    },
  };

  return { ScrollTrigger };
}, { virtual: true }); // Add virtual: true to handle ES module

// Mock for particlesJS
global.particlesJS = jest.fn();

// Initialize Crypto for UUID generation if needed
global.crypto = {
  getRandomValues: function(buffer) {
    return require('crypto').randomFillSync(buffer);
  }
};