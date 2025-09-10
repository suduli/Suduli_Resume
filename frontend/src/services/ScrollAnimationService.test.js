/**
 * ScrollAnimationService tests
 */

import ScrollAnimationService from './ScrollAnimationService';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Mock ThemeAnimationAdapter
jest.mock('./ThemeAnimationAdapter', () => ({
  getTextEffectSettings: jest.fn().mockReturnValue({
    textAnimationSpeed: 0.8,
    textGlow: 'none'
  }),
  getCardAnimationSettings: jest.fn().mockReturnValue({
    cardTransitionSpeed: 0.5,
    cardGlow: 'none'
  })
}));

// Mock SystemPreferenceDetector
jest.mock('./SystemPreferenceDetector', () => ({
  initialize: jest.fn(),
  getReducedMotionPreference: jest.fn().mockReturnValue(false),
  startListening: jest.fn(),
  stopListening: jest.fn(),
  onPreferenceChange: jest.fn(),
  _initialized: true
}));

describe('ScrollAnimationService', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup DOM element for testing
    document.body.innerHTML = `
      <div id="test-element"></div>
      <div class="stagger-elements"></div>
      <div class="stagger-elements"></div>
      <div class="stagger-elements"></div>
    `;
  });
  
  it('should create a scroll animation', () => {
    const element = document.getElementById('test-element');
    const timeline = ScrollAnimationService.createScrollAnimation(element);
    
    expect(gsap.timeline).toHaveBeenCalled();
    expect(timeline).toBeDefined();
  });
  
  it('should create a staggered animation', () => {
    const elements = document.querySelectorAll('.stagger-elements');
    const timeline = ScrollAnimationService.createStaggeredAnimation(elements);
    
    expect(gsap.timeline).toHaveBeenCalled();
    expect(timeline).toBeDefined();
  });
  
  it('should create a parallax effect', () => {
    const element = document.getElementById('test-element');
    const timeline = ScrollAnimationService.createParallaxEffect(element);
    
    expect(gsap.timeline).toHaveBeenCalled();
    expect(timeline).toBeDefined();
  });
  
  it('should create a custom animation', () => {
    const element = document.getElementById('test-element');
    const fromVars = { opacity: 0, y: 50 };
    const toVars = { opacity: 1, y: 0 };
    const timeline = ScrollAnimationService.createCustomScrollAnimation(element, fromVars, toVars);
    
    expect(gsap.timeline).toHaveBeenCalled();
    expect(timeline).toBeDefined();
  });
  
  it('should refresh ScrollTrigger instances', () => {
    ScrollAnimationService.refreshScrollTriggers();
    
    expect(ScrollTrigger.refresh).toHaveBeenCalled();
  });
  
  it('should get active ScrollTrigger instances', () => {
    const triggers = ScrollAnimationService.getActiveScrollTriggers();
    
    expect(ScrollTrigger.getAll).toHaveBeenCalled();
    expect(Array.isArray(triggers)).toBe(true);
  });
  
  it('should have animation presets defined', () => {
    expect(ScrollAnimationService.animationPresets).toBeDefined();
  });
  
  it('should detect reduced motion preference', () => {
    const isReduced = ScrollAnimationService.isReducedMotionPreferred();
    expect(typeof isReduced).toBe('boolean');
  });
  
  it('should initialize with a theme manager', () => {
    // Create a mock theme manager
    const mockThemeManager = {
      on: jest.fn(),
      getCurrentTheme: jest.fn().mockReturnValue({
        id: 'light',
        colors: {
          primary: '#000000'
        }
      })
    };
    
    // Initialize the service
    ScrollAnimationService.initialize(mockThemeManager);
    
    // Verify that the theme manager was used
    expect(mockThemeManager.on).toHaveBeenCalledWith('themeChanged', expect.any(Function));
    expect(mockThemeManager.getCurrentTheme).toHaveBeenCalled();
  });
  
  it('should clear all animations', () => {
    // Create a few animations to clear
    const element = document.getElementById('test-element');
    ScrollAnimationService.createScrollAnimation(element);
    ScrollAnimationService.createParallaxEffect(element);
    
    // Clear animations
    ScrollAnimationService.clearAllAnimations();
    
    // Verify that ScrollTrigger.getAll was called (to get triggers to kill)
    expect(ScrollTrigger.getAll).toHaveBeenCalled();
  });
});
