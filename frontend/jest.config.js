/**
 * Setup Jest test configuration
 */

module.exports = {
  // The root directory where Jest should scan for tests
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  
  // File extensions Jest will look for
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  
  // Ignore these directories
  testPathIgnorePatterns: ['/node_modules/', '/public/'],
  
  // Use jsdom environment for DOM testing
  testEnvironment: 'jsdom',
  
  // Setup files to run before tests
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupTests.js'
  ],
  
  // Mock file imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '^src/components/common/TextAnimation/TextAnimation$': '<rootDir>/tests/__mocks__/TextAnimation.js',
    '^src/components/common/TextAnimation$': '<rootDir>/tests/__mocks__/TextAnimation.js',
    '^src/components/common/LazyLoad$': '<rootDir>/tests/__mocks__/LazyLoad.js',
    '^src/components/common/ParticleBackground$': '<rootDir>/tests/__mocks__/ParticleBackground.js',
    '^src/components/common/ParticleBackground/ParticleBackground$': '<rootDir>/tests/__mocks__/ParticleBackground.js',
    '^src/contexts/DataContext$': '<rootDir>/tests/__mocks__/DataContext.js',
    // Add GSAP modules to prevent import errors
    '^gsap/ScrollTrigger$': '<rootDir>/tests/__mocks__/gsapMock.js',
    '^gsap$': '<rootDir>/tests/__mocks__/gsapMock.js',
    // Theme-related mocks
    '^src/services/ThemeManager$': '<rootDir>/tests/__mocks__/ThemeManager.js',
    '^src/services/ThemeStorage$': '<rootDir>/tests/__mocks__/ThemeStorage.js',
    '^src/services/ThemeAnimationAdapter$': '<rootDir>/tests/__mocks__/ThemeAnimationAdapter.js',
    '^src/models/theme$': '<rootDir>/tests/__mocks__/theme.js'
  },
  
  // Coverage settings
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/index.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
