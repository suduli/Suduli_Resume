/**
 * Tests for Profile model
 */
import {
  createProfile,
  defaultProfile,
  isProfileValid,
  getFormattedName,
  getSocialLinks,
  formatContactLink,
  profileFromJson,
  profileToJson
} from './Profile';

describe('Profile Model', () => {
  describe('createProfile', () => {
    it('should create a profile with default values when no data provided', () => {
      const profile = createProfile();
      expect(profile).toEqual(defaultProfile);
    });

    it('should override default values with provided data', () => {
      const customData = {
        name: 'John Doe',
        title: 'Software Engineer',
        contact: {
          email: 'john@example.com'
        }
      };
      
      const profile = createProfile(customData);
      
      expect(profile.name).toBe('John Doe');
      expect(profile.title).toBe('Software Engineer');
      expect(profile.contact.email).toBe('john@example.com');
      
      // Should keep default values for properties not specified
      expect(profile.contact.github).toBe(defaultProfile.contact.github);
      expect(profile.location).toBe(defaultProfile.location);
    });
    
    it('should handle nested contact object properly', () => {
      const customData = {
        contact: {
          email: 'test@example.com',
          phone: '123-456-7890'
        }
      };
      
      const profile = createProfile(customData);
      
      expect(profile.contact.email).toBe('test@example.com');
      expect(profile.contact.phone).toBe('123-456-7890');
      expect(profile.contact.linkedIn).toBe(defaultProfile.contact.linkedIn);
      expect(profile.contact.github).toBe(defaultProfile.contact.github);
    });
  });

  describe('isProfileValid', () => {
    it('should return true for valid profiles', () => {
      const validProfile = {
        name: 'John Doe',
        title: 'Developer',
        contact: {
          email: 'john@example.com'
        }
      };
      
      expect(isProfileValid(validProfile)).toBe(true);
    });
    
    it('should return false if name is missing', () => {
      const invalidProfile = {
        title: 'Developer',
        contact: {
          email: 'john@example.com'
        }
      };
      
      expect(isProfileValid(invalidProfile)).toBe(false);
    });
    
    it('should return false if title is missing', () => {
      const invalidProfile = {
        name: 'John Doe',
        contact: {
          email: 'john@example.com'
        }
      };
      
      expect(isProfileValid(invalidProfile)).toBe(false);
    });
    
    it('should return false if email is missing', () => {
      const invalidProfile = {
        name: 'John Doe',
        title: 'Developer',
        contact: {}
      };
      
      expect(isProfileValid(invalidProfile)).toBe(false);
    });
    
    it('should return false if contact object is missing', () => {
      const invalidProfile = {
        name: 'John Doe',
        title: 'Developer'
      };
      
      expect(isProfileValid(invalidProfile)).toBe(false);
    });
  });

  describe('getFormattedName', () => {
    it('should format full name to first name and last initial', () => {
      const profile = {
        name: 'John Smith Doe'
      };
      
      expect(getFormattedName(profile)).toBe('John D.');
    });
    
    it('should return full name if only one word', () => {
      const profile = {
        name: 'John'
      };
      
      expect(getFormattedName(profile)).toBe('John');
    });
    
    it('should return empty string if name is missing', () => {
      const profile = {};
      
      expect(getFormattedName(profile)).toBe('');
    });
  });

  describe('getSocialLinks', () => {
    it('should return all available social links', () => {
      const profile = {
        contact: {
          linkedIn: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe'
        }
      };
      
      const links = getSocialLinks(profile);
      
      expect(links).toHaveLength(2);
      expect(links[0]).toEqual({
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/johndoe',
        icon: 'linkedin'
      });
      expect(links[1]).toEqual({
        platform: 'GitHub',
        url: 'https://github.com/johndoe',
        icon: 'github'
      });
    });
    
    it('should return only available links', () => {
      const profile = {
        contact: {
          github: 'https://github.com/johndoe'
        }
      };
      
      const links = getSocialLinks(profile);
      
      expect(links).toHaveLength(1);
      expect(links[0]).toEqual({
        platform: 'GitHub',
        url: 'https://github.com/johndoe',
        icon: 'github'
      });
    });
    
    it('should return empty array if no social links available', () => {
      const profile = {
        contact: {}
      };
      
      const links = getSocialLinks(profile);
      
      expect(links).toHaveLength(0);
    });
  });

  describe('formatContactLink', () => {
    it('should format email link correctly', () => {
      expect(formatContactLink('email', 'john@example.com')).toBe('mailto:john@example.com');
    });
    
    it('should format phone link correctly by removing non-numeric characters', () => {
      expect(formatContactLink('phone', '(123) 456-7890')).toBe('tel:1234567890');
    });
    
    it('should preserve plus sign in phone numbers', () => {
      expect(formatContactLink('phone', '+1 (123) 456-7890')).toBe('tel:+11234567890');
    });
    
    it('should return original value for unknown types', () => {
      expect(formatContactLink('unknown', 'some-value')).toBe('some-value');
    });
    
    it('should return empty string for empty values', () => {
      expect(formatContactLink('email', '')).toBe('');
      expect(formatContactLink('phone', null)).toBe('');
      expect(formatContactLink('phone', undefined)).toBe('');
    });
  });

  describe('JSON conversion', () => {
    it('should convert profile to JSON and back', () => {
      const originalProfile = createProfile({
        name: 'Test User',
        title: 'Tester'
      });
      
      const json = profileToJson(originalProfile);
      const restoredProfile = profileFromJson(json);
      
      expect(restoredProfile).toEqual(originalProfile);
    });
    
    it('should return null for invalid JSON', () => {
      const invalidJson = '{name: "Test"'; // Missing closing brace
      
      const result = profileFromJson(invalidJson);
      
      expect(result).toBeNull();
    });
  });
});
