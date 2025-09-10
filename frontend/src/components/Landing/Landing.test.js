import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from './Landing';

// Mock the dependencies
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../common/ParticleBackground', () => {
  return function MockParticleBackground({ containerId }) {
    return <div data-testid="mock-particle-bg" id={containerId}></div>;
  };
});

jest.mock('../common/TextAnimation', () => {
  return function MockTextAnimation({ text, element: Element = 'div', className, animation, delay, children }) {
    return (
      <Element className={className} data-testid={`mock-text-animation-${animation}-${delay}`}>
        {text || children}
      </Element>
    );
  };
});

jest.mock('../Button/Button', () => {
  return function MockButton({ label, href, variant, onClick }) {
    return (
      <button 
        onClick={onClick} 
        data-href={href}
        data-variant={variant}
        data-testid="mock-button"
      >
        {label}
      </button>
    );
  };
});

describe('Landing Component', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    description: 'Test Description',
    buttons: [
      { label: 'Button 1', href: '#test1', variant: 'primary' },
      { label: 'Button 2', href: '#test2', variant: 'secondary' }
    ],
    particleConfig: { test: 'config' }
  };

  test('renders with all content', () => {
    render(<Landing {...defaultProps} />);
    
    // Check text animations with correct text content
    expect(screen.getByTestId('mock-text-animation-typewriter-300')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('mock-text-animation-fadeIn-1500')).toHaveTextContent('Test Subtitle');
    expect(screen.getByTestId('mock-text-animation-fadeIn-2000')).toHaveTextContent('Test Description');
    
    // Check that particle background is rendered
    expect(screen.getByTestId('mock-particle-bg')).toBeInTheDocument();
    
    // Check that buttons are rendered
    const buttons = screen.getAllByTestId('mock-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Button 1');
    expect(buttons[1]).toHaveTextContent('Button 2');
    
    // Check that scroll indicator is rendered
    expect(screen.getByText('Scroll Down')).toBeInTheDocument();
  });

  test('renders with default props when none provided', () => {
    render(<Landing />);
    
    // Check default title
    expect(screen.getByTestId('mock-text-animation-typewriter-300')).toHaveTextContent('Hi, I\'m John Doe');
    
    // Check default buttons
    const buttons = screen.getAllByTestId('mock-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('View Projects');
    expect(buttons[1]).toHaveTextContent('Contact Me');
  });

  test('applies theme-specific class', () => {
    render(<Landing />);
    
    const landingContainer = screen.getByTestId('landing-container');
    expect(landingContainer).toHaveClass('landing-light');
  });

  test('applies additional className when provided', () => {
    render(<Landing className="custom-class" />);
    
    const landingContainer = screen.getByTestId('landing-container');
    expect(landingContainer).toHaveClass('custom-class');
  });
});
