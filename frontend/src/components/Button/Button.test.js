import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Import and extend jest-dom matchers directly in this file
import '@testing-library/jest-dom';
import Button from './Button';

// Mock the ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('Button Component', () => {
  test('renders button with label', () => {
    render(<Button label="Click me" />);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button-primary');
    expect(button).toHaveClass('button-medium');
  });

  test('renders anchor when href is provided', () => {
    render(<Button label="Go to page" href="/page" />);
    
    const anchor = screen.getByRole('link', { name: 'Go to page' });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '/page');
  });

  test('applies variant and size classes', () => {
    render(<Button label="Styled Button" variant="secondary" size="large" />);
    
    const button = screen.getByRole('button', { name: 'Styled Button' });
    expect(button).toHaveClass('button-secondary');
    expect(button).toHaveClass('button-large');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies disabled state', () => {
    render(<Button label="Disabled Button" disabled />);
    
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
  });

  test('applies disabled state to anchor', () => {
    render(<Button label="Disabled Link" href="/page" disabled />);
    
    const anchor = screen.getByTestId('disabled-link');
    expect(anchor).toHaveAttribute('aria-disabled', 'true');
    expect(anchor).not.toHaveAttribute('href');
  });

  test('applies full width style', () => {
    render(<Button label="Full Width" fullWidth />);
    
    const button = screen.getByRole('button', { name: 'Full Width' });
    expect(button).toHaveClass('fullWidth');
  });

  test('renders with left icon', () => {
    render(
      <Button 
        label="Icon Button" 
        icon={<span data-testid="test-icon">Icon</span>} 
        iconPosition="left" 
      />
    );
    
    const button = screen.getByTestId('button-element');
    const icon = screen.getByTestId('test-icon');
    
    expect(icon).toBeInTheDocument();
    expect(button).toContainElement(icon);
    // Verify icon container is present
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('renders with right icon', () => {
    render(
      <Button 
        label="Icon Button" 
        icon={<span data-testid="test-icon">Icon</span>} 
        iconPosition="right" 
      />
    );
    
    const button = screen.getByTestId('button-element');
    const icon = screen.getByTestId('test-icon');
    
    expect(icon).toBeInTheDocument();
    expect(button).toContainElement(icon);
    // Verify icon container is present
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('applies additional className', () => {
    render(<Button label="Custom Class" className="custom-class" />);
    
    const button = screen.getByRole('button', { name: 'Custom Class' });
    expect(button).toHaveClass('custom-class');
  });

  test('adds target and rel attributes for external links', () => {
    render(<Button label="External Link" href="https://example.com" />);
    
    const anchor = screen.getByRole('link', { name: 'External Link' });
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
