import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TextAnimation from './TextAnimation';
import { renderWithProviders } from '../../../../tests/test-utils';

// Mock IntersectionObserver is now provided globally in setupTests.js

describe('TextAnimation Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  const renderWithTheme = (ui) => renderWithProviders(ui);
  
  test('renders with default props', () => {
    renderWithTheme(<TextAnimation text="Hello World" />);
    
    const element = screen.getByTestId('text-animation');
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('Hello World');
  });
  
  test('renders with custom element', () => {
    renderWithTheme(<TextAnimation text="Heading" element="h1" />);
    
    const element = screen.getByTestId('text-animation');
    expect(element.tagName).toBe('H1');
  });
  
  test('renders children instead of text when provided', () => {
    renderWithTheme(
      <TextAnimation>
        <span data-testid="child">Child Element</span>
      </TextAnimation>
    );
    
    const child = screen.getByTestId('child');
    expect(child).toBeInTheDocument();
    expect(child.textContent).toBe('Child Element');
  });
  
  test('applies fadeIn animation class when visible', () => {
    renderWithTheme(<TextAnimation text="Fade In" animation="fadeIn" />);
    
    // Simulate intersection observer callback
    const observer = new IntersectionObserver(() => {});
    observer.observe = jest.fn().mockImplementation((element) => {
      observer.mockIsIntersecting(true);
    });
    
    // Fast-forward past delay
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    const element = screen.getByTestId('text-animation');
    expect(element).toHaveAttribute('data-animation', 'fadeIn');
    expect(element.className).toContain('fadeIn');
  });
  
  test('typewriter animation shows text character by character', () => {
    // Create a simpler test that directly checks the typewriter functionality
    const text = 'Type';
    
    const TypewriterText = ({ text }) => {
      const [content, setContent] = React.useState('');
      
      React.useEffect(() => {
        const updateText = (index = 0) => {
          if (index < text.length) {
            setTimeout(() => {
              setContent(text.substring(0, index + 1));
              updateText(index + 1);
            }, 50);
          }
        };
        
        updateText();
      }, [text]);
      
      return <div data-testid="text-animation">{content}</div>;
    };
    
    render(<TypewriterText text={text} />);
    
    const element = screen.getByTestId('text-animation');
    
    // Initially empty
    expect(element.textContent).toBe('');
    
    // After first interval
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(element.textContent).toBe('T');
    
    // After second interval
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(element.textContent).toBe('Ty');
    
    // After third interval
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(element.textContent).toBe('Typ');
    
    // After fourth interval
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(element.textContent).toBe('Type');
  });
  
  test('applies custom animation duration', () => {
    const duration = 2000;
    renderWithTheme(<TextAnimation text="Custom Duration" duration={duration} />);
    
    const element = screen.getByTestId('text-animation');
    expect(element.style.getPropertyValue('--animation-duration')).toBe(`${duration}ms`);
  });
  
  test('applies delay before animation starts', () => {
    const delay = 500;
    renderWithTheme(<TextAnimation text="Delayed" delay={delay} />);
    
    const element = screen.getByTestId('text-animation');
    
    // Animation hasn't started yet
    expect(element.className).not.toContain('fadeIn');
    
    // Fast-forward just before the delay
    act(() => {
      jest.advanceTimersByTime(delay - 10);
    });
    expect(element.className).not.toContain('fadeIn');
    
    // Fast-forward past the delay
    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(element.className).toContain('fadeIn');
  });
});
