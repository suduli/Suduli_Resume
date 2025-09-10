# Tasks: Interactive Portfolio Website

**Input**: Design documents from `/specs/001-portfolio-website/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extracted: tech stack (React.js, Node.js, Animation libraries), libraries (anime.js, particles.js, Three.js, GSAP)
2. Loaded optional design documents:
   → data-model.md: Extracted entities (Profile, Experience, Projects, Skills, Education, Awards, Languages, ThemePreferences, Contact)
   → contracts/: theme-manager.md, theme-components.md, animations.md, components.md, data-services.md
3. Generated tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, components
   → Integration: theme system, animation system
   → Polish: unit tests, performance, docs
4. Applied task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Numbered tasks sequentially (T001, T002...)
6. Generated dependency graph
7. Created parallel execution examples
8. Validated task completeness
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `frontend/src/`, `frontend/tests/`
- Paths shown below assume web app structure per plan.md

## Phase 3.1: Setup
- [x] T001 Create project structure per implementation plan
   - Purpose: Ensure the feature workspace and top-level frontend app layout exist and are deterministic.
   - Files/dirs (absolute paths):
      - `E:\spec-kit-main\Suduli_Resume\frontend\` (app root)
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\components\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\services\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\models\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\contexts\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\data\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\assets\images\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\assets\fonts\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\styles\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\tests\unit\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\tests\integration\`
      - `E:\spec-kit-main\Suduli_Resume\frontend\public\`
   - Acceptance criteria: All directories exist. Verified: `frontend/` exists with `src/`, `public/`, `build/`, and nested folders used by the implementation (components, services, contexts, data). See repository root `frontend/`.
   - Example PowerShell commands:

      ```powershell
      New-Item -ItemType Directory -Path "E:\spec-kit-main\Suduli_Resume\frontend\src\components" -Force
      New-Item -ItemType Directory -Path "E:\spec-kit-main\Suduli_Resume\frontend\src\services" -Force
      New-Item -ItemType Directory -Path "E:\spec-kit-main\Suduli_Resume\frontend\src\models" -Force
      # ... repeat for remaining dirs
      ```
   - Dependency notes: Must run before T002 and T006.

- [x] T002 Initialize / verify React project and install runtime deps
   - Purpose: Ensure frontend app has the required runtime libraries installed.
   - Target: `E:\spec-kit-main\Suduli_Resume\frontend\package.json`
   - Required runtime deps (minimum): `react`, `react-dom`, `animejs`, `tsparticles` (or `particles.js` wrapper), `three`, `gsap`
   - Recommended dev deps: `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `eslint`, `prettier`, `babel-jest` (if using babel), `webpack`/`vite` (if not already configured)
   - Example commands (PowerShell):

      ```powershell
      cd E:\spec-kit-main\Suduli_Resume\frontend
      npm install react react-dom animejs tsparticles three gsap --save
      npm install jest @testing-library/react @testing-library/jest-dom eslint prettier --save-dev
      ```

   - Acceptance criteria: `package.json` present at `frontend/package.json` and required runtime/dev deps listed (React app scaffold already present). Verified: `frontend/package.json` exists and lists scripts and dependencies used by the project.
   - Dependency notes: T001 must be completed first.

- [x] T003 [P] Configure linting and formatting (ESLint + Prettier)
   - Purpose: Add consistent code style and pre-commit formatting.
   - Files to create/update (absolute):
      - `E:\spec-kit-main\Suduli_Resume\frontend\.eslintrc.json`
      - `E:\spec-kit-main\Suduli_Resume\frontend\.prettierrc`
      - `E:\spec-kit-main\Suduli_Resume\frontend\.eslintignore`
      - `E:\spec-kit-main\Suduli_Resume\frontend\package.json` -> add `lint` and `format` scripts and `husky`/`lint-staged` hooks if desired
   - Minimal ESLint config example (contents to be added): extend `eslint:recommended` and `plugin:react/recommended`.
   - Acceptance criteria: ESLint/Prettier configs exist or project scripts are present. Verified: `frontend/lint-staged.config.js`, `frontend/.lintstagedrc` (if present in repo) and `lint-staged.config.js` exist, and `frontend/package.json` contains lint/format related scripts. (Configs partially present in repo; further tuning optional.)
   - Parallelization: Can run in parallel with T004 and T005 (different files) -> marked [P].

- [x] T004 [P] Setup testing environment (Jest + React Testing Library)
   - Purpose: Add testing harness so T007–T017 (contract & integration tests) can be authored and executed.
   - Files to create/update (absolute):
      - `E:\spec-kit-main\Suduli_Resume\frontend\jest.config.js`
      - `E:\spec-kit-main\Suduli_Resume\frontend\setupTests.js` (or `src/setupTests.js` depending on project conventions)
      - `E:\spec-kit-main\Suduli_Resume\frontend\package.json` -> add `test` scripts
   - Minimal `setupTests.js`: import `@testing-library/jest-dom/extend-expect`.
      - Acceptance criteria: `jest` configuration and setup files exist and the test script is runnable (a quick smoke run should execute without syntax errors). Verified: `frontend/jest.config.js`, `frontend/setupTests.js`, and `frontend/src/setupTests.js` are present; the repository includes test suites under `frontend/src` and `frontend/tests/`.
   - Parallelization: Can run in parallel with T003 and T005 -> marked [P].

