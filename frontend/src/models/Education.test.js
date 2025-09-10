/**
 * Tests for Education model
 */
import {
  createEducation,
  isEducationValid,
  formatEducationDateRange,
  calculateEducationDuration,
  sortEducationByDate,
  groupEducationByDegree,
  getHighestEducation,
  educationFromJson,
  educationToJson,
  sampleEducation
} from './Education';

describe('Education Model', () => {
  describe('createEducation', () => {
    it('should create an education entry with default values', () => {
      const education = createEducation({
        degree: 'B.Sc',
        institution: 'Test University'
      });
      
      expect(education.degree).toBe('B.Sc');
      expect(education.institution).toBe('Test University');
      expect(education.startDate).toBe('');
      expect(education.endDate).toBe('');
      expect(education.description).toBe('');
      expect(education.achievements).toEqual([]);
      expect(education.courses).toEqual([]);
      expect(education.id).toBeDefined();
    });
    
    it('should create an education entry with provided values', () => {
      const education = createEducation({
        id: 'test-id',
        degree: 'M.Sc',
        institution: 'Advanced University',
        startDate: '2018-09-01',
        endDate: '2020-06-30',
        location: 'London, UK',
        description: 'Computer Science specialization',
        achievements: ['Graduated with honors'],
        courses: ['Advanced Algorithms', 'Machine Learning'],
        gpa: '3.9',
        fieldOfStudy: 'Computer Science'
      });
      
      expect(education.id).toBe('test-id');
      expect(education.degree).toBe('M.Sc');
      expect(education.institution).toBe('Advanced University');
      expect(education.startDate).toBe('2018-09-01');
      expect(education.endDate).toBe('2020-06-30');
      expect(education.location).toBe('London, UK');
      expect(education.description).toBe('Computer Science specialization');
      expect(education.achievements).toEqual(['Graduated with honors']);
      expect(education.courses).toEqual(['Advanced Algorithms', 'Machine Learning']);
      expect(education.gpa).toBe('3.9');
      expect(education.fieldOfStudy).toBe('Computer Science');
    });
  });
  
  describe('isEducationValid', () => {
    it('should return true for valid education entries', () => {
      const education = {
        degree: 'B.Sc',
        institution: 'Test University'
      };
      
      expect(isEducationValid(education)).toBe(true);
    });
    
    it('should return false if degree is missing', () => {
      const education = {
        institution: 'Test University'
      };
      
      expect(isEducationValid(education)).toBe(false);
    });
    
    it('should return false if institution is missing', () => {
      const education = {
        degree: 'B.Sc'
      };
      
      expect(isEducationValid(education)).toBe(false);
    });
  });
  
  describe('formatEducationDateRange', () => {
    it('should format date range with start and end dates', () => {
      const result = formatEducationDateRange('2018-09-01', '2022-06-30');
      expect(result).toBe('2018 - 2022');
    });
    
    it('should handle missing start date', () => {
      const result = formatEducationDateRange('', '2022-06-30');
      expect(result).toBe('Until 2022');
    });
    
    it('should handle missing end date', () => {
      const result = formatEducationDateRange('2018-09-01', '');
      expect(result).toBe('2018 - Present');
    });
    
    it('should return empty string if both dates are missing', () => {
      const result = formatEducationDateRange('', '');
      expect(result).toBe('');
    });
  });
  
  describe('calculateEducationDuration', () => {
    it('should calculate duration in years', () => {
      const duration = calculateEducationDuration('2018-09-01', '2022-06-30');
      expect(duration).toBeCloseTo(3.8, 1);
    });
    
    it('should return 0 if start date is missing', () => {
      const duration = calculateEducationDuration('', '2022-06-30');
      expect(duration).toBe(0);
    });
    
    it('should return 0 if end date is missing', () => {
      const duration = calculateEducationDuration('2018-09-01', '');
      expect(duration).toBe(0);
    });
  });
  
  describe('sortEducationByDate', () => {
    it('should sort education entries by end date (most recent first)', () => {
      const educationList = [
        { degree: 'B.Sc', institution: 'University A', endDate: '2018-06-30' },
        { degree: 'M.Sc', institution: 'University B', endDate: '2020-06-30' },
        { degree: 'Ph.D', institution: 'University C', endDate: '2023-06-30' }
      ];
      
      const sorted = sortEducationByDate(educationList);
      
      expect(sorted[0].degree).toBe('Ph.D');
      expect(sorted[1].degree).toBe('M.Sc');
      expect(sorted[2].degree).toBe('B.Sc');
    });
    
    it('should handle missing end dates by treating them as current', () => {
      const educationList = [
        { degree: 'B.Sc', institution: 'University A', endDate: '2018-06-30' },
        { degree: 'M.Sc', institution: 'University B', endDate: '' },
        { degree: 'Ph.D', institution: 'University C', endDate: '2023-06-30' }
      ];
      
      const sorted = sortEducationByDate(educationList);
      
      // M.Sc with missing end date should be considered current and come first
      expect(sorted[0].degree).toBe('M.Sc');
      expect(sorted[1].degree).toBe('Ph.D');
      expect(sorted[2].degree).toBe('B.Sc');
    });
  });
  
  describe('groupEducationByDegree', () => {
    it('should group education entries by degree type', () => {
      const educationList = [
        { degree: 'B.Sc', institution: 'University A' },
        { degree: 'B.Sc', institution: 'University B' },
        { degree: 'M.Sc', institution: 'University C' },
        { degree: 'Ph.D', institution: 'University D' }
      ];
      
      const grouped = groupEducationByDegree(educationList);
      
      expect(Object.keys(grouped).length).toBe(3);
      expect(grouped['B.Sc'].length).toBe(2);
      expect(grouped['M.Sc'].length).toBe(1);
      expect(grouped['Ph.D'].length).toBe(1);
    });
    
    it('should handle missing degree by grouping as Other', () => {
      const educationList = [
        { institution: 'University A' },
        { degree: 'B.Sc', institution: 'University B' }
      ];
      
      const grouped = groupEducationByDegree(educationList);
      
      expect(Object.keys(grouped).length).toBe(2);
      expect(grouped['Other'].length).toBe(1);
      expect(grouped['B.Sc'].length).toBe(1);
    });
  });
  
  describe('getHighestEducation', () => {
    it('should identify the highest level of education', () => {
      const educationList = [
        { degree: 'B.Sc', institution: 'University A', endDate: '2016-06-30' },
        { degree: 'M.Sc', institution: 'University B', endDate: '2018-06-30' },
        { degree: 'Certificate', institution: 'Training Center', endDate: '2020-06-30' }
      ];
      
      const highest = getHighestEducation(educationList);
      
      expect(highest.degree).toBe('M.Sc');
    });
    
    it('should use end date as tiebreaker for same level education', () => {
      const educationList = [
        { degree: 'B.Sc', institution: 'University A', endDate: '2016-06-30' },
        { degree: 'B.Tech', institution: 'University B', endDate: '2018-06-30' }
      ];
      
      const highest = getHighestEducation(educationList);
      
      expect(highest.degree).toBe('B.Tech');
      expect(highest.endDate).toBe('2018-06-30');
    });
    
    it('should return null for empty education list', () => {
      expect(getHighestEducation([])).toBeNull();
      expect(getHighestEducation(null)).toBeNull();
    });
  });
  
  describe('JSON conversion', () => {
    it('should convert education list to JSON and back', () => {
      const educationList = [
        {
          id: 'edu-1',
          degree: 'B.Sc',
          institution: 'University A',
          startDate: '2014-09-01',
          endDate: '2018-06-30'
        },
        {
          id: 'edu-2',
          degree: 'M.Sc',
          institution: 'University B',
          startDate: '2018-09-01',
          endDate: '2020-06-30'
        }
      ];
      
      const json = educationToJson(educationList);
      const restored = educationFromJson(json);
      
      expect(restored.length).toBe(2);
      expect(restored[0].id).toBe('edu-1');
      expect(restored[0].degree).toBe('B.Sc');
      expect(restored[1].id).toBe('edu-2');
      expect(restored[1].degree).toBe('M.Sc');
    });
    
    it('should return null for invalid JSON', () => {
      expect(educationFromJson('invalid json')).toBeNull();
    });
    
    it('should handle non-array data', () => {
      expect(educationFromJson('{"degree": "B.Sc"}')).toBeNull();
    });
  });
  
  describe('sampleEducation', () => {
    it('should have sample education data', () => {
      expect(sampleEducation).toBeDefined();
      expect(Array.isArray(sampleEducation)).toBe(true);
      expect(sampleEducation.length).toBeGreaterThan(0);
      
      const firstEntry = sampleEducation[0];
      expect(firstEntry.degree).toBe('B.E');
      expect(firstEntry.institution).toBe('The Aeronautical Society of lndia');
    });
  });
});
