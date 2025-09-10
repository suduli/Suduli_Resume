// Mock implementation for tsparticles
const tsparticles = {
  load: jest.fn().mockResolvedValue({
    refresh: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    destroy: jest.fn().mockResolvedValue(undefined),
  }),
  setOnParticlesLoaded: jest.fn(),
  setOnParticlesInit: jest.fn(),
};

module.exports = tsparticles;
