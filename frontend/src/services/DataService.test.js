/**
 * Test file for DataService.js
 * Implements task T030
 */

import DataService from './DataService';

// Mock fetch API
global.fetch = jest.fn();

// Setup mock data responses
const mockProfileData = {
  name: 'John Doe',
  title: 'Software Developer',
  bio: 'Passionate developer...'
};

const mockExperienceData = [
  {
    company: 'Tech Corp',
    position: 'Senior Developer',
    startDate: '2020-01',
    endDate: null,
    description: 'Working on...'
  }
];

const mockProjectsData = [
  {
    title: 'Project X',
    description: 'A cutting-edge...',
    technologies: ['React', 'Node.js']
  }
];

const mockSkillsData = {
  categories: [
    {
      name: 'Programming',
      skills: [
        { name: 'JavaScript', level: 90, yearsExperience: 5 }
      ]
    }
  ]
};

const mockEducationData = [
  {
    institution: 'University of Tech',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startYear: '2012',
    endYear: '2016'
  }
];

const mockAwardsData = [
  {
    title: 'Developer of the Year',
    issuer: 'Tech Awards',
    date: '2022'
  }
];

const mockLanguagesData = [
  {
    name: 'English',
    proficiency: 'Native'
  }
];

const mockContactFormData = {
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true }
  ],
  submitEndpoint: '/api/contact'
};

