/**
 * Experience model based on the data-model.md specification
 */

/**
 * @typedef {Object} Experience
 * @property {string} id - Unique identifier
 * @property {string} company - Company name
 * @property {string} position - Job title or position
 * @property {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @property {string} endDate - End date in ISO format (YYYY-MM-DD) or "present"
 * @property {string} [location] - Job location
 * @property {string} description - Brief description of role
 * @property {string[]} [highlights] - Key achievements or responsibilities
 * @property {string[]} [technologies] - Technologies used
 * @property {string[]} [keywords] - Related keywords for filtering/search
 */

/**
 * Sample experience entries based on data-model.md
 * @type {Experience[]}
 */
export const sampleExperiences = [
  {
    id: 'exp-1',
    company: 'KPIT Technologies Ltd',
    position: 'Test Lead',
    startDate: '2023-11-01',
    endDate: 'present',
    location: 'Bengaluru, India',
    description: 'Leading validation and testing efforts for automotive systems',
    highlights: [
      'Developed and managed validation plans using IBM ALM with traceability to requirements from DOORS® Next Generation (DNG)',
      'Conducted Sanity, Manual, Functional Testing Performance Testing and Automated testing using dSPACE and ECU-Test Tool',
      'Oversaw validation of features like infotainment system like Steering Wheel Controls, Horn, and Crash detection in system',
      'Collaborated with cross-functional teams and provided regular project updates to stakeholders',
      'Identified, tracked, and resolved Dev issues with timely fixes and retesting'
    ],
    technologies: ['IBM ALM', 'DOORS Next Generation', 'dSPACE', 'ECU-Test Tool'],
    keywords: ['validation', 'testing', 'automotive', 'infotainment']
  },
  {
    id: 'exp-2',
    company: 'HL Klemove India Pvt Ltd (Halla Group)',
    position: 'Specialist Embedded Test Engineer',
    startDate: '2022-02-01',
    endDate: '2023-11-01',
    location: 'Bengaluru, India',
    description: 'Specialized in embedded systems testing and validation',
    highlights: [
      'Test Development: Design and execute test plans for embedded systems, both manually and using automation',
      'ECU Management: Utilize Trace32 for ECU flashing and validate firmware/software updates on embedded hardware',
      'Environment Setup: Establish a Zero DTC environment with ADAS Analyser and maintain comprehensive test environments',
      'Collaboration: Work with developers, product managers, and the development team to ensure system requirements are met and defects are addressed',
      'Defect Management: Identify and track system defects, maintaining a database of known issues and resolutions'
    ],
    technologies: ['Trace32', 'ADAS Analyser', 'Embedded Systems', 'ECU'],
    keywords: ['embedded', 'testing', 'ECU', 'ADAS']
  },
  {
    id: 'exp-3',
    company: 'Mando Softtech India Pvt Ltd (Halla Group)',
    position: 'Senior Embedded Test Engineer',
    startDate: '2020-03-01',
    endDate: '2022-02-01',
    location: 'Bengaluru, India',
    description: 'Advanced testing for embedded automotive systems',
    highlights: [
      'Unit Testing: Designed, implemented, and executed unit tests for software components using VectorCAST, ensuring each function met design specifications',
      'Defect Management: Identified, logged, and tracked system defects, maintaining a record at the unit level',
      'Utilized VectorCAST to achieve desired code coverage, identifying untested code areas and addressing them',
      'Integration Testing: Designed tests for software module integration, ensuring seamless functionality and validating integration with external systems',
      'Project Management: Handled estimation, work allocation, and reviews. Set up MC/DC, identified bugs, and participated in peer reviews'
    ],
    technologies: ['VectorCAST', 'MC/DC', 'Unit Testing', 'Integration Testing'],
    keywords: ['embedded', 'testing', 'automotive', 'code coverage']
  },
  {
    id: 'exp-4',
    company: 'Binsoft Techno Solutions',
    position: 'Test Engineer',
    startDate: '2017-09-01',
    endDate: '2020-02-01',
    location: 'Bengaluru, India',
    description: 'Testing and quality assurance for software applications',
    highlights: [
      'Unit Testing: Designed, implemented, and executed unit tests for software components using VectorCAST, ensuring each function met design specifications',
      'Defect Management: Identified, logged, and tracked system defects, maintaining a record at the unit level',
      'Code Coverage: Utilized VectorCAST to achieve desired code coverage, identifying untested code areas'
    ],
    technologies: ['VectorCAST', 'Unit Testing', 'Code Coverage'],
    keywords: ['testing', 'defect management', 'code coverage']
  }
];

