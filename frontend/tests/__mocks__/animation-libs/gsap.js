/**
 * Mock for GSAP library
 */

const gsap = {
  to: jest.fn().mockReturnValue({
    pause: jest.fn(),
    resume: jest.fn(),
    kill: jest.fn(),
  }),
  from: jest.fn().mockReturnValue({
    pause: jest.fn(),
    resume: jest.fn(),
    kill: jest.fn(),
  }),
  fromTo: jest.fn().mockReturnValue({
    pause: jest.fn(),
    resume: jest.fn(),
    kill: jest.fn(),
  }),
  timeline: jest.fn().mockReturnValue({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    pause: jest.fn(),
    resume: jest.fn(),
    kill: jest.fn(),
  }),
  registerPlugin: jest.fn(),
  config: jest.fn(),
  set: jest.fn(),
};

// ScrollTrigger plugin mock
gsap.ScrollTrigger = {
  create: jest.fn().mockReturnValue({
    kill: jest.fn(),
  }),
  refresh: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

module.exports = gsap;
