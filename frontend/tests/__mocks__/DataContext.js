/**
 * Mock for DataContext
 */

import React from 'react';

// Create mock data for testing
const mockData = {
  profile: {
    name: 'John Doe',
    title: 'Frontend Developer',
    bio: 'Test bio'
  },
  skills: [
    { name: 'JavaScript', level: 90, category: 'Frontend' },
    { name: 'React', level: 85, category: 'Frontend' },
    { name: 'Node.js', level: 80, category: 'Backend' }
  ],
  experience: [
    {
      title: 'Senior Developer',
      company: 'Tech Co',
      period: '2020 - Present',
      description: 'Lead development team'
    }
  ],
  education: [
    {
      degree: 'Computer Science',
      institution: 'University',
      year: '2015 - 2019'
    }
  ],
  projects: [
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio',
      technologies: ['React', 'CSS'],
      category: 'Frontend',
      github: 'https://github.com/test',
      demo: 'https://test.com'
    },
    {
      title: 'API Service',
      description: 'RESTful API',
      technologies: ['Node.js', 'Express'],
      category: 'Backend',
      github: 'https://github.com/test',
      demo: 'https://test.com'
    }
  ],
  contact: {
    email: 'test@example.com',
    phone: '123-456-7890',
    location: 'City, Country'
  }
};

// Create mock context value
export const mockContextValue = {
  ...mockData,
  loading: false,
  error: null,
  refresh: jest.fn(),
  isLoaded: true
};

// Create mock context
export const DataContext = React.createContext(mockContextValue);

// Mock provider component
export const DataProvider = ({ children }) => {
  return (
    <DataContext.Provider value={mockContextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Mock useData hook
export const useData = () => {
  return mockContextValue;
};

export default { DataContext, DataProvider, useData, mockContextValue };
