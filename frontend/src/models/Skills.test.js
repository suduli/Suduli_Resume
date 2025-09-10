/**
 * Tests for Skills model
 */
import {
  createSkill,
  createSkillCategory,
  createSkillsData,
  isSkillValid,
  isSkillCategoryValid,
  isSkillsDataValid,
  getAllSkills,
  getTopSkills,
  getSkillsByCategory,
  getSkillsByExperience,
  getSkillsByLevel,
  getAverageSkillLevel,
  getAverageYearsExperience,
  searchSkills,
  skillsFromJson,
  skillsToJson,
  sampleSkills
} from './Skills';

describe('Skills Model', () => {
  describe('createSkill', () => {
    it('should create a skill with default values', () => {
      const skill = createSkill({ name: 'JavaScript' });
      
      expect(skill.name).toBe('JavaScript');
      expect(skill.level).toBe(0);
      expect(skill.yearsExperience).toBe(0);
    });
    
    it('should create a skill with provided values', () => {
      const skill = createSkill({
        name: 'JavaScript',
        level: 85,
        yearsExperience: 3
      });
      
      expect(skill.name).toBe('JavaScript');
      expect(skill.level).toBe(85);
      expect(skill.yearsExperience).toBe(3);
    });
  });
  
  describe('createSkillCategory', () => {
    it('should create a category with default values', () => {
      const category = createSkillCategory({ name: 'Programming' });
      
      expect(category.name).toBe('Programming');
      expect(category.skills).toEqual([]);
    });
    
    it('should create a category with provided values', () => {
      const skills = [
        { name: 'JavaScript', level: 85, yearsExperience: 3 },
        { name: 'TypeScript', level: 80, yearsExperience: 2 }
      ];
      
      const category = createSkillCategory({
        name: 'Programming',
        skills
      });
      
      expect(category.name).toBe('Programming');
      expect(category.skills).toEqual(skills);
    });
  });
  
  describe('createSkillsData', () => {
    it('should create skills data with default values', () => {
      const skillsData = createSkillsData();
      
      expect(skillsData.categories).toEqual([]);
    });
    
    it('should create skills data with provided values', () => {
      const categories = [
        {
          name: 'Programming',
          skills: [
            { name: 'JavaScript', level: 85, yearsExperience: 3 }
          ]
        }
      ];
      
      const skillsData = createSkillsData({ categories });
      
      expect(skillsData.categories).toEqual(categories);
    });
  });
  
  describe('isSkillValid', () => {
    it('should return true for valid skills', () => {
      const skill = {
        name: 'JavaScript',
        level: 85,
        yearsExperience: 3
      };
      
      expect(isSkillValid(skill)).toBe(true);
    });
    
    it('should return false if name is missing', () => {
      const skill = {
        level: 85,
        yearsExperience: 3
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
    
    it('should return false if level is missing', () => {
      const skill = {
        name: 'JavaScript',
        yearsExperience: 3
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
    
    it('should return false if level is not a number', () => {
      const skill = {
        name: 'JavaScript',
        level: '85',
        yearsExperience: 3
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
    
    it('should return false if level is less than 0', () => {
      const skill = {
        name: 'JavaScript',
        level: -10,
        yearsExperience: 3
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
    
    it('should return false if level is greater than 100', () => {
      const skill = {
        name: 'JavaScript',
        level: 110,
        yearsExperience: 3
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
    
    it('should return false if yearsExperience is missing', () => {
      const skill = {
        name: 'JavaScript',
        level: 85
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
    
    it('should return false if yearsExperience is not a number', () => {
      const skill = {
        name: 'JavaScript',
        level: 85,
        yearsExperience: '3'
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
    
    it('should return false if yearsExperience is negative', () => {
      const skill = {
        name: 'JavaScript',
        level: 85,
        yearsExperience: -1
      };
      
      expect(isSkillValid(skill)).toBe(false);
    });
  });
  
  describe('isSkillCategoryValid', () => {
    it('should return true for valid categories', () => {
      const category = {
        name: 'Programming',
        skills: [
          { name: 'JavaScript', level: 85, yearsExperience: 3 }
        ]
      };
      
      expect(isSkillCategoryValid(category)).toBe(true);
    });
    
    it('should return false if name is missing', () => {
      const category = {
        skills: [
          { name: 'JavaScript', level: 85, yearsExperience: 3 }
        ]
      };
      
      expect(isSkillCategoryValid(category)).toBe(false);
    });
    
    it('should return false if skills is missing', () => {
      const category = {
        name: 'Programming'
      };
      
      expect(isSkillCategoryValid(category)).toBe(false);
    });
    
    it('should return false if skills is not an array', () => {
      const category = {
        name: 'Programming',
        skills: {}
      };
      
      expect(isSkillCategoryValid(category)).toBe(false);
    });
    
    it('should return false if skills is an empty array', () => {
      const category = {
        name: 'Programming',
        skills: []
      };
      
      expect(isSkillCategoryValid(category)).toBe(false);
    });
    
    it('should return false if any skill is invalid', () => {
      const category = {
        name: 'Programming',
        skills: [
          { name: 'JavaScript', level: 85, yearsExperience: 3 },
          { name: 'TypeScript', level: 110, yearsExperience: 2 } // invalid level
        ]
      };
      
      expect(isSkillCategoryValid(category)).toBe(false);
    });
  });
  
  describe('isSkillsDataValid', () => {
    it('should return true for valid skills data', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 85, yearsExperience: 3 }
            ]
          }
        ]
      };
      
      expect(isSkillsDataValid(skillsData)).toBe(true);
    });
    
    it('should return false if categories is missing', () => {
      const skillsData = {};
      
      expect(isSkillsDataValid(skillsData)).toBe(false);
    });
    
    it('should return false if categories is not an array', () => {
      const skillsData = {
        categories: {}
      };
      
      expect(isSkillsDataValid(skillsData)).toBe(false);
    });
    
    it('should return false if categories is an empty array', () => {
      const skillsData = {
        categories: []
      };
      
      expect(isSkillsDataValid(skillsData)).toBe(false);
    });
    
    it('should return false if any category is invalid', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 85, yearsExperience: 3 }
            ]
          },
          {
            name: 'Design', // invalid: no skills
            skills: []
          }
        ]
      };
      
      expect(isSkillsDataValid(skillsData)).toBe(false);
    });
  });
  
  describe('getAllSkills', () => {
    it('should return all skills from all categories', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 85, yearsExperience: 3 },
              { name: 'TypeScript', level: 80, yearsExperience: 2 }
            ]
          },
          {
            name: 'Design',
            skills: [
              { name: 'Photoshop', level: 70, yearsExperience: 5 }
            ]
          }
        ]
      };
      
      const allSkills = getAllSkills(skillsData);
      
      expect(allSkills.length).toBe(3);
      expect(allSkills.some(s => s.name === 'JavaScript')).toBe(true);
      expect(allSkills.some(s => s.name === 'TypeScript')).toBe(true);
      expect(allSkills.some(s => s.name === 'Photoshop')).toBe(true);
    });
    
    it('should return empty array if skillsData is null or undefined', () => {
      expect(getAllSkills(null)).toEqual([]);
      expect(getAllSkills(undefined)).toEqual([]);
    });
    
    it('should return empty array if categories is missing', () => {
      expect(getAllSkills({})).toEqual([]);
    });
    
    it('should handle categories with no skills', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 85, yearsExperience: 3 }
            ]
          },
          {
            name: 'Design'
          }
        ]
      };
      
      const allSkills = getAllSkills(skillsData);
      
      expect(allSkills.length).toBe(1);
      expect(allSkills[0].name).toBe('JavaScript');
    });
  });
  
  describe('getTopSkills', () => {
    const skillsData = {
      categories: [
        {
          name: 'Programming',
          skills: [
            { name: 'JavaScript', level: 85, yearsExperience: 3 },
            { name: 'TypeScript', level: 80, yearsExperience: 2 },
            { name: 'Python', level: 90, yearsExperience: 4 }
          ]
        },
        {
          name: 'Design',
          skills: [
            { name: 'Photoshop', level: 70, yearsExperience: 5 },
            { name: 'Illustrator', level: 95, yearsExperience: 6 }
          ]
        }
      ]
    };
    
    it('should return top skills sorted by level', () => {
      const topSkills = getTopSkills(skillsData, 3);
      
      expect(topSkills.length).toBe(3);
      expect(topSkills[0].name).toBe('Illustrator'); // level 95
      expect(topSkills[1].name).toBe('Python');      // level 90
      expect(topSkills[2].name).toBe('JavaScript');  // level 85
    });
    
    it('should limit results to specified number', () => {
      const topSkills = getTopSkills(skillsData, 2);
      
      expect(topSkills.length).toBe(2);
      expect(topSkills[0].name).toBe('Illustrator'); // level 95
      expect(topSkills[1].name).toBe('Python');      // level 90
    });
    
    it('should default to 5 skills if limit not specified', () => {
      const topSkills = getTopSkills(skillsData);
      
      expect(topSkills.length).toBe(5); // all skills in the test data
    });
    
    it('should return empty array if skillsData is null or undefined', () => {
      expect(getTopSkills(null)).toEqual([]);
      expect(getTopSkills(undefined)).toEqual([]);
    });
  });
  
  describe('getSkillsByCategory', () => {
    const skillsData = {
      categories: [
        {
          name: 'Programming',
          skills: [
            { name: 'JavaScript', level: 85, yearsExperience: 3 },
            { name: 'TypeScript', level: 80, yearsExperience: 2 }
          ]
        },
        {
          name: 'Design',
          skills: [
            { name: 'Photoshop', level: 70, yearsExperience: 5 }
          ]
        }
      ]
    };
    
    it('should return skills for the specified category', () => {
      const programmingSkills = getSkillsByCategory(skillsData, 'Programming');
      
      expect(programmingSkills.length).toBe(2);
      expect(programmingSkills[0].name).toBe('JavaScript');
      expect(programmingSkills[1].name).toBe('TypeScript');
    });
    
    it('should be case insensitive', () => {
      const programmingSkills = getSkillsByCategory(skillsData, 'programming');
      
      expect(programmingSkills.length).toBe(2);
    });
    
    it('should return empty array if category not found', () => {
      const skillsNotFound = getSkillsByCategory(skillsData, 'Marketing');
      
      expect(skillsNotFound).toEqual([]);
    });
    
    it('should return empty array if skillsData is null or undefined', () => {
      expect(getSkillsByCategory(null, 'Programming')).toEqual([]);
      expect(getSkillsByCategory(undefined, 'Programming')).toEqual([]);
    });
  });
  
  describe('getSkillsByExperience', () => {
    const skillsData = {
      categories: [
        {
          name: 'Programming',
          skills: [
            { name: 'JavaScript', level: 85, yearsExperience: 3 },
            { name: 'TypeScript', level: 80, yearsExperience: 2 },
            { name: 'Python', level: 90, yearsExperience: 4 }
          ]
        },
        {
          name: 'Design',
          skills: [
            { name: 'Photoshop', level: 70, yearsExperience: 5 },
            { name: 'Illustrator', level: 95, yearsExperience: 6 }
          ]
        }
      ]
    };
    
    it('should return skills with at least the specified experience', () => {
      const experiencedSkills = getSkillsByExperience(skillsData, 4);
      
      expect(experiencedSkills.length).toBe(3);
      expect(experiencedSkills.some(s => s.name === 'Python')).toBe(true);
      expect(experiencedSkills.some(s => s.name === 'Photoshop')).toBe(true);
      expect(experiencedSkills.some(s => s.name === 'Illustrator')).toBe(true);
    });
    
    it('should return all skills if minYears is 0', () => {
      const allSkills = getSkillsByExperience(skillsData, 0);
      
      expect(allSkills.length).toBe(5);
    });
    
    it('should return empty array if no skills meet the criteria', () => {
      const noSkills = getSkillsByExperience(skillsData, 10);
      
      expect(noSkills).toEqual([]);
    });
  });
  
  describe('getSkillsByLevel', () => {
    const skillsData = {
      categories: [
        {
          name: 'Programming',
          skills: [
            { name: 'JavaScript', level: 85, yearsExperience: 3 },
            { name: 'TypeScript', level: 80, yearsExperience: 2 },
            { name: 'Python', level: 90, yearsExperience: 4 }
          ]
        },
        {
          name: 'Design',
          skills: [
            { name: 'Photoshop', level: 70, yearsExperience: 5 },
            { name: 'Illustrator', level: 95, yearsExperience: 6 }
          ]
        }
      ]
    };
    
    it('should return skills with at least the specified level', () => {
      const advancedSkills = getSkillsByLevel(skillsData, 90);
      
      expect(advancedSkills.length).toBe(2);
      expect(advancedSkills.some(s => s.name === 'Python')).toBe(true);
      expect(advancedSkills.some(s => s.name === 'Illustrator')).toBe(true);
    });
    
    it('should return all skills if minLevel is 0', () => {
      const allSkills = getSkillsByLevel(skillsData, 0);
      
      expect(allSkills.length).toBe(5);
    });
    
    it('should return empty array if no skills meet the criteria', () => {
      const noSkills = getSkillsByLevel(skillsData, 99);
      
      expect(noSkills).toEqual([]);
    });
  });
  
  describe('getAverageSkillLevel', () => {
    it('should calculate the average level across all skills', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 80, yearsExperience: 3 },
              { name: 'Python', level: 90, yearsExperience: 4 }
            ]
          },
          {
            name: 'Design',
            skills: [
              { name: 'Photoshop', level: 70, yearsExperience: 5 }
            ]
          }
        ]
      };
      
      // (80 + 90 + 70) / 3 = 80
      expect(getAverageSkillLevel(skillsData)).toBe(80);
    });
    
    it('should return 0 if there are no skills', () => {
      const skillsData = {
        categories: []
      };
      
      expect(getAverageSkillLevel(skillsData)).toBe(0);
    });
    
    it('should round to the nearest integer', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 80, yearsExperience: 3 },
              { name: 'Python', level: 85, yearsExperience: 4 }
            ]
          }
        ]
      };
      
      // (80 + 85) / 2 = 82.5, rounded to 83
      expect(getAverageSkillLevel(skillsData)).toBe(83);
    });
  });
  
  describe('getAverageYearsExperience', () => {
    it('should calculate the average years across all skills', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 80, yearsExperience: 3 },
              { name: 'Python', level: 90, yearsExperience: 5 }
            ]
          },
          {
            name: 'Design',
            skills: [
              { name: 'Photoshop', level: 70, yearsExperience: 4 }
            ]
          }
        ]
      };
      
      // (3 + 5 + 4) / 3 = 4
      expect(getAverageYearsExperience(skillsData)).toBe(4);
    });
    
    it('should return 0 if there are no skills', () => {
      const skillsData = {
        categories: []
      };
      
      expect(getAverageYearsExperience(skillsData)).toBe(0);
    });
    
    it('should round to one decimal place', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 80, yearsExperience: 3 },
              { name: 'Python', level: 85, yearsExperience: 5 }
            ]
          }
        ]
      };
      
      // (3 + 5) / 2 = 4
      expect(getAverageYearsExperience(skillsData)).toBe(4);
      
      const skillsData2 = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 80, yearsExperience: 2 },
              { name: 'Python', level: 85, yearsExperience: 5 },
              { name: 'Java', level: 75, yearsExperience: 4 }
            ]
          }
        ]
      };
      
      // (2 + 5 + 4) / 3 = 3.6666..., rounded to 3.7
      expect(getAverageYearsExperience(skillsData2)).toBe(3.7);
    });
  });
  
  describe('searchSkills', () => {
    const skillsData = {
      categories: [
        {
          name: 'Programming',
          skills: [
            { name: 'JavaScript', level: 85, yearsExperience: 3 },
            { name: 'TypeScript', level: 80, yearsExperience: 2 },
            { name: 'Python', level: 90, yearsExperience: 4 }
          ]
        },
        {
          name: 'Design',
          skills: [
            { name: 'Photoshop', level: 70, yearsExperience: 5 },
            { name: 'Illustrator', level: 95, yearsExperience: 6 }
          ]
        }
      ]
    };
    
    it('should find skills matching the search term', () => {
      const scriptSkills = searchSkills(skillsData, 'script');
      
      expect(scriptSkills.length).toBe(2);
      expect(scriptSkills.some(s => s.name === 'JavaScript')).toBe(true);
      expect(scriptSkills.some(s => s.name === 'TypeScript')).toBe(true);
    });
    
    it('should be case insensitive', () => {
      const pythonSkills = searchSkills(skillsData, 'PYTHON');
      
      expect(pythonSkills.length).toBe(1);
      expect(pythonSkills[0].name).toBe('Python');
    });
    
    it('should return empty array if no skills match', () => {
      const noSkills = searchSkills(skillsData, 'React');
      
      expect(noSkills).toEqual([]);
    });
    
    it('should return empty array if search term is empty', () => {
      expect(searchSkills(skillsData, '')).toEqual([]);
      expect(searchSkills(skillsData, null)).toEqual([]);
      expect(searchSkills(skillsData, undefined)).toEqual([]);
    });
  });
  
  describe('JSON conversion', () => {
    it('should convert skills data to JSON and back', () => {
      const skillsData = {
        categories: [
          {
            name: 'Programming',
            skills: [
              { name: 'JavaScript', level: 85, yearsExperience: 3 },
              { name: 'Python', level: 90, yearsExperience: 4 }
            ]
          }
        ]
      };
      
      const json = skillsToJson(skillsData);
      const restored = skillsFromJson(json);
      
      expect(restored.categories.length).toBe(1);
      expect(restored.categories[0].name).toBe('Programming');
      expect(restored.categories[0].skills.length).toBe(2);
      expect(restored.categories[0].skills[0].name).toBe('JavaScript');
      expect(restored.categories[0].skills[1].name).toBe('Python');
    });
    
    it('should return null for invalid JSON', () => {
      const result = skillsFromJson('invalid json');
      expect(result).toBeNull();
    });
  });
  
  describe('sampleSkills', () => {
    it('should have sample skills data', () => {
      expect(sampleSkills).toBeDefined();
      expect(sampleSkills.categories).toBeInstanceOf(Array);
      expect(sampleSkills.categories.length).toBeGreaterThan(0);
      
      // Check for specific categories
      const categoryNames = sampleSkills.categories.map(c => c.name);
      expect(categoryNames).toContain('Programming & Scripting');
      expect(categoryNames).toContain('Testing & QA');
      expect(categoryNames).toContain('Tools & Technologies');
      
      // Check for specific skills
      const allSkills = getAllSkills(sampleSkills);
      expect(allSkills.some(s => s.name === 'Embedded C')).toBe(true);
      expect(allSkills.some(s => s.name === 'Python')).toBe(true);
      expect(allSkills.some(s => s.name === 'Functional Testing')).toBe(true);
    });
  });
});
