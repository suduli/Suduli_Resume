/**
 * Tests for Projects model
 */
import {
  createProject,
  isProjectValid,
  sortProjects,
  filterProjectsBySearchTerm,
  filterProjectsByTechnology,
  getUniqueTechnologies,
  projectsFromJson,
  projectsToJson,
  sampleProjects
} from './Projects';

describe('Projects Model', () => {
  describe('createProject', () => {
    it('should create a project with all required fields', () => {
      const project = createProject({
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React', 'Node.js']
      });
      
      expect(project.title).toBe('Test Project');
      expect(project.description).toBe('A test project');
      expect(project.technologies).toEqual(['React', 'Node.js']);
      expect(project.id).toBeDefined();
    });
    
    it('should use provided id if available', () => {
      const project = createProject({
        id: 'test-id',
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React', 'Node.js']
      });
      
      expect(project.id).toBe('test-id');
    });
    
    it('should initialize optional arrays if not provided', () => {
      const project = createProject({
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React', 'Node.js']
      });
      
      expect(project.achievements).toEqual([]);
      expect(project.collaboration).toEqual([]);
      expect(project.links).toEqual([]);
    });
    
    it('should use provided optional arrays', () => {
      const achievements = ['Achievement 1', 'Achievement 2'];
      const collaboration = ['Team A', 'Team B'];
      const links = [
        { type: 'demo', url: 'https://example.com', label: 'Demo' }
      ];
      
      const project = createProject({
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React', 'Node.js'],
        achievements,
        collaboration,
        links
      });
      
      expect(project.achievements).toEqual(achievements);
      expect(project.collaboration).toEqual(collaboration);
      expect(project.links).toEqual(links);
    });
  });
  
  describe('isProjectValid', () => {
    it('should return true for valid projects', () => {
      const project = {
        title: 'Test Project',
        description: 'A test project',
        technologies: ['React', 'Node.js']
      };
      
      expect(isProjectValid(project)).toBe(true);
    });
    
    it('should return false if title is missing', () => {
      const project = {
        description: 'A test project',
        technologies: ['React', 'Node.js']
      };
      
      expect(isProjectValid(project)).toBe(false);
    });
    
    it('should return false if description is missing', () => {
      const project = {
        title: 'Test Project',
        technologies: ['React', 'Node.js']
      };
      
      expect(isProjectValid(project)).toBe(false);
    });
    
    it('should return false if technologies is missing', () => {
      const project = {
        title: 'Test Project',
        description: 'A test project'
      };
      
      expect(isProjectValid(project)).toBe(false);
    });
    
    it('should return false if technologies is empty', () => {
      const project = {
        title: 'Test Project',
        description: 'A test project',
        technologies: []
      };
      
      expect(isProjectValid(project)).toBe(false);
    });
  });
  
  describe('sortProjects', () => {
    const testProjects = [
      createProject({
        id: 'proj1',
        title: 'C Project',
        description: 'Description C',
        technologies: ['Tech1', 'Tech2', 'Tech3']
      }),
      createProject({
        id: 'proj2',
        title: 'A Project',
        description: 'Description A',
        technologies: ['Tech1']
      }),
      createProject({
        id: 'proj3',
        title: 'B Project',
        description: 'Description B',
        technologies: ['Tech1', 'Tech2']
      })
    ];
    
    it('should sort projects by title in ascending order by default', () => {
      const sorted = sortProjects(testProjects);
      expect(sorted[0].title).toBe('A Project');
      expect(sorted[1].title).toBe('B Project');
      expect(sorted[2].title).toBe('C Project');
    });
    
    it('should sort projects by title in descending order', () => {
      const sorted = sortProjects(testProjects, 'title', false);
      expect(sorted[0].title).toBe('C Project');
      expect(sorted[1].title).toBe('B Project');
      expect(sorted[2].title).toBe('A Project');
    });
    
    it('should sort projects by technologies count', () => {
      const sorted = sortProjects(testProjects, 'technologies', true);
      expect(sorted[0].id).toBe('proj2'); // 1 technology
      expect(sorted[1].id).toBe('proj3'); // 2 technologies
      expect(sorted[2].id).toBe('proj1'); // 3 technologies
    });
    
    it('should sort projects by technologies count in descending order', () => {
      const sorted = sortProjects(testProjects, 'technologies', false);
      expect(sorted[0].id).toBe('proj1'); // 3 technologies
      expect(sorted[1].id).toBe('proj3'); // 2 technologies
      expect(sorted[2].id).toBe('proj2'); // 1 technology
    });
  });
  
  describe('filterProjectsBySearchTerm', () => {
    const testProjects = [
      createProject({
        title: 'Web Application',
        description: 'A React web application',
        technologies: ['React', 'Node.js']
      }),
      createProject({
        title: 'Mobile App',
        description: 'A React Native mobile app',
        technologies: ['React Native', 'Firebase']
      }),
      createProject({
        title: 'Backend Service',
        description: 'A Node.js backend service',
        technologies: ['Node.js', 'Express', 'MongoDB']
      }),
      createProject({
        title: 'Testing Framework',
        description: 'A testing framework',
        technologies: ['Jest'],
        role: 'Lead Developer'
      })
    ];
    
    it('should return all projects if search term is empty', () => {
      const filtered = filterProjectsBySearchTerm(testProjects, '');
      expect(filtered.length).toBe(4);
    });
    
    it('should filter projects by title', () => {
      const filtered = filterProjectsBySearchTerm(testProjects, 'Web');
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Web Application');
    });
    
    it('should filter projects by description', () => {
      const filtered = filterProjectsBySearchTerm(testProjects, 'mobile');
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Mobile App');
    });
    
    it('should filter projects by technology', () => {
      const filtered = filterProjectsBySearchTerm(testProjects, 'Node');
      expect(filtered.length).toBe(2);
      expect(filtered.some(p => p.title === 'Web Application')).toBe(true);
      expect(filtered.some(p => p.title === 'Backend Service')).toBe(true);
    });
    
    it('should filter projects by role', () => {
      const filtered = filterProjectsBySearchTerm(testProjects, 'Lead');
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Testing Framework');
    });
    
    it('should be case insensitive', () => {
      const filtered = filterProjectsBySearchTerm(testProjects, 'react');
      expect(filtered.length).toBe(2);
    });
  });
  
  describe('filterProjectsByTechnology', () => {
    const testProjects = [
      createProject({
        title: 'Project 1',
        description: 'Description 1',
        technologies: ['React', 'Node.js', 'MongoDB']
      }),
      createProject({
        title: 'Project 2',
        description: 'Description 2',
        technologies: ['Angular', 'Node.js']
      }),
      createProject({
        title: 'Project 3',
        description: 'Description 3',
        technologies: ['Vue', 'Express']
      })
    ];
    
    it('should return all projects if technologies array is empty', () => {
      const filtered = filterProjectsByTechnology(testProjects, []);
      expect(filtered.length).toBe(3);
    });
    
    it('should filter projects by a single technology', () => {
      const filtered = filterProjectsByTechnology(testProjects, ['React']);
      expect(filtered.length).toBe(1);
      expect(filtered[0].title).toBe('Project 1');
    });
    
    it('should filter projects by multiple technologies (OR logic)', () => {
      const filtered = filterProjectsByTechnology(testProjects, ['React', 'Angular']);
      expect(filtered.length).toBe(2);
      expect(filtered.some(p => p.title === 'Project 1')).toBe(true);
      expect(filtered.some(p => p.title === 'Project 2')).toBe(true);
    });
    
    it('should return projects that have any of the specified technologies', () => {
      const filtered = filterProjectsByTechnology(testProjects, ['Node.js']);
      expect(filtered.length).toBe(2);
    });
  });
  
  describe('getUniqueTechnologies', () => {
    const testProjects = [
      createProject({
        title: 'Project 1',
        description: 'Description 1',
        technologies: ['React', 'Node.js', 'MongoDB']
      }),
      createProject({
        title: 'Project 2',
        description: 'Description 2',
        technologies: ['Angular', 'Node.js']
      }),
      createProject({
        title: 'Project 3',
        description: 'Description 3',
        technologies: ['Vue', 'Express', 'MongoDB']
      })
    ];
    
    it('should return all unique technologies sorted alphabetically', () => {
      const technologies = getUniqueTechnologies(testProjects);
      expect(technologies).toEqual(['Angular', 'Express', 'MongoDB', 'Node.js', 'React', 'Vue']);
    });
    
    it('should return empty array for projects without technologies', () => {
      const emptyProjects = [
        createProject({
          title: 'Project 1',
          description: 'Description 1',
          technologies: []
        }),
        createProject({
          title: 'Project 2',
          description: 'Description 2'
        })
      ];
      
      const technologies = getUniqueTechnologies(emptyProjects);
      expect(technologies).toEqual([]);
    });
  });
  
  describe('JSON conversion', () => {
    it('should convert projects to JSON and back', () => {
      const projects = [
        createProject({
          title: 'Project 1',
          description: 'Description 1',
          technologies: ['React', 'Node.js']
        }),
        createProject({
          title: 'Project 2',
          description: 'Description 2',
          technologies: ['Angular'],
          links: [
            { type: 'demo', url: 'https://example.com', label: 'Demo' }
          ]
        })
      ];
      
      const json = projectsToJson(projects);
      const restored = projectsFromJson(json);
      
      expect(restored.length).toBe(2);
      expect(restored[0].title).toBe('Project 1');
      expect(restored[1].title).toBe('Project 2');
      expect(restored[1].links).toHaveLength(1);
      expect(restored[1].links[0].type).toBe('demo');
    });
    
    it('should return null for invalid JSON', () => {
      const result = projectsFromJson('invalid json');
      expect(result).toBeNull();
    });
    
    it('should return null if JSON is not an array', () => {
      const result = projectsFromJson('{"key": "value"}');
      expect(result).toBeNull();
    });
  });
  
  describe('sampleProjects', () => {
    it('should have sample project data', () => {
      expect(sampleProjects).toBeInstanceOf(Array);
      expect(sampleProjects.length).toBeGreaterThan(0);
      expect(sampleProjects[0].title).toBe('BCM-Systems Validation');
    });
  });
});
