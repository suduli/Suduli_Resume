# Suduli Resume (Frontend)

This repository contains a React frontend inside the `frontend/` folder.

Quick start (from repo root):

```powershell
# Install dependencies inside frontend
cd frontend; npm install

# Start dev server from root
npm start
# or
npm run start:dev
```

Or start directly inside the frontend folder:

```powershell
cd frontend; npm install
npm start
```

Notes:
- The root `package.json` contains proxy scripts which change directory into `frontend/` and run the corresponding commands there.
- For tests and linting, run the commands inside `frontend/` or use the root scripts (`npm test`, `npm run lint`).
