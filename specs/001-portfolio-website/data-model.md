# Data Model: Interactive Portfolio Website

This document defines the data structures and relationships for the portfolio website. The data will be stored in JSON format to facilitate easy updates and maintenance.

## Core Entities

### Profile
Represents the basic personal and professional information.

```json
{
  "name": "Suduli Kumar Balabantaray",
  "title": "Embedded Test Engineer",
  "location": "Bengaluru, India",
  "contact": {
    "email": "suduli.office@gmail.com",
    "phone": "+91 9500097614",
    "linkedIn": "https://www.linkedin.com/in/suduli/",
    "github": "https://github.com/suduli"
  },
  "about": "Experienced professional with 7+ years in Independent Verification & Validation for Critical Systems in the automotive domain...",
  "photo": "/assets/images/profile.jpg",
  "objective": "To work in a professional atmosphere that would give a scope to display my skills request for a challenging position. Where I can use my skills to grow me and my organization."
}
```

### Experience
Represents professional work experience entries.

```json
[
  {
    "id": "exp-1",
    "company": "KPIT Technologies Ltd",
    "position": "Test Lead",
    "startDate": "2023-11-01",
    "endDate": "present",
    "location": "Bengaluru, India",
    "description": "Leading validation and testing efforts for automotive systems",
    "highlights": [
      "Developed and managed validation plans using IBM ALM with traceability to requirements from DOORS® Next Generation (DNG)",
      "Conducted Sanity, Manual, Functional Testing Performance Testing and Automated testing using dSPACE and ECU-Test Tool",
      "Oversaw validation of features like infotainment system like Steering Wheel Controls, Horn, and Crash detection in system",
      "Collaborated with cross-functional teams and provided regular project updates to stakeholders",
      "Identified, tracked, and resolved Dev issues with timely fixes and retesting"
    ],
    "technologies": ["IBM ALM", "DOORS Next Generation", "dSPACE", "ECU-Test Tool"],
    "keywords": ["validation", "testing", "automotive", "infotainment"]
  },
  {
    "id": "exp-2",
    "company": "HL Klemove India Pvt Ltd (Halla Group)",
    "position": "Specialist Embedded Test Engineer",
    "startDate": "2022-02-01",
    "endDate": "2023-11-01",
    "location": "Bengaluru, India",
    "description": "Specialized in embedded systems testing and validation",
    "highlights": [
      "Test Development: Design and execute test plans for embedded systems, both manually and using automation",
      "ECU Management: Utilize Trace32 for ECU flashing and validate firmware/software updates on embedded hardware",
      "Environment Setup: Establish a Zero DTC environment with ADAS Analyser and maintain comprehensive test environments",
      "Collaboration: Work with developers, product managers, and the development team to ensure system requirements are met and defects are addressed",
      "Defect Management: Identify and track system defects, maintaining a database of known issues and resolutions"
    ],
    "technologies": ["Trace32", "ADAS Analyser", "Embedded Systems", "ECU"],
    "keywords": ["embedded", "testing", "ECU", "ADAS"]
  },
  {
    "id": "exp-3",
    "company": "Mando Softtech India Pvt Ltd (Halla Group)",
    "position": "Senior Embedded Test Engineer",
    "startDate": "2020-03-01",
    "endDate": "2022-02-01",
    "location": "Bengaluru, India",
    "description": "Advanced testing for embedded automotive systems",
    "highlights": [
      "Unit Testing: Designed, implemented, and executed unit tests for software components using VectorCAST, ensuring each function met design specifications",
      "Defect Management: Identified, logged, and tracked system defects, maintaining a record at the unit level",
      "Utilized VectorCAST to achieve desired code coverage, identifying untested code areas and addressing them",
      "Integration Testing: Designed tests for software module integration, ensuring seamless functionality and validating integration with external systems",
      "Project Management: Handled estimation, work allocation, and reviews. Set up MC/DC, identified bugs, and participated in peer reviews"
    ],
    "technologies": ["VectorCAST", "MC/DC", "Unit Testing", "Integration Testing"],
    "keywords": ["embedded", "testing", "automotive", "code coverage"]
  },
  {
    "id": "exp-4",
    "company": "Binsoft Techno Solutions",
    "position": "Test Engineer",
    "startDate": "2017-09-01",
    "endDate": "2020-02-01",
    "location": "Bengaluru, India",
    "description": "Testing and quality assurance for software applications",
    "highlights": [
      "Unit Testing: Designed, implemented, and executed unit tests for software components using VectorCAST, ensuring each function met design specifications",
      "Defect Management: Identified, logged, and tracked system defects, maintaining a record at the unit level",
      "Code Coverage: Utilized VectorCAST to achieve desired code coverage, identifying untested code areas"
    ],
    "technologies": ["VectorCAST", "Unit Testing", "Code Coverage"],
    "keywords": ["testing", "defect management", "code coverage"]
  }
]
```

