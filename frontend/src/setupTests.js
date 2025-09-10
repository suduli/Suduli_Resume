// setupTests.js
import '@testing-library/jest-dom';

// Ensure Jest uses our manual module mocks for gsap and ScrollTrigger
// Let Jest auto-use manual mocks placed in ../__mocks__ when modules are mocked by name
jest.mock('gsap');
jest.mock('gsap/ScrollTrigger');

// Mock IntersectionObserver: simple factory that returns an object with observe/unobserve/disconnect
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockIsIntersecting = true;
  }

  observe(element) {
    this.elements.add(element);
    // Immediately notify as intersecting
    this.callback([
      { isIntersecting: this.mockIsIntersecting, target: element, intersectionRatio: 1 }
    ]);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // helpers for tests
  __setMockIsIntersecting(val) { this.mockIsIntersecting = val; }
  __trigger() { this.elements.forEach(el => this.callback([{ isIntersecting: this.mockIsIntersecting, target: el, intersectionRatio: 1 }])); }
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
// Expose IntersectionObserver on global/window
global.IntersectionObserver = MockIntersectionObserver;
window.IntersectionObserver = MockIntersectionObserver;

// Mock for window.scrollTo
window.scrollTo = jest.fn();

// Mock for particlesJS - record calls for tests
const particlesMock = jest.fn();
particlesMock.mockConfig = null;
particlesMock.mockCalls = [];
particlesMock.mockImplementation((id, config) => {
  particlesMock.mockCalls.push({ id, config });
  particlesMock.mockConfig = config;
});
global.particlesJS = particlesMock;
window.particlesJS = particlesMock;

// Helper to reset particles mock between tests
particlesMock.reset = () => {
  particlesMock.mockConfig = null;
  particlesMock.mockCalls = [];
  particlesMock.mockClear();
};

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

// Mock global.fetch to return fixture JSON files from public/data
const fixtureMap = {
  '/data/profile.json': require('../public/data/profile.json'),
  '/data/experience.json': require('../public/data/experience.json'),
  '/data/projects.json': require('../public/data/projects.json'),
  '/data/skills.json': require('../public/data/skills.json'),
  '/data/education.json': require('../public/data/education.json'),
  '/data/awards.json': require('../public/data/awards.json'),
  '/data/languages.json': require('../public/data/languages.json'),
  '/data/contact-form.json': require('../public/data/contact-form.json'),
};

global.fetch = jest.fn((url) => {
  // Accept absolute or relative URLs
  const pathname = (new URL(url, 'http://localhost')).pathname;
  const fixture = fixtureMap[pathname];
  if (fixture) {
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve(JSON.stringify(fixture))
    });
  }

  // Default: simulate 404
  return Promise.resolve({ ok: false, status: 404, statusText: 'Not Found', text: () => Promise.resolve('') });
});
