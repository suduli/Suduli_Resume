/**
 * Mock for anime.js library
 */

const anime = jest.fn().mockImplementation((params) => {
  return {
    play: jest.fn(),
    pause: jest.fn(),
    restart: jest.fn(),
    seek: jest.fn(),
    finished: Promise.resolve(),
  };
});

anime.timeline = jest.fn().mockImplementation((params) => {
  return {
    add: jest.fn().mockReturnThis(),
    play: jest.fn(),
    pause: jest.fn(),
    finished: Promise.resolve(),
  };
});

anime.random = jest.fn().mockImplementation((min, max) => {
  return min + Math.random() * (max - min);
});

anime.stagger = jest.fn().mockImplementation((value, options) => {
  return value;
});

anime.path = jest.fn().mockImplementation((path) => {
  return () => ({ x: 0, y: 0 });
});

module.exports = anime;
