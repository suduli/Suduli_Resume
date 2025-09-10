import React from 'react';
import { render, screen } from '@testing-library/react';
import ParticleBackground from './ParticleBackground';

// Mock the theme context
jest.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

// Mock window.particlesJS
const mockParticlesJS = jest.fn();

describe('ParticleBackground Component', () => {
  // Save original console.warn
  const originalConsoleWarn = console.warn;
  
  beforeAll(() => {
    // Suppress console warnings for tests
    console.warn = jest.fn();
    
    // Mock window.particlesJS
    window.particlesJS = mockParticlesJS;
    
    // Mock window.pJSDom for cleanup
    window.pJSDom = [];
  });
  
  afterAll(() => {
    // Restore console.warn
    console.warn = originalConsoleWarn;
    
    // Clean up mocks
    delete window.particlesJS;
    delete window.pJSDom;
  });
  
  beforeEach(() => {
    // Clear mock calls before each test
    mockParticlesJS.mockClear();
    window.pJSDom = [];
  });

  test('renders with default props', () => {
    render(<ParticleBackground />);
    
    const container = screen.getByTestId('particle-background');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('id', 'particles-background');
  });

  test('renders with custom containerId', () => {
    render(<ParticleBackground containerId="custom-container" />);
    
    const container = screen.getByTestId('particle-background');
    expect(container).toHaveAttribute('id', 'custom-container');
  });

  test('applies additional className when provided', () => {
    render(<ParticleBackground className="custom-class" />);
    
    const container = screen.getByTestId('particle-background');
    expect(container).toHaveClass('custom-class');
  });

  test('initializes particles.js with default config when no config provided', () => {
    render(<ParticleBackground />);
    
    // Check if particlesJS was called with the containerId
    expect(mockParticlesJS).toHaveBeenCalledWith(
      'particles-background',
      expect.any(Object)
    );
  });

  test('initializes particles.js with custom config when provided', () => {
    const customConfig = { test: 'config' };
    render(<ParticleBackground config={customConfig} />);
    
    // Check if particlesJS was called with the custom config
    expect(mockParticlesJS).toHaveBeenCalledWith(
      'particles-background',
      customConfig
    );
  });
});
