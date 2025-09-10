/**
 * Skills model based on the data-model.md specification
 */

/**
 * @typedef {Object} Skill
 * @property {string} name - Skill name
 * @property {number} level - Proficiency level (0-100)
 * @property {number} yearsExperience - Years of experience with the skill
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string} name - Category name
 * @property {Skill[]} skills - Array of skills in this category
 */

/**
 * @typedef {Object} SkillsData
 * @property {SkillCategory[]} categories - Array of skill categories
 */

/**
 * Sample skills data based on data-model.md
 * @type {SkillsData}
 */
export const sampleSkills = {
  categories: [
    {
      name: 'Programming & Scripting',
      skills: [
        { name: 'Embedded C', level: 90, yearsExperience: 7 },
        { name: 'Python', level: 85, yearsExperience: 5 },
        { name: 'CAPL', level: 90, yearsExperience: 6 }
      ]
    },
    {
      name: 'Testing & QA',
      skills: [
        { name: 'Functional Testing', level: 95, yearsExperience: 7 },
        { name: 'Performance Testing', level: 90, yearsExperience: 7 },
        { name: 'White Box Testing', level: 85, yearsExperience: 7 },
        { name: 'Black Box Testing', level: 95, yearsExperience: 7 },
        { name: 'Infotainment Testing', level: 90, yearsExperience: 5 },
        { name: 'System Testing', level: 95, yearsExperience: 7 },
        { name: 'Unit Testing', level: 90, yearsExperience: 7 },
        { name: 'Integration Testing', level: 90, yearsExperience: 7 },
        { name: 'Regression Testing', level: 95, yearsExperience: 7 }
      ]
    },
    {
      name: 'Tools & Technologies',
      skills: [
        { name: 'RQM', level: 85, yearsExperience: 6 },
        { name: 'RTC', level: 85, yearsExperience: 6 },
        { name: 'DOORS', level: 90, yearsExperience: 6 },
        { name: 'RHAPSODY', level: 80, yearsExperience: 5 },
        { name: 'CLEAR QUEST', level: 75, yearsExperience: 4 },
        { name: 'EWM', level: 80, yearsExperience: 5 },
        { name: 'ECU TEST Tool', level: 95, yearsExperience: 5 },
        { name: 'Dspace', level: 90, yearsExperience: 5 },
        { name: 'CANalyzer', level: 95, yearsExperience: 6 },
        { name: 'CANdb', level: 90, yearsExperience: 6 },
        { name: 'CANdela', level: 85, yearsExperience: 5 },
        { name: 'CANoe', level: 95, yearsExperience: 6 },
        { name: 'VectorCast', level: 90, yearsExperience: 6 },
        { name: 'VtestStudio', level: 85, yearsExperience: 5 },
        { name: 'Trace32', level: 90, yearsExperience: 5 },
        { name: 'Understand C', level: 85, yearsExperience: 6 },
        { name: 'Jira', level: 90, yearsExperience: 5 }
      ]
    },
    {
      name: 'Protocols & Standards',
      skills: [
        { name: 'CAN (ISO-11898)', level: 95, yearsExperience: 7 },
        { name: 'UDS (ISO-14229)', level: 90, yearsExperience: 6 },
        { name: 'AUTOSAR', level: 85, yearsExperience: 5 },
        { name: 'XCP', level: 80, yearsExperience: 4 },
        { name: 'ISO-26262', level: 90, yearsExperience: 6 }
      ]
    },
    {
      name: 'Software Development',
      skills: [
        { name: 'SDLC', level: 90, yearsExperience: 7 },
        { name: 'STLC', level: 95, yearsExperience: 7 },
        { name: 'Bug Life Cycle', level: 95, yearsExperience: 7 }
      ]
    }
  ]
};

/**
 * Creates a new skill object
 * @param {Partial<Skill>} skillData - Partial skill data to initialize with
 * @returns {Skill} A new skill instance with defaults
 */
export const createSkill = (skillData) => {
  return {
    name: '',
    level: 0,
    yearsExperience: 0,
    ...skillData
  };
};

/**
 * Creates a new skill category
 * @param {Partial<SkillCategory>} categoryData - Partial category data to initialize with
 * @returns {SkillCategory} A new skill category instance with defaults
 */
export const createSkillCategory = (categoryData) => {
  return {
    name: '',
    skills: [],
    ...categoryData
  };
};

/**
 * Creates a complete skills data structure
 * @param {Partial<SkillsData>} skillsData - Partial skills data to initialize with
 * @returns {SkillsData} A new skills data instance with defaults
 */
export const createSkillsData = (skillsData = {}) => {
  return {
    categories: [],
    ...skillsData
  };
};

