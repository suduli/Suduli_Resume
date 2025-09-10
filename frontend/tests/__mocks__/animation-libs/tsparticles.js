/**
 * Mock for tsparticles library
 */

const tsParticles = {
  load: jest.fn().mockResolvedValue({}),
  loadJSON: jest.fn().mockResolvedValue({}),
  setOnParticlesLoaded: jest.fn(),
  domItem: jest.fn().mockReturnValue({
    destroy: jest.fn().mockResolvedValue({}),
    pause: jest.fn(),
    play: jest.fn(),
    refresh: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  }),
};

module.exports = { tsParticles };
