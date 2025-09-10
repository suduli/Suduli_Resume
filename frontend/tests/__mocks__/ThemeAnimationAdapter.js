/**
 * Mock for ThemeAnimationAdapter
 */

const ThemeAnimationAdapter = {
  getTextEffectSettings: jest.fn((theme) => {
    // Default mock settings for any theme
    return {
      textGlow: 'none',
      textAnimationSpeed: 1,
      textShadow: 'none'
    };
  }),
  
  getScrollTriggerSettings: jest.fn((theme) => {
    return {
      scrub: 0.5,
      ease: 'power2.inOut',
      toggleActions: 'play none none reverse'
    };
  }),
  
  getMotionEffectSettings: jest.fn((theme) => {
    return {
      duration: 0.8,
      ease: 'power1.out',
      stagger: 0.1
    };
  })
};

export default ThemeAnimationAdapter;
