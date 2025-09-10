/**
 * Testing utilities for common test operations
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { DataProvider } from '../src/contexts/DataContext';

/**
 * Custom render function that includes providers
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Additional render options
 * @returns {Object} - Result from render
 */
export const renderWithProviders = (ui, options = {}) => {
  const AllProviders = ({ children }) => {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };
  
  return render(ui, { wrapper: AllProviders, ...options });
};

/**
 * Create a mocked theme context for testing
 * @param {Object} themeContextValue - Theme context value overrides
 * @returns {Object} - Mocked theme context
 */
export const mockThemeContext = (themeContextValue = {}) => {
  return {
    theme: 'light',
    setTheme: jest.fn(),
    toggleTheme: jest.fn(),
    ...themeContextValue,
  };
};

/**
 * Creates a mocked ResizeObserver for testing components that use it
 */
export const setupResizeObserverMock = () => {
  class ResizeObserverMock {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  
  window.ResizeObserver = ResizeObserverMock;
  return ResizeObserverMock;
};

/**
 * Creates a mock for IntersectionObserver
 */
export const setupIntersectionObserverMock = () => {
  // Provide a factory that mirrors the browser API and also exposes helpers
  // so tests can trigger intersection changes deterministically.
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockImplementation((callback) => {
    const elements = new Set();

    const instance = {
      observe: jest.fn((el) => {
        elements.add(el);
      }),
      unobserve: jest.fn((el) => {
        elements.delete(el);
      }),
      disconnect: jest.fn(() => {
        elements.clear();
      }),
      takeRecords: jest.fn(() => {
        return Array.from(elements).map(target => ({ target, isIntersecting: false }));
      }),
      // Helper used by tests to simulate an intersection change for all observed elements
      _simulateAllIntersecting: jest.fn((isIntersecting = true) => {
        const entries = Array.from(elements).map(target => ({
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          target,
          time: Date.now(),
          boundingClientRect: target && typeof target.getBoundingClientRect === 'function' ? target.getBoundingClientRect() : {},
          intersectionRect: isIntersecting && target && typeof target.getBoundingClientRect === 'function' ? target.getBoundingClientRect() : {},
          rootBounds: null,
        }));
        if (entries.length) callback(entries, instance);
      }),
      // Helper to simulate individual element intersection
      _simulateElementIntersecting: jest.fn((element, isIntersecting = true) => {
        if (!elements.has(element)) elements.add(element);
        const entry = {
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          target: element,
          time: Date.now(),
          boundingClientRect: element && typeof element.getBoundingClientRect === 'function' ? element.getBoundingClientRect() : {},
          intersectionRect: isIntersecting && element && typeof element.getBoundingClientRect === 'function' ? element.getBoundingClientRect() : {},
          rootBounds: null,
        };
        callback([entry], instance);
      }),
    };

    return instance;
  });

  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};