/**
 * Creates a new Experience entry
 * @param {Partial<Experience>} experienceData - Partial experience data to initialize with
 * @returns {Experience} A new experience instance with defaults for optional properties
 */
export const createExperience = (experienceData) => {
  // Generate a unique ID if not provided
  if (!experienceData.id) {
    experienceData.id = `exp-${Date.now().toString(36)}`;
  }

  return {
    // Default values for optional properties
    highlights: [],
    technologies: [],
    keywords: [],
    // Override with provided data
    ...experienceData
  };
};

/**
 * Validates an experience object to ensure required fields are present
 * @param {Experience} experience - The experience to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isExperienceValid = (experience) => {
  // Check required fields
  return !!(
    experience.company &&
    experience.position &&
    experience.startDate &&
    experience.description
  );
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string or "present"
 * @param {string} [format="medium"] - Format style: "short", "medium", "long"
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'medium') => {
  if (!dateString) return '';
  if (dateString.toLowerCase() === 'present') return 'Present';

  try {
    const date = new Date(dateString);
    
    switch (format) {
    case 'short':
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    case 'long':
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'medium':
    default:
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  } catch (error) {
    console.error('Invalid date format:', error);
    return dateString;
  }
};

/**
 * Calculate duration between two dates
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format or "present"
 * @returns {Object} Duration object with years and months
 */
export const calculateDuration = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = endDate.toLowerCase() === 'present' ? new Date() : new Date(endDate);
    
    // Calculate the difference in milliseconds
    const diffMs = end - start;
    
    // Convert to years and months
    const msInYear = 1000 * 60 * 60 * 24 * 365.25;
    const totalYears = diffMs / msInYear;
    
    const years = Math.floor(totalYears);
    const months = Math.round((totalYears - years) * 12);
    
    return { years, months };
  } catch (error) {
    console.error('Error calculating duration:', error);
    return { years: 0, months: 0 };
  }
};

/**
 * Format duration as a readable string
 * @param {Object} duration - Duration object with years and months
 * @returns {string} Formatted duration string
 */
export const formatDuration = (duration) => {
  const { years, months } = duration;
  
  if (years === 0 && months === 0) return 'Less than a month';
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  
  return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
};

/**
 * Get the total years of experience from all experience entries
 * @param {Experience[]} experiences - Array of experience entries
 * @returns {number} Total years of experience
 */
export const getTotalYearsExperience = (experiences) => {
  if (!experiences || !experiences.length) return 0;
  
  // Sort experiences chronologically by start date
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });
  
  let totalMs = 0;
  
  sortedExperiences.forEach(exp => {
    const start = new Date(exp.startDate);
    const end = exp.endDate.toLowerCase() === 'present' ? new Date() : new Date(exp.endDate);
    
    totalMs += (end - start);
  });
  
  // Convert milliseconds to years
  return Math.round((totalMs / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
};

/**
 * Sorts experience entries by date (newest first)
 * @param {Experience[]} experiences - Array of experience entries
 * @returns {Experience[]} Sorted array of experiences
 */
export const sortExperiencesByDate = (experiences) => {
  return [...experiences].sort((a, b) => {
    const dateA = a.endDate.toLowerCase() === 'present' 
      ? new Date() 
      : new Date(a.endDate);
      
    const dateB = b.endDate.toLowerCase() === 'present' 
      ? new Date() 
      : new Date(b.endDate);
      
    return dateB - dateA;
  });
};

/**
 * Creates an array of experiences from JSON data
 * @param {string} jsonData - JSON string containing experience data
 * @returns {Experience[]|null} The created experiences or null if invalid JSON
 */
export const experiencesFromJson = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error('Experience data must be an array');
      return null;
    }
    return data.map(item => createExperience(item));
  } catch (error) {
    console.debug('Failed to parse experiences JSON:', error);
    return null;
  }
};

/**
 * Converts an array of experiences to a JSON string
 * @param {Experience[]} experiences - The experiences to convert
 * @returns {string} JSON string representation of the experiences
 */
export const experiencesToJson = (experiences) => {
  return JSON.stringify(experiences);
};
