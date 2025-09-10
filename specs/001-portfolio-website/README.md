# Data model for Interactive Portfolio Website

This folder contains a machine-readable summary and guidance for the project's data model derived from `data-model.md`.

Files
- `data-model.json` — JSON Schema (draft-07) with the required top-level entities used by the site: `profile`, `experience`, `projects`, `skills`, `education`, `awards`, `languages`, `themes`, `contact`.

Validation
1. Quick smoke-check: ensure required data files are present and parseable.
   - Run from project root (Windows PowerShell):

```powershell
node .\scripts\validate-data.js
```

2. (Optional) Add strict validation: extend `data-model.json` with detailed constraints (formats, regex, numeric ranges) and use a JSON Schema validator (for example, `ajv`) to run checks programmatically.

Suggested next steps
- Add a CI job to run `node scripts/validate-data.js` on pull requests.
- Strengthen `data-model.json` with property-level constraints (ISO date regex, email format, color hex regex, skill-level integer min/max).
- Normalize fields across `frontend/public/data` (IDs, date formats) if you want consistent programmatic consumption.
