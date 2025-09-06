# Software Requirements Specification (SRS)
## Personal Interactive 3D Portfolio for Suduli Kumar Balabantaray

### 1. Introduction

#### 1.1. Purpose
This document specifies the requirements for a personal portfolio website for Suduli Kumar Balabantaray. The website will serve as an interactive, 3D digital resume to showcase his skills, work experience, and projects to potential employers and professional contacts. It is designed to be a memorable and engaging experience, reflecting his expertise in the high-tech automotive industry.

#### 1.2. Scope
The website will be a single-page application (SPA) presenting a linear, interactive 3D journey through Suduli's career. It will feature sections for his professional summary, work experience, technical skills, major projects, and contact information. The data will be sourced from the provided resume files.

#### 1.3. References
The design and user experience will be heavily inspired by the following state-of-the-art interactive websites:
*   **Core Concept:** `https://bruno-simon.com/` (for the 3D world navigation)
*   **Particle Effects:** `https://vincentgarreau.com/particles.js/`, `https://particles.wannathis.one/`
*   **Animation & UI:** `https://animejs.com/`, `https://gradienty.codes/`

### 2. Overall Description

#### 2.1. Product Perspective
The product is a self-contained, static web application. It will be built using modern web technologies (React, Three.js) and will not require a backend database. All content will be hardcoded into the application, ensuring fast performance and simple deployment.

#### 2.2. User Journey
The user navigates the website by scrolling or using keyboard controls. This action moves a camera along a pre-defined path in a 3D scene. Different sections of the portfolio are represented as interactive "stops" or "zones" along this path.

### 3. Functional Requirements

#### 3.1. FR-1: The Landing & Introduction Zone
*   **3.1.1.** The website shall immediately display a full-screen 3D scene upon loading.
*   **3.1.2.** A dynamic particle background, inspired by `particles.js`, shall be present and react to mouse movement.
*   **3.1.3.** The name "Suduli Kumar Balabantaray" shall be rendered as 3D text in the center of the view.
*   **3.1.4.** Below the name, the title "Specialist Engineer | Automotive Software & Systems Validation" shall be displayed.
*   **3.1.5.** A brief professional summary, extracted from the resume, shall appear as the user begins to scroll.
*   **3.1.6.** A visual cue (e.g., a glowing arrow or text "Scroll to Explore") shall prompt the user to begin the journey.

#### 3.2. FR-2: The Experience Expressway (Work History)
*   **3.2.1.** As the user navigates, the camera shall move along a path to the "Experience" section.
*   **3.2.2.** Each past role shall be represented by a distinct 3D object or landmark.
    *   Landmark 1: KPIT Technologies
    *   Landmark 2: HL Klemove India Pvt Ltd
    *   Landmark 3: Mando Softtech India Pvt Ltd
    *   Landmark 4: Binsoft Techno Solutions
*   **3.2.3.** Clicking on a landmark shall trigger an animation and open a clean UI modal/panel.
*   **3.2.4.** The panel shall display the Company Name, Job Title, Duration, and a list of key achievements for that role, sourced from the resume.
*   **3.2.5.** The user must be able to close the panel to return to the 3D scene.

#### 3.3. FR-3: The Skills Galaxy
*   **3.3.1.** This section shall be visualized as an interactive constellation of floating 3D objects.
*   **3.3.2.** The constellation will be organized into logical clusters representing skill categories.
    *   **Cluster 1: Testing & Validation:** System, Unit, Integration, White/Black Box, Functional, Regression Testing.
    *   **Cluster 2: Tools & Software:** VectorCAST, CANoe, dSPACE, ECU-Test, Jira, IBM ALM, Trace32.
    *   **Cluster 3: Languages & Protocols:** Embedded C, Python, CAPL, CAN, UDS, ISO-26262.
*   **3.3.3.** Hovering over a skill object shall cause it to glow and display its name as a text label.
*   **3.3.4.** The visual effect should be fluid and engaging, with subtle animations.

#### 3.4. FR-4: The Project & Awards Showcase
*   **3.4.1.** This section shall feature interactive exhibits for key projects.
*   **3.4.2.** There will be two primary exhibits:
    *   **Exhibit A: BCM-Systems Validation:** Clicking this will open a modal detailing the project overview, achievements (e.g., "Reduced manual testing by 40%"), and tools used.
    *   **Exhibit B: DCU 20:** Clicking this will open a modal detailing the project overview, its context (Onsite in Korea), achievements, and tools used.
*   **3.4.3.** A dedicated sub-section or animated text display will list the "Awards & Achievements" (e.g., "Spotlight Award from HL Klemove").
*   **3.4.4.** This section must feature prominent, interactive 3D models or icons that link directly to:
    *   GitHub Profile (`https://github.com/suduli`)
    *   `CAnalyzerAI` Project (`https://suduli.github.io/CAnalyzerAI/`)
    *   `AI-ASIL-Analyser` Project (`https://suduli.github.io/AI-ASIL-Analyser/`)

#### 3.5. FR-5: The Contact & Connection Hub
*   **3.5.1.** The journey shall conclude at a final, calm section of the scene.
*   **3.5.2.** This section must display interactive 3D icons for LinkedIn, Email, and Phone.
*   **3.5.3.** Clicking the LinkedIn icon shall open `https://linkedin.com/in/suduli-kumar-balabantaray-325765b6/` in a new browser tab.
*   **3.5.4.** Clicking the Email icon shall trigger a "mailto:" link for `suduli.office@gmail.com`.
*   **3.5.5.** Clicking the Phone icon shall display the number `+919500097614` and offer a "copy to clipboard" functionality.

### 4. Non-Functional Requirements

#### 4.1. NFR-1: Performance
*   **4.1.1.** The initial page load time shall be under 5 seconds on a standard broadband connection.
*   **4.1.2.** All animations and transitions within the 3D scene must maintain a frame rate of at least 45 FPS on modern hardware.
*   **4.1.3.** The application shall be optimized for performance on modern desktop browsers (Chrome, Firefox, Safari, Edge).

#### 4.2. NFR-2: Usability
*   **4.2.1.** Navigation shall be intuitive via mouse scroll, trackpad gestures, and keyboard arrow keys.
*   **4.2.2.** All interactive elements must provide clear visual feedback on hover and click states (e.g., glowing, scaling, sound effects).
*   **4.2.3.** While the primary experience is 3D, the website must be navigable and its information accessible on devices or browsers that may have difficulty with WebGL. A simple fallback HTML version is not required, but the site should not crash.

#### 4.3. NFR-3: Compatibility
*   **4.3.1.** The website must be fully responsive and functional on screen resolutions from 1366x768 up to 4K.
*   **4.3.2.** The experience is desktop-first. A simplified, 2D version of the content should be considered for mobile devices to ensure readability and accessibility.

#### 4.4. NFR-4: Technology Stack
*   **4.4.1.** **Frontend Framework:** React
*   **4.4.2.** **3D Library:** Three.js
*   **4.4.3.** **React-Three.js Bridge:** React Three Fiber (R3F)
*   **4.4.4.** **Animation:** Framer Motion (for UI) & GSAP (for complex 3D sequences)
*   **4.4.5.** **Deployment:** GitHub Pages or Vercel