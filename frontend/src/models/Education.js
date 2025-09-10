/**
 * Education model based on the data-model.md specification
 */

/**
 * @typedef {Object} Education
 * @property {string} [id] - Unique identifier
 * @property {string} degree - Degree or certification name
 * @property {string} institution - School, university, or institution name
 * @property {string} [startDate] - Start date in ISO format (YYYY-MM-DD)
 * @property {string} [endDate] - End date in ISO format (YYYY-MM-DD)
 * @property {string} [location] - Location of the institution
 * @property {string} [description] - Description of the educational experience
 * @property {string[]} [achievements] - Notable achievements during education
 * @property {string[]} [courses] - Relevant courses taken
 * @property {string} [gpa] - Grade Point Average or other grade metric
 * @property {string} [fieldOfStudy] - Major or concentration
 */

/**
 * Sample education entries based on data-model.md
 * @type {Education[]}
 */
export const sampleEducation = [
  {
    id: 'edu-1',
    degree: 'B.E',
    institution: 'The Aeronautical Society of lndia',
    startDate: '',
    endDate: '',
    location: 'India',
    description: '',
    achievements: []
  }
];

/**
 * Creates a new Education entry
 * @param {Partial<Education>} educationData - Partial education data to initialize with
 * @returns {Education} A new education instance with defaults for optional properties
 */
export const createEducation = (educationData) => {
  // Generate a unique ID if not provided
  if (!educationData.id) {
    educationData.id = `edu-${Date.now().toString(36)}`;
  }

  return {
    // Default values for optional properties
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    achievements: [],
    courses: [],
    // Override with provided data
    ...educationData
  };
};

/**
 * Validates an education object to ensure required fields are present
 * @param {Education} education - The education to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isEducationValid = (education) => {
  // Check required fields
  return !!(
    education.degree &&
    education.institution
  );
};

/**
 * Formats the date range for education display
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {string} Formatted date range string
 */
export const formatEducationDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '';
  
  const formatYear = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).getFullYear().toString();
    } catch (error) {
      console.error('Invalid date format:', error);
      return dateString;
    }
  };
  
  const start = formatYear(startDate);
  const end = formatYear(endDate);
  
  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} - Present`;
  if (end) return `Until ${end}`;
  
  return '';
};

/**
 * Calculates education duration in years
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {number} Duration in years (decimal)
 */
export const calculateEducationDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the difference in milliseconds
    const diffMs = end - start;
    
    // Convert to years
    const msInYear = 1000 * 60 * 60 * 24 * 365.25;
    const years = diffMs / msInYear;
    
    return Math.round(years * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating education duration:', error);
    return 0;
  }
};

/**
 * Sorts education entries by date (most recent first)
 * @param {Education[]} educationList - Array of education entries
 * @returns {Education[]} Sorted array of education entries
 */
export const sortEducationByDate = (educationList) => {
  return [...educationList].sort((a, b) => {
    const endA = a.endDate ? new Date(a.endDate) : new Date();
    const endB = b.endDate ? new Date(b.endDate) : new Date();
    
    // Sort by end date descending (most recent first)
    return endB - endA;
  });
};

/**
 * Groups education entries by degree type
 * @param {Education[]} educationList - Array of education entries
 * @returns {Object} Object with degree types as keys and arrays of education entries as values
 */
export const groupEducationByDegree = (educationList) => {
  return educationList.reduce((groups, education) => {
    const degreeType = education.degree || 'Other';
    
    if (!groups[degreeType]) {
      groups[degreeType] = [];
    }
    
    groups[degreeType].push(education);
    return groups;
  }, {});
};

/**
 * Gets the highest level of education
 * @param {Education[]} educationList - Array of education entries
 * @returns {Education|null} The highest level education entry or null if none
 */
export const getHighestEducation = (educationList) => {
  if (!educationList || educationList.length === 0) return null;
  
  // Define education level hierarchy (higher index = higher level)
  const educationLevels = [
    'certificate',
    'diploma',
    'associate',
    'bachelor',
    'b.e',
    'b.tech',
    'master',
    'm.sc',
    'm.tech',
    'mba',
    'phd',
    'doctorate'
  ];
  
  // Sort by education level
  return [...educationList].sort((a, b) => {
    // Get the highest matching level for each degree
    const levelA = a.degree ? Math.max(...educationLevels.map((level, index) => 
      a.degree.toLowerCase().includes(level) ? index : -1
    )) : -1;
    
    const levelB = b.degree ? Math.max(...educationLevels.map((level, index) => 
      b.degree.toLowerCase().includes(level) ? index : -1
    )) : -1;
    
    // If levels are the same, use end date as tiebreaker
    if (levelA === levelB) {
      const endA = a.endDate ? new Date(a.endDate) : new Date(0);
      const endB = b.endDate ? new Date(b.endDate) : new Date(0);
      return endB - endA;
    }
    
    return levelB - levelA;
  })[0];
};

/**
 * Creates an array of education entries from JSON data
 * @param {string} jsonData - JSON string containing education data
 * @returns {Education[]|null} The created education entries or null if invalid JSON
 */
export const educationFromJson = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error('Education data must be an array');
      return null;
    }
    return data.map(item => createEducation(item));
  } catch (error) {
    console.debug('Failed to parse education JSON:', error);
    return null;
  }
};

/**
 * Converts an array of education entries to a JSON string
 * @param {Education[]} educationList - The education entries to convert
 * @returns {string} JSON string representation of the education entries
 */
export const educationToJson = (educationList) => {
  return JSON.stringify(educationList);
};
