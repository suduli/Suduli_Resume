/**
 * Header Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { ThemeManager } from '../../services/ThemeManager';

// Mock ThemeManager
jest.mock('../../services/ThemeManager', () => ({
  ThemeManager: {
    getCurrentTheme: jest.fn().mockReturnValue({ name: 'light' }),
    subscribe: jest.fn().mockReturnValue(() => {}),
  }
}));

describe('Header Component', () => {
  const mockProfile = {
    name: 'John Doe',
    title: 'Frontend Developer'
  };
  
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the header with profile information', () => {
    render(<Header profile={mockProfile} onNavigate={mockNavigate} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });
  
  test('renders navigation items', () => {
    render(<Header profile={mockProfile} onNavigate={mockNavigate} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
  
  test('calls onNavigate when a navigation item is clicked', () => {
    render(<Header profile={mockProfile} onNavigate={mockNavigate} />);
    
    fireEvent.click(screen.getByText('About'));
    
    expect(mockNavigate).toHaveBeenCalledWith('about');
  });
  
  test('toggles mobile menu when menu button is clicked', () => {
    render(<Header profile={mockProfile} onNavigate={mockNavigate} />);
    
    const menuButton = screen.getByLabelText('Open menu');
    
    fireEvent.click(menuButton);
    
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    
    // Nav should have the open class
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('header__nav--open');
    
    // Click again to close
    fireEvent.click(screen.getByLabelText('Close menu'));
    
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    expect(nav).not.toHaveClass('header__nav--open');
  });
  
  test('subscribes to theme changes on mount', () => {
    render(<Header profile={mockProfile} onNavigate={mockNavigate} />);
    
    expect(ThemeManager.subscribe).toHaveBeenCalled();
  });
  
  test('renders default values when no profile is provided', () => {
    render(<Header onNavigate={mockNavigate} />);
    
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
  });
});
