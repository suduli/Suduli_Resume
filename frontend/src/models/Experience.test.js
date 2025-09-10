/**
 * Tests for Experience model
 */
import {
  createExperience,
  isExperienceValid,
  formatDate,
  calculateDuration,
  formatDuration,
  getTotalYearsExperience,
  sortExperiencesByDate,
  experiencesFromJson,
  experiencesToJson,
  sampleExperiences
} from './Experience';

describe('Experience Model', () => {
  describe('createExperience', () => {
    it('should create an experience with all required fields', () => {
      const exp = createExperience({
        company: 'Test Company',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        description: 'Test description'
      });
      
      expect(exp.company).toBe('Test Company');
      expect(exp.position).toBe('Software Engineer');
      expect(exp.startDate).toBe('2020-01-01');
      expect(exp.description).toBe('Test description');
      expect(exp.id).toBeDefined();
    });
    
    it('should use provided id if available', () => {
      const exp = createExperience({
        id: 'test-id',
        company: 'Test Company',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        description: 'Test description'
      });
      
      expect(exp.id).toBe('test-id');
    });
    
    it('should initialize optional arrays if not provided', () => {
      const exp = createExperience({
        company: 'Test Company',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        description: 'Test description'
      });
      
      expect(exp.highlights).toEqual([]);
      expect(exp.technologies).toEqual([]);
      expect(exp.keywords).toEqual([]);
    });
    
    it('should use provided optional arrays', () => {
      const highlights = ['Highlight 1', 'Highlight 2'];
      const technologies = ['React', 'Node.js'];
      const keywords = ['frontend', 'javascript'];
      
      const exp = createExperience({
        company: 'Test Company',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        description: 'Test description',
        highlights,
        technologies,
        keywords
      });
      
      expect(exp.highlights).toEqual(highlights);
      expect(exp.technologies).toEqual(technologies);
      expect(exp.keywords).toEqual(keywords);
    });
  });
  
  describe('isExperienceValid', () => {
    it('should return true for valid experiences', () => {
      const exp = {
        company: 'Test Company',
        position: 'Software Engineer',
        startDate: '2020-01-01',
        description: 'Test description'
      };
      
      expect(isExperienceValid(exp)).toBe(true);
    });
    
    it('should return false if company is missing', () => {
      const exp = {
        position: 'Software Engineer',
        startDate: '2020-01-01',
        description: 'Test description'
      };
      
      expect(isExperienceValid(exp)).toBe(false);
    });
    
    it('should return false if position is missing', () => {
      const exp = {
        company: 'Test Company',
        startDate: '2020-01-01',
        description: 'Test description'
      };
      
      expect(isExperienceValid(exp)).toBe(false);
    });
    
    it('should return false if startDate is missing', () => {
      const exp = {
        company: 'Test Company',
        position: 'Software Engineer',
        description: 'Test description'
      };
      
      expect(isExperienceValid(exp)).toBe(false);
    });
    
    it('should return false if description is missing', () => {
      const exp = {
        company: 'Test Company',
        position: 'Software Engineer',
        startDate: '2020-01-01'
      };
      
      expect(isExperienceValid(exp)).toBe(false);
    });
  });
  
  describe('formatDate', () => {
    it('should format date in medium style by default', () => {
      const formatted = formatDate('2020-01-15');
      // The exact format depends on the locale, so just check it's transformed
      expect(formatted).toContain('2020');
      expect(formatted).not.toBe('2020-01-15');
    });
    
    it('should handle "present" string', () => {
      expect(formatDate('present')).toBe('Present');
      expect(formatDate('PRESENT')).toBe('Present');
    });
    
    it('should format date in short style', () => {
      const formatted = formatDate('2020-01-15', 'short');
      expect(formatted).toContain('2020');
      expect(formatted).not.toContain('15');
    });
    
    it('should format date in long style', () => {
      const formatted = formatDate('2020-01-15', 'long');
      expect(formatted).toContain('2020');
      expect(formatted).toContain('15');
    });
    
    it('should return empty string for empty input', () => {
      expect(formatDate('')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });
  
  describe('calculateDuration', () => {
    it('should calculate duration between two dates', () => {
      const duration = calculateDuration('2020-01-01', '2022-07-01');
      expect(duration.years).toBe(2);
      expect(duration.months).toBe(6);
    });
    
    it('should handle "present" as end date', () => {
      // Mock current date for consistent testing
      const realDate = Date;
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return new realDate('2023-07-01');
          }
          return new realDate(...args);
        }
      };
      
      const duration = calculateDuration('2020-01-01', 'present');
      expect(duration.years).toBe(3);
      expect(duration.months).toBe(6);
      
      // Restore original Date
      global.Date = realDate;
    });
    
    it('should handle less than a month duration', () => {
      const duration = calculateDuration('2020-01-01', '2020-01-15');
      expect(duration.years).toBe(0);
      expect(duration.months).toBe(0);
    });
  });
  
  describe('formatDuration', () => {
    it('should format years and months', () => {
      expect(formatDuration({ years: 2, months: 6 })).toBe('2 years, 6 months');
      expect(formatDuration({ years: 1, months: 1 })).toBe('1 year, 1 month');
    });
    
    it('should format only years when months is 0', () => {
      expect(formatDuration({ years: 3, months: 0 })).toBe('3 years');
      expect(formatDuration({ years: 1, months: 0 })).toBe('1 year');
    });
    
    it('should format only months when years is 0', () => {
      expect(formatDuration({ years: 0, months: 6 })).toBe('6 months');
      expect(formatDuration({ years: 0, months: 1 })).toBe('1 month');
    });
    
    it('should handle zero duration', () => {
      expect(formatDuration({ years: 0, months: 0 })).toBe('Less than a month');
    });
  });
  
  describe('getTotalYearsExperience', () => {
    it('should calculate total years from multiple experiences', () => {
      const experiences = [
        {
          startDate: '2018-01-01',
          endDate: '2020-01-01'
        },
        {
          startDate: '2020-02-01',
          endDate: '2022-08-01'
        }
      ];
      
      // 2 years + 2 years 6 months = 4.5 years
      expect(getTotalYearsExperience(experiences)).toBeCloseTo(4.5, 1);
    });
    
    it('should handle present endDate', () => {
      // Mock current date for consistent testing
      const realDate = Date;
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            return new realDate('2023-07-01');
          }
          return new realDate(...args);
        }
      };
      
      const experiences = [
        {
          startDate: '2020-01-01',
          endDate: 'present'
        }
      ];
      
      expect(getTotalYearsExperience(experiences)).toBeCloseTo(3.5, 1);
      
      // Restore original Date
      global.Date = realDate;
    });
    
    it('should return 0 for empty experiences array', () => {
      expect(getTotalYearsExperience([])).toBe(0);
      expect(getTotalYearsExperience(null)).toBe(0);
      expect(getTotalYearsExperience(undefined)).toBe(0);
    });
  });
  
  describe('sortExperiencesByDate', () => {
    it('should sort experiences with newest first', () => {
      const experiences = [
        {
          id: 'exp1',
          startDate: '2018-01-01',
          endDate: '2020-01-01'
        },
        {
          id: 'exp2',
          startDate: '2020-02-01',
          endDate: '2022-08-01'
        },
        {
          id: 'exp3',
          startDate: '2015-01-01',
          endDate: '2017-12-31'
        }
      ];
      
      const sorted = sortExperiencesByDate(experiences);
      expect(sorted[0].id).toBe('exp2');
      expect(sorted[1].id).toBe('exp1');
      expect(sorted[2].id).toBe('exp3');
    });
    
    it('should place "present" experiences first', () => {
      const experiences = [
        {
          id: 'exp1',
          startDate: '2018-01-01',
          endDate: '2020-01-01'
        },
        {
          id: 'exp2',
          startDate: '2015-01-01',
          endDate: 'present'
        }
      ];
      
      const sorted = sortExperiencesByDate(experiences);
      expect(sorted[0].id).toBe('exp2');
      expect(sorted[1].id).toBe('exp1');
    });
  });
  
  describe('JSON conversion', () => {
    it('should convert experiences to JSON and back', () => {
      const experiences = [
        createExperience({
          company: 'Test Company',
          position: 'Software Engineer',
          startDate: '2020-01-01',
          endDate: '2022-01-01',
          description: 'Test description'
        }),
        createExperience({
          company: 'Another Company',
          position: 'Senior Developer',
          startDate: '2022-02-01',
          endDate: 'present',
          description: 'Another description'
        })
      ];
      
      const json = experiencesToJson(experiences);
      const restored = experiencesFromJson(json);
      
      expect(restored.length).toBe(2);
      expect(restored[0].company).toBe('Test Company');
      expect(restored[1].company).toBe('Another Company');
    });
    
    it('should return null for invalid JSON', () => {
      const result = experiencesFromJson('invalid json');
      expect(result).toBeNull();
    });
    
    it('should return null if JSON is not an array', () => {
      const result = experiencesFromJson('{"key": "value"}');
      expect(result).toBeNull();
    });
  });
  
  describe('sampleExperiences', () => {
    it('should have sample experience data', () => {
      expect(sampleExperiences).toBeInstanceOf(Array);
      expect(sampleExperiences.length).toBeGreaterThan(0);
      expect(sampleExperiences[0].company).toBe('KPIT Technologies Ltd');
    });
  });
});