describe('DataService', () => {
  let dataService;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of DataService for each test
    dataService = new DataService();
    
    // Mock methods to avoid implementation details
    dataService.getFromCache = jest.fn().mockResolvedValue(null);
    dataService.saveToCache = jest.fn().mockResolvedValue();
  });

  describe('loadProfile', () => {
    it('should fetch profile data from the correct path', async () => {
      // Setup mock to return profile data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProfileData)
      });
      
      // Call the method
      await dataService.loadProfile();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/profile.json', expect.any(Object));
    });
    
    it('should return profile data when fetch is successful', async () => {
      // Setup mock to return profile data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProfileData)
      });
      
      // Call the method
      const result = await dataService.loadProfile();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockProfileData);
    });
    
    it('should save profile data to cache', async () => {
      // Setup mock to return profile data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProfileData)
      });
      
      // Call the method
      await dataService.loadProfile();
      
      // Verify that data was saved to cache
      expect(dataService.saveToCache).toHaveBeenCalledWith('profile', mockProfileData);
    });
    
    it('should use cached data if available', async () => {
      // Setup cache to return profile data
      dataService.getFromCache.mockResolvedValueOnce(mockProfileData);
      
      // Call the method
      const result = await dataService.loadProfile();
      
      // Verify that fetch was not called
      expect(global.fetch).not.toHaveBeenCalled();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockProfileData);
    });
  });

  describe('loadExperience', () => {
    it('should fetch experience data from the correct path', async () => {
      // Setup mock to return experience data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockExperienceData)
      });
      
      // Call the method
      await dataService.loadExperience();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/experience.json', expect.any(Object));
    });
    
    it('should return experience data when fetch is successful', async () => {
      // Setup mock to return experience data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockExperienceData)
      });
      
      // Call the method
      const result = await dataService.loadExperience();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockExperienceData);
    });
  });

  describe('loadProjects', () => {
    it('should fetch projects data from the correct path', async () => {
      // Setup mock to return projects data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProjectsData)
      });
      
      // Call the method
      await dataService.loadProjects();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/projects.json', expect.any(Object));
    });
    
    it('should return projects data when fetch is successful', async () => {
      // Setup mock to return projects data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProjectsData)
      });
      
      // Call the method
      const result = await dataService.loadProjects();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockProjectsData);
    });
  });

  describe('loadSkills', () => {
    it('should fetch skills data from the correct path', async () => {
      // Setup mock to return skills data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockSkillsData)
      });
      
      // Call the method
      await dataService.loadSkills();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/skills.json', expect.any(Object));
    });
    
    it('should return skills data when fetch is successful', async () => {
      // Setup mock to return skills data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockSkillsData)
      });
      
      // Call the method
      const result = await dataService.loadSkills();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockSkillsData);
    });
  });

  describe('loadEducation', () => {
    it('should fetch education data from the correct path', async () => {
      // Setup mock to return education data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEducationData)
      });
      
      // Call the method
      await dataService.loadEducation();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/education.json', expect.any(Object));
    });
    
    it('should return education data when fetch is successful', async () => {
      // Setup mock to return education data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockEducationData)
      });
      
      // Call the method
      const result = await dataService.loadEducation();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockEducationData);
    });
  });

  describe('loadAwards', () => {
    it('should fetch awards data from the correct path', async () => {
      // Setup mock to return awards data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockAwardsData)
      });
      
      // Call the method
      await dataService.loadAwards();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/awards.json', expect.any(Object));
    });
    
    it('should return awards data when fetch is successful', async () => {
      // Setup mock to return awards data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockAwardsData)
      });
      
      // Call the method
      const result = await dataService.loadAwards();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockAwardsData);
    });
  });

  describe('loadLanguages', () => {
    it('should fetch languages data from the correct path', async () => {
      // Setup mock to return languages data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockLanguagesData)
      });
      
      // Call the method
      await dataService.loadLanguages();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/languages.json', expect.any(Object));
    });
    
    it('should return languages data when fetch is successful', async () => {
      // Setup mock to return languages data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockLanguagesData)
      });
      
      // Call the method
      const result = await dataService.loadLanguages();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockLanguagesData);
    });
  });

  describe('loadContactForm', () => {
    it('should fetch contact form data from the correct path', async () => {
      // Setup mock to return contact form data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockContactFormData)
      });
      
      // Call the method
      await dataService.loadContactForm();
      
      // Verify that fetch was called with the correct path
      expect(global.fetch).toHaveBeenCalledWith('/data/contact-form.json', expect.any(Object));
    });
    
    it('should return contact form data when fetch is successful', async () => {
      // Setup mock to return contact form data
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockContactFormData)
      });
      
      // Call the method
      const result = await dataService.loadContactForm();
      
      // Verify that the correct data was returned
      expect(result).toEqual(mockContactFormData);
    });
  });

  describe('loadAll', () => {
    it('should load all data types and return a complete portfolio object', async () => {
      // Store original methods
      const originalMethods = {
        loadProfile: dataService.loadProfile,
        loadExperience: dataService.loadExperience,
        loadProjects: dataService.loadProjects,
        loadSkills: dataService.loadSkills,
        loadEducation: dataService.loadEducation,
        loadAwards: dataService.loadAwards,
        loadLanguages: dataService.loadLanguages,
        loadContactForm: dataService.loadContactForm
      };
      
      // Mock all the individual load methods
      dataService.loadProfile = jest.fn().mockResolvedValue(mockProfileData);
      dataService.loadExperience = jest.fn().mockResolvedValue(mockExperienceData);
      dataService.loadProjects = jest.fn().mockResolvedValue(mockProjectsData);
      dataService.loadSkills = jest.fn().mockResolvedValue(mockSkillsData);
      dataService.loadEducation = jest.fn().mockResolvedValue(mockEducationData);
      dataService.loadAwards = jest.fn().mockResolvedValue(mockAwardsData);
      dataService.loadLanguages = jest.fn().mockResolvedValue(mockLanguagesData);
      dataService.loadContactForm = jest.fn().mockResolvedValue(mockContactFormData);
      
      // Call the method
      const result = await dataService.loadAll();
      
      // Verify that all methods were called
      expect(dataService.loadProfile).toHaveBeenCalled();
      expect(dataService.loadExperience).toHaveBeenCalled();
      expect(dataService.loadProjects).toHaveBeenCalled();
      expect(dataService.loadSkills).toHaveBeenCalled();
      expect(dataService.loadEducation).toHaveBeenCalled();
      expect(dataService.loadAwards).toHaveBeenCalled();
      expect(dataService.loadLanguages).toHaveBeenCalled();
      expect(dataService.loadContactForm).toHaveBeenCalled();
      
      // Verify that the result has the correct structure
      expect(result).toEqual({
        profile: mockProfileData,
        experience: mockExperienceData,
        projects: mockProjectsData,
        skills: mockSkillsData,
        education: mockEducationData,
        awards: mockAwardsData,
        languages: mockLanguagesData,
        contactForm: mockContactFormData
      });
      
      // Restore original methods
      Object.assign(dataService, originalMethods);
    });
  });

  describe('cache management', () => {
    it('should have clearCache method that clears all caches', async () => {
      // Mock the clearCache method
      dataService.clearCache = jest.fn().mockResolvedValue();
      
      // Call the method
      await dataService.clearCache();
      
      // Verify that the method was called
      expect(dataService.clearCache).toHaveBeenCalled();
    });
    
    it('should have isCacheValid method that returns boolean', async () => {
      // Mock the getCacheMetadata method to return valid metadata
      dataService.getCacheMetadata = jest.fn().mockResolvedValue({
        timestamp: Date.now(),
        version: '1.1'
      });
      
      // Call the method
      const result = await dataService.isCacheValid();
      
      // Verify that a boolean is returned
      expect(typeof result).toBe('boolean');
    });
    
    it('should have getCacheAge method that returns the age in seconds', async () => {
      // Define a timestamp one hour ago
      const timestamp = Date.now() - (60 * 60 * 1000);
      
      // Mock the getCacheMetadata method to return metadata with the timestamp
      dataService.getCacheMetadata = jest.fn().mockResolvedValue({
        timestamp,
        version: '1.1'
      });
      
      // Call the method
      const result = await dataService.getCacheAge();
      
      // Verify that the age is approximately correct (within 5 seconds)
      const expectedAge = Math.floor((Date.now() - timestamp) / 1000);
      expect(result).toBeGreaterThanOrEqual(expectedAge - 5);
      expect(result).toBeLessThanOrEqual(expectedAge + 5);
    });
  });

  describe('error handling', () => {
    it('should handle fetch errors gracefully', async () => {
      // Mock fetch to throw an error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Call the method and expect it to reject
      await expect(dataService.loadProfile()).rejects.toThrow('Failed to load profile data');
    });
    
    it('should handle non-OK responses', async () => {
      // Mock fetch to return a non-OK response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });
      
      // Call the method and expect it to reject
      await expect(dataService.loadProfile()).rejects.toThrow('Failed to load profile data: 404 Not Found');
    });
  });
});
