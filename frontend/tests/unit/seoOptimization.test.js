/**
 * Tests for SEO Optimization Utility
 * Part of task T059 - Implement SEO optimizations
 */

import {
  generatePersonStructuredData,
  generateProjectStructuredData,
  generateMetaTags,
  updateMetaTags,
  generateSitemap,
  addStructuredData,
  optimizeHeadingStructure,
  ensureImagesHaveAltText,
  initSEO
} from '../../src/utils/seoOptimization';

// Mock document
let documentHead;
let documentTitle;
let documentSelectors;

// Mock profile data
const mockProfile = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  website: 'https://johndoe.com',
  avatar: '/images/john-doe.jpg',
  email: 'john@example.com',
  phone: '+1234567890',
  summary: 'Experienced developer with 10+ years of experience',
  linkedIn: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  socialLinks: [
    { name: 'Medium', url: 'https://medium.com/@johndoe' }
  ],
  currentCompany: 'Tech Solutions Inc.',
  skills: [
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'Node.js' }
  ]
};

// Mock project data
const mockProject = {
  title: 'Portfolio Website',
  description: 'Interactive portfolio website built with React',
  repoUrl: 'https://github.com/johndoe/portfolio',
  startDate: '2023-01-01',
  endDate: '2023-02-15',
  technologies: ['React', 'JavaScript', 'CSS'],
  liveUrl: 'https://portfolio.johndoe.com',
  authorName: 'John Doe',
  thumbnail: '/images/portfolio-thumbnail.jpg'
};

// Mock site info
const mockSiteInfo = {
  name: 'John Doe Portfolio',
  url: 'https://johndoe.com',
  description: 'Personal portfolio of John Doe, Full Stack Developer',
  profile: mockProfile
};

