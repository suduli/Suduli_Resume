import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

// Mock the ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

describe('Footer Component', () => {
  const mockSocialLinks = [
    { name: 'GitHub', url: 'https://github.com/username', icon: 'GitHub' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: 'LinkedIn' }
  ];

  test('renders copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer copyright="© {year} Test Name" />);
    
    const copyrightElement = screen.getByText(`© ${currentYear} Test Name`);
    expect(copyrightElement).toBeInTheDocument();
  });

  test('renders social links when provided', () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    
    const githubLink = screen.getByText('GitHub');
    const linkedinLink = screen.getByText('LinkedIn');
    
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    
    expect(links[0]).toHaveAttribute('href', 'https://github.com/username');
    expect(links[1]).toHaveAttribute('href', 'https://linkedin.com/in/username');
  });

  test('does not render social links section when no links are provided', () => {
    render(<Footer />);
    
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  test('renders with default props when no props provided', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    
    const copyrightElement = screen.getByText(`© ${currentYear} Portfolio. All rights reserved.`);
    expect(copyrightElement).toBeInTheDocument();
  });
});
