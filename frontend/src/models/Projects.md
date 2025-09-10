````markdown
# Projects Model Documentation

This document explains how to use the Projects model in the Interactive Portfolio Website application.

## Overview

The Projects model represents showcase projects with details and links, implementing the data structure defined in the data-model.md specification. The model includes functionality for creating, validating, sorting, and filtering project data.

## Key Features

- Creation of project entries with required and optional fields
- Validation of required project fields
- Sorting projects by various criteria
- Filtering projects by search term or technologies
- Extracting unique technologies from all projects
- JSON conversion for data persistence

## Usage Examples

### Creating Project Entries

```javascript
import { createProject } from './models/Projects';

// Create a new project entry
const project = createProject({
  title: 'Portfolio Website',
  description: 'Interactive portfolio website built with React',
  role: 'Lead Developer',
  achievements: [
    'Implemented responsive design',
    'Created interactive components'
  ],
  technologies: ['React', 'CSS', 'JavaScript'],
  collaboration: ['Worked with UI/UX designer'],
  image: '/assets/images/projects/portfolio.jpg',
  links: [
    { type: 'demo', url: 'https://example.com', label: 'Live Demo' },
    { type: 'github', url: 'https://github.com/user/repo', label: 'GitHub Repository' }
  ]
});

// Only required fields
const minimalProject = createProject({
  title: 'Minimal Project',
  description: 'A simple project',
  technologies: ['JavaScript']
});
```

### Validating Project Entries

```javascript
import { isProjectValid } from './models/Projects';

// Check if a project entry is valid
if (isProjectValid(project)) {
  // Valid - has all required fields
} else {
  // Invalid - missing required fields
}
```

### Sorting Projects

```javascript
import { sortProjects } from './models/Projects';

// Sort projects by title (ascending, default)
const sortedByTitle = sortProjects(projectsArray);

// Sort projects by title (descending)
const sortedByTitleDesc = sortProjects(projectsArray, 'title', false);

// Sort by number of technologies (ascending)
const sortedByTechCount = sortProjects(projectsArray, 'technologies', true);

// Sort by number of achievements (descending)
const sortedByAchievements = sortProjects(projectsArray, 'achievements', false);
```

### Filtering Projects

```javascript
import { filterProjectsBySearchTerm, filterProjectsByTechnology } from './models/Projects';

// Filter projects by search term (case-insensitive)
const searchResults = filterProjectsBySearchTerm(projectsArray, 'react');
// Returns projects containing "react" in title, description, technologies, role, or achievements

// Filter projects by technologies (projects with any of the specified technologies)
const reactProjects = filterProjectsByTechnology(projectsArray, ['React']);
const webProjects = filterProjectsByTechnology(projectsArray, ['React', 'Vue', 'Angular']);
```

### Getting Unique Technologies

```javascript
import { getUniqueTechnologies } from './models/Projects';

// Get all unique technologies across all projects
const technologies = getUniqueTechnologies(projectsArray);
// Returns sorted array of unique technologies, e.g., ['Angular', 'CSS', 'JavaScript', 'React', 'Vue']

// Useful for creating technology filter options
const technologyOptions = getUniqueTechnologies(projectsArray).map(tech => ({
  label: tech,
  value: tech
}));
```

### JSON Conversion

```javascript
import { projectsToJson, projectsFromJson } from './models/Projects';

// Convert to JSON for storage
const json = projectsToJson(projectsArray);
localStorage.setItem('projects', json);

// Load from storage
const storedJson = localStorage.getItem('projects');
const loadedProjects = projectsFromJson(storedJson);
```

## Required Fields

For a project entry to be considered valid, it must include:

- `title`: Project title
- `description`: Project description
- `technologies`: Array of technologies used (at least one technology)

## Project Links

Projects can include links to resources such as demos, repositories, or documentation:

```javascript
const projectWithLinks = createProject({
  title: 'Example Project',
  description: 'An example project with links',
  technologies: ['React'],
  links: [
    { type: 'demo', url: 'https://example.com/demo', label: 'Live Demo' },
    { type: 'github', url: 'https://github.com/user/repo', label: 'GitHub' },
    { type: 'docs', url: 'https://example.com/docs', label: 'Documentation' }
  ]
});
```

Common link types include:
- `demo`: Link to a live demo
- `github`: Link to GitHub repository
- `docs`: Link to documentation
- `video`: Link to video demo or presentation
- `article`: Link to related article or blog post

## Integration with Components

The Projects model is designed to be used with React components that display project portfolios. The model provides utilities for filtering and sorting projects to create dynamic user interfaces.

## Best Practices

1. Always create project entries using the `createProject()` function to ensure proper defaults for optional properties
2. Validate entries with `isProjectValid()` before using them in components
3. Use `filterProjectsBySearchTerm()` to implement search functionality
4. Use `filterProjectsByTechnology()` to implement technology filtering
5. Use `getUniqueTechnologies()` to generate filter options from available data
6. Use `sortProjects()` to allow users to sort projects by different criteria

````
