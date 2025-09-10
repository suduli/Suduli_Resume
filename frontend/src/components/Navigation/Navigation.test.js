import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';

// Mock the dependencies
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../ThemeSwitcher/ThemeSwitcher', () => {
  return function MockThemeSwitcher({ size, showLabel }) {
    return (
      <div data-testid="mock-theme-switcher" data-size={size} data-show-label={showLabel}>
        Theme Switcher
      </div>
    );
  };
});

// Mock window functions
const originalScrollTo = window.scrollTo;
beforeAll(() => {
  window.scrollTo = jest.fn();
  // Mock element.offsetTop and element.offsetHeight
  Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
    configurable: true,
    value: 100
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 200
  });
});

afterAll(() => {
  window.scrollTo = originalScrollTo;
});

describe('Navigation Component', () => {
  const mockNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'projects', label: 'Projects' }
  ];
  
  // Create mock elements for section IDs
  /* eslint-disable testing-library/no-node-access */
  beforeEach(() => {
    for (const item of mockNavItems) {
      const mockElement = document.createElement('div');
      mockElement.id = item.id;
      document.body.appendChild(mockElement);
    }
  });
  /* eslint-enable testing-library/no-node-access */
  
  /* eslint-disable testing-library/no-node-access */
  afterEach(() => {
    // Clean up mock elements
    for (const item of mockNavItems) {
      const element = document.getElementById(item.id);
      if (element) document.body.removeChild(element);
    }
  });
  /* eslint-enable testing-library/no-node-access */

  test('renders navigation with correct items', () => {
    render(<Navigation navItems={mockNavItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  test('shows ThemeSwitcher when showThemeSwitcher is true', () => {
    render(<Navigation navItems={mockNavItems} showThemeSwitcher={true} />);
    
    expect(screen.getByTestId('mock-theme-switcher')).toBeInTheDocument();
  });

  test('hides ThemeSwitcher when showThemeSwitcher is false', () => {
    render(<Navigation navItems={mockNavItems} showThemeSwitcher={false} />);
    
    expect(screen.queryByTestId('mock-theme-switcher')).not.toBeInTheDocument();
  });

  test('calls onNavigate callback when navigation item is clicked', () => {
    const mockNavigate = jest.fn();
    render(<Navigation navItems={mockNavItems} onNavigate={mockNavigate} />);
    
    fireEvent.click(screen.getByText('About Me'));
    
    expect(mockNavigate).toHaveBeenCalledWith('about');
  });

  test('scrolls to section when navigation item is clicked and no onNavigate callback provided', () => {
    render(<Navigation navItems={mockNavItems} />);
    
    fireEvent.click(screen.getByText('About Me'));
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 20, // 100 (offsetTop) - 80 (header offset)
      behavior: 'smooth'
    });
  });

  test('toggles mobile menu when mobile menu toggle is clicked', () => {
    render(<Navigation navItems={mockNavItems} />);
    
    const menuToggle = screen.getByTestId('mobile-menu-toggle');
    
    // Initially menu is closed
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(menuToggle);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    
    // Click to close
    fireEvent.click(menuToggle);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('applies active class to current section link', () => {
    render(<Navigation navItems={mockNavItems} />);
    
    // Simulate scroll to trigger active section change
    const scrollEvent = new Event('scroll');
    window.scrollY = 150; // Between offsetTop (100) and offsetTop + offsetHeight (300)
    window.dispatchEvent(scrollEvent);
    
    // Home should be active by default in our test setup
    const homeLink = screen.getByTestId('nav-link-home');
    expect(homeLink).toHaveClass('active');
  });

  test('renders with default nav items when none provided', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
