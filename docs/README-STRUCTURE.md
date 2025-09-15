# 📁 Project Structure Documentation

## Overview

This document describes the reorganized file structure for the Suduli Automotive Resume Website, optimized for maintainability, clarity, and modern development practices.

## 🎯 Restructuring Goals

- **Logical grouping**: Related files are organized together
- **Consistent naming**: Clear, predictable file and folder names
- **Reduced nesting depth**: Minimal folder hierarchy for easy navigation
- **Enhanced maintainability**: Easier to locate and update files
- **Modern practices**: Following frontend development best practices

## 📂 Current Directory Structure

```
/
├── index.html                    # Main landing page
├── package.json                  # Project dependencies and scripts
├── vercel.json                   # Deployment configuration
├── LICENSE                       # MIT License
├── README.md                     # Main project documentation
│
├── assets/                       # All static assets
│   ├── css/                      # Stylesheets
│   │   ├── main.css              # Primary application styles
│   │   └── visitor-counter.css   # Visitor counter specific styles
│   │
│   ├── js/                       # JavaScript files
│   │   ├── core/                 # Core application logic
│   │   │   ├── main.js           # Main application script (formerly script.js)
│   │   │   └── vendor/           # Third-party libraries
│   │   │       └── particles-fallback.js
│   │   │
│   │   ├── features/             # Feature-specific modules
│   │   │   ├── visitor-counter.js
│   │   │   └── recommendations/
│   │   │       ├── recommendation-summary.js
│   │   │       └── recommendation-cards.js
│   │   │
│   │   └── utils/                # Shared utility functions
│   │       └── recommendation-utils.js
│   │
│   └── data/                     # Static data files
│       ├── Recommendations_Received.csv
│       └── Suduli_7_10_year-1.txt
│
├── api/                          # Serverless functions (Vercel)
│   └── visitors.js               # Visitor counter API endpoint
│
├── database/                     # Database schemas and configurations
│   ├── firestore-schema.json     # Firebase Firestore schema
│   └── supabase-schema.sql       # Supabase PostgreSQL schema
│
├── docs/                         # Documentation files
│   ├── README-STRUCTURE.md       # This file - project structure
│   ├── README-visitor-counter.md # Visitor counter implementation guide
│   ├── IMPLEMENTATION-SUMMARY.md # Project implementation summary
│   ├── DEPLOYMENT-CHECKLIST.md   # Deployment guide and checklist
│   ├── QUICKSTART.md             # Quick setup guide
│   └── ACCESSIBILITY.md          # Accessibility guidelines
│
└── tests/                        # Test files
    ├── recommendations.test.js   # Recommendation system tests
    ├── visitor-counter.test.js   # Visitor counter tests
    └── test-visitor-counter.html # Browser-based testing interface
```

## 🗂️ Organization Principles

### Assets Structure (`/assets/`)
- **css/**: All stylesheets in one location
- **js/core/**: Main application logic and vendor libraries
- **js/features/**: Self-contained feature modules
- **js/utils/**: Shared utility functions
- **data/**: Static data files (CSV, text files)

### Documentation (`/docs/`)
- Centralized location for all project documentation
- Clear naming with README- prefix for main guides
- Specific implementation guides for features

### Tests (`/tests/`)
- All test files in one location
- Consistent naming: `*.test.js`
- Includes both Node.js and browser-based tests

### Deployment Files (Root)
- Essential deployment files remain in root for platform compatibility
- `index.html`, `package.json`, `vercel.json` required by hosting platforms

## 🔄 Migration Changes

### Files Moved
- Documentation: `*.md` files → `docs/`
- Main script: `script.js` → `assets/js/core/main.js`
- Features: `visitor-counter.js`, `recommendation-*.js` → `assets/js/features/`
- Data: `*.csv`, `*.txt` → `assets/data/`
- Tests: `test/` → `tests/`

### Files Removed
- Duplicate files in root directory
- Legacy `skills/` directory (unused)
- Experimental `ui-lab.*` and `design-automotive.*` files
- Redundant `styles.css` (content in `assets/css/main.css`)

### Path Updates
- HTML script references updated to new paths
- CSS import paths updated
- Test file require() paths updated
- CSV data paths updated in JavaScript

## ⚡ Development Benefits

1. **Faster File Location**: Logical grouping means files are where you expect
2. **Easier Maintenance**: Related files are co-located
3. **Better Scalability**: Clear structure supports adding new features
4. **Improved Collaboration**: Consistent organization helps team members
5. **Modern Standards**: Follows current frontend development practices

## 🛠️ Development Workflow

### Adding New Features
1. Create feature module in `assets/js/features/[feature-name]/`
2. Add feature-specific styles to `assets/css/` or feature subfolder
3. Update `index.html` to include new scripts
4. Add tests to `tests/[feature-name].test.js`
5. Document in `docs/README-[feature-name].md`

### Working with Assets
- CSS: Edit files in `assets/css/`
- JavaScript: Use appropriate subfolder in `assets/js/`
- Data: Place in `assets/data/` and update paths in code
- Images/Media: Add to `assets/` with appropriate subfolder

### Running Tests
```bash
npm test  # Runs all tests from tests/ directory
```

### Local Development
```bash
npm run dev  # Starts local development server
```

## 📋 Maintenance Notes

- All paths in code now reference the new structure
- Tests validate both file locations and functionality
- Documentation is centralized and easier to maintain
- Deployment configuration unchanged (compatible with Vercel/Netlify)

## 🔧 Troubleshooting

If you encounter issues after restructuring:

1. **Missing Files**: Check if files moved to new locations
2. **Broken Paths**: Verify script src and link href in HTML
3. **Test Failures**: Ensure test require() paths are updated
4. **Build Issues**: Check that deployment files remain in root

## 📞 Support

For questions about the project structure:
- Check this documentation first
- Review main `README.md` for project overview
- Consult feature-specific docs in `docs/` folder
- Contact: suduli.office@gmail.com

---

*Structure optimized: January 2025*  
*Benefits: Improved maintainability, clearer organization, modern practices*
