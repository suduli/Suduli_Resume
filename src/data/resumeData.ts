
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface HeroData {
  greeting: string;
  name: string;
  title: string;
  description: string;
  actions: {
    label: string;
    href: string;
    primary: boolean;
    download?: boolean;
    icon?: string;
  }[];
}

export interface AboutData {
  title: string;
  intro: string;
  details: string;
  stats: {
    value: string;
    label: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  period: string;
  responsibilities: string[];
  sublist?: string[]; // For specific nested items like in the Test Lead role
  highlight?: boolean;
}

export interface SkillItem {
  name: string;
  category: string;
  level: number;
  tags: string[];
  desc: string;
  experience: string;
  youtubeLink?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  links: {
    label: string;
    url: string;
    icon?: string;
  }[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface ContactData {
  email: string;
  linkedin: string;
  phone: string;
  location: string;
}

export interface ResumeData {
  hero: HeroData;
  about: AboutData;
  experience: ExperienceItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  languages: LanguageItem[];
  contact: ContactData;
  social: SocialLink[];
}

export const SKILLS_LIST: SkillItem[] = [
  // Learning category
  { name: 'Machine Learning', category: 'Learning', level: 60, tags:['ai','algorithms','data'], desc: 'Statistical modeling techniques for predictive analytics.', experience: 'Currently exploring applications in automotive testing' },
  { name: 'AI', category: 'Learning', level: 55, tags:['deep-learning','neural-networks'], desc: 'Artificial intelligence systems and algorithms.', experience: 'Studying applications for automotive systems' },
  { name: 'Vibe Coding', category: 'Learning', level: 50, tags:['innovative','experimental'], desc: 'Modern coding approach emphasizing aesthetic and intuitive design.', experience: 'Exploring for enhanced UI/UX implementation' },
  { name: 'KDT (Keyword-Driven Testing)', category: 'Learning', level: 65, tags:['automation','frameworks'], desc: 'Framework approach using keywords for test automation.', experience: 'Implementing in current test processes' },
  { name: 'Xray', category: 'Learning', level: 58, tags:['jira','test-management'], desc: 'Test management tool for Jira ecosystems.', experience: 'Adopting for test reporting and management' },
  { name: 'Gherkin', category: 'Learning', level: 62, tags:['bdd','specifications'], desc: 'Business-readable domain-specific language for behavior descriptions.', experience: 'Implementing in current project documentation' },
  { name: 'Behavior-Driven Development (BDD)', category: 'Learning', level: 60, tags:['agile','collaboration'], desc: 'Development approach emphasizing collaboration between technical and non-technical participants.', experience: 'Adopting methodologies for current projects' },
  { name: 'Cucumber in Python', category: 'Learning', level: 55, tags:['bdd','automation'], desc: 'Python implementation of Cucumber for BDD test automation.', experience: 'Building test suites with this framework' },
  { name: 'Love', category: 'Learning', level: 95, tags:['passion','dedication'], desc: 'Bringing passion and dedication to all technical endeavors.', experience: 'Lifelong commitment to craftsmanship', youtubeLink: 'https://www.youtube.com/watch?v=exDJJ3Fqyr4&ab_channel=GiveSomethingBackToBerlin' },

  { name: 'Black Box Testing', category: 'Testing', level: 92, tags:['functional','system','validation'], desc: 'Testing based on requirements and specifications without knowledge of internal structure.', experience: '5+ years in automotive testing projects' },
  { name: 'White Box Testing', category: 'Testing', level: 85, tags:['structural','internal','code-based'], desc: 'Testing based on the internal structure of the component or system.', experience: '4 years in structural testing' },
  { name: 'Regression Testing', category: 'Testing', level: 88, tags:['stability','maintenance'], desc: 'Ensures that changes have not negatively impacted existing functionality.', experience: '4 years in software maintenance' },
  { name: 'Integration Testing', category: 'Testing', level: 86, tags:['interfaces','modules'], desc: 'Validates contract between combined modules.', experience: '3 years in module integration' },
  { name: 'Unit Testing', category: 'Testing', level: 83, tags:['granular','logic','component'], desc: 'Testing individual components in isolation.', experience: '4 years in unit-level validation' },
  { name: 'System Testing', category: 'Testing', level: 84, tags:['end-to-end','integrated'], desc: 'Assesses the integrated system as a whole.', experience: '3 years in end-to-end testing' },
  { name: 'Smoke Testing', category: 'Testing', level: 82, tags:['build','stability','sanity'], desc: 'Test run on a new build to verify its stability for further testing.', experience: '3 years in build verification' },
  { name: 'Sanity Testing', category: 'Testing', level: 80, tags:['focused','regression','minor-changes'], desc: 'Focused regression test to check a specific function after a minor change.', experience: '3 years in targeted validation' },
  { name: 'Re-Testing', category: 'Testing', level: 78, tags:['defect','validation','fix-verification'], desc: 'Executing a test that previously failed to confirm that a fix has been implemented.', experience: '4 years in defect validation' },
  { name: 'SDLC', category: 'Software Lifecycle', level: 85, tags:['process','development','methodology'], desc: 'Software Development Life Cycle methodology and processes.', experience: '6 years in software development processes' },
  { name: 'STLC', category: 'Software Lifecycle', level: 88, tags:['testing','process','lifecycle'], desc: 'Software Testing Life Cycle methodology and best practices.', experience: '7 years in testing lifecycle processes' },
  { name: 'Bug Life Cycle', category: 'Software Lifecycle', level: 83, tags:['defect','tracking','resolution'], desc: 'Complete defect management from identification to closure.', experience: '6 years in defect management' },
  { name: 'HIL Testing', category: 'Simulation', level: 70, tags:['hardware','realtime','embedded'], desc: 'Specialized environment for conducting system testing, particularly in embedded systems.', experience: '2 years in hardware simulation' },
  { name: 'SIL Testing', category: 'Simulation', level: 68, tags:['simulation','early','embedded'], desc: 'Specialized environment for conducting system testing, particularly in embedded systems.', experience: '2 years in software simulation' },
  { name: 'Embedded C', category: 'Programming', level: 82, tags:['firmware','memory'], desc: 'Low-level language for performance and control.', experience: '6 years in embedded systems' },
  { name: 'Python', category: 'Programming', level: 78, tags:['automation','scripting'], desc: 'Automation, reporting & tooling scripts.', experience: '5 years in scripting and automation' },
  { name: 'CAPL', category: 'Programming', level: 72, tags:['vector','bus'], desc: 'Vector tool scripting for CAN bus scenarios.', experience: '3 years in CAN bus scripting' },
  { name: 'UDS', category: 'Protocols', level: 70, tags:['diagnostics','ecu'], desc: 'Unified Diagnostic Services for ECUs.', experience: '2 years in ECU diagnostics' },
  { name: 'CAN', category: 'Protocols', level: 85, tags:['network','bus'], desc: 'Primary automotive communication bus.', experience: '7 years in automotive networking' },
  { name: 'AUTOSAR', category: 'Protocols', level: 65, tags:['architecture'], desc: 'Standardized automotive software framework.', experience: '2 years in AUTOSAR implementation' },
  { name: 'ISO 26262', category: 'Safety', level: 60, tags:['functional safety'], desc: 'Guidelines for automotive functional safety.', experience: '1 year in safety compliance' },
  { name: 'VectorCast', category: 'Tools', level: 80, tags:['unit','coverage'], desc: 'Unit & integration test environment.', experience: '4 years using VectorCast' },
  { name: 'Trace32 Debugging', category: 'Tools', level: 74, tags:['jtag','firmware'], desc: 'Hardware level debugging & introspection.', experience: '3 years in hardware debugging' },
  { name: 'dSPACE', category: 'Tools', level: 68, tags:['hil','simulation'], desc: 'Real-time hardware in the loop platform.', experience: '2 years with dSPACE' },
  { name: 'ECU-Test Tool', category: 'Tools', level: 66, tags:['automation','ecu'], desc: 'Automated functional/integration ECU testing.', experience: '2 years in ECU testing automation' },
  { name: 'CANoe', category: 'Tools', level: 82, tags:['vector','can','analysis'], desc: 'Comprehensive CAN bus analysis and simulation tool.', experience: '5 years in CAN bus analysis' },
  { name: 'CANalyzer', category: 'Tools', level: 80, tags:['vector','can','monitoring'], desc: 'CAN bus monitoring and analysis tool.', experience: '4 years in bus monitoring' },
  { name: 'CANdb', category: 'Tools', level: 75, tags:['vector','database','can'], desc: 'CAN database management and signal definition.', experience: '3 years in database management' },
  { name: 'CANdela', category: 'Tools', level: 70, tags:['vector','diagnostics','uds'], desc: 'Diagnostic test and development tool.', experience: '2 years in diagnostic testing' },
  { name: 'VtestStudio', category: 'Tools', level: 72, tags:['vector','automation','testing'], desc: 'Test automation framework for automotive systems.', experience: '3 years in test automation' },
  { name: 'UnderstandC', category: 'Tools', level: 68, tags:['static-analysis','code-review'], desc: 'Static code analysis and reverse engineering tool.', experience: '2 years in code analysis' },
  { name: 'RQM', category: 'Tools', level: 78, tags:['ibm','test-management','quality'], desc: 'IBM Rational Quality Manager for test management.', experience: '4 years in test management' },
  { name: 'RTC', category: 'Tools', level: 76, tags:['ibm','collaboration','alm'], desc: 'IBM Rational Team Concert for application lifecycle management.', experience: '3 years in ALM processes' },
  { name: 'Structural Coverage', category: 'Coverage', level: 77, tags:['branch','statement'], desc: 'Execution path measurement for untested code.', experience: '3 years in coverage analysis' },
  { name: 'MC/DC', category: 'Coverage', level: 78, tags:['safety','logic'], desc: 'Modified Condition/Decision Coverage expertise.', experience: '3 years in MC/DC coverage' },
  { name: 'DOORS', category: 'Requirements', level: 75, tags:['traceability'], desc: 'Requirement management & impact tracking.', experience: '4 years in requirements management' },
  { name: 'Rhapsody', category: 'Requirements', level: 55, tags:['modeling'], desc: 'UML/SysML model-driven design tool.', experience: '1 year in modeling tools' },
  { name: 'Git', category: 'Version Control', level: 82, tags:['branching'], desc: 'Distributed version control & collaboration.', experience: '6 years in version control' },
  { name: 'SVN', category: 'Version Control', level: 60, tags:['centralized'], desc: 'Centralized version control (legacy flows).', experience: '2 years in legacy systems' }
];

export const RESUME_DATA: ResumeData = {
  hero: {
    greeting: "Hello, I'm",
    name: "SUDULI KUMAR BALABANTARAY",
    title: "Test Lead & IV&V Specialist",
    description: "I seek a professional environment that offers opportunities to showcase my skills and take on challenging roles where I can contribute to the growth of both myself and my organization.",
    actions: [
      { label: "Get In Touch", href: "#contact", primary: true },
      { label: "Download Resume", href: "legacy/assets/data/Suduli_Resume.pdf", primary: false, download: true, icon: "FaDownload" },
      { label: "Learn More", href: "#about", primary: false }
    ]
  },
  about: {
    title: "About Me",
    intro: "I have 8 years of experience in independent verification (IV) and validation (V) for critical systems in the automotive domain.",
    details: "Expertise in automotive testing with extensive experience in RQM tools, programming languages, and advanced automotive software analysis. Proficient in functional testing, performance testing, and validation, with a focus on infotainment systems, ADAS, and critical automotive components.",
    stats: [
      { value: "8+", label: "Years Experience" },
      { value: "50+", label: "Projects Completed" },
      { value: "4+", label: "Companies" }
    ]
  },
  experience: [
    {
      id: "test-lead-kpit",
      title: "Test Lead",
      company: "KPIT Technologies Ltd",
      companyUrl: "https://www.kpit.com/",
      period: "Nov 2023 – Present",
      responsibilities: [
        "Developed & managed comprehensive validation plans using IBM ALM.",
        "Ensured full requirement traceability via DOORS Next Generation (DNG).",
        "Executed Sanity, Manual, Functional & Performance test cycles.",
        "Drove automation initiatives with dSPACE & ECU-Test Tool.",
        "Validated infotainment feature set:"
      ],
      sublist: [
        "Steering Wheel Controls",
        "Horn functionality",
        "Crash detection mechanisms"
      ],
      highlight: true
    },
    {
      id: "specialist-embedded-test-engineer-hl-klemove",
      title: "Specialist Embedded Test Engineer",
      company: "HL Klemove India Pvt Ltd (Halla Group)",
      companyUrl: "https://hlklemove.com/eng/main.do",
      period: "February 2022 - November 2023",
      responsibilities: [
        "Designed & executed embedded test plans ensuring coverage & traceability.",
        "Flashed & validated ECUs using Trace32; confirmed firmware integrity.",
        "Established Zero DTC test environments leveraging ADAS Analyser.",
        "Managed defect lifecycle with structured root cause tracking & database hygiene."
      ]
    },
    {
      id: "senior-embedded-test-engineer-mando",
      title: "Senior Embedded Test Engineer",
      company: "Mando Softtech India Pvt Ltd (Halla Group)",
      companyUrl: "https://www.hlmando.com/en/main.do",
      period: "March 2020 - February 2022",
      responsibilities: [
        "Developed & executed unit test suites with VectorCAST achieving target coverage.",
        "Created integration test scenarios validating module interfaces & data flow.",
        "Drove estimation, task allocation & peer reviews; enforced MC/DC practices.",
        "Proactively identified defects early through systematic review & instrumentation."
      ]
    },
    {
      id: "test-engineer-binsoft",
      title: "Test Engineer",
      company: "Binsoft Techno Solutions",
      period: "September 2017 - February 2020",
      responsibilities: [
        "Implemented foundational unit tests with VectorCAST for core modules.",
        "Captured, triaged & tracked defects; improved feedback loop speed.",
        "Monitored & raised coverage metrics, highlighting untested paths."
      ]
    }
  ],
  skills: SKILLS_LIST,
  projects: [
    {
      title: "BCM-Systems Validation",
      description: "Automotive software validation for Stellantis OEM, focusing on safety-critical Infotainment embedded systems including steering controls, crash detection, and vehicle lighting. Implemented end-to-end testing processes from requirement analysis to automated validation.",
      tags: ["Stellantis", "IBM RQM/DNG", "ECU-Test", "dSPACE"],
      links: [
        { label: "Details", url: "#", icon: "FaInfoCircle" }
      ]
    },
    {
      title: "DCU 20 (Domain Control Unit)",
      description: "Centralized ADAS domain controller (DCU) designed to process data from various vehicle sensors, including cameras and radars. Centralization approach simplifies the architecture, reduces costs, and enhances scalability and software updates.",
      tags: ["ADAS", "CAPL", "Trace32", "Canoe"],
      links: [
        { label: "Details", url: "#", icon: "FaInfoCircle" }
      ]
    },
    {
      title: "CAnalyzerAI",
      description: "AI-powered C code analysis tool that provides intelligent code quality assessment, vulnerability detection, and performance optimization recommendations for automotive embedded systems.",
      tags: ["AI/ML", "C Language", "Code Analysis", "Automotive"],
      links: [
        { label: "GitHub", url: "https://github.com/suduli/CAnalyzerAI", icon: "FaGithub" },
        { label: "Live Demo", url: "https://suduli.github.io/CAnalyzerAI/", icon: "FaExternalLinkAlt" }
      ]
    },
    {
      title: "AI-ASIL-Analyser",
      description: "Advanced AI-driven ASIL (Automotive Safety Integrity Level) analysis tool for ISO 26262 compliance, providing automated safety assessment for automotive software components.",
      tags: ["ISO 26262", "ASIL", "Safety Analysis", "AI/ML"],
      links: [
        { label: "GitHub", url: "https://github.com/suduli/AI-ASIL-Analyser", icon: "FaGithub" },
        { label: "Live Demo", url: "https://suduli.github.io/AI-ASIL-Analyser/", icon: "FaExternalLinkAlt" }
      ]
    },
    {
      title: "VectorCast Unit Report Generation",
      description: "Automated report generation tool for VectorCAST unit testing results, providing comprehensive test coverage analysis and detailed reporting for automotive embedded systems.",
      tags: ["VectorCAST", "Unit Testing", "Report Generation", "Python"],
      links: [
        { label: "GitHub", url: "https://github.com/suduli/VectorCast_Unit_Report_genration", icon: "FaGithub" }
      ]
    },
    {
      title: "VectorCast SI Report Generator",
      description: "System Integration (SI) report generator for VectorCAST testing framework, enabling automated documentation and analysis of integration test results in automotive projects.",
      tags: ["VectorCAST", "Integration Testing", "Automation", "SI Testing"],
      links: [
        { label: "GitHub", url: "https://github.com/suduli/VectorCast_SI_Report_Generator", icon: "FaGithub" }
      ]
    },
    {
      title: "VectorCAST Import Error Remover",
      description: "Utility tool for resolving and automatically fixing common import errors in VectorCAST projects, streamlining the setup process for automotive testing environments.",
      tags: ["VectorCAST", "Error Handling", "Utility Tool", "Automation"],
      links: [
        { label: "GitHub", url: "https://github.com/suduli/VectorCAST_Import-Error-Remover", icon: "FaGithub" }
      ]
    },
    {
      title: "VectorCAST Report Analyser",
      description: "Advanced analysis tool for VectorCAST test reports, providing detailed insights, trend analysis, and quality metrics for automotive software testing outcomes.",
      tags: ["VectorCAST", "Report Analysis", "Data Analytics", "Quality Metrics"],
      links: [
        { label: "GitHub", url: "https://github.com/suduli/VectorCAST_Report_Analyser", icon: "FaGithub" }
      ]
    },
    {
      title: "VectorCAST Bench Setup",
      description: "Automated bench setup and configuration tool for VectorCAST testing environments, simplifying the initialization and management of automotive testing workbenches.",
      tags: ["VectorCAST", "Setup Automation", "Configuration", "Workbench"],
      links: [
        { label: "GitHub", url: "https://github.com/suduli/VectorCAST_Bench_setup", icon: "FaGithub" }
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Engineering (B.E)",
      institution: "The Aeronautical Society of India",
      year: "Completed 2017",
      description: "Comprehensive engineering education with focus on technical fundamentals and practical applications in the automotive and aerospace domains."
    }
  ],
  languages: [
    { name: "English", level: "Professional Proficiency" },
    { name: "Hindi", level: "Native" }
  ],
  contact: {
    email: "suduli.office@gmail.com",
    linkedin: "linkedin.com/in/suduli",
    phone: "+91 9500097614",
    location: "Bengaluru, India"
  },
  social: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/suduli/", icon: "FaLinkedin" },
    { platform: "GitHub", url: "https://github.com/suduli", icon: "FaGithub" },
    { platform: "Twitter", url: "#", icon: "FaTwitter" }
  ]
};
