/**
 * Projects model based on the data-model.md specification
 */

/**
 * @typedef {Object} ProjectLink
 * @property {string} type - Type of link (e.g., 'demo', 'github', 'documentation')
 * @property {string} url - URL to the resource
 * @property {string} label - Display text for the link
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {string} [role] - Role in the project
 * @property {string[]} [achievements] - Key achievements or highlights
 * @property {string[]} [technologies] - Technologies used
 * @property {string[]} [collaboration] - Collaboration details
 * @property {string} [environment] - Project environment details
 * @property {string} [image] - Path to project image
 * @property {ProjectLink[]} [links] - Links to project resources
 */

/**
 * Sample project entries based on data-model.md
 * @type {Project[]}
 */
export const sampleProjects = [
  {
    id: 'proj-1',
    title: 'BCM-Systems Validation',
    description: 'Automotive software validation for Stellantis OEM, focusing on safety-critical Infotainment embedded systems including steering controls, crash detection, and vehicle lighting. Implemented end-to-end testing processes from requirement analysis to automated validation.',
    role: 'Lead Tester',
    achievements: [
      'Spearheaded manual/automated testing of ECU software using dSPACE environments',
      'Reduced manual testing by 40% via optimized test scripts and ECU-Test automation',
      'Achieved 95% requirement traceability using IBM RQM/DNG integration',
      'Created reusable XAM signal mapping files, cutting test setup time by 30%',
      'Led debugging of 200+ defects across critical features (Drive Mode, crash detection)'
    ],
    technologies: ['IBM RQM', 'DOORS DNG', 'ECU-Test', 'dSPACE', 'XAM signal mapping'],
    collaboration: [
      'Partnered with Stellantis engineers, developers, and integration teams',
      'Coordinated with cross-functional teams for requirement reviews and defect resolution'
    ],
    image: '/assets/images/projects/bcm-validation.jpg',
    links: []
  },
  {
    id: 'proj-2',
    title: 'DCU 20 (Domain Control Unit)',
    description: 'Centralized ADAS domain controller (DCU) designed to process data from various vehicle sensors, including cameras and radars. Centralization approach simplifies the architecture, reduces costs, and enhances scalability and software updates. Eliminated the need for individual ECUs for each function.',
    role: 'Point of Contact (POC)',
    achievements: [
      'Successfully conducted System Testing including EOL, Failsafe, and USM Testing'
    ],
    technologies: ['Canoe', 'VtestStudio', 'ADAS Analyser', 'Trace32', 'Jira', 'CAPL', 'Python'],
    collaboration: [
      'Collaborated closely with developers to prepare software demos for the HKMC client',
      'Worked onsite at the Korea Head Office'
    ],
    environment: 'Zero DTC Environment, Windows 10',
    image: '/assets/images/projects/dcu20.jpg',
    links: []
  },
  {
    id: 'proj-3',
    title: 'CAnalyzerAI',
    description: 'An AI-powered tool for analyzing CAN bus data in automotive systems',
    role: 'Developer',
    technologies: ['AI/ML', 'CAN Protocol', 'JavaScript', 'Python'],
    image: '/assets/images/projects/canalyzerai.jpg',
    links: [
      {
        type: 'demo',
        url: 'https://suduli.github.io/CAnalyzerAI/',
        label: 'Live Demo'
      },
      {
        type: 'github',
        url: 'https://github.com/suduli/CAnalyzerAI',
        label: 'GitHub Repository'
      }
    ]
  },
  {
    id: 'proj-4',
    title: 'AI-ASIL-Analyser',
    description: 'Tool for analyzing Automotive Safety Integrity Level (ASIL) using AI techniques',
    role: 'Developer',
    technologies: ['AI/ML', 'Automotive Safety', 'ISO 26262', 'JavaScript', 'Python'],
    image: '/assets/images/projects/ai-asil-analyser.jpg',
    links: [
      {
        type: 'demo',
        url: 'https://suduli.github.io/AI-ASIL-Analyser/',
        label: 'Live Demo'
      },
      {
        type: 'github',
        url: 'https://github.com/suduli/AI-ASIL-Analyser',
        label: 'GitHub Repository'
      }
    ]
  }
];

