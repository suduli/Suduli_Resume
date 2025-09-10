/**
 * Unit tests for useReducedMotion hooks
 * Part of task T057 - Create unit tests for utility functions
 */

import { renderHook, act } from '@testing-library/react';
import { 
  useReducedMotion, 
  getReducedMotionAnimationOptions 
} from '../../src/hooks/useReducedMotion';
import reducedMotionService from '../../src/services/ReducedMotionService';

// Mock the ReducedMotionService
jest.mock('../../src/services/ReducedMotionService', () => ({
  initialized: false,
  initialize: jest.fn(),
  isReducedMotionPreferred: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  getAnimationOptions: jest.fn()
}));

describe('useReducedMotion hooks', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default implementation
    reducedMotionService.initialized = false;
    reducedMotionService.isReducedMotionPreferred.mockReturnValue(false);
    reducedMotionService.getAnimationOptions.mockImplementation((standard, reduced) => 
      reducedMotionService.isReducedMotionPreferred() ? reduced : standard
    );
  });
  
  describe('useReducedMotion', () => {
    test('initializes the service if not already initialized', () => {
      reducedMotionService.initialized = false;
      
      renderHook(() => useReducedMotion());
      
      expect(reducedMotionService.initialize).toHaveBeenCalled();
    });
    
    test('does not initialize the service if already initialized', () => {
      reducedMotionService.initialized = true;
      
      renderHook(() => useReducedMotion());
      
      expect(reducedMotionService.initialize).not.toHaveBeenCalled();
    });
    
    test('returns the current reduced motion preference', () => {
      reducedMotionService.isReducedMotionPreferred.mockReturnValue(true);
      
      const { result } = renderHook(() => useReducedMotion());
      
      expect(result.current).toBe(true);
    });
    
    test('adds a listener on mount and removes it on unmount', () => {
      const { unmount } = renderHook(() => useReducedMotion());
      
      expect(reducedMotionService.addListener).toHaveBeenCalled();
      
      unmount();
      
      expect(reducedMotionService.removeListener).toHaveBeenCalled();
    });
    
    test('updates when the reduced motion preference changes', () => {
      reducedMotionService.isReducedMotionPreferred.mockReturnValue(false);
      
      const { result } = renderHook(() => useReducedMotion());
      
      expect(result.current).toBe(false);
      
      // Simulate preference change by calling the listener callback
      const listenerCallback = reducedMotionService.addListener.mock.calls[0][0];
      
      act(() => {
        listenerCallback(true);
      });
      
      expect(result.current).toBe(true);
    });
  });
  
  describe('getReducedMotionAnimationOptions', () => {
    test('initializes the service if not already initialized', () => {
      reducedMotionService.initialized = false;
      
      getReducedMotionAnimationOptions({}, {});
      
      expect(reducedMotionService.initialize).toHaveBeenCalled();
    });
    
    test('does not initialize the service if already initialized', () => {
      reducedMotionService.initialized = true;
      
      getReducedMotionAnimationOptions({}, {});
      
      expect(reducedMotionService.initialize).not.toHaveBeenCalled();
    });
    
    test('calls getAnimationOptions on the service', () => {
      const standardOptions = { duration: 1000, easing: 'ease-in-out' };
      const reducedOptions = { duration: 0, easing: 'linear' };
      
      getReducedMotionAnimationOptions(standardOptions, reducedOptions);
      
      expect(reducedMotionService.getAnimationOptions).toHaveBeenCalledWith(
        standardOptions,
        reducedOptions
      );
    });
    
    test('returns standard options when reduced motion is not preferred', () => {
      reducedMotionService.isReducedMotionPreferred.mockReturnValue(false);
      
      const standardOptions = { duration: 1000, easing: 'ease-in-out' };
      const reducedOptions = { duration: 0, easing: 'linear' };
      
      const result = getReducedMotionAnimationOptions(standardOptions, reducedOptions);
      
      expect(result).toEqual(standardOptions);
    });
    
    test('returns reduced options when reduced motion is preferred', () => {
      reducedMotionService.isReducedMotionPreferred.mockReturnValue(true);
      
      const standardOptions = { duration: 1000, easing: 'ease-in-out' };
      const reducedOptions = { duration: 0, easing: 'linear' };
      
      const result = getReducedMotionAnimationOptions(standardOptions, reducedOptions);
      
      expect(result).toEqual(reducedOptions);
    });
  });
});
