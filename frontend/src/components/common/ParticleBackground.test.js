import React from 'react';
import { render, screen } from '@testing-library/react';
import ParticleBackground from './ParticleBackground';
import { ThemeContext } from '../../contexts/ThemeContext';

// Mock tsParticles
jest.mock('tsparticles', () => ({
  load: jest.fn().mockResolvedValue({ id: 'test-container' }),
  domItem: jest.fn().mockReturnValue({
    destroy: jest.fn()
  })
}));

describe('ParticleBackground', () => {
  // Mock theme context
  const mockThemeContext = {
    theme: 'light',
    toggleTheme: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <ParticleBackground id="test-particles" />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('particle-background')).toBeInTheDocument();
  });

  it('applies custom class name', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <ParticleBackground id="test-particles" className="custom-class" />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('particle-background')).toHaveClass('custom-class');
  });

  it('uses the correct ID', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <ParticleBackground id="custom-id" />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('particle-background').id).toBe('custom-id');
  });

  it('uses default ID if none provided', () => {
    render(
      <ThemeContext.Provider value={mockThemeContext}>
        <ParticleBackground />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId('particle-background').id).toBe('particles-background');
  });
});
