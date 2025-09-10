# Experience Model Documentation

This document explains how to use the Experience model in the Interactive Portfolio Website application.

## Overview

The Experience model represents professional work experience entries, implementing the data structure defined in the data-model.md specification. The model includes functionality for creating, validating, and formatting experience data.

## Key Features

- Creation of experience entries with required and optional fields
- Validation of required experience fields
- Date formatting and duration calculation utilities
- Sorting experience entries by date (newest first)
- Calculating total years of experience
- JSON conversion for data persistence

## Usage Examples

### Creating Experience Entries

```javascript
import { createExperience } from './models/Experience';

// Create a new experience entry
const experience = createExperience({
  company: 'ACME Corporation',
  position: 'Software Engineer',
  startDate: '2020-01-15',
  endDate: '2022-06-30',
  location: 'San Francisco, CA',
  description: 'Developed web applications using React and Node.js',
  highlights: ['Led development of customer-facing portal', 'Improved performance by 40%'],
  technologies: ['React', 'Node.js', 'MongoDB'],
  keywords: ['frontend', 'backend', 'web development'],
});

// Only required fields
const minimalExperience = createExperience({
  company: 'Startup Inc',
  position: 'Frontend Developer',
  startDate: '2018-06-01',
  description: 'Built UI components',
});
```

### Validating Experience Entries

```javascript
import { isExperienceValid } from './models/Experience';

// Check if an experience entry is valid
if (isExperienceValid(experience)) {
  // Valid - has all required fields
} else {
  // Invalid - missing required fields
}
```

### Formatting Dates

```javascript
import { formatDate } from './models/Experience';

// Format dates for display
const formattedStartDate = formatDate('2020-01-15', 'medium'); // e.g., "Jan 15, 2020"
const formattedEndDate = formatDate('present', 'medium'); // "Present"

// Different formats
const shortDate = formatDate('2020-01-15', 'short'); // e.g., "Jan 2020"
const longDate = formatDate('2020-01-15', 'long'); // e.g., "January 15, 2020"
```

### Calculating and Formatting Duration

```javascript
import { calculateDuration, formatDuration } from './models/Experience';

// Calculate duration between dates
const duration = calculateDuration('2020-01-15', '2022-06-30');
// Result: { years: 2, months: 5 }

// Format duration for display
const formattedDuration = formatDuration(duration);
// Result: "2 years, 5 months"

// Current role (ongoing)
const currentDuration = calculateDuration('2022-07-01', 'present');
const formattedCurrentDuration = formatDuration(currentDuration);
```

### Sorting Experiences

```javascript
import { sortExperiencesByDate } from './models/Experience';

// Sort experiences with newest first
const sortedExperiences = sortExperiencesByDate(experiencesArray);
// Current roles (endDate: "present") appear first
```

### Calculating Total Experience

```javascript
import { getTotalYearsExperience } from './models/Experience';

// Calculate total years of experience
const totalYears = getTotalYearsExperience(experiencesArray);
// Result: e.g., 7.5 (years)
```

### JSON Conversion

```javascript
import { experiencesToJson, experiencesFromJson } from './models/Experience';

// Convert to JSON for storage
const json = experiencesToJson(experiencesArray);
localStorage.setItem('experiences', json);

// Load from storage
const storedJson = localStorage.getItem('experiences');
const loadedExperiences = experiencesFromJson(storedJson);
```

## Required Fields

For an experience entry to be considered valid, it must include:

- `company`: Company or organization name
- `position`: Job title or position
- `startDate`: Start date in ISO format (YYYY-MM-DD)
- `description`: Brief description of the role

## Integration with Components

The Experience model is designed to be used with React components that display work history. The model provides formatting utilities to ensure consistent display of dates, durations, and other information.

## Best Practices

1. Always create experience entries using the `createExperience()` function to ensure proper defaults for optional properties
2. Validate entries with `isExperienceValid()` before using them in components
3. Use `formatDate()` and `formatDuration()` for consistent display of temporal information
4. Sort experiences with `sortExperiencesByDate()` to ensure newest entries appear first
5. When displaying a timeline, use `calculateDuration()` to show the duration of each position
