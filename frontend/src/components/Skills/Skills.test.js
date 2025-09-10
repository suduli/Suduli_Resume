import React from 'react';
import { screen } from '@testing-library/react';
import Skills from './Skills';
import { renderWithProviders } from '../../../tests/test-utils';

// Mock data for testing
const mockSkillsData = {
  title: 'Technical Skills',
  description: 'My technical expertise',
  categories: [
    {
      name: 'frontend',
      skills: [
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 85 }
      ]
    },
    {
      name: 'backend',
      skills: [
        { name: 'Node.js', level: 75 }
      ]
    },
    {
      name: 'database',
      skills: [
        { name: 'MongoDB', level: 70 }
      ]
    }
  ]
};

// Alternative data format for home page
const mockSimpleSkillsData = {
  title: 'Technical Skills',
  description: 'My technical expertise',
  skills: [
    { name: 'JavaScript', icon: 'js', level: 90 },
    { name: 'React', icon: 'react', level: 85 },
    { name: 'Node.js', icon: 'node', level: 75 },
    { name: 'MongoDB', icon: 'database', level: 70 }
  ]
};

describe('Skills Component', () => {
  const renderWithTheme = (ui) => renderWithProviders(ui);

  test('renders the Skills component with title', () => {
    renderWithTheme(<Skills data={mockSkillsData} />);
    
    const titleElement = screen.getByText('Technical Skills');
    expect(titleElement).toBeInTheDocument();
  });

  test('renders skill categories when provided', () => {
    renderWithTheme(<Skills data={mockSkillsData} />);
    
    // Check for category headings
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();
    expect(screen.getByText('database')).toBeInTheDocument();
    
    // Check for skills
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    
    // Check for skill levels
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  test('renders simple skills list when no categories provided', () => {
    renderWithTheme(<Skills data={mockSimpleSkillsData} />);
    
    // Check for skills in grid format
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    
    // Instead of direct DOM access, we just verify each skill is present
    mockSimpleSkillsData.skills.forEach(skill => {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    });
  });

  test('uses default title and description when not provided', () => {
    const minimalData = {
      categories: mockSkillsData.categories
    };
    
    renderWithTheme(<Skills data={minimalData} />);
    
    // Should use default title and description
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('My technical expertise and competencies')).toBeInTheDocument();
  });
});
