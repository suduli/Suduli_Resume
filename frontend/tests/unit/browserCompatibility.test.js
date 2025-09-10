/**
 * Tests for Browser Compatibility Utility
 * Part of task T058 - Perform cross-browser testing
 */

import {
  browser,
  features,
  addBrowserClasses,
  applyBrowserFixes,
  initBrowserCompatibility
} from '../../src/utils/browserCompatibility';

describe('Browser Compatibility Utility', () => {
  let mockUserAgent;
  
  beforeEach(() => {
    // Save original window properties
    mockUserAgent = '';
    
    // Mock navigator.userAgent
    Object.defineProperty(window.navigator, 'userAgent', {
      get: () => mockUserAgent,
      configurable: true
    });
    
    // Mock document.documentElement
    document.documentElement.classList.remove(...document.documentElement.classList);
    document.documentElement.style.removeProperty('--vh');
    
    // Mock CSS.supports
    window.CSS = window.CSS || {};
    window.CSS.supports = jest.fn().mockImplementation((prop, value) => {
      if (prop === 'display' && value === 'grid') return true;
      if (prop === 'display' && value === 'flex') return true;
      if (prop === '--test' && value === '0') return true;
      if (prop === 'gap' && value === '1px') return true;
      return false;
    });
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
    
    // Mock console methods
    console.log = jest.fn();
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    // Restore window methods and properties
    jest.restoreAllMocks();
  });
  
  describe('browser detection', () => {
    test('detects Chrome browser', () => {
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
      window.chrome = { runtime: {} };
      
      const info = browser.getBrowserInfo();
      
      expect(info.name).toEqual('Chrome');
      expect(info.version).toEqual('90');
      expect(browser.isChrome()).toBe(true);
      expect(browser.isFirefox()).toBe(false);
    });
    
    test('detects Firefox browser', () => {
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0';
      window.chrome = undefined;
      window.InstallTrigger = {};
      
      const info = browser.getBrowserInfo();
      
      expect(info.name).toEqual('Firefox');
      expect(info.version).toEqual('89');
      expect(browser.isFirefox()).toBe(true);
      expect(browser.isChrome()).toBe(false);
    });
    
    test('detects Safari browser', () => {
      mockUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15';
      window.chrome = undefined;
      window.InstallTrigger = undefined;
      
      const info = browser.getBrowserInfo();
      
      expect(info.name).toEqual('Safari');
      expect(info.version).toEqual('14');
      expect(browser.isSafari()).toBe(true);
      expect(browser.isChrome()).toBe(false);
    });
    
    test('detects Edge browser', () => {
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.66';
      window.chrome = { runtime: {} };
      window.StyleMedia = {};
      
      const info = browser.getBrowserInfo();
      
      expect(info.name).toEqual('Edge');
      expect(info.version).toEqual('90');
      expect(browser.isEdgeLegacy()).toBe(true);
      expect(browser.isChrome()).toBe(true); // Edge is Chromium-based
    });
    
    test('detects IE browser', () => {
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
      window.chrome = undefined;
      window.InstallTrigger = undefined;
      document.documentMode = 11;
      
      const info = browser.getBrowserInfo();
      
      expect(info.name).toEqual('Internet Explorer');
      expect(info.version).toEqual('11');
      expect(browser.isIE()).toBe(true);
      expect(browser.isChrome()).toBe(false);
      
      // Clean up
      delete document.documentMode;
    });
    
    test('detects mobile devices', () => {
      mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1';
      
      expect(browser.isMobile()).toBe(true);
      expect(browser.isIOS()).toBe(true);
      expect(browser.isAndroid()).toBe(false);
    });
    
    test('detects Android devices', () => {
      mockUserAgent = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
      
      expect(browser.isMobile()).toBe(true);
      expect(browser.isAndroid()).toBe(true);
      expect(browser.isIOS()).toBe(false);
    });
  });
  
  describe('feature detection', () => {
    test('detects CSS Grid support', () => {
      window.CSS.supports.mockImplementation((prop, value) => {
        return prop === 'display' && value === 'grid';
      });
      
      expect(features.supportsGrid()).toBe(true);
      
      window.CSS.supports.mockImplementation(() => false);
      
      expect(features.supportsGrid()).toBe(false);
    });
    
    test('detects CSS Flexbox support', () => {
      window.CSS.supports.mockImplementation((prop, value) => {
        return prop === 'display' && value === 'flex';
      });
      
      expect(features.supportsFlexbox()).toBe(true);
      
      window.CSS.supports.mockImplementation(() => false);
      
      expect(features.supportsFlexbox()).toBe(false);
    });
    
    test('detects CSS Custom Properties support', () => {
      window.CSS.supports.mockImplementation((prop, value) => {
        return prop === '--test' && value === '0';
      });
      
      expect(features.supportsCustomProperties()).toBe(true);
      
      window.CSS.supports.mockImplementation(() => false);
      
      expect(features.supportsCustomProperties()).toBe(false);
    });
    
    test('detects Intersection Observer API support', () => {
      // Save original IntersectionObserver
      const originalIntersectionObserver = window.IntersectionObserver;
      
      // Mock IntersectionObserver
      window.IntersectionObserver = function() {};
      
      expect(features.supportsIntersectionObserver()).toBe(true);
      
      // Remove IntersectionObserver
      delete window.IntersectionObserver;
      
      expect(features.supportsIntersectionObserver()).toBe(false);
      
      // Restore original
      window.IntersectionObserver = originalIntersectionObserver;
    });
    
    test('detects WebGL support', () => {
      // Mock canvas and WebGL context
      const mockContext = {};
      const mockCanvas = {
        getContext: jest.fn().mockImplementation((contextType) => {
          if (contextType === 'webgl' || contextType === 'experimental-webgl') {
            return mockContext;
          }
          return null;
        })
      };
      
      document.createElement = jest.fn().mockImplementation((type) => {
        if (type === 'canvas') {
          return mockCanvas;
        }
        return {};
      });
      
      window.WebGLRenderingContext = {};
      
      expect(features.supportsWebGL()).toBe(true);
      
      // Test without WebGLRenderingContext
      delete window.WebGLRenderingContext;
      
      expect(features.supportsWebGL()).toBe(false);
    });
    
    test('detects Local Storage support', () => {
      expect(features.supportsLocalStorage()).toBe(true);
      
      // Simulate localStorage not available
      localStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage is not available');
      });
      
      expect(features.supportsLocalStorage()).toBe(false);
    });
    
    test('detects Web Animations API support', () => {
      // Mock div with animate method
      const mockDiv = {
        animate: jest.fn()
      };
      
      document.createElement = jest.fn().mockImplementation(() => mockDiv);
      
      expect(features.supportsWebAnimations()).toBe(true);
      
      // Test without animate method
      document.createElement = jest.fn().mockImplementation(() => ({}));
      
      expect(features.supportsWebAnimations()).toBe(false);
    });
  });
  
  describe('browser classes', () => {
    test('adds browser-specific classes to html element', () => {
      // Setup Chrome browser
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
      window.chrome = { runtime: {} };
      
      addBrowserClasses();
      
      expect(document.documentElement.classList.contains('browser-chrome')).toBe(true);
      expect(document.documentElement.classList.contains('browser-version-90')).toBe(true);
      expect(document.documentElement.classList.contains('is-desktop')).toBe(true);
    });
    
    test('adds mobile-specific classes', () => {
      // Setup iOS device
      mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1';
      
      addBrowserClasses();
      
      expect(document.documentElement.classList.contains('is-mobile')).toBe(true);
      expect(document.documentElement.classList.contains('is-ios')).toBe(true);
    });
    
    test('adds feature support classes', () => {
      // Mock no Grid support
      window.CSS.supports.mockImplementation((prop, value) => {
        return !(prop === 'display' && value === 'grid');
      });
      
      addBrowserClasses();
      
      expect(document.documentElement.classList.contains('no-grid')).toBe(true);
    });
  });
  
  describe('browser fixes', () => {
    test('applies iOS viewport height fix', () => {
      // Setup iOS device
      mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1';
      
      // Mock window inner height
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1000
      });
      
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      applyBrowserFixes();
      
      expect(document.documentElement.style.getPropertyValue('--vh')).toBe('10px');
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
    });
    
    test('warns about Internet Explorer', () => {
      // Setup IE browser
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
      document.documentMode = 11;
      
      applyBrowserFixes();
      
      expect(console.warn).toHaveBeenCalledWith('Internet Explorer detected. Some features may not work correctly.');
      
      // Clean up
      delete document.documentMode;
    });
    
    test('adds no-flex-gap class for Safari without gap support', () => {
      // Setup Safari browser
      mockUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15';
      
      // Mock no gap support
      window.CSS.supports.mockImplementation((prop, value) => {
        return !(prop === 'gap' && value === '1px');
      });
      
      applyBrowserFixes();
      
      expect(document.documentElement.classList.contains('no-flex-gap')).toBe(true);
    });
  });
  
  describe('initialization', () => {
    test('initializes browser compatibility and logs info in development', () => {
      // Setup Chrome browser
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
      window.chrome = { runtime: {} };
      
      // Mock NODE_ENV
      process.env.NODE_ENV = 'development';
      
      const result = initBrowserCompatibility();
      
      expect(result.name).toBe('Chrome');
      expect(result.version).toBe('90');
      expect(console.log).toHaveBeenCalledWith('Browser:', 'Chrome', '90');
      
      // Restore NODE_ENV
      process.env.NODE_ENV = 'test';
    });
    
    test('does not log in production environment', () => {
      // Setup Chrome browser
      mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
      window.chrome = { runtime: {} };
      
      // Mock NODE_ENV
      process.env.NODE_ENV = 'production';
      
      initBrowserCompatibility();
      
      expect(console.log).not.toHaveBeenCalled();
      
      // Restore NODE_ENV
      process.env.NODE_ENV = 'test';
    });
  });
});