/**
 * Creates a new Project entry
 * @param {Partial<Project>} projectData - Partial project data to initialize with
 * @returns {Project} A new project instance with defaults for optional properties
 */
export const createProject = (projectData) => {
  // Generate a unique ID if not provided
  if (!projectData.id) {
    projectData.id = `proj-${Date.now().toString(36)}`;
  }

  return {
    // Default values for optional properties
    role: '',
    achievements: [],
    technologies: [],
    collaboration: [],
    links: [],
    // Override with provided data
    ...projectData
  };
};

/**
 * Validates a project object to ensure required fields are present
 * @param {Project} project - The project to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isProjectValid = (project) => {
  // Check required fields
  return !!(
    project.title &&
    project.description &&
    project.technologies &&
    project.technologies.length > 0
  );
};

/**
 * Sorts projects by a specified field
 * @param {Project[]} projects - Array of project entries
 * @param {string} field - Field to sort by (default: 'title')
 * @param {boolean} ascending - Sort in ascending order (default: true)
 * @returns {Project[]} Sorted array of projects
 */
export const sortProjects = (projects, field = 'title', ascending = true) => {
  return [...projects].sort((a, b) => {
    let compareA = a[field];
    let compareB = b[field];
    
    // Handle special cases
    if (field === 'technologies' || field === 'achievements' || field === 'collaboration') {
      compareA = a[field] ? a[field].length : 0;
      compareB = b[field] ? b[field].length : 0;
    }
    
    // Handle string comparison
    if (typeof compareA === 'string' && typeof compareB === 'string') {
      return ascending
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    }
    
    // Handle numeric comparison
    return ascending 
      ? compareA - compareB 
      : compareB - compareA;
  });
};

/**
 * Filters projects based on search term
 * @param {Project[]} projects - Array of project entries
 * @param {string} searchTerm - Term to search for
 * @returns {Project[]} Filtered array of projects
 */
export const filterProjectsBySearchTerm = (projects, searchTerm) => {
  if (!searchTerm) return projects;
  
  const term = searchTerm.toLowerCase();
  
  return projects.filter(project => {
    // Search in title and description
    if (project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term)) {
      return true;
    }
    
    // Search in technologies
    if (project.technologies && project.technologies.some(tech => 
      tech.toLowerCase().includes(term))) {
      return true;
    }
    
    // Search in achievements
    if (project.achievements && project.achievements.some(achievement => 
      achievement.toLowerCase().includes(term))) {
      return true;
    }
    
    // Search in role
    if (project.role && project.role.toLowerCase().includes(term)) {
      return true;
    }
    
    return false;
  });
};

/**
 * Filters projects by technology
 * @param {Project[]} projects - Array of project entries
 * @param {string[]} technologies - Array of technologies to filter by
 * @returns {Project[]} Filtered array of projects
 */
export const filterProjectsByTechnology = (projects, technologies) => {
  if (!technologies || technologies.length === 0) return projects;
  
  return projects.filter(project => {
    if (!project.technologies) return false;
    
    return technologies.some(tech => 
      project.technologies.includes(tech));
  });
};

/**
 * Gets all unique technologies across all projects
 * @param {Project[]} projects - Array of project entries
 * @returns {string[]} Array of unique technologies
 */
export const getUniqueTechnologies = (projects) => {
  const technologiesSet = new Set();
  
  projects.forEach(project => {
    if (project.technologies) {
      project.technologies.forEach(tech => {
        technologiesSet.add(tech);
      });
    }
  });
  
  return Array.from(technologiesSet).sort();
};

/**
 * Creates an array of projects from JSON data
 * @param {string} jsonData - JSON string containing project data
 * @returns {Project[]|null} The created projects or null if invalid JSON
 */
export const projectsFromJson = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error('Project data must be an array');
      return null;
    }
    return data.map(item => createProject(item));
  } catch (error) {
    console.debug('Failed to parse projects JSON:', error);
    return null;
  }
};

/**
 * Converts an array of projects to a JSON string
 * @param {Project[]} projects - The projects to convert
 * @returns {string} JSON string representation of the projects
 */
export const projectsToJson = (projects) => {
  return JSON.stringify(projects);
};