/**
 * Validates a skill object to ensure required fields are present and valid
 * @param {Skill} skill - The skill to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isSkillValid = (skill) => {
  return !!(
    skill.name &&
    typeof skill.level === 'number' && 
    skill.level >= 0 && 
    skill.level <= 100 &&
    typeof skill.yearsExperience === 'number' && 
    skill.yearsExperience >= 0
  );
};

/**
 * Validates a skill category to ensure required fields are present and valid
 * @param {SkillCategory} category - The category to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isSkillCategoryValid = (category) => {
  return !!(
    category.name &&
    Array.isArray(category.skills) &&
    category.skills.length > 0 &&
    category.skills.every(skill => isSkillValid(skill))
  );
};

/**
 * Validates skills data to ensure required fields are present and valid
 * @param {SkillsData} skillsData - The skills data to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isSkillsDataValid = (skillsData) => {
  return !!(
    skillsData &&
    Array.isArray(skillsData.categories) &&
    skillsData.categories.length > 0 &&
    skillsData.categories.every(category => isSkillCategoryValid(category))
  );
};

/**
 * Gets all skills across all categories
 * @param {SkillsData} skillsData - The skills data
 * @returns {Skill[]} All skills from all categories
 */
export const getAllSkills = (skillsData) => {
  if (!skillsData || !skillsData.categories) return [];
  
  return skillsData.categories.reduce((allSkills, category) => {
    return allSkills.concat(category.skills || []);
  }, []);
};

/**
 * Gets the top skills by level across all categories
 * @param {SkillsData} skillsData - The skills data
 * @param {number} limit - Maximum number of skills to return
 * @returns {Skill[]} Top skills sorted by level (descending)
 */
export const getTopSkills = (skillsData, limit = 5) => {
  const allSkills = getAllSkills(skillsData);
  
  return [...allSkills]
    .sort((a, b) => b.level - a.level)
    .slice(0, limit);
};

/**
 * Gets skills by category
 * @param {SkillsData} skillsData - The skills data
 * @param {string} categoryName - Category name to filter by
 * @returns {Skill[]} Skills in the specified category
 */
export const getSkillsByCategory = (skillsData, categoryName) => {
  if (!skillsData || !skillsData.categories) return [];
  
  const category = skillsData.categories.find(cat => 
    cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  
  return category ? [...category.skills] : [];
};

/**
 * Gets skills by minimum experience years
 * @param {SkillsData} skillsData - The skills data
 * @param {number} minYears - Minimum years of experience
 * @returns {Skill[]} Skills with at least the specified years of experience
 */
export const getSkillsByExperience = (skillsData, minYears) => {
  const allSkills = getAllSkills(skillsData);
  
  return allSkills.filter(skill => skill.yearsExperience >= minYears);
};

/**
 * Gets skills by minimum proficiency level
 * @param {SkillsData} skillsData - The skills data
 * @param {number} minLevel - Minimum proficiency level (0-100)
 * @returns {Skill[]} Skills with at least the specified proficiency level
 */
export const getSkillsByLevel = (skillsData, minLevel) => {
  const allSkills = getAllSkills(skillsData);
  
  return allSkills.filter(skill => skill.level >= minLevel);
};

/**
 * Calculates the average proficiency level across all skills
 * @param {SkillsData} skillsData - The skills data
 * @returns {number} Average proficiency level
 */
export const getAverageSkillLevel = (skillsData) => {
  const allSkills = getAllSkills(skillsData);
  
  if (allSkills.length === 0) return 0;
  
  const sum = allSkills.reduce((total, skill) => total + skill.level, 0);
  return Math.round(sum / allSkills.length);
};

/**
 * Calculates the average years of experience across all skills
 * @param {SkillsData} skillsData - The skills data
 * @returns {number} Average years of experience
 */
export const getAverageYearsExperience = (skillsData) => {
  const allSkills = getAllSkills(skillsData);
  
  if (allSkills.length === 0) return 0;
  
  const sum = allSkills.reduce((total, skill) => total + skill.yearsExperience, 0);
  return Math.round((sum / allSkills.length) * 10) / 10; // Round to 1 decimal place
};

/**
 * Searches for skills by name across all categories
 * @param {SkillsData} skillsData - The skills data
 * @param {string} searchTerm - Search term
 * @returns {Skill[]} Skills matching the search term
 */
export const searchSkills = (skillsData, searchTerm) => {
  if (!searchTerm) return [];
  
  const allSkills = getAllSkills(skillsData);
  const term = searchTerm.toLowerCase();
  
  return allSkills.filter(skill => 
    skill.name.toLowerCase().includes(term)
  );
};

/**
 * Creates skills data from JSON
 * @param {string} jsonData - JSON string containing skills data
 * @returns {SkillsData|null} The created skills data or null if invalid JSON
 */
export const skillsFromJson = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    return createSkillsData(data);
  } catch (error) {
    console.debug('Failed to parse skills JSON:', error);
    return null;
  }
};

/**
 * Converts skills data to a JSON string
 * @param {SkillsData} skillsData - The skills data to convert
 * @returns {string} JSON string representation of the skills data
 */
export const skillsToJson = (skillsData) => {
  return JSON.stringify(skillsData);
};
