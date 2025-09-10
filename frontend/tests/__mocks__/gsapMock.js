/**
 * Mock implementation for GSAP and ScrollTrigger
 * This avoids test failures when components import GSAP libraries
 */

const timelineFactory = () => {
  const tl = {
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
    play: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    progress: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
  };

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
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn(),
  timeline: jest.fn().mockImplementation(() => timelineFactory()),
  registerPlugin: jest.fn(),
  config: jest.fn(),
};

// ScrollTrigger plugin mock
const ScrollTrigger = {
  create: jest.fn(),
  refresh: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn(() => []),
  kill: jest.fn(),
  defaults: {},
};

// Add ScrollTrigger as a property of gsap for imports like: import { ScrollTrigger } from 'gsap'
gsap.ScrollTrigger = ScrollTrigger;

// Export both as the default export and named export
export { ScrollTrigger };
export default gsap;
