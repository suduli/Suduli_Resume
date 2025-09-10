// jest manual mock for gsap/ScrollTrigger
const ScrollTrigger = {
  create: jest.fn().mockReturnValue({
    kill: jest.fn(),
    refresh: jest.fn(),
    update: jest.fn(),
  }),
  refresh: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn().mockReturnValue([]),
  kill: jest.fn(),
  killAll: jest.fn(),
  defaults: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  batch: jest.fn(),
  saveStyles: jest.fn(),
  revert: jest.fn(),
  matchMedia: jest.fn(),
  clearMatchMedia: jest.fn(),
  isTouch: false,
  config: {
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
  },
};

export { ScrollTrigger };
export default ScrollTrigger;
