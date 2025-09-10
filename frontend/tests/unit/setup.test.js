/**
 * Basic test to verify Jest setup
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import App from '../../src/App';

describe('Testing Environment', () => {
  test('Testing library is working', () => {
    render(<div data-testid="test-element">Test Environment Setup</div>);
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test Environment Setup');
  });

  test('Animation libraries mocks are working', () => {
    // Import mocked libraries
    const anime = require('animejs');
    const three = require('three');
    const gsap = require('gsap');
    const { tsParticles } = require('tsparticles');
    
    // Verify they can be called without errors
    anime({
      targets: '.element',
      translateX: 250,
      duration: 1000,
    });
    
    const scene = new three.Scene();
    const camera = new three.PerspectiveCamera();
    const renderer = new three.WebGLRenderer();
    
    gsap.to('.element', { duration: 1, x: 100 });
    
    tsParticles.load('tsparticles', {
      particles: {
        number: {
          value: 80,
        },
      },
    });
    
    // Expect they've been mocked correctly
    expect(anime).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalled();
    expect(tsParticles.load).toHaveBeenCalled();
    expect(scene).toBeDefined();
    expect(camera).toBeDefined();
    expect(renderer).toBeDefined();
  });

  test('Providers are working with test utils', () => {
    renderWithProviders(<App />);
    // Just verifying it renders without errors
    expect(document.body).toBeDefined();
  });
});
