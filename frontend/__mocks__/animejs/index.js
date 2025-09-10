// Mock implementation for anime.js
const anime = jest.fn().mockReturnValue({
  play: jest.fn(),
  pause: jest.fn(),
  restart: jest.fn(),
  seek: jest.fn(),
  completed: true,
  begin: jest.fn(),
  loopBegin: jest.fn(),
  changeBegin: jest.fn(),
  changeComplete: jest.fn(),
  update: jest.fn(),
  complete: jest.fn(),
  reset: jest.fn(),
  finished: Promise.resolve(),
});

anime.timeline = jest.fn().mockReturnValue({
  add: jest.fn().mockReturnThis(),
  play: jest.fn(),
  pause: jest.fn(),
  restart: jest.fn(),
  seek: jest.fn(),
  completed: true,
});

anime.random = jest.fn((min, max) => min + Math.random() * (max - min));
anime.stagger = jest.fn((value) => value);
anime.path = jest.fn();
anime.setDashoffset = jest.fn();
anime.easing = {
  easeInOutSine: jest.fn((t) => t),
  easeOutSine: jest.fn((t) => t),
  easeInSine: jest.fn((t) => t),
  easeInOutQuad: jest.fn((t) => t),
  easeOutQuad: jest.fn((t) => t),
  easeInQuad: jest.fn((t) => t),
  easeInOutCubic: jest.fn((t) => t),
  easeOutCubic: jest.fn((t) => t),
  easeInCubic: jest.fn((t) => t),
  easeInOutQuart: jest.fn((t) => t),
  easeOutQuart: jest.fn((t) => t),
  easeInQuart: jest.fn((t) => t),
  easeInOutQuint: jest.fn((t) => t),
  easeOutQuint: jest.fn((t) => t),
  easeInQuint: jest.fn((t) => t),
  easeInOutExpo: jest.fn((t) => t),
  easeOutExpo: jest.fn((t) => t),
  easeInExpo: jest.fn((t) => t),
  easeInOutCirc: jest.fn((t) => t),
  easeOutCirc: jest.fn((t) => t),
  easeInCirc: jest.fn((t) => t),
  easeInOutBack: jest.fn((t) => t),
  easeOutBack: jest.fn((t) => t),
  easeInBack: jest.fn((t) => t),
  easeInOutElastic: jest.fn((t) => t),
  easeOutElastic: jest.fn((t) => t),
  easeInElastic: jest.fn((t) => t),
  easeInOutBounce: jest.fn((t) => t),
  easeOutBounce: jest.fn((t) => t),
  easeInBounce: jest.fn((t) => t),
  cubicBezier: jest.fn().mockReturnValue((t) => t),
  spring: jest.fn().mockReturnValue((t) => t),
  elasticity: jest.fn().mockReturnValue((t) => t),
};

anime.remove = jest.fn();
anime.get = jest.fn();
anime.set = jest.fn();
anime.tick = jest.fn();
anime.running = [];

module.exports = anime;
