import React from 'react';
import { screen } from '@testing-library/react';
import About from './About';
import { renderWithProviders } from '../../../tests/test-utils';

// Mock TextAnimation component to simplify tests
jest.mock('../common/TextAnimation', () => {
  return function MockTextAnimation({ element: Element, text, children, className, 'data-testid': testId }) {
    return (
      <Element className={className} data-testid={testId || 'text-animation'}>
        {text || children}
      </Element>
    );
  };
});

describe('About Component', () => {
  const mockData = {
    name: 'John Doe',
    title: 'Software Engineer',
    summary: 'Experienced software engineer with a passion for creating clean, efficient code.',
    description: 'I have over 5 years of experience in web development.\nSpecializing in React and Node.js.',
    highlights: [
      'Led development of a major enterprise application',
      'Contributed to multiple open source projects',
      'Mentor for junior developers'
    ]
  };

  const renderWithTheme = (ui) => renderWithProviders(ui);

  test('renders without data', () => {
    renderWithTheme(<About />);
    
    const aboutSection = screen.getByTestId('about-section');
    expect(aboutSection).toBeInTheDocument();
    
    const sectionTitle = screen.getByText('About Me');
    expect(sectionTitle).toBeInTheDocument();
  });

  test('renders with complete data', () => {
    renderWithTheme(<About data={mockData} />);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText(mockData.name)).toBeInTheDocument();
    expect(screen.getByText(mockData.title)).toBeInTheDocument();
    expect(screen.getByText(mockData.summary)).toBeInTheDocument();
    
    // Check if description paragraphs are rendered
    const paragraphs = mockData.description.split('\n');
    paragraphs.forEach(paragraph => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
    
    // Check if highlights are rendered
    expect(screen.getByText('Highlights')).toBeInTheDocument();
    mockData.highlights.forEach(highlight => {
      expect(screen.getByText(highlight)).toBeInTheDocument();
    });
  });

  test('renders with partial data', () => {
    const partialData = {
      name: 'Jane Smith',
      title: 'UX Designer'
    };
    
    renderWithTheme(<About data={partialData} />);
    
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText(partialData.name)).toBeInTheDocument();
    expect(screen.getByText(partialData.title)).toBeInTheDocument();
    
    // These elements should not be in the document
    expect(screen.queryByText('Highlights')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    const customClass = 'custom-class';
    renderWithTheme(<About data={mockData} className={customClass} />);
    
    const aboutSection = screen.getByTestId('about-section');
    expect(aboutSection).toHaveClass(customClass);
  });

  test('applies theme correctly', () => {
    renderWithTheme(<About data={mockData} />);
    
    const aboutSection = screen.getByTestId('about-section');
    expect(aboutSection).toHaveAttribute('data-theme');
  });
});