### Projects
Represents showcase projects with details and links.

```json
[
  {
    "id": "proj-1",
    "title": "BCM-Systems Validation",
    "description": "Automotive software validation for Stellantis OEM, focusing on safety-critical Infotainment embedded systems including steering controls, crash detection, and vehicle lighting. Implemented end-to-end testing processes from requirement analysis to automated validation.",
    "role": "Lead Tester",
    "achievements": [
      "Spearheaded manual/automated testing of ECU software using dSPACE environments",
      "Reduced manual testing by 40% via optimized test scripts and ECU-Test automation",
      "Achieved 95% requirement traceability using IBM RQM/DNG integration",
      "Created reusable XAM signal mapping files, cutting test setup time by 30%",
      "Led debugging of 200+ defects across critical features (Drive Mode, crash detection)"
    ],
    "technologies": ["IBM RQM", "DOORS DNG", "ECU-Test", "dSPACE", "XAM signal mapping"],
    "collaboration": [
      "Partnered with Stellantis engineers, developers, and integration teams",
      "Coordinated with cross-functional teams for requirement reviews and defect resolution"
    ],
    "image": "/assets/images/projects/bcm-validation.jpg",
    "links": []
  },
  {
    "id": "proj-2",
    "title": "DCU 20 (Domain Control Unit)",
    "description": "Centralized ADAS domain controller (DCU) designed to process data from various vehicle sensors, including cameras and radars. Centralization approach simplifies the architecture, reduces costs, and enhances scalability and software updates. Eliminated the need for individual ECUs for each function.",
    "role": "Point of Contact (POC)",
    "achievements": [
      "Successfully conducted System Testing including EOL, Failsafe, and USM Testing"
    ],
    "technologies": ["Canoe", "VtestStudio", "ADAS Analyser", "Trace32", "Jira", "CAPL", "Python"],
    "collaboration": [
      "Collaborated closely with developers to prepare software demos for the HKMC client",
      "Worked onsite at the Korea Head Office"
    ],
    "environment": "Zero DTC Environment, Windows 10",
    "image": "/assets/images/projects/dcu20.jpg",
    "links": []
  },
  {
    "id": "proj-3",
    "title": "CAnalyzerAI",
    "description": "An AI-powered tool for analyzing CAN bus data in automotive systems",
    "role": "Developer",
    "technologies": ["AI/ML", "CAN Protocol", "JavaScript", "Python"],
    "image": "/assets/images/projects/canalyzerai.jpg",
    "links": [
      {
        "type": "demo",
        "url": "https://suduli.github.io/CAnalyzerAI/",
        "label": "Live Demo"
      },
      {
        "type": "github",
        "url": "https://github.com/suduli/CAnalyzerAI",
        "label": "GitHub Repository"
      }
    ]
  },
  {
    "id": "proj-4",
    "title": "AI-ASIL-Analyser",
    "description": "Tool for analyzing Automotive Safety Integrity Level (ASIL) using AI techniques",
    "role": "Developer",
    "technologies": ["AI/ML", "Automotive Safety", "ISO 26262", "JavaScript", "Python"],
    "image": "/assets/images/projects/ai-asil-analyser.jpg",
    "links": [
      {
        "type": "demo",
        "url": "https://suduli.github.io/AI-ASIL-Analyser/",
        "label": "Live Demo"
      },
      {
        "type": "github",
        "url": "https://github.com/suduli/AI-ASIL-Analyser",
        "label": "GitHub Repository"
      }
    ]
  }
]
```

### Skills
Represents technical and professional skills with proficiency levels.

