/**
 * Unit tests for PerformanceMonitor utility
 * Part of task T057 - Create unit tests for utility functions
 */

import {
  resetPerformanceData,
  measurePerformance,
  measureAsyncPerformance,
  trackRender,
  usePerformanceTracking,
  logPerformanceStats,
  monitorResourceLoading
} from '../../src/utils/PerformanceMonitor';
import { renderHook } from '@testing-library/react';

// Mock the console methods
const originalConsole = { ...console };
beforeEach(() => {
  console.log = jest.fn();
  console.time = jest.fn();
  console.timeEnd = jest.fn();
  console.group = jest.fn();
  console.table = jest.fn();
  console.groupEnd = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  // Restore console methods
  console.log = originalConsole.log;
  console.time = originalConsole.time;
  console.timeEnd = originalConsole.timeEnd;
  console.group = originalConsole.group;
  console.table = originalConsole.table;
  console.groupEnd = originalConsole.groupEnd;
  console.error = originalConsole.error;
  
  // Reset performance monitoring data
  resetPerformanceData();
});

// Mock the performance API
const originalPerformance = global.performance;
beforeAll(() => {
  global.performance = {
    now: jest.fn().mockReturnValue(1000),
    memory: {
      usedJSHeapSize: 50 * 1024 * 1024, // 50 MB
      totalJSHeapSize: 100 * 1024 * 1024, // 100 MB
      jsHeapSizeLimit: 200 * 1024 * 1024 // 200 MB
    },
    getEntriesByType: jest.fn().mockReturnValue([])
  };
});

afterAll(() => {
  global.performance = originalPerformance;
});

// Mock PerformanceObserver
global.PerformanceObserver = class PerformanceObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    // Simulate an observation with a sample entry
    this.callback({
      getEntries: () => [{
        name: 'https://example.com/image.jpg',
        duration: 300,
        initiatorType: 'img'
      }]
    });
  }
  
  disconnect() {}
};