describe('SEO Optimization Utility', () => {
  beforeEach(() => {
    // Mock document head
    documentHead = [];
    documentTitle = '';
    documentSelectors = {};
    
    // Mock document methods
    global.document = {
      head: {
        appendChild: jest.fn(element => {
          documentHead.push(element);
          return element;
        })
      },
      querySelector: jest.fn(selector => {
        return documentSelectors[selector] || null;
      }),
      querySelectorAll: jest.fn(selector => {
        return documentSelectors[selector] || [];
      }),
      createElement: jest.fn(tagName => {
        const element = {
          tagName,
          attributes: {},
          dataset: {},
          setAttribute: (name, value) => {
            element.attributes[name] = value;
          },
          getAttribute: name => element.attributes[name],
          remove: () => {}
        };
        
        if (tagName === 'script') {
          element.type = '';
          element.textContent = '';
        }
        
        if (tagName === 'link') {
          element.rel = '';
          element.href = '';
        }
        
        if (tagName === 'meta') {
          element.content = '';
        }
        
        return element;
      })
    };
    
    // Mock document.title
    Object.defineProperty(global.document, 'title', {
      get: () => documentTitle,
      set: (value) => {
        documentTitle = value;
      }
    });
    
    // Mock console methods
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('generatePersonStructuredData', () => {
    test('generates correct person structured data', () => {
      const result = generatePersonStructuredData(mockProfile);
      
      expect(result['@context']).toBe('https://schema.org');
      expect(result['@type']).toBe('Person');
      expect(result.name).toBe(mockProfile.name);
      expect(result.jobTitle).toBe(mockProfile.title);
      expect(result.skills).toBe('JavaScript, React, Node.js');
      expect(result.sameAs).toContain(mockProfile.github);
      expect(result.worksFor['@type']).toBe('Organization');
      expect(result.worksFor.name).toBe(mockProfile.currentCompany);
    });
  });
  
  describe('generateProjectStructuredData', () => {
    test('generates correct project structured data', () => {
      const result = generateProjectStructuredData(mockProject);
      
      expect(result['@context']).toBe('https://schema.org');
      expect(result['@type']).toBe('SoftwareSourceCode');
      expect(result.name).toBe(mockProject.title);
      expect(result.description).toBe(mockProject.description);
      expect(result.programmingLanguage).toBe('React, JavaScript, CSS');
      expect(result.author['@type']).toBe('Person');
      expect(result.author.name).toBe(mockProject.authorName);
    });
  });
  
  describe('generateMetaTags', () => {
    test('generates correct meta tags for a page', () => {
      const pageInfo = {
        title: 'Projects',
        description: 'View my latest projects',
        path: '/projects',
        image: '/images/projects.jpg'
      };
      
      const result = generateMetaTags(pageInfo, mockSiteInfo);
      
      expect(result.title).toBe('Projects | John Doe Portfolio');
      expect(result.description).toBe(pageInfo.description);
      expect(result['og:title']).toBe(pageInfo.title);
      expect(result['og:image']).toBe(`${mockSiteInfo.url}${pageInfo.image}`);
      expect(result['twitter:card']).toBe('summary_large_image');
      expect(result.canonical).toBe(`${mockSiteInfo.url}${pageInfo.path}`);
    });
    
    test('handles missing image correctly', () => {
      const pageInfo = {
        title: 'Contact',
        description: 'Get in touch with me',
        path: '/contact'
      };
      
      const result = generateMetaTags(pageInfo, mockSiteInfo);
      
      expect(result['og:image']).toBeUndefined();
      expect(result['twitter:card']).toBe('summary');
      expect(result['twitter:image']).toBeUndefined();
    });
  });
  
  describe('updateMetaTags', () => {
    test('updates existing meta tags', () => {
      // Mock existing meta tag
      const mockDescriptionMeta = {
        getAttribute: jest.fn().mockReturnValue('description'),
        setAttribute: jest.fn()
      };
      
      documentSelectors['meta[name="description"]'] = mockDescriptionMeta;
      
      // Run function
      updateMetaTags({
        title: 'New Title',
        description: 'New description'
      });
      
      // Verify updates
      expect(documentTitle).toBe('New Title');
      expect(mockDescriptionMeta.setAttribute).toHaveBeenCalledWith('content', 'New description');
    });
    
    test('creates new meta tags when they do not exist', () => {
      // Mock meta creation
      const mockMetaElement = {
        setAttribute: jest.fn()
      };
      
      document.createElement.mockReturnValue(mockMetaElement);
      
      // Run function
      updateMetaTags({
        'og:title': 'OG Title',
        'twitter:description': 'Twitter description'
      });
      
      // Verify document.head.appendChild was called for new meta tags
      expect(document.createElement).toHaveBeenCalledWith('meta');
      expect(document.head.appendChild).toHaveBeenCalled();
    });
    
    test('updates canonical link', () => {
      // Mock canonical link
      const mockCanonicalLink = {
        href: 'https://example.com/old',
        getAttribute: jest.fn().mockReturnValue('canonical'),
        setAttribute: jest.fn()
      };
      
      documentSelectors['link[rel=\'canonical\']'] = mockCanonicalLink;
      
      // Run function
      updateMetaTags({
        canonical: 'https://example.com/new'
      });
      
      // Verify canonical link is updated
      expect(mockCanonicalLink.href).toBe('https://example.com/new');
    });
  });
  
  describe('generateSitemap', () => {
    test('generates correct sitemap XML', () => {
      const pages = [
        { url: '/', lastmod: '2023-01-01', changefreq: 'weekly', priority: '1.0' },
        { url: '/projects', lastmod: '2023-01-15', changefreq: 'monthly', priority: '0.8' },
        { url: '/contact' } // Missing optional fields
      ];
      
      const result = generateSitemap(pages, 'https://johndoe.com');
      
      // Check basic structure
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      
      // Check first page with all fields
      expect(result).toContain('<loc>https://johndoe.com/</loc>');
      expect(result).toContain('<lastmod>2023-01-01</lastmod>');
      expect(result).toContain('<changefreq>weekly</changefreq>');
      expect(result).toContain('<priority>1.0</priority>');
      
      // Check page with default values
      expect(result).toContain('<loc>https://johndoe.com/contact</loc>');
      expect(result).toContain('<changefreq>monthly</changefreq>'); // Default
      expect(result).toContain('<priority>0.8</priority>'); // Default
    });
  });
  
  describe('addStructuredData', () => {
    test('adds structured data script to document head', () => {
      const structuredData = {
        '@type': 'Person',
        name: 'John Doe'
      };
      
      addStructuredData(structuredData);
      
      // Verify script was created and added to head
      expect(document.createElement).toHaveBeenCalledWith('script');
      expect(document.head.appendChild).toHaveBeenCalled();
      
      // Get the created script element
      const scriptElement = documentHead.find(el => el.tagName === 'script');
      
      expect(scriptElement.type).toBe('application/ld+json');
      expect(scriptElement.dataset.type).toBe('Person');
      expect(scriptElement.textContent).toBe(JSON.stringify(structuredData));
    });
    
    test('removes existing structured data of same type', () => {
      // Mock existing script
      const mockRemove = jest.fn();
      const mockExistingScript = {
        remove: mockRemove
      };
      
      documentSelectors['script[type="application/ld+json"][data-type="Person"]'] = mockExistingScript;
      
      // Add new structured data
      addStructuredData({
        '@type': 'Person',
        name: 'John Doe'
      });
      
      // Verify existing script was removed
      expect(mockRemove).toHaveBeenCalled();
    });
  });
  
  describe('optimizeHeadingStructure', () => {
    test('warns about multiple H1 elements', () => {
      // Mock multiple H1 elements
      documentSelectors['h1'] = [
        { tagName: 'H1' },
        { tagName: 'H1' }
      ];
      
      optimizeHeadingStructure();
      
      expect(console.warn).toHaveBeenCalledWith('Multiple H1 elements detected. This may impact SEO.');
    });
    
    test('warns about skipped heading levels', () => {
      // Mock headings with skipped levels
      documentSelectors['h1, h2, h3, h4, h5, h6'] = [
        { tagName: 'H1' },
        { tagName: 'H3' } // Skipped H2
      ];
      
      optimizeHeadingStructure();
      
      expect(console.warn).toHaveBeenCalledWith('Heading hierarchy issue: H1 followed by H3. Consider adding H2 in between.');
    });
    
    test('does not warn when heading structure is correct', () => {
      // Mock correct heading structure
      documentSelectors['h1, h2, h3, h4, h5, h6'] = [
        { tagName: 'H1' },
        { tagName: 'H2' },
        { tagName: 'H2' },
        { tagName: 'H3' }
      ];
      
      documentSelectors['h1'] = [{ tagName: 'H1' }];
      
      optimizeHeadingStructure();
      
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
  
  describe('ensureImagesHaveAltText', () => {
    test('adds alt text to images without it', () => {
      // Mock images without alt text
      const mockSetAttribute = jest.fn();
      const mockImages = [
        { 
          src: 'image1.jpg',
          alt: '',
          setAttribute: mockSetAttribute
        },
        {
          src: 'image2.jpg',
          alt: '',
          setAttribute: mockSetAttribute
        }
      ];
      
      documentSelectors['img:not([alt])'] = mockImages;
      
      ensureImagesHaveAltText('Custom default alt');
      
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(mockImages[0].alt).toBe('Custom default alt');
      expect(mockImages[1].alt).toBe('Custom default alt');
    });
    
    test('uses default alt text when none provided', () => {
      // Mock image without alt text
      const mockImage = {
        src: 'image.jpg',
        alt: '',
        setAttribute: jest.fn()
      };
      
      documentSelectors['img:not([alt])'] = [mockImage];
      
      ensureImagesHaveAltText();
      
      expect(mockImage.alt).toBe('Portfolio image');
    });
  });
  
  describe('initSEO', () => {
    test('initializes all SEO optimizations', () => {
      // Mock functions
      const mockOptimizeHeadingStructure = jest.fn();
      const mockEnsureImagesHaveAltText = jest.fn();
      const mockUpdateMetaTags = jest.fn();
      const mockAddStructuredData = jest.fn();
      
      // Replace actual functions with mocks
      global.optimizeHeadingStructure = mockOptimizeHeadingStructure;
      global.ensureImagesHaveAltText = mockEnsureImagesHaveAltText;
      global.updateMetaTags = mockUpdateMetaTags;
      global.addStructuredData = mockAddStructuredData;
      
      // Execute
      initSEO(mockSiteInfo);
      
      // Verify all functions are called
      expect(optimizeHeadingStructure).toHaveBeenCalled();
      expect(ensureImagesHaveAltText).toHaveBeenCalled();
    });
  });
});
