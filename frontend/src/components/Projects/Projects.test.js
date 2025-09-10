import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Projects from './Projects';
import { renderWithProviders } from '../../../tests/test-utils';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback) => {
  return {
    observe: jest.fn().mockImplementation(() => {
      callback([{ isIntersecting: true }]);
    }),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  };
});

window.IntersectionObserver = mockIntersectionObserver;

// Mock data for testing
const mockProjectsData = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A responsive portfolio website',
    technologies: ['React', 'CSS'],
    categories: ['web', 'frontend'],
    demoUrl: 'https://example.com/portfolio',
    codeUrl: 'https://github.com/user/portfolio',
    highlights: ['Feature 1', 'Feature 2'],
    date: 'January 2023',
  },
  {
    id: 2,
    title: 'Mobile App',
    description: 'A cross-platform mobile application',
    technologies: ['React Native', 'Firebase'],
    categories: ['mobile'],
    demoUrl: 'https://example.com/app',
    codeUrl: 'https://github.com/user/app',
    highlights: ['Feature 1', 'Feature 2'],
    date: 'February 2023',
  },
  {
    id: 3,
    title: 'API Service',
    description: 'RESTful API service',
    technologies: ['Node.js', 'Express', 'MongoDB'],
    categories: ['backend', 'api'],
    codeUrl: 'https://github.com/user/api',
    highlights: ['Feature 1', 'Feature 2'],
    date: 'March 2023',
  },
];

describe('Projects Component', () => {
  // use shared renderWithProviders which includes ThemeProvider and DataProvider
  const renderWithTheme = (ui) => renderWithProviders(ui);

  test('renders the Projects component with title', () => {
    renderWithTheme(<Projects projectsData={mockProjectsData} />);
    
    const titleElement = screen.getByText('Featured Projects');
    expect(titleElement).toBeInTheDocument();
  });

  test('displays all projects initially', () => {
    renderWithTheme(<Projects projectsData={mockProjectsData} />);
    
    // All projects should be displayed when filter "all" is active
    expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('project-card-3')).toBeInTheDocument();
    
    expect(screen.getByText('Portfolio Website')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
    expect(screen.getByText('API Service')).toBeInTheDocument();
  });

  test('filters projects by category when clicking filter buttons', () => {
    renderWithTheme(<Projects projectsData={mockProjectsData} />);
    
    // Click on the "frontend" category button
    const frontendButton = screen.getByTestId('filter-frontend');
    fireEvent.click(frontendButton);
    
    // Should only show frontend projects
    expect(screen.getByTestId('project-card-1')).toBeInTheDocument();
    
    // Mobile and backend projects should not be visible
    expect(screen.queryByTestId('project-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-card-3')).not.toBeInTheDocument();
    
    // Click on the "mobile" category button
    const mobileButton = screen.getByTestId('filter-mobile');
    fireEvent.click(mobileButton);
    
    // Should only show mobile projects
    expect(screen.getByTestId('project-card-2')).toBeInTheDocument();
    
    // Frontend and backend projects should not be visible
    expect(screen.queryByTestId('project-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-card-3')).not.toBeInTheDocument();
  });

  test('renders appropriate number of filter buttons', () => {
    renderWithTheme(<Projects projectsData={mockProjectsData} />);
    
    // Should have 5 filter buttons: all, web, frontend, mobile, backend, api
    const allButton = screen.getByTestId('filter-all');
    const webButton = screen.getByTestId('filter-web');
    const frontendButton = screen.getByTestId('filter-frontend');
    const mobileButton = screen.getByTestId('filter-mobile');
    const backendButton = screen.getByTestId('filter-backend');
    const apiButton = screen.getByTestId('filter-api');
    
    expect(allButton).toBeInTheDocument();
    expect(webButton).toBeInTheDocument();
    expect(frontendButton).toBeInTheDocument();
    expect(mobileButton).toBeInTheDocument();
    expect(backendButton).toBeInTheDocument();
    expect(apiButton).toBeInTheDocument();
  });
});