describe('PerformanceMonitor', () => {
  describe('measurePerformance', () => {
    test('measures the execution time of a synchronous function', () => {
      // Setup
      const mockFn = jest.fn().mockReturnValue('result');
      
      // Execute
      const result = measurePerformance(mockFn, 'Test Function');
      
      // Verify
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('result');
      expect(console.time).toHaveBeenCalledWith('⏱️ Test Function');
      expect(console.timeEnd).toHaveBeenCalledWith('⏱️ Test Function');
    });
    
    test('returns function result without measurement when monitoring is disabled', () => {
      // Store original NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Force reimport to get updated ENABLE_PERFORMANCE_MONITORING value
      jest.resetModules();
      const { measurePerformance } = require('../../src/utils/PerformanceMonitor');
      
      // Setup
      const mockFn = jest.fn().mockReturnValue('result');
      
      // Execute
      const result = measurePerformance(mockFn, 'Test Function');
      
      // Verify
      expect(mockFn).toHaveBeenCalled();
      expect(result).toBe('result');
      expect(console.time).not.toHaveBeenCalled();
      expect(console.timeEnd).not.toHaveBeenCalled();
      
      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
  
  describe('measureAsyncPerformance', () => {
    test('measures the execution time of an async function that succeeds', async () => {
      // Setup - mock performance.now() to return different values on successive calls
      global.performance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1300);
      
      // Async function that returns a promise
      const mockAsyncFn = jest.fn().mockResolvedValue('async result');
      
      // Execute
      const result = await measureAsyncPerformance(mockAsyncFn, 'Async Test');
      
      // Verify
      expect(mockAsyncFn).toHaveBeenCalled();
      expect(result).toBe('async result');
      expect(console.log).toHaveBeenCalledWith('⏱️ Async Test: 300.00ms');
    });
    
    test('measures the execution time of an async function that fails', async () => {
      // Setup - mock performance.now() to return different values on successive calls
      global.performance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1500);
      
      // Async function that throws an error
      const error = new Error('async error');
      const mockAsyncFn = jest.fn().mockRejectedValue(error);
      
      // Execute & Verify
      await expect(measureAsyncPerformance(mockAsyncFn, 'Async Error Test')).rejects.toThrow('async error');
      expect(mockAsyncFn).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('⏱️ Async Error Test (error): 500.00ms');
    });
    
    test('returns function result without measurement when monitoring is disabled', async () => {
      // Store original NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Force reimport to get updated ENABLE_PERFORMANCE_MONITORING value
      jest.resetModules();
      const { measureAsyncPerformance } = require('../../src/utils/PerformanceMonitor');
      
      // Setup
      const mockAsyncFn = jest.fn().mockResolvedValue('async result');
      
      // Execute
      const result = await measureAsyncPerformance(mockAsyncFn, 'Async Test');
      
      // Verify
      expect(mockAsyncFn).toHaveBeenCalled();
      expect(result).toBe('async result');
      expect(console.log).not.toHaveBeenCalled();
      
      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
  
  describe('trackRender', () => {
    test('tracks the render count of a component', () => {
      // First render
      trackRender('TestComponent');
      expect(console.log).toHaveBeenCalledWith('🔄 TestComponent rendered 1 times');
      
      // Second render
      console.log.mockClear();
      trackRender('TestComponent');
      expect(console.log).not.toHaveBeenCalled(); // Only logs on 1st render or every 5th
      
      // Fifth render
      console.log.mockClear();
      trackRender('TestComponent');
      trackRender('TestComponent');
      trackRender('TestComponent');
      expect(console.log).toHaveBeenCalledWith('🔄 TestComponent rendered 5 times');
    });
    
    test('returns 0 and does not track when monitoring is disabled', () => {
      // Store original NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Force reimport to get updated ENABLE_PERFORMANCE_MONITORING value
      jest.resetModules();
      const { trackRender } = require('../../src/utils/PerformanceMonitor');
      
      // Execute
      trackRender('TestComponent');
      
      // Verify
      expect(console.log).not.toHaveBeenCalled();
      
      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
  
  describe('usePerformanceTracking', () => {
    test('tracks component render times', () => {
      // Mock performance.now() to simulate time passing
      global.performance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1020);
      
      // Render the hook
      const { unmount } = renderHook(() => usePerformanceTracking('HookedComponent'));
      
      // Simulate component unmount
      unmount();
      
      // Should log slow render warning (>16ms)
      expect(console.log).toHaveBeenCalledWith('⚠️ Slow render: HookedComponent took 20.00ms');
    });
    
    test('does not log when render time is within performance threshold', () => {
      // Mock performance.now() to simulate fast render (less than 16ms)
      global.performance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1010);
      
      // Render the hook
      const { unmount } = renderHook(() => usePerformanceTracking('FastComponent'));
      
      // Simulate component unmount
      unmount();
      
      // Should not log (render time < 16ms)
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Slow render'));
    });
  });
  
  describe('logPerformanceStats', () => {
    test('logs performance statistics', () => {
      // Setup render counts
      trackRender('Component1');
      trackRender('Component1');
      trackRender('Component2');
      
      // Execute
      logPerformanceStats();
      
      // Verify
      expect(console.group).toHaveBeenCalledWith('📊 Performance Statistics');
      expect(console.log).toHaveBeenCalledWith('Component Render Counts:');
      expect(console.table).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Memory Usage:');
      expect(console.table).toHaveBeenCalledWith({
        'Used JS Heap': '50 MB',
        'Total JS Heap': '100 MB',
        'JS Heap Limit': '200 MB'
      });
      expect(console.groupEnd).toHaveBeenCalled();
    });
    
    test('does not log when monitoring is disabled', () => {
      // Store original NODE_ENV
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      // Force reimport to get updated ENABLE_PERFORMANCE_MONITORING value
      jest.resetModules();
      const { logPerformanceStats } = require('../../src/utils/PerformanceMonitor');
      
      // Execute
      logPerformanceStats();
      
      // Verify
      expect(console.group).not.toHaveBeenCalled();
      
      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
  
  describe('monitorResourceLoading', () => {
    test('monitors resource loading and logs slow resources', () => {
      // Execute
      const cleanup = monitorResourceLoading();
      
      // Verify
      expect(console.group).toHaveBeenCalledWith('🐢 Slow Resource Loading Detected');
      expect(console.log).toHaveBeenCalledWith('image.jpg: 300ms');
      expect(console.groupEnd).toHaveBeenCalled();
      
      // Call cleanup
      cleanup();
    });
    
    test('does not monitor when performance API is not available', () => {
      // Mock window.performance to not have getEntriesByType
      const tempPerformance = { ...global.performance };
      delete global.performance.getEntriesByType;
      
      // Execute
      monitorResourceLoading();
      
      // Verify
      expect(console.group).not.toHaveBeenCalled();
      
      // Restore
      global.performance = tempPerformance;
    });
  });
  
  describe('resetPerformanceData', () => {
    test('resets all performance monitoring data', () => {
      // Setup render counts
      trackRender('Component1');
      trackRender('Component2');
      
      // Execute
      resetPerformanceData();
      
      // Verify by tracking again - should be like first render
      console.log.mockClear();
      trackRender('Component1');
      expect(console.log).toHaveBeenCalledWith('🔄 Component1 rendered 1 times');
    });
  });
});