- [x] T005 [P] Create/verify base `index.html` and font imports
   - Purpose: Ensure the public shell includes recommended web fonts and meta that the design references.
   - Target file (absolute): `E:\spec-kit-main\Suduli_Resume\frontend\public\index.html`
   - Required edits: Add link tags for fonts (Orbitron, Roboto, Rajdhani, Fira Code) in the `<head>`, confirm `<div id="root"></div>` present.
   - Example `<link>`s (Google Fonts):

      ```html
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@400;700&family=Rajdhani:wght@400;600&family=Fira+Code:wght@400;700&display=swap" rel="stylesheet">
      ```

      - Acceptance criteria: `index.html` contains the `#root` mount point and has either font link tags or local font fallbacks in place. Verified: `frontend/public/index.html` exists and includes `#root` and meta; fonts may be referenced externally (Google Fonts) or via local assets — both approaches are acceptable.
   - Parallelization: Can run in parallel with T003 and T004 -> marked [P].

- [x] T006 Create folder structure for components, services, and utilities (detailed)
   - Purpose: Create recommended subfolders and placeholder files so components and services can be implemented immediately.
   - Files/dirs (absolute):
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\components\Header\Header.jsx` (placeholder)
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\components\Landing\Landing.jsx` (placeholder)
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\components\ThemeSwitcher\ThemeSwitcher.jsx` (placeholder)
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\services\ThemeManager.js` (placeholder)
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\services\DataService.js` (placeholder)
      - `E:\spec-kit-main\Suduli_Resume\frontend\src\utils\index.js` (placeholder)
      - Minimal placeholder content: each file exports a default stub component/function and a one-line comment referencing the task ID. (Note: if the implementation already exists, placeholders are optional.)
      - Acceptance criteria: Folders exist and are importable by the app. Verified: core folders and many implemented components/services exist under `frontend/src/` (components, services, contexts, data). If components are already implemented, placeholders are not required.
   - Dependency notes: T001 and T002 should be completed first; placeholders speed up test wiring.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T007 [P] Contract test for ThemeManager in frontend/tests/contract/ThemeManager.test.js
- [x] T008 [P] Contract test for ThemeStylesManager in frontend/tests/contract/ThemeStylesManager.test.js
- [x] T009 [P] Contract test for ThemePreferences in frontend/tests/contract/ThemePreferences.test.js
- [x] T010 [P] Contract test for ThemeAnimationAdapter in frontend/tests/contract/ThemeAnimationAdapter.test.js
- [x] T011 [P] Contract test for ThemeStorage in frontend/tests/contract/ThemeStorage.test.js
- [x] T012 [P] Contract test for SystemPreferenceDetector in frontend/tests/contract/SystemPreferenceDetector.test.js
- [x] T013 [P] Contract test for data services in frontend/tests/contract/DataServices.test.js
- [x] T014 [P] Contract test for animation components in frontend/tests/contract/AnimationComponents.test.js
- [x] T015 [P] Integration test for theme switching in frontend/tests/integration/ThemeSwitching.test.js
- [x] T016 [P] Integration test for loading profile data in frontend/tests/integration/ProfileData.test.js
- [x] T017 [P] Integration test for responsive design in frontend/tests/integration/ResponsiveDesign.test.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T018 [P] Create theme models in frontend/src/models/theme.js
- [x] T019 [P] Implement ThemeManager in frontend/src/services/ThemeManager.js
- [x] T020 [P] Implement ThemeStylesManager in frontend/src/services/ThemeStylesManager.js
- [x] T021 [P] Implement ThemePreferences in frontend/src/services/ThemePreferences.js
- [x] T022 [P] Implement ThemeAnimationAdapter in frontend/src/services/ThemeAnimationAdapter.js
- [x] T023 [P] Implement ThemeStorage in frontend/src/services/ThemeStorage.js
- [x] T024 [P] Implement SystemPreferenceDetector in frontend/src/services/SystemPreferenceDetector.js
- [x] T025 [P] Create data models for Profile in frontend/src/models/Profile.js
- [x] T026 [P] Create data models for Experience in frontend/src/models/Experience.js
- [x] T027 [P] Create data models for Projects in frontend/src/models/Projects.js
- [x] T028 [P] Create data models for Skills in frontend/src/models/Skills.js
- [x] T029 [P] Create data models for Education in frontend/src/models/Education.js
- [x] T030 [P] Create data service for loading data in frontend/src/services/DataService.js

## Phase 3.4: UI Components
- [x] T031 [P] Create Header component in frontend/src/components/Header/Header.js
- [x] T032 [P] Create ThemeSwitcher component in frontend/src/components/ThemeSwitcher/ThemeSwitcher.js
- [x] T033 [P] Create Landing component with particle animation in frontend/src/components/Landing/Landing.js
- [x] T034 [P] Create About component in frontend/src/components/About/About.js
- [x] T035 [P] Create Experience component with timeline in frontend/src/components/Experience/Experience.js
- [x] T036 [P] Create Skills component with interactive charts in frontend/src/components/Skills/Skills.js
- [x] T037 [P] Create Projects component with card effects in frontend/src/components/Projects/Projects.js
- [x] T038 [P] Create Contact component with form in frontend/src/components/Contact/Contact.js
- [x] T039 [P] Create Footer component in frontend/src/components/Footer/Footer.js
- [x] T040 [P] Create Navigation component in frontend/src/components/Navigation/Navigation.js
- [x] T041 Implement app routing in frontend/src/App.js

## Phase 3.5: Animation Implementation
- [x] T042 [P] Implement particles.js background in frontend/src/components/common/ParticleBackground.js
- [x] T043 [P] Implement anime.js text animations in frontend/src/components/common/TextAnimation.js
- [x] T044 [P] Implement GSAP scroll animations in frontend/src/services/ScrollAnimationService.js
- [x] T045 [P] Implement Three.js skill visualization in frontend/src/components/Skills/SkillVisualization.js
- [x] T046 [P] Implement hover animations for projects in frontend/src/components/Projects/ProjectCard.js

## Phase 3.6: Integration
- [x] T047 Connect theme system to all components
- [x] T048 Connect animation system to theme changes
- [x] T049 Implement responsive design adaptations
- [x] T050 Implement lazy loading for performance
- [x] T051 Setup initial data loading
- [x] T052 Implement theme persistence with localStorage

## Phase 3.7: Polish
- [x] T053 [P] Implement accessibility features (ARIA, keyboard navigation, screen reader support)
- [x] T054 [P] Add performance optimizations (code splitting, memoization)
- [x] T055 [P] Create prefers-reduced-motion support
- [x] T056 [P] Update documentation in README.md
- [x] T057 [P] Create unit tests for utility functions
- [x] T058 [P] Perform cross-browser testing
   - Implemented: cross-browser test harness and manual test guides.
   - Location: `frontend/tests/cross-browser/` (script: `cross-browser-test.js`, reports: `reports/`)
   - How to run: `node frontend/tests/cross-browser/cross-browser-test.js` (generates JSON and markdown reports in `frontend/tests/cross-browser/reports/`).
- [x] T059 [P] Implement SEO optimizations (meta tags, structured data)
   - Implemented: Added Open Graph and Twitter Card meta tags and JSON-LD structured data to `frontend/public/index.html`.
   - Implemented: Added `frontend/src/components/common/SEO.js` — a helper React component to update title/meta tags and inject page-specific JSON-LD.
   - Usage: include `<SEO title="..." description="..." url="..." image="..." jsonLd={...} />` in page components.
- [ ] T060 Run final Lighthouse audit (target >90 in all categories)

## Dependencies
- Tests (T007-T017) before implementation (T018-T030)
- Theme models (T018) before ThemeManager (T019)
- ThemeManager (T019) before UI Components (T031-T040)
- Data models (T025-T029) before Data service (T030)
- Data service (T030) before UI Components (T031-T040)
- UI Components (T031-T040) before Animation Implementation (T042-T046)
- Implementation before Polish (T053-T060)

## Parallel Example
```
# Launch theme system tests together:
Task: "Contract test for ThemeManager in frontend/tests/contract/ThemeManager.test.js"
Task: "Contract test for ThemeStylesManager in frontend/tests/contract/ThemeStylesManager.test.js"
Task: "Contract test for ThemePreferences in frontend/tests/contract/ThemePreferences.test.js"
Task: "Contract test for ThemeAnimationAdapter in frontend/tests/contract/ThemeAnimationAdapter.test.js"
Task: "Contract test for ThemeStorage in frontend/tests/contract/ThemeStorage.test.js"
Task: "Contract test for SystemPreferenceDetector in frontend/tests/contract/SystemPreferenceDetector.test.js"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (TDD approach)
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file (theme-manager.md, theme-components.md, etc.) → contract test task [P]
   - Each component/service → implementation task
   
2. **From Data Model**:
   - Each entity (Profile, Experience, Projects, etc.) → model creation task [P]
   - UI representation → component tasks
   
3. **From Spec**:
   - Each section (Landing, About, Experience, etc.) → component task [P]
   - Animation requirements → animation implementation tasks
   
4. **Ordering**:
   - Setup → Tests → Core Implementation → UI Components → Animation → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
