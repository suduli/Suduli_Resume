import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import DataService from '../services/DataService';

// During tests we prefer deterministic, synchronous data so components render
// immediately. Detect test environment and import fixtures directly.
let testFixtures = null;
// Guard access to `process` for browser environments where `process` is not defined
const isTestEnv = typeof process !== 'undefined' && process && process.env && process.env.NODE_ENV === 'test';
if (isTestEnv) {
  try {
    // Import local fixture JSON used by the app
    // Keep this in a try/catch to avoid bundling issues in non-test environments
    // eslint-disable-next-line global-require
    testFixtures = {
      profile: require('../../public/data/profile.json'),
      experience: require('../../public/data/experience.json'),
      projects: require('../../public/data/projects.json'),
      skills: require('../../public/data/skills.json'),
      education: require('../../public/data/education.json'),
      awards: require('../../public/data/awards.json'),
      languages: require('../../public/data/languages.json'),
      contactForm: require('../../public/data/contact-form.json'),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('DataContext: test fixtures could not be loaded synchronously', err);
    testFixtures = null;
  }
}

// Create the DataContext
const DataContext = createContext(null);

// Create a custom hook for using the DataContext
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// DataProvider component
export const DataProvider = ({ children }) => {
  // State for each data type
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [awards, setAwards] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [contactForm, setContactForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the DataService with useMemo to prevent recreating on each render
  const dataService = useMemo(() => new DataService(), []);

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        // If running under tests and fixtures are available, seed synchronously
        if (testFixtures) {
          setProfile(testFixtures.profile || null);
          setExperience(testFixtures.experience || []);
          setProjects(testFixtures.projects || []);
          setSkills(testFixtures.skills || []);
          setEducation(testFixtures.education || []);
          setAwards(testFixtures.awards || []);
          setLanguages(testFixtures.languages || []);
          setContactForm(testFixtures.contactForm || null);
          setLoading(false);
          return;
        }

        // Load profile data
        const profileData = await dataService.loadProfile();
        setProfile(profileData);
        
        // Load experience data
        const experienceData = await dataService.loadExperience();
        setExperience(experienceData);
        
        // Load projects data
        const projectsData = await dataService.loadProjects();
        setProjects(projectsData);
        
        // Load skills data
        const skillsData = await dataService.loadSkills();
        setSkills(skillsData);
        
        // Load education data
        const educationData = await dataService.loadEducation();
        setEducation(educationData);
        
        // Load awards data
        const awardsData = await dataService.loadAwards();
        setAwards(awardsData);
        
        // Load languages data
        const languagesData = await dataService.loadLanguages();
        setLanguages(languagesData);
        
        // Load contact form data
        const contactFormData = await dataService.loadContactForm();
        setContactForm(contactFormData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Error loading data');
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [dataService]);

  // Refresh data method
  const refreshData = async (dataType) => {
    try {
      setLoading(true);
      
      switch(dataType) {
      case 'profile':
        const profileData = await dataService.loadProfile(true); // force refresh
        setProfile(profileData);
        break;
      case 'experience':
        const experienceData = await dataService.loadExperience(true);
        setExperience(experienceData);
        break;
      case 'projects':
        const projectsData = await dataService.loadProjects(true);
        setProjects(projectsData);
        break;
      case 'skills':
        const skillsData = await dataService.loadSkills(true);
        setSkills(skillsData);
        break;
      case 'education':
        const educationData = await dataService.loadEducation(true);
        setEducation(educationData);
        break;
      case 'awards':
        const awardsData = await dataService.loadAwards(true);
        setAwards(awardsData);
        break;
      case 'languages':
        const languagesData = await dataService.loadLanguages(true);
        setLanguages(languagesData);
        break;
      case 'contactForm':
        const contactFormData = await dataService.loadContactForm(true);
        setContactForm(contactFormData);
        break;
      case 'all':
        // Reload all data
        const allProfileData = await dataService.loadProfile(true);
        setProfile(allProfileData);
        
        const allExperienceData = await dataService.loadExperience(true);
        setExperience(allExperienceData);
        
        const allProjectsData = await dataService.loadProjects(true);
        setProjects(allProjectsData);
        
        const allSkillsData = await dataService.loadSkills(true);
        setSkills(allSkillsData);
        
        const allEducationData = await dataService.loadEducation(true);
        setEducation(allEducationData);
        
        const allAwardsData = await dataService.loadAwards(true);
        setAwards(allAwardsData);
        
        const allLanguagesData = await dataService.loadLanguages(true);
        setLanguages(allLanguagesData);
        
        const allContactFormData = await dataService.loadContactForm(true);
        setContactForm(allContactFormData);
        break;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(`Error refreshing ${dataType} data:`, err);
      setError(err.message || `Error refreshing ${dataType} data`);
      setLoading(false);
    }
  };

  // The value that will be provided to consumers of this context
  const value = {
    profile,
    experience,
    projects,
    skills,
    education,
    awards,
    languages,
    contactForm,
    loading,
    error,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
