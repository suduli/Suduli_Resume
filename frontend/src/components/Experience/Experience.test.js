import React from 'react';
import { render, screen } from '@testing-library/react';
import Experience from './Experience';

// Mock the dependencies
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../common/TextAnimation', () => {
  return function MockTextAnimation({ text, element: Element = 'div', className, children }) {
    return <Element className={className} data-testid="mock-text-animation">{text || children}</Element>;
  };
});

// IntersectionObserver is mocked in setupTests.js

describe('Experience Component', () => {
  // Save the original IntersectionObserver
  const originalIntersectionObserver = window.IntersectionObserver;
  
  // Create a custom mock for these tests
  let mockIntersectionObserver;

  beforeEach(() => {
    // Setup a fresh mock for each test
    mockIntersectionObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    };
    
    // Override the global IntersectionObserver with our simplified mock
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      return mockIntersectionObserver;
    });
  });

  afterEach(() => {
    // Restore the original after each test
    window.IntersectionObserver = originalIntersectionObserver;
  });
  
  const mockExperiences = [
    {
      title: 'Test Job Title 1',
      company: 'Test Company 1',
      location: 'Test Location 1',
      startDate: 'Jan 2022',
      endDate: '',
      description: 'Test description 1',
      responsibilities: ['Responsibility 1', 'Responsibility 2'],
      technologies: ['Tech 1', 'Tech 2']
    },
    {
      title: 'Test Job Title 2',
      company: 'Test Company 2',
      location: 'Test Location 2',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      description: 'Test description 2',
      responsibilities: ['Responsibility 3', 'Responsibility 4'],
      technologies: ['Tech 3', 'Tech 4']
    }
  ];

  test('renders experience section with title', () => {
    render(<Experience experiences={mockExperiences} />);
    
    const titleElement = screen.getByTestId('mock-text-animation');
    expect(titleElement).toHaveTextContent('Experience');
    
    const sectionElement = screen.getByTestId('experience-section');
    expect(sectionElement).toBeInTheDocument();
  });

  test('renders timeline items for each experience', () => {
    render(<Experience experiences={mockExperiences} />);
    
    const timelineItems = screen.getAllByTestId(/timeline-item-\d+/);
    expect(timelineItems).toHaveLength(2);
    
    expect(screen.getByText('Test Job Title 1')).toBeInTheDocument();
    expect(screen.getByText('Test Company 1')).toBeInTheDocument();
    expect(screen.getByText('Test Location 1')).toBeInTheDocument();
    expect(screen.getByText('Jan 2022 - Present')).toBeInTheDocument();
    
    expect(screen.getByText('Test Job Title 2')).toBeInTheDocument();
    expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    expect(screen.getByText('Mar 2019 - Dec 2021')).toBeInTheDocument();
  });

  test('renders responsibilities as list items', () => {
    render(<Experience experiences={mockExperiences} />);
    
    expect(screen.getByText('Responsibility 1')).toBeInTheDocument();
    expect(screen.getByText('Responsibility 2')).toBeInTheDocument();
    expect(screen.getByText('Responsibility 3')).toBeInTheDocument();
    expect(screen.getByText('Responsibility 4')).toBeInTheDocument();
  });

  test('renders technologies as tags', () => {
    render(<Experience experiences={mockExperiences} />);
    
    expect(screen.getByText('Tech 1')).toBeInTheDocument();
    expect(screen.getByText('Tech 2')).toBeInTheDocument();
    expect(screen.getByText('Tech 3')).toBeInTheDocument();
    expect(screen.getByText('Tech 4')).toBeInTheDocument();
  });

  test('renders message when no experience data is provided', () => {
    render(<Experience experiences={[]} />);
    
    expect(screen.getByText('No experience data available.')).toBeInTheDocument();
  });

  test('applies theme-specific class', () => {
    render(<Experience experiences={mockExperiences} />);
    
    const sectionElement = screen.getByTestId('experience-section');
    expect(sectionElement).toHaveClass('experience-light');
  });

  test('applies additional className when provided', () => {
    render(<Experience experiences={mockExperiences} className="custom-class" />);
    
    const sectionElement = screen.getByTestId('experience-section');
    expect(sectionElement).toHaveClass('custom-class');
  });
});
