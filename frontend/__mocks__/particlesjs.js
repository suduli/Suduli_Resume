// Mock implementation for particles.js
const particlesJS = jest.fn();

global.particlesJS = particlesJS;

module.exports = particlesJS;
