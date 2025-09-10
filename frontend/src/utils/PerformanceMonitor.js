/**
 * Performance Monitoring Utility
 * Part of task T054 - Performance Optimizations
 * 
 * This utility provides simple performance monitoring capabilities:
 * - Measure function execution time
 * - Track component render counts
 * - Log render durations
 * - Monitor resource loading
 */

import { useEffect } from 'react';

// Enable/disable performance monitoring globally
const ENABLE_PERFORMANCE_MONITORING = process.env.NODE_ENV === 'development';

// Track component render counts for development purposes
const renderCounts = new Map();

/**
 * Reset all performance monitoring data
 */
export const resetPerformanceData = () => {
  renderCounts.clear();
};

/**
 * Measure the execution time of a function
 * @param {Function} fn - The function to measure
 * @param {string} label - A label for the measurement
 * @returns {any} The result of the function
 */
export const measurePerformance = (fn, label) => {
  if (!ENABLE_PERFORMANCE_MONITORING) return fn();
  
  console.time(`⏱️ ${label}`);
  const result = fn();
  console.timeEnd(`⏱️ ${label}`);
  
  return result;
};

/**
 * Measure the execution time of an async function
 * @param {Function} asyncFn - The async function to measure
 * @param {string} label - A label for the measurement
 * @returns {Promise<any>} A promise that resolves to the result of the async function
 */
export const measureAsyncPerformance = async (asyncFn, label) => {
  if (!ENABLE_PERFORMANCE_MONITORING) return asyncFn();
  
  const startTime = performance.now();
  try {
    const result = await asyncFn();
    const duration = performance.now() - startTime;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.log(`⏱️ ${label} (error): ${duration.toFixed(2)}ms`);
    throw error;
  }
};

/**
 * Track component render count
 * @param {string} componentName - The name of the component
 * @returns {number} The current render count
 */
export const trackRender = (componentName) => {
  if (!ENABLE_PERFORMANCE_MONITORING) return 0;
  
  const currentCount = renderCounts.get(componentName) || 0;
  const newCount = currentCount + 1;
  renderCounts.set(componentName, newCount);
  
  // Only log every 5 renders to reduce console noise
  if (newCount % 5 === 0 || newCount === 1) {
    console.log(`🔄 ${componentName} rendered ${newCount} times`);
  }
  
  return newCount;
};

/**
 * Create a performance tracking hook for React components
 * Usage: usePerformanceTracking('ComponentName');
 * 
 * @param {string} componentName - The name of the component to track
 */
export const usePerformanceTracking = (componentName) => {
  // Always call hooks unconditionally
  useEffect(() => {
    if (!ENABLE_PERFORMANCE_MONITORING) return;
    
    trackRender(componentName);
    const startTime = performance.now();
    
    return () => {
      if (!ENABLE_PERFORMANCE_MONITORING) return;
      
      const duration = performance.now() - startTime;
      if (duration > 16) { // Only log slow renders (> 16ms = 60fps threshold)
        console.log(`⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  });
};

/**
 * Log the current performance statistics
 */
export const logPerformanceStats = () => {
  if (!ENABLE_PERFORMANCE_MONITORING) return;
  
  console.group('📊 Performance Statistics');
  
  // Log component render counts
  console.log('Component Render Counts:');
  const sortedRenderCounts = [...renderCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 most rendered components
    
  console.table(sortedRenderCounts.map(([name, count]) => ({ Component: name, Renders: count })));
  
  // Log memory usage if available
  if (window.performance && window.performance.memory) {
    const memoryInfo = window.performance.memory;
    console.log('Memory Usage:');
    console.table({
      'Used JS Heap': `${Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024))} MB`,
      'Total JS Heap': `${Math.round(memoryInfo.totalJSHeapSize / (1024 * 1024))} MB`,
      'JS Heap Limit': `${Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024))} MB`
    });
  }
  
  console.groupEnd();
};

/**
 * Monitor resource loading performance
 * Call this once at app initialization to start monitoring
 */
export const monitorResourceLoading = () => {
  if (!ENABLE_PERFORMANCE_MONITORING || !window.performance || !window.performance.getEntriesByType) return;
  
  // Create a performance observer to monitor resource loading
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    
    // Filter out small resources and non-slow resources
    const slowResources = entries.filter(entry => 
      entry.duration > 200 && // Only resources that took more than 200ms
      entry.initiatorType !== 'xmlhttprequest' // Exclude XHR as they're handled separately
    );
    
    if (slowResources.length > 0) {
      console.group('🐢 Slow Resource Loading Detected');
      slowResources.forEach(entry => {
        console.log(`${entry.name.split('/').pop()}: ${entry.duration.toFixed(0)}ms`);
      });
      console.groupEnd();
    }
  });
  
  // Start observing resource timing entries
  observer.observe({ entryTypes: ['resource'] });
  
  return () => observer.disconnect(); // Return cleanup function
};

// Create an object with all utilities
const PerformanceMonitor = {
  measurePerformance,
  measureAsyncPerformance,
  trackRender,
  usePerformanceTracking,
  logPerformanceStats,
  monitorResourceLoading,
  resetPerformanceData
};

export default PerformanceMonitor;
