# Profile Model Documentation

This document explains how to use the Profile model in the Interactive Portfolio Website application.

## Overview

The Profile model represents the basic personal and professional information of the portfolio owner. It's implemented according to the data structure defined in the data-model.md specification.

## Key Features

- Creation of profile instances with default or custom data
- Validation of required profile fields
- Formatting utilities for contact information and display names
- Conversion to/from JSON for data persistence

## Usage Examples

### Creating a Profile Instance

```javascript
import { createProfile } from './models/Profile';

// Create with default values
const defaultProfile = createProfile();

// Create with custom values
const customProfile = createProfile({
  name: 'Jane Doe',
  title: 'Full Stack Developer',
  contact: {
    email: 'jane@example.com',
    github: 'https://github.com/janedoe'
  }
});
```

### Validating a Profile

```javascript
import { isProfileValid } from './models/Profile';

// Check if profile has all required fields
if (isProfileValid(profile)) {
  // Profile is valid, proceed with rendering or storage
} else {
  // Handle invalid profile
  console.error('Profile is missing required fields');
}
```

### Formatting Contact Information

```javascript
import { formatContactLink } from './models/Profile';

// Create mailto: link
const emailLink = formatContactLink('email', profile.contact.email);

// Create tel: link (removes non-numeric characters)
const phoneLink = formatContactLink('phone', profile.contact.phone);
```

### Getting Social Media Links

```javascript
import { getSocialLinks } from './models/Profile';

// Get all available social media links
const socialLinks = getSocialLinks(profile);

// Render social links
socialLinks.forEach(link => {
  console.log(`${link.platform}: ${link.url}`);
});
```

### Formatting Display Names

```javascript
import { getFormattedName } from './models/Profile';

// Get first name and last initial (e.g., "John D.")
const shortName = getFormattedName(profile);
```

### Converting to/from JSON

```javascript
import { profileToJson, profileFromJson } from './models/Profile';

// Save profile to localStorage
const json = profileToJson(profile);
localStorage.setItem('profile', json);

// Load profile from localStorage
const savedJson = localStorage.getItem('profile');
const loadedProfile = profileFromJson(savedJson);
```

## Required Fields

For a profile to be considered valid, it must include:

- `name`: Full name
- `title`: Professional title
- `contact.email`: Email address

## Integration with Components

The Profile model is designed to be used with React components that need to display profile information. See the `ProfileCardExample.jsx` file for an example of how to integrate the model with a component.

## Best Practices

1. Always create profile instances using the `createProfile()` function to ensure proper defaults
2. Validate profiles with `isProfileValid()` before using them in critical operations
3. Use the formatting utilities for consistent display of profile information
4. When updating profile data, create a new instance rather than mutating an existing one
