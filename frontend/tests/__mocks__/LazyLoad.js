/**
 * Mock implementation for LazyLoad component
 * This allows tests to run without the need for IntersectionObserver
 */

import React from 'react';

const LazyLoad = ({ children }) => {
  // Simple mock that just renders the children without any lazy loading
  return <div data-testid="lazy-load-mock">{children}</div>;
};

export default LazyLoad;
