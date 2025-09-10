import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from './ThemeSwitcher';

// Create a mock for the ThemeContext
const mockToggleTheme = jest.fn();
let mockTheme = 'light';

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme
  })
}));

describe('ThemeSwitcher Component', () => {
  beforeEach(() => {
    mockTheme = 'light';
    mockToggleTheme.mockClear();
  });

  test('renders with default props', () => {
    render(<ThemeSwitcher />);
    
    const switcherButton = screen.getByTestId('theme-switcher');
    expect(switcherButton).toBeInTheDocument();
    
    const label = screen.getByText('Light Mode');
    expect(label).toBeInTheDocument();
  });

  test('calls toggleTheme when clicked', () => {
    render(<ThemeSwitcher />);
    
    const switcherButton = screen.getByTestId('theme-switcher');
    fireEvent.click(switcherButton);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test('renders different label text based on theme', () => {
    mockTheme = 'dark';
    render(<ThemeSwitcher />);
    
    const label = screen.getByText('Dark Mode');
    expect(label).toBeInTheDocument();
  });

  test('applies size class based on size prop', () => {
    render(<ThemeSwitcher size="large" />);
    
    const switcherButton = screen.getByTestId('theme-switcher');
    expect(switcherButton).toHaveClass('switcher-large');
  });

  test('hides label when showLabel is false', () => {
    render(<ThemeSwitcher showLabel={false} />);
    
    expect(screen.queryByText('Light Mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Dark Mode')).not.toBeInTheDocument();
  });

  test('positions label on the left when labelPosition is left', () => {
    render(<ThemeSwitcher labelPosition="left" />);
    
    const container = screen.getByTestId('theme-switcher-container');
    expect(container).toHaveClass('label-left');
  });

  test('applies additional className when provided', () => {
    render(<ThemeSwitcher className="custom-class" />);
    
    const switcherButton = screen.getByTestId('theme-switcher');
    expect(switcherButton).toHaveClass('custom-class');
  });

  test('has correct aria-label based on current theme', () => {
    // Test light theme
    mockTheme = 'light';
    const { rerender } = render(<ThemeSwitcher />);

    let switcherButton = screen.getByTestId('theme-switcher');
    expect(switcherButton).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Rerender with dark theme
    mockTheme = 'dark';
    rerender(<ThemeSwitcher />);

    switcherButton = screen.getByTestId('theme-switcher');
    expect(switcherButton).toHaveAttribute('aria-label', 'Switch to light mode');
  });
});
