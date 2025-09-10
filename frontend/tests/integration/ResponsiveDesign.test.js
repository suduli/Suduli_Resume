/**
 * Integration test for Responsive Design
 * Implements task T017
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { act } from 'react-dom/test-utils';

// Media query mock
const mockMatchMedia = (matches) => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe('Responsive Design Integration Tests', () => {
  // Original window dimensions
  let originalInnerWidth;
  let originalInnerHeight;
  
  beforeEach(() => {
    // Store original window dimensions
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    
    // Create HTML container for the app
    document.body.innerHTML = '<div id="root"></div>';
    
    // Set up a clean DOM for testing
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore original window dimensions
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth
    });
    
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: originalInnerHeight
    });
    
    // Clean up DOM
    document.body.innerHTML = '';
    
    // Clean up mocks
    window.matchMedia.mockClear();
  });

  test('should display mobile navigation menu on small screens', async () => {
    // Mock small screen (mobile)
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 375
    });
    
    mockMatchMedia(true); // Match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Mobile menu button should be visible
    const mobileMenuButton = screen.getByLabelText('Toggle navigation menu');
    expect(mobileMenuButton).toBeInTheDocument();
    expect(mobileMenuButton).toBeVisible();
    
    // Navigation menu should be collapsed initially
    const navigationMenu = screen.getByRole('navigation');
    expect(navigationMenu).toHaveClass('collapsed');
    
    // Click mobile menu button to open navigation
    act(() => {
      fireEvent.click(mobileMenuButton);
    });
    
    // Navigation menu should now be expanded
    expect(navigationMenu).toHaveClass('expanded');
    
    // Click mobile menu button again to close navigation
    act(() => {
      fireEvent.click(mobileMenuButton);
    });
    
    // Navigation menu should be collapsed again
    expect(navigationMenu).toHaveClass('collapsed');
  });

  test('should display desktop navigation menu on large screens', async () => {
    // Mock large screen (desktop)
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200
    });
    
    mockMatchMedia(false); // Don't match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Mobile menu button should not be visible on desktop
    const mobileMenuButton = screen.queryByLabelText('Toggle navigation menu');
    expect(mobileMenuButton).not.toBeVisible();
    
    // Navigation menu should be expanded by default on desktop
    const navigationMenu = screen.getByRole('navigation');
    expect(navigationMenu).toHaveClass('expanded');
    expect(navigationMenu).not.toHaveClass('collapsed');
    
    // Navigation links should be visible
    const navLinks = screen.getAllByRole('link', { within: navigationMenu });
    navLinks.forEach(link => {
      expect(link).toBeVisible();
    });
  });

  test('should adjust layout when screen size changes', async () => {
    // Start with desktop view
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200
    });
    
    mockMatchMedia(false); // Don't match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Check desktop layout
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass('desktop-layout');
    expect(mainContent).not.toHaveClass('mobile-layout');
    
    // Simulate resize to tablet
    act(() => {
      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 768
      });
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Check tablet layout
    expect(mainContent).toHaveClass('tablet-layout');
    expect(mainContent).not.toHaveClass('desktop-layout');
    
    // Simulate resize to mobile
    act(() => {
      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 375
      });
      
      // Update media query result
      mockMatchMedia(true);
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Check mobile layout
    expect(mainContent).toHaveClass('mobile-layout');
    expect(mainContent).not.toHaveClass('tablet-layout');
  });

  test('should adjust font sizes for different screen sizes', async () => {
    // Mock mobile screen
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 375
    });
    
    mockMatchMedia(true); // Match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Check heading font size on mobile
    const heading = screen.getByRole('heading', { level: 1 });
    const headingStyles = window.getComputedStyle(heading);
    const mobileFontSize = parseFloat(headingStyles.fontSize);
    
    // Simulate resize to desktop
    act(() => {
      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 1200
      });
      
      // Update media query result
      mockMatchMedia(false);
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Check heading font size on desktop
    const desktopHeadingStyles = window.getComputedStyle(heading);
    const desktopFontSize = parseFloat(desktopHeadingStyles.fontSize);
    
    // Desktop font size should be larger than mobile
    expect(desktopFontSize).toBeGreaterThan(mobileFontSize);
  });

  test('should reposition elements in projects section on different screen sizes', async () => {
    // Mock desktop screen
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200
    });
    
    mockMatchMedia(false); // Don't match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // On desktop, projects should be in grid layout
    const projectsSection = screen.getByTestId('projects-section');
    const projectsGrid = projectsSection.querySelector('.projects-grid');
    expect(projectsGrid).toHaveClass('grid-layout');
    expect(projectsGrid).not.toHaveClass('list-layout');
    
    // Project cards should be side by side (columns)
    const projectCards = projectsSection.querySelectorAll('.project-card');
    const firstCardRect = projectCards[0].getBoundingClientRect();
    const secondCardRect = projectCards[1].getBoundingClientRect();
    
    // On desktop, cards are positioned horizontally next to each other
    expect(Math.abs(firstCardRect.top - secondCardRect.top)).toBeLessThan(10); // Approximately same top position
    expect(firstCardRect.left).toBeLessThan(secondCardRect.left); // First card is to the left of second
    
    // Simulate resize to mobile
    act(() => {
      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 375
      });
      
      // Update media query result
      mockMatchMedia(true);
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // On mobile, projects should be in list layout
    expect(projectsGrid).toHaveClass('list-layout');
    expect(projectsGrid).not.toHaveClass('grid-layout');
    
    // Project cards should be stacked (rows)
    const mobileFirstCardRect = projectCards[0].getBoundingClientRect();
    const mobileSecondCardRect = projectCards[1].getBoundingClientRect();
    
    // On mobile, cards are positioned vertically one below the other
    expect(mobileFirstCardRect.top).toBeLessThan(mobileSecondCardRect.top); // First card is above second
    expect(Math.abs(mobileFirstCardRect.left - mobileSecondCardRect.left)).toBeLessThan(10); // Approximately same left position
  });

  test('should adjust image sizes for different screen sizes', async () => {
    // Mock desktop screen
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200
    });
    
    mockMatchMedia(false); // Don't match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Get profile image on desktop
    const profileImage = screen.getByAltText('Profile Photo');
    const desktopImageRect = profileImage.getBoundingClientRect();
    const desktopImageWidth = desktopImageRect.width;
    
    // Simulate resize to mobile
    act(() => {
      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 375
      });
      
      // Update media query result
      mockMatchMedia(true);
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Get profile image on mobile
    const mobileImageRect = profileImage.getBoundingClientRect();
    const mobileImageWidth = mobileImageRect.width;
    
    // Mobile image should be smaller than desktop image
    expect(mobileImageWidth).toBeLessThan(desktopImageWidth);
  });

  test('should adjust skill visualization for different screen sizes', async () => {
    // Mock desktop screen
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200
    });
    
    mockMatchMedia(false); // Don't match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // On desktop, advanced skill visualization should be visible
    const skillsSection = screen.getByTestId('skills-section');
    const advancedVisualization = skillsSection.querySelector('.advanced-visualization');
    const simpleVisualization = skillsSection.querySelector('.simple-visualization');
    
    expect(advancedVisualization).toBeVisible();
    expect(simpleVisualization).not.toBeVisible();
    
    // Simulate resize to mobile
    act(() => {
      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 375
      });
      
      // Update media query result
      mockMatchMedia(true);
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // On mobile, simple skill visualization should be visible
    expect(advancedVisualization).not.toBeVisible();
    expect(simpleVisualization).toBeVisible();
  });

  test('should have appropriate touch targets on mobile', async () => {
    // Mock mobile screen
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 375
    });
    
    mockMatchMedia(true); // Match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Navigation links should have appropriate size for touch targets
    const navigationMenu = screen.getByRole('navigation');
    const navLinks = screen.getAllByRole('link', { within: navigationMenu });
    
    navLinks.forEach(link => {
      const linkRect = link.getBoundingClientRect();
      // Touch targets should be at least 44x44 pixels according to WCAG 2.1
      expect(linkRect.height).toBeGreaterThanOrEqual(44);
    });
    
    // Buttons should also have appropriate touch target sizes
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      const buttonRect = button.getBoundingClientRect();
      expect(buttonRect.height).toBeGreaterThanOrEqual(44);
      expect(buttonRect.width).toBeGreaterThanOrEqual(44);
    });
  });

  test('should adjust form layout on contact section for different screen sizes', async () => {
    // Mock desktop screen
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1200
    });
    
    mockMatchMedia(false); // Don't match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // On desktop, form fields should be wider
    const contactForm = screen.getByRole('form');
    const nameInput = screen.getByLabelText('Name');
    const messageInput = screen.getByLabelText('Message');
    
    const desktopNameInputRect = nameInput.getBoundingClientRect();
    const desktopMessageInputRect = messageInput.getBoundingClientRect();
    
    // Simulate resize to mobile
    act(() => {
      // Change window dimensions
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 375
      });
      
      // Update media query result
      mockMatchMedia(true);
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // On mobile, form fields should be narrower
    const mobileNameInputRect = nameInput.getBoundingClientRect();
    const mobileMessageInputRect = messageInput.getBoundingClientRect();
    
    expect(mobileNameInputRect.width).toBeLessThan(desktopNameInputRect.width);
    expect(mobileMessageInputRect.width).toBeLessThan(desktopMessageInputRect.width);
    
    // Form should take full width on mobile
    const contactSection = screen.getByTestId('contact-section');
    const contactSectionRect = contactSection.getBoundingClientRect();
    expect(Math.abs(mobileNameInputRect.width - contactSectionRect.width)).toBeLessThan(40); // Allow for padding
  });

  test('should handle orientation changes', async () => {
    // Mock portrait orientation (mobile)
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 375
    });
    
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 667
    });
    
    mockMatchMedia(true); // Match mobile media query
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Check initial portrait layout
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass('portrait');
    expect(mainContent).not.toHaveClass('landscape');
    
    // Simulate change to landscape orientation
    act(() => {
      // Swap dimensions to simulate rotation
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 667
      });
      
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        writable: true,
        value: 375
      });
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'));
    });
    
    // Check landscape layout
    expect(mainContent).toHaveClass('landscape');
    expect(mainContent).not.toHaveClass('portrait');
  });
});