```json
{
  "categories": [
    {
      "name": "Programming & Scripting",
      "skills": [
        { "name": "Embedded C", "level": 90, "yearsExperience": 7 },
        { "name": "Python", "level": 85, "yearsExperience": 5 },
        { "name": "CAPL", "level": 90, "yearsExperience": 6 }
      ]
    },
    {
      "name": "Testing & QA",
      "skills": [
        { "name": "Functional Testing", "level": 95, "yearsExperience": 7 },
        { "name": "Performance Testing", "level": 90, "yearsExperience": 7 },
        { "name": "White Box Testing", "level": 85, "yearsExperience": 7 },
        { "name": "Black Box Testing", "level": 95, "yearsExperience": 7 },
        { "name": "Infotainment Testing", "level": 90, "yearsExperience": 5 },
        { "name": "System Testing", "level": 95, "yearsExperience": 7 },
        { "name": "Unit Testing", "level": 90, "yearsExperience": 7 },
        { "name": "Integration Testing", "level": 90, "yearsExperience": 7 },
        { "name": "Regression Testing", "level": 95, "yearsExperience": 7 }
      ]
    },
    {
      "name": "Tools & Technologies",
      "skills": [
        { "name": "RQM", "level": 85, "yearsExperience": 6 },
        { "name": "RTC", "level": 85, "yearsExperience": 6 },
        { "name": "DOORS", "level": 90, "yearsExperience": 6 },
        { "name": "RHAPSODY", "level": 80, "yearsExperience": 5 },
        { "name": "CLEAR QUEST", "level": 75, "yearsExperience": 4 },
        { "name": "EWM", "level": 80, "yearsExperience": 5 },
        { "name": "ECU TEST Tool", "level": 95, "yearsExperience": 5 },
        { "name": "Dspace", "level": 90, "yearsExperience": 5 },
        { "name": "CANalyzer", "level": 95, "yearsExperience": 6 },
        { "name": "CANdb", "level": 90, "yearsExperience": 6 },
        { "name": "CANdela", "level": 85, "yearsExperience": 5 },
        { "name": "CANoe", "level": 95, "yearsExperience": 6 },
        { "name": "VectorCast", "level": 90, "yearsExperience": 6 },
        { "name": "VtestStudio", "level": 85, "yearsExperience": 5 },
        { "name": "Trace32", "level": 90, "yearsExperience": 5 },
        { "name": "Understand C", "level": 85, "yearsExperience": 6 },
        { "name": "Jira", "level": 90, "yearsExperience": 5 }
      ]
    },
    {
      "name": "Protocols & Standards",
      "skills": [
        { "name": "CAN (ISO-11898)", "level": 95, "yearsExperience": 7 },
        { "name": "UDS (ISO-14229)", "level": 90, "yearsExperience": 6 },
        { "name": "AUTOSAR", "level": 85, "yearsExperience": 5 },
        { "name": "XCP", "level": 80, "yearsExperience": 4 },
        { "name": "ISO-26262", "level": 90, "yearsExperience": 6 }
      ]
    },
    {
      "name": "Software Development",
      "skills": [
        { "name": "SDLC", "level": 90, "yearsExperience": 7 },
        { "name": "STLC", "level": 95, "yearsExperience": 7 },
        { "name": "Bug Life Cycle", "level": 95, "yearsExperience": 7 }
      ]
    }
  ]
}
```

### Education
Represents educational qualifications.

```json
[
  {
    "degree": "B.E",
    "institution": "The Aeronautical Society of lndia",
    "startDate": "",
    "endDate": "",
    "location": "India",
    "description": "",
    "achievements": []
  }
]
```

### Awards
Represents professional achievements and recognitions.

```json
[
  {
    "title": "Best project award in LRR25",
    "issuer": "",
    "date": "",
    "description": ""
  },
  {
    "title": "Best project award in MRR30",
    "issuer": "",
    "date": "",
    "description": ""
  },
  {
    "title": "Spotlight Award",
    "issuer": "HL Mando Softtech India",
    "date": "",
    "description": ""
  },
  {
    "title": "Spotlight Award",
    "issuer": "HL Klemove India",
    "date": "",
    "description": ""
  }
]
```

### Languages
Represents language proficiencies.

```json
[
  {
    "name": "English",
    "proficiency": "Fluent"
  },
  {
    "name": "Hindi",
    "proficiency": "Fluent"
  }
]
```

### Theme Preferences
Represents theme-related settings and preferences.

