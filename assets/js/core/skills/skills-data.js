// Core Skills data synchronized with updated Automotive Validation Resume
export const SKILLS = [
  // 1. HIL, Bench & Simulation
  { name: 'Vector-based HIL', category: 'HIL & Simulation', level: 92, tags: ['hil', 'vector', 'bench', 'realtime'], desc: 'ECU functional and regression validation in Vector-based Hardware-in-the-Loop environments.', experience: 'Hands-on validation across JLR and OEM programs' },
  { name: 'ECU Bench Setup & Integration', category: 'HIL & Simulation', level: 90, tags: ['bench', 'ecu', 'hardware', 'wiring'], desc: 'DCU-20 and ECU test benches setup using variable power supplies, JTAG, JIG fixtures, and harnesses.', experience: 'Setup and verified complex multi-ECU validation benches' },
  { name: 'CANcase XL Hardware', category: 'HIL & Simulation', level: 88, tags: ['vector', 'hardware', 'can', 'bus-interface'], desc: 'Vector hardware interface integration, DB9/120-ohm CAN termination, and physical layer analysis.', experience: 'Utilized across bench testing and physical ECU verification' },
  { name: 'dSPACE VEOS', category: 'HIL & Simulation', level: 86, tags: ['dspace', 'veos', 'virtual-ecu', 'hil'], desc: 'Virtual ECU simulation and test execution for body control and safety-critical functions.', experience: 'Extensive use on Stellantis automotive validation projects' },
  { name: 'ECU-TEST Tool', category: 'HIL & Simulation', level: 90, tags: ['automation', 'trace-analysis', 'test-bench'], desc: 'Test automation, execution, and testbench management across dSPACE and virtual environments.', experience: 'Automated test suites reducing manual testing by 40%' },
  { name: 'SIL Testing', category: 'HIL & Simulation', level: 82, tags: ['sil', 'simulation', 'embedded'], desc: 'Software-in-the-Loop simulation environments for pre-hardware algorithm verification.', experience: 'Executed module and system-level SIL testing' },

  // 2. Automation & Scripting
  { name: 'Python', category: 'Automation & Scripting', level: 90, tags: ['python', 'automation', 'parsing', 'tooling'], desc: 'Test automation scripts, report generation, and Gherkin scenario parsing into CAPL test scripts.', experience: '5+ years developing custom engineering automation frameworks' },
  { name: 'CAPL', category: 'Automation & Scripting', level: 88, tags: ['capl', 'vector', 'can', 'scripting'], desc: 'Vector tool scripting for CAN bus messaging, sensor simulation, and automated test sequences.', experience: 'Core scripting language for CANoe test environments across JLR/Halla' },
  { name: 'Gherkin / BDD', category: 'Automation & Scripting', level: 88, tags: ['bdd', 'gherkin', 'automation', 'test-cases'], desc: 'Behavior-Driven Development test scenarios, feature files, and reusable step-definition (SD) files.', experience: 'Automated Gherkin test scenarios with Python parsing for CANoe execution' },
  { name: 'Embedded C', category: 'Automation & Scripting', level: 84, tags: ['c', 'embedded', 'firmware', 'unit-test'], desc: 'Low-level programming language for automotive ECUs, firmware introspection, and algorithm analysis.', experience: '6+ years in automotive embedded systems' },
  { name: 'vTESTstudio', category: 'Automation & Scripting', level: 86, tags: ['vector', 'test-design', 'automation'], desc: 'Test design environment for automated testing of embedded software via CANoe.', experience: 'Automated ADAS failsafe test cases with variant coding' },
  { name: 'VectorCAST', category: 'Automation & Scripting', level: 92, tags: ['unit-testing', 'coverage', 'integration'], desc: 'Automated unit and integration test suite development, achieving up to 98% MC/DC coverage.', experience: '4+ years driving coverage-driven unit and integration validation' },
  { name: 'Kiara', category: 'Automation & Scripting', level: 80, tags: ['regression', 'nightly-runs', 'automation'], desc: 'Execution platform for automated overnight regression suites linked with Jira Xray.', experience: 'Configured and executed overnight regression suites on JLR programs' },

  // 3. Diagnostics & Networks
  { name: 'UDS (ISO 14229)', category: 'Diagnostics & Networks', level: 95, tags: ['uds', 'diagnostics', 'iso14229', 'dtc'], desc: 'Unified Diagnostic Services: session control, security access, routine control, and flashing.', experience: 'Deep expertise; architected the browser-based UDS Simulator covering 19 services' },
  { name: 'CAN (ISO 11898)', category: 'Diagnostics & Networks', level: 92, tags: ['can', 'can-fd', 'bus', 'iso11898'], desc: 'Controller Area Network protocol architecture, signal matrix verification, and timing validation.', experience: '7+ years across body control, infotainment, and ADAS networks' },
  { name: 'Zero-DTC & Fault Injection', category: 'Diagnostics & Networks', level: 90, tags: ['zero-dtc', 'dtc', 'fault-injection', 'recovery'], desc: 'Establishment of Zero-DTC baselines, sensor blockage simulation, and UDS DTC status verification.', experience: 'Verified camera/radar blockage fault detection (0x89 active / 0x08 history)' },
  { name: 'Corvos Flashing', category: 'Diagnostics & Networks', level: 85, tags: ['corvos', 'uds', 'flashing', 'firmware'], desc: 'ECU software flashing, bootloader execution, and UDS diagnostic validation tool.', experience: 'Performed ECU flashing and diagnostics on JLR programs' },
  { name: 'Lauterbach Trace32', category: 'Diagnostics & Networks', level: 88, tags: ['trace32', 'jtag', 'bootloader', 'debugging'], desc: 'Hardware-level JTAG debugging, bootloader recovery, memory inspection, and flashing.', experience: 'Used for bootloader recovery and firmware integrity verification' },
  { name: 'XCP Protocol', category: 'Diagnostics & Networks', level: 75, tags: ['xcp', 'calibration', 'measurement'], desc: 'Universal Measurement and Calibration Protocol for ECU internal variable access.', experience: 'Measurement and calibration on powertrain and ADAS controllers' },
  { name: 'SOME/IP (Familiarity)', category: 'Diagnostics & Networks', level: 65, tags: ['someip', 'ethernet', 'soa'], desc: 'Scalable service-Oriented MiddlewarE over IP for automotive Ethernet architectures.', experience: 'Working familiarity from modern ADAS and zonal architectures' },

  // 4. Tools & Configuration
  { name: 'CANoe', category: 'Tools & Configuration', level: 94, tags: ['vector', 'canoe', 'simulation', 'bus'], desc: 'Full-featured simulation and analysis tool for CAN networks, DBC integration, and test panels.', experience: 'Primary Vector tool for camera/radar simulation and HIL execution' },
  { name: 'CANalyzer & CANdb/CANdela', category: 'Tools & Configuration', level: 90, tags: ['vector', 'canalyzer', 'candb', 'candela'], desc: 'Network analysis, signal logging, database maintenance (DBC), and diagnostic CDD authoring.', experience: 'Extensive use in bus monitoring and diagnostic parameter definition' },
  { name: 'Jira Xray', category: 'Tools & Configuration', level: 88, tags: ['jira', 'xray', 'test-management', 'traceability'], desc: 'Test management ecosystem inside Jira: test case definition, execution sets, and defect links.', experience: 'Managed test cases, execution IDs, and overnight test runs' },
  { name: 'IBM RQM & DOORS NG', category: 'Tools & Configuration', level: 88, tags: ['ibm', 'rqm', 'doors', 'alm'], desc: 'Requirements traceability and test management with IBM Engineering Lifecycle Management (ELM).', experience: 'Achieved 95% requirements-to-test traceability on Stellantis programs' },
  { name: 'Git & GitLab', category: 'Tools & Configuration', level: 86, tags: ['git', 'gitlab', 'version-control', 'ci'], desc: 'Version control for CAPL scripts, step-definition files, and test automation codebases.', experience: 'Managed repositories and collaboration workflows across distributed teams' },
  { name: 'Confluence', category: 'Tools & Configuration', level: 85, tags: ['confluence', 'documentation', 'collaboration'], desc: 'Technical documentation, test specifications, validation reports, and team collaboration.', experience: 'Authored engineering test procedures and stakeholder reports' },

  // 5. Validation & Standards
  { name: 'ADAS Failsafe Testing', category: 'Validation & Standards', level: 90, tags: ['adas', 'failsafe', 'camera', 'radar'], desc: 'Failsafe validation under sensor blockage, variant coding, voltage drops, and bus faults.', experience: 'Automated ADAS failsafe test execution for DCU-20 domain controller' },
  { name: 'Camera & Radar Simulation', category: 'Validation & Standards', level: 90, tags: ['camera', 'radar', 'sensor-simulation'], desc: 'Simulated sensor streams into ADAS domain controller via DBC environment variables and CAPL.', experience: 'End-to-end signal level verification on Halla Group programs' },
  { name: 'EOL & USM Testing', category: 'Validation & Standards', level: 88, tags: ['eol', 'usm', 'end-of-line', 'software-management'], desc: 'End-of-Line manufacturing testing and Update Software Management testing routines.', experience: 'Executed EOL and USM validation for production vehicle lines' },
  { name: 'MC/DC Coverage (Structural)', category: 'Validation & Standards', level: 92, tags: ['mcdc', 'structural-coverage', 'statement', 'branch'], desc: 'Modified Condition/Decision Coverage for ISO 26262 ASIL-D safety compliance.', experience: 'Achieved 98% MC/DC structural coverage on automotive radar projects' },
  { name: 'ISO 26262 Guidelines', category: 'Validation & Standards', level: 80, tags: ['iso26262', 'functional-safety', 'asil'], desc: 'Automotive functional safety standard compliance across V-model verification phases.', experience: 'Applied ISO 26262 guidelines to test plans, fault injection, and coverage' },
  { name: 'AUTOSAR Architecture', category: 'Validation & Standards', level: 75, tags: ['autosar', 'bsw', 'rte'], desc: 'Standardized automotive software architecture, layered software stacks, and interfaces.', experience: 'Familiarity with AUTOSAR layered models during ECU integration' },

  // 6. AI-Assisted Engineering
  { name: 'Amazon Kiro IDE', category: 'AI-Assisted Engineering', level: 80, tags: ['kiro', 'ide', 'ai', 'gitlab', 'jira'], desc: 'AI-assisted development environment integrated with Jira, Confluence, and GitLab.', experience: 'Explored for AI-assisted Gherkin test automation and code generation' },
  { name: 'AI-DLC & Prompt Engineering', category: 'AI-Assisted Engineering', level: 85, tags: ['ai-dlc', 'prompts', 'llm', 'automation'], desc: 'AI Development Life Cycle methodologies and precision prompt design for test engineering.', experience: 'Certified training completed; integrated into daily testing workflows' },
  { name: 'UDS Simulator Core (udssimulator.com)', category: 'AI-Assisted Engineering', level: 96, tags: ['uds-simulator', 'fullstack', 'rest-api', 'architecture'], desc: 'Architected and launched interactive browser-based UDS protocol simulator with WCAG 2.1 AAA.', experience: 'Self-employed founder; reduced trainee onboarding by 60%' }
];

export const CATEGORY_COLORS = ['teal', 'blue', 'purple', 'green', 'orange', 'gold'];

export function colorForCategory(cat) {
  let h = 0;
  for (let i = 0; i < cat.length; i++) {
    h = Math.imul(31, h) + cat.charCodeAt(i) | 0;
  }
  return CATEGORY_COLORS[Math.abs(h) % CATEGORY_COLORS.length];
}
