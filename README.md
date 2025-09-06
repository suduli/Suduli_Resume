# Interactive Portfolio Website Architecture

This website will be a single-page application (SPA) built as an interactive 3D scene.

## 1. The Landing Zone (Above the Fold)

This is the first thing users see. It should be visually striking and set the tone.

*   **Visuals:** A dynamic background using **particles.js** or a custom shader effect. Your name, "Suduli Kumar Balabantaray," is rendered in 3D text.
*   **Interactivity:** Users can drag to rotate the scene. The particles could react to mouse movement.
*   **Content:**
    *   **Name:** Suduli Kumar Balabantaray
    *   **Title:** Specialist Engineer | Automotive Software & Systems Validation
    *   **Call to Action:** A subtle, glowing prompt like "Begin the Journey" or "Scroll to Explore" that initiates the camera movement along the career path.

## 2. The "Experience Expressway"

As the user scrolls, the camera moves along a 3D path. Each job position is a distinct stop.

*   **Visuals:** Each company (KPIT, HL Klemove, Mando, Binsoft) is represented by a unique 3D model or a stylized structure.
*   **Interactivity:** Clicking on a structure opens a clean, modern UI panel (modal) with details for that role.
*   **Content (per job):**
    *   **Company & Role:** e.g., "Test Lead @ KPIT Technologies"
    *   **Duration:** e.g., "10/2023 - Present"
    *   **Key Achievements:** Bullet points sourced from your resume (e.g., "Developed validation plans using IBM RQM," "Reduced manual testing by 40%").

## 3. The "Skills Galaxy"

This section is a cluster of interactive objects, representing your technical skills.

*   **Visuals:** A constellation of floating 3D objects. Each object represents a skill category (e.g., Testing, Programming, Protocols).
*   **Interactivity:** When a user hovers over an object, it glows, and smaller "satellites" representing individual skills (e.g., "Unit Testing," "Python," "CAN") orbit it. Clicking a skill could display a brief definition or related project.
*   **Content:**
    *   **Categories & Skills:** Sourced directly from the "Skills" section of your resume.
        *   **Testing:** System, Unit, Integration, White/Black Box
        *   **Tools:** VectorCast, CANoe, dSPACE, Jira
        *   **Languages:** Embedded C, Python, CAPL
        *   **Protocols:** CAN, UDS, ISO-26262

## 4. The "Project Showcase"

This section features your key projects as interactive exhibits.

*   **Visuals:** Two main exhibits, one for "BCM-Systems Validation" and one for "DCU 20." These could be stylized 3D models of a car's electronic system or a domain controller.
*   **Interactivity:** Clicking an exhibit brings it into focus and displays a panel with project details and links.
*   **Content:**
    *   **Project Name & Overview:** "BCM-Systems Validation: Automotive software validation for Stellantis OEM."
    *   **Your Role:** "Lead Tester"
    *   **Key Achievements:** "Achieved 95% requirement traceability," "Led debugging of 200+ defects."
    *   **Links:** Add prominent buttons linking to your live GitHub Pages projects (`CAnalyzerAI`, `AI-ASIL-Analyser`) and your main GitHub profile.

## 5. The "Contact Hub"

The final stop on the path.

*   **Visuals:** A simple, elegant area where the path ends. It could feature a 3D model of a phone, an email icon, and a LinkedIn icon.
*   **Interactivity:** Clicking on the icons will either copy the information (email, phone) or navigate to the URL (LinkedIn, GitHub).
*   **Content:**
    *   Email: `suduli.office@gmail.com`
    *   Phone: `+919500097614`
    *   LinkedIn Profile
    *   GitHub Profile