```json
{
  "themes": [
    {
      "id": "light",
      "name": "Light Theme",
      "isDefault": true,
      "colors": {
        "primary": "#0050ff",
        "secondary": "#00c8ff",
        "accent": "#6600ff",
        "background": "#ffffff",
        "surface": "#f8f9fa",
        "text": "#212529",
        "textSecondary": "#6c757d",
        "border": "#dee2e6",
        "shadow": "rgba(0, 0, 0, 0.1)",
        "success": "#28a745",
        "warning": "#ffc107",
        "error": "#dc3545",
        "info": "#17a2b8"
      },
      "fonts": {
        "heading": "'Orbitron', sans-serif",
        "body": "'Roboto', sans-serif",
        "code": "'Fira Code', monospace"
      },
      "animations": {
        "particleColor": "#0050ff",
        "particleOpacity": 0.6,
        "backgroundGradient": "linear-gradient(120deg, #f8f9fa, #e9ecef)",
        "cardGlow": "rgba(0, 80, 255, 0.15)"
      }
    },
    {
      "id": "dark",
      "name": "Dark Theme",
      "isDefault": false,
      "colors": {
        "primary": "#00c8ff",
        "secondary": "#0050ff",
        "accent": "#bb00ff",
        "background": "#121212",
        "surface": "#1e1e1e",
        "text": "#f8f9fa",
        "textSecondary": "#adb5bd",
        "border": "#343a40",
        "shadow": "rgba(0, 0, 0, 0.25)",
        "success": "#28a745",
        "warning": "#ffc107",
        "error": "#dc3545",
        "info": "#17a2b8"
      },
      "fonts": {
        "heading": "'Orbitron', sans-serif",
        "body": "'Roboto', sans-serif",
        "code": "'Fira Code', monospace"
      },
      "animations": {
        "particleColor": "#00c8ff",
        "particleOpacity": 0.8,
        "backgroundGradient": "linear-gradient(120deg, #121212, #0a0a0a)",
        "cardGlow": "rgba(0, 200, 255, 0.25)"
      }
    },
    {
      "id": "cyberpunk",
      "name": "Cyberpunk",
      "isDefault": false,
      "colors": {
        "primary": "#00ffd5",
        "secondary": "#ff00aa",
        "accent": "#ffff00",
        "background": "#0a0a16",
        "surface": "#141428",
        "text": "#ffffff",
        "textSecondary": "#adb5bd",
        "border": "#343a40",
        "shadow": "rgba(0, 255, 213, 0.25)",
        "success": "#00ff66",
        "warning": "#ffcc00",
        "error": "#ff0033",
        "info": "#00ccff"
      },
      "fonts": {
        "heading": "'Orbitron', sans-serif",
        "body": "'Rajdhani', sans-serif",
        "code": "'Fira Code', monospace"
      },
      "animations": {
        "particleColor": "#00ffd5",
        "particleOpacity": 0.9,
        "backgroundGradient": "linear-gradient(135deg, #0a0a16 0%, #141428 100%)",
        "cardGlow": "rgba(0, 255, 213, 0.35)"
      }
    }
  ],
  "preferences": {
    "detectSystemTheme": true,
    "fallbackTheme": "dark",
    "enableAnimations": true,
    "reducedMotion": false,
    "transitionSpeed": 300
  }
}
```

### Contact
Represents contact form structure and validation.

```json
{
  "formFields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Your full name",
      "required": true,
      "validation": "^[a-zA-Z ]{2,50}$"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "your.email@example.com",
      "required": true,
      "validation": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    },
    {
      "id": "subject",
      "type": "text",
      "label": "Subject",
      "placeholder": "What is this regarding?",
      "required": true,
      "validation": "^.{5,100}$"
    },
    {
      "id": "message",
      "type": "textarea",
      "label": "Message",
      "placeholder": "Your message here...",
      "required": true,
      "validation": "^[\\s\\S]{10,1000}$"
    }
  ],
  "submitButton": {
    "text": "Send Message",
    "loadingText": "Sending..."
  },
  "successMessage": "Thank you for your message! I'll get back to you as soon as possible.",
  "errorMessage": "There was an error sending your message. Please try again."
}
```

## Data Relationships

### Entity Relationships
- **Profile** is the central entity containing basic information
- **Experience** entries are ordered chronologically (newest first)
- **Projects** showcase work related to **Experience** entries
- **Skills** are categorized and can be filtered/sorted
- **Education** provides academic background
- **Awards** highlight professional achievements
- **Languages** list communication capabilities
- **ThemePreferences** control site appearance and visual experience
- **Contact** defines the form structure for communication

### Data Flow
1. All data loaded at site initialization
2. Theme preferences detected from browser settings or user selection
3. Filtered and displayed based on user interaction
4. Animation sequences triggered by data availability and current theme
5. Interaction metrics tracked anonymously (if enabled)

## Data Validation

### Required Properties
- **Profile**: name, title, contact (email)
- **Experience**: company, position, startDate, description
- **Projects**: title, description, technologies
- **Skills**: categories with name, skills with name and level
- **ThemePreferences**: at least one theme with default set to true
- **Contact Form**: all fields marked as required

### Format Validation
- Dates: ISO format (YYYY-MM-DD)
- Email: Standard email format
- URLs: Must be valid and include protocol
- Skill levels: 0-100 integer
- Colors: Valid hex code or CSS color value

## Data Update Process

1. Edit corresponding JSON file
2. Validate against schema
3. Commit changes to repository
4. Site rebuilds automatically via CI/CD

## Localization Support

The data structure supports future localization by extracting strings into language-specific files using a key-based approach:

```json
{
  "en": {
    "about.title": "About Me",
    "experience.title": "Professional Experience",
    "skills.title": "My Skills"
  },
  "fr": {
    "about.title": "À Propos De Moi",
    "experience.title": "Expérience Professionnelle",
    "skills.title": "Mes Compétences"
  }
}
```

## Caching Strategy

- JSON data cached in localStorage with version control
- Theme preferences stored in localStorage with system preference fallback
- Auto-invalidate cache on version change
- 24-hour max cache lifetime
