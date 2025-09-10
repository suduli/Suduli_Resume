// Mock implementation for GSAP
const timelineFactory = () => {
  const tl = {
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    resume: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
  };

  // Provide a minimal scrollTrigger stub that tests and services may access
  tl.scrollTrigger = {
    kill: jest.fn(),
    refresh: jest.fn(),
    disable: jest.fn(),
    enable: jest.fn(),
    update: jest.fn(),
  };

  return tl;
};

const gsap = {
  version: 'mock',
  to: jest.fn().mockReturnValue({ pause: jest.fn(), resume: jest.fn(), kill: jest.fn() }),
  from: jest.fn().mockReturnValue({ pause: jest.fn(), resume: jest.fn(), kill: jest.fn() }),
  fromTo: jest.fn().mockReturnValue({ pause: jest.fn(), resume: jest.fn(), kill: jest.fn() }),
  set: jest.fn(),
  timeline: jest.fn().mockImplementation(() => timelineFactory()),
  registerPlugin: jest.fn(),
  config: jest.fn(),
  defaults: {},
  getProperty: jest.fn(),
  parseEase: jest.fn(),
  ticker: {
    add: jest.fn(),
    remove: jest.fn(),
  },
};

// CommonJS compatibility so require('gsap') or jest's module system returns usable exports
module.exports = gsap;
module.exports.gsap = gsap;
module.exports.default = gsap;

// Also provide ES module style exports for consumers that use import { gsap } or default
export { gsap };
export default gsap;
