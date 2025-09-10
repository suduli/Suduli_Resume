// setupTests.js
import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockIsIntersecting = true;
  }

  observe(element) {
    this.elements.add(element);
    this.callback([
      {
        isIntersecting: this.mockIsIntersecting,
        target: element,
        intersectionRatio: 1
      }
    ]);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Helper methods for tests
  setMockIsIntersecting(isIntersecting) {
    this.mockIsIntersecting = isIntersecting;
  }

  triggerObservers() {
    this.elements.forEach(element => {
      this.callback([
        {
          isIntersecting: this.mockIsIntersecting,
          target: element,
          intersectionRatio: 1
        }
      ]);
    });
  }
}

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for IntersectionObserver
global.IntersectionObserver = MockIntersectionObserver;

// Mock for window.scrollTo
window.scrollTo = jest.fn();

// Mock for particlesJS
global.particlesJS = jest.fn();

// LocalStorage mock
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
    length: 0,
    key: jest.fn(i => null)
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
