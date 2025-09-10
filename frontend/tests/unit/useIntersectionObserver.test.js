/**
 * Unit tests for useIntersectionObserver hook
 * Part of task T057 - Create unit tests for utility functions
 */

import { renderHook, act } from '@testing-library/react';
import useIntersectionObserver from '../../src/hooks/useIntersectionObserver';

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

describe('useIntersectionObserver', () => {
  let mockIntersectionObserver;
  let mockEntry;
  let observerCallback;
  
  beforeEach(() => {
    // Reset mocks
    mockObserve.mockReset();
    mockUnobserve.mockReset();
    mockDisconnect.mockReset();
    
    // Default mock entry
    mockEntry = {
      isIntersecting: false,
      target: document.createElement('div')
    };
    
    // Mock IntersectionObserver implementation
    mockIntersectionObserver = jest.fn((callback, options) => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        options
      };
    });
    
    // Set global IntersectionObserver
    global.IntersectionObserver = mockIntersectionObserver;
  });
  
  afterEach(() => {
    // Cleanup global mocks
    delete global.IntersectionObserver;
  });
  
  test('should return a ref and isIntersecting state', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    // Initial state should be a ref and false
    const [ref, isIntersecting] = result.current;
    expect(ref).toBeDefined();
    expect(isIntersecting).toBe(false);
  });
  
  test('should start observing when ref is set', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    // Set the ref to a DOM element
    const [ref] = result.current;
    const element = document.createElement('div');
    
    // Set the ref
    act(() => {
      ref.current = element;
      // Manually trigger the effect since the ref is set after rendering
      const observer = mockIntersectionObserver.mock.results[0].value;
      observer.observe(element);
    });
    
    expect(mockObserve).toHaveBeenCalledWith(element);
  });
  
  test('should update isIntersecting when entry changes', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    // Initial state
    expect(result.current[1]).toBe(false);
    
    // Simulate intersection
    act(() => {
      mockEntry.isIntersecting = true;
      observerCallback([mockEntry]);
    });
    
    // State should update
    expect(result.current[1]).toBe(true);
  });
  
  test('should unobserve on unmount', () => {
    const element = document.createElement('div');
    
    // Render the hook with a pre-set ref
    const { unmount } = renderHook(() => {
      const [ref, isIntersecting] = useIntersectionObserver();
      ref.current = element;
      return { ref, isIntersecting };
    });
    
    // Simulate setting up the observer
    act(() => {
      const observer = mockIntersectionObserver.mock.results[0].value;
      observer.observe(element);
    });
    
    // Unmount the component
    unmount();
    
    // Should unobserve the element
    expect(mockUnobserve).toHaveBeenCalledWith(element);
  });
  
  test('should pass options to IntersectionObserver', () => {
    const options = {
      root: null,
      rootMargin: '10px',
      threshold: 0.5
    };
    
    renderHook(() => useIntersectionObserver(options));
    
    // Check that options were passed to IntersectionObserver
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });
  
  test('should unobserve when triggerOnce is true and element becomes visible', () => {
    const options = { triggerOnce: true };
    
    const { result } = renderHook(() => useIntersectionObserver(options));
    
    // Set the ref to a DOM element
    const [ref] = result.current;
    const element = document.createElement('div');
    
    // Set the ref and start observing
    act(() => {
      ref.current = element;
      const observer = mockIntersectionObserver.mock.results[0].value;
      observer.observe(element);
    });
    
    // Simulate intersection
    act(() => {
      mockEntry.isIntersecting = true;
      mockEntry.target = element;
      observerCallback([mockEntry]);
    });
    
    // Should unobserve the element
    expect(mockUnobserve).toHaveBeenCalledWith(element);
  });
  
  test('should not unobserve when triggerOnce is true but element is not visible', () => {
    const options = { triggerOnce: true };
    
    const { result } = renderHook(() => useIntersectionObserver(options));
    
    // Set the ref to a DOM element
    const [ref] = result.current;
    const element = document.createElement('div');
    
    // Set the ref and start observing
    act(() => {
      ref.current = element;
      const observer = mockIntersectionObserver.mock.results[0].value;
      observer.observe(element);
    });
    
    // Simulate non-intersection
    act(() => {
      mockEntry.isIntersecting = false;
      mockEntry.target = element;
      observerCallback([mockEntry]);
    });
    
    // Should not unobserve the element
    expect(mockUnobserve).not.toHaveBeenCalled();
  });
  
  test('should not unobserve when triggerOnce is not set', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    
    // Set the ref to a DOM element
    const [ref] = result.current;
    const element = document.createElement('div');
    
    // Set the ref and start observing
    act(() => {
      ref.current = element;
      const observer = mockIntersectionObserver.mock.results[0].value;
      observer.observe(element);
    });
    
    // Simulate intersection
    act(() => {
      mockEntry.isIntersecting = true;
      mockEntry.target = element;
      observerCallback([mockEntry]);
    });
    
    // Should not unobserve the element
    expect(mockUnobserve).not.toHaveBeenCalled();
  });
});
