/**
 * Integration test for Profile Data Loading
 * Implements task T016
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../src/App';
import DataLoader from '../../src/services/DataLoader';
import LocalStorageService from '../../src/services/LocalStorageService';

// Sample profile data for testing
const sampleProfileData = {
  profile: {
    name: "Suduli Kumar Balabantaray",
    title: "Embedded Test Engineer",
    location: "Bengaluru, India",
    contact: {
      email: "suduli.office@gmail.com",
      phone: "+91 9500097614",
      linkedIn: "https://www.linkedin.com/in/suduli/",
      github: "https://github.com/suduli"
    },
    about: "Experienced professional with 7+ years in Independent Verification & Validation for Critical Systems in the automotive domain...",
    photo: "/assets/images/profile.jpg",
    objective: "To work in a professional atmosphere that would give a scope to display my skills request for a challenging position. Where I can use my skills to grow me and my organization."
  },
  experience: [
    {
      id: "exp-1",
      company: "KPIT Technologies Ltd",
      position: "Test Lead",
      startDate: "2023-11-01",
      endDate: "present",
      location: "Bengaluru, India",
      description: "Leading validation and testing efforts for automotive systems",
      highlights: [
        "Developed and managed validation plans using IBM ALM with traceability to requirements from DOORS® Next Generation (DNG)",
        "Conducted Sanity, Manual, Functional Testing Performance Testing and Automated testing using dSPACE and ECU-Test Tool"
      ],
      technologies: ["IBM ALM", "DOORS Next Generation", "dSPACE", "ECU-Test Tool"],
      keywords: ["validation", "testing", "automotive", "infotainment"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "BCM-Systems Validation",
      description: "Automotive software validation for Stellantis OEM...",
      role: "Lead Tester",
      achievements: [
        "Spearheaded manual/automated testing of ECU software using dSPACE environments"
      ],
      technologies: ["IBM RQM", "DOORS DNG", "ECU-Test", "dSPACE"],
      image: "/assets/images/projects/bcm-validation.jpg",
      links: []
    }
  ],
  skills: {
    categories: [
      {
        name: "Programming & Scripting",
        skills: [
          { name: "Embedded C", level: 90, yearsExperience: 7 },
          { name: "Python", level: 85, yearsExperience: 5 }
        ]
      }
    ]
  },
  education: [
    {
      degree: "B.E",
      institution: "The Aeronautical Society of lndia",
      location: "India"
    }
  ],
  awards: [
    {
      title: "Best project award in LRR25",
      issuer: "",
      date: "",
      description: ""
    }
  ],
  languages: [
    {
      name: "English",
      proficiency: "Fluent"
    }
  ]
};

describe('Profile Data Loading Integration Tests', () => {
  // Set up mocks
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock DataLoader methods
    DataLoader.loadAll = jest.fn().mockResolvedValue(sampleProfileData);
    DataLoader.loadProfile = jest.fn().mockResolvedValue(sampleProfileData.profile);
    DataLoader.loadExperience = jest.fn().mockResolvedValue(sampleProfileData.experience);
    DataLoader.loadProjects = jest.fn().mockResolvedValue(sampleProfileData.projects);
    DataLoader.loadSkills = jest.fn().mockResolvedValue(sampleProfileData.skills);
    DataLoader.loadEducation = jest.fn().mockResolvedValue(sampleProfileData.education);
    DataLoader.loadAwards = jest.fn().mockResolvedValue(sampleProfileData.awards);
    DataLoader.loadLanguages = jest.fn().mockResolvedValue(sampleProfileData.languages);
    DataLoader.isCacheValid = jest.fn().mockReturnValue(false);
    DataLoader.clearCache = jest.fn();
    
    // Create HTML container for the app
    document.body.innerHTML = '<div id="root"></div>';
  });
  
  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('should load all profile data on initial render', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that DataLoader.loadAll was called
      expect(DataLoader.loadAll).toHaveBeenCalled();
    });
    
    // Verify that profile data is displayed
    expect(screen.getByText('Suduli Kumar Balabantaray')).toBeInTheDocument();
    expect(screen.getByText('Embedded Test Engineer')).toBeInTheDocument();
    expect(screen.getByText('Bengaluru, India')).toBeInTheDocument();
  });

  test('should display profile section with correct data', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that profile section is rendered
      expect(screen.getByText('Suduli Kumar Balabantaray')).toBeInTheDocument();
      expect(screen.getByText('Embedded Test Engineer')).toBeInTheDocument();
      
      // Verify that contact information is displayed
      expect(screen.getByText('suduli.office@gmail.com')).toBeInTheDocument();
      expect(screen.getByText('+91 9500097614')).toBeInTheDocument();
      
      // Verify that profile photo is loaded
      const profilePhoto = document.querySelector('img[src="/assets/images/profile.jpg"]');
      expect(profilePhoto).toBeInTheDocument();
      
      // Verify that the about text is displayed
      expect(screen.getByText(/Experienced professional with 7\+ years/)).toBeInTheDocument();
    });
  });

  test('should display experience section with correct data', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that experience section is rendered
      expect(screen.getByText('KPIT Technologies Ltd')).toBeInTheDocument();
      expect(screen.getByText('Test Lead')).toBeInTheDocument();
      expect(screen.getByText('2023-11-01 - present')).toBeInTheDocument();
      expect(screen.getByText('Bengaluru, India')).toBeInTheDocument();
      
      // Verify that experience description is displayed
      expect(screen.getByText('Leading validation and testing efforts for automotive systems')).toBeInTheDocument();
      
      // Verify that highlights are displayed
      expect(screen.getByText(/Developed and managed validation plans/)).toBeInTheDocument();
      expect(screen.getByText(/Conducted Sanity, Manual, Functional Testing/)).toBeInTheDocument();
      
      // Verify that technologies are displayed
      expect(screen.getByText('IBM ALM')).toBeInTheDocument();
      expect(screen.getByText('DOORS Next Generation')).toBeInTheDocument();
    });
  });

  test('should display projects section with correct data', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that projects section is rendered
      expect(screen.getByText('BCM-Systems Validation')).toBeInTheDocument();
      expect(screen.getByText(/Automotive software validation for Stellantis OEM/)).toBeInTheDocument();
      expect(screen.getByText('Lead Tester')).toBeInTheDocument();
      
      // Verify that achievements are displayed
      expect(screen.getByText(/Spearheaded manual\/automated testing/)).toBeInTheDocument();
      
      // Verify that technologies are displayed
      expect(screen.getByText('IBM RQM')).toBeInTheDocument();
      expect(screen.getByText('DOORS DNG')).toBeInTheDocument();
      
      // Verify that project image is loaded
      const projectImage = document.querySelector('img[src="/assets/images/projects/bcm-validation.jpg"]');
      expect(projectImage).toBeInTheDocument();
    });
  });

  test('should display skills section with correct data', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that skills section is rendered
      expect(screen.getByText('Programming & Scripting')).toBeInTheDocument();
      
      // Verify that skills are displayed
      expect(screen.getByText('Embedded C')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      
      // Verify that skill levels are displayed
      const embeddedCSkill = screen.getByText('Embedded C').closest('.skill-item');
      expect(embeddedCSkill).toHaveTextContent('90%');
      expect(embeddedCSkill).toHaveTextContent('7 years');
      
      const pythonSkill = screen.getByText('Python').closest('.skill-item');
      expect(pythonSkill).toHaveTextContent('85%');
      expect(pythonSkill).toHaveTextContent('5 years');
    });
  });

  test('should display education section with correct data', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that education section is rendered
      expect(screen.getByText('B.E')).toBeInTheDocument();
      expect(screen.getByText('The Aeronautical Society of lndia')).toBeInTheDocument();
      expect(screen.getByText('India')).toBeInTheDocument();
    });
  });

  test('should display awards section with correct data', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that awards section is rendered
      expect(screen.getByText('Best project award in LRR25')).toBeInTheDocument();
    });
  });

  test('should display languages section with correct data', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that languages section is rendered
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Fluent')).toBeInTheDocument();
    });
  });

  test('should use cached data when available and valid', async () => {
    // Setup localStorage with cached data
    LocalStorageService.get = jest.fn().mockImplementation((key) => {
      if (key === 'portfolioData') {
        return {
          data: sampleProfileData,
          timestamp: Date.now() - 5 * 60 * 1000 // 5 minutes ago
        };
      }
      return null;
    });
    
    // Mock cache validation to return true
    DataLoader.isCacheValid = jest.fn().mockReturnValue(true);
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that DataLoader.loadAll was NOT called (because cache was used)
      expect(DataLoader.loadAll).not.toHaveBeenCalled();
      
      // Verify that profile data is still displayed (from cache)
      expect(screen.getByText('Suduli Kumar Balabantaray')).toBeInTheDocument();
    });
  });

  test('should reload data when cache is invalid', async () => {
    // Setup localStorage with cached but invalid data
    LocalStorageService.get = jest.fn().mockImplementation((key) => {
      if (key === 'portfolioData') {
        return {
          data: sampleProfileData,
          timestamp: Date.now() - 25 * 60 * 60 * 1000 // 25 hours ago (expired)
        };
      }
      return null;
    });
    
    // Mock cache validation to return false
    DataLoader.isCacheValid = jest.fn().mockReturnValue(false);
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that DataLoader.loadAll was called (because cache was invalid)
      expect(DataLoader.loadAll).toHaveBeenCalled();
      
      // Verify that profile data is displayed (from fresh load)
      expect(screen.getByText('Suduli Kumar Balabantaray')).toBeInTheDocument();
    });
  });

  test('should handle API errors gracefully', async () => {
    // Mock DataLoader.loadAll to throw an error
    DataLoader.loadAll = jest.fn().mockRejectedValue(new Error('Failed to load data'));
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for error handling to complete
    await waitFor(() => {
      // Verify that an error message is displayed
      expect(screen.getByText(/Error loading profile data/i)).toBeInTheDocument();
    });
  });

  test('should show loading state while data is being fetched', async () => {
    // Mock DataLoader.loadAll to delay
    const originalLoadAll = DataLoader.loadAll;
    DataLoader.loadAll = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(sampleProfileData);
        }, 100);
      });
    });
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Check for loading indicator immediately
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that loading indicator is gone
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
      
      // Verify that profile data is displayed
      expect(screen.getByText('Suduli Kumar Balabantaray')).toBeInTheDocument();
    });
    
    // Restore original loadAll function
    DataLoader.loadAll = originalLoadAll;
  });

  test('should update localStorage after loading fresh data', async () => {
    // Spy on LocalStorageService.set
    const setMock = jest.fn();
    LocalStorageService.set = setMock;
    
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for data loading to complete
    await waitFor(() => {
      // Verify that LocalStorageService.set was called with portfolio data
      expect(setMock).toHaveBeenCalledWith('portfolioData', expect.objectContaining({
        data: sampleProfileData,
        timestamp: expect.any(Number)
      }));
    });
  });

  test('should update components when data changes', async () => {
    // Render the App component
    render(<App />, { container: document.getElementById('root') });
    
    // Wait for initial data loading to complete
    await waitFor(() => {
      expect(screen.getByText('Suduli Kumar Balabantaray')).toBeInTheDocument();
    });
    
    // Update the profile data
    const updatedProfileData = {
      ...sampleProfileData,
      profile: {
        ...sampleProfileData.profile,
        name: "Suduli K. Balabantaray",
        title: "Senior Embedded Test Engineer"
      }
    };
    
    // Mock DataLoader.loadAll to return updated data
    DataLoader.loadAll = jest.fn().mockResolvedValue(updatedProfileData);
    
    // Simulate a data refresh (e.g., by calling a refresh method)
    // This would typically be triggered by a refresh button or similar UI element
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);
    
    // Wait for data refresh to complete
    await waitFor(() => {
      // Verify that DataLoader.loadAll was called again
      expect(DataLoader.loadAll).toHaveBeenCalled();
      
      // Verify that the updated profile data is displayed
      expect(screen.getByText('Suduli K. Balabantaray')).toBeInTheDocument();
      expect(screen.getByText('Senior Embedded Test Engineer')).toBeInTheDocument();
    });
  });
});
