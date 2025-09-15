// Shared skills data (subset reused) for variant pages
export const SKILLS = [
  // Learning category (newly added section)
  { name: 'Machine Learning', category: 'Learning', level: 60, tags:['ai','algorithms','data'], desc: 'Statistical modeling techniques for predictive analytics.', endorsements: 3, experience: 'Currently exploring applications in automotive testing' },
  { name: 'AI', category: 'Learning', level: 55, tags:['deep-learning','neural-networks'], desc: 'Artificial intelligence systems and algorithms.', endorsements: 2, experience: 'Studying applications for automotive systems' },
  { name: 'Vibe Coding', category: 'Learning', level: 50, tags:['innovative','experimental'], desc: 'Modern coding approach emphasizing aesthetic and intuitive design.', endorsements: 1, experience: 'Exploring for enhanced UI/UX implementation' },
  { name: 'KDT (Keyword-Driven Testing)', category: 'Learning', level: 65, tags:['automation','frameworks'], desc: 'Framework approach using keywords for test automation.', endorsements: 3, experience: 'Implementing in current test processes' },
  { name: 'Xray', category: 'Learning', level: 58, tags:['jira','test-management'], desc: 'Test management tool for Jira ecosystems.', endorsements: 2, experience: 'Adopting for test reporting and management' },
  { name: 'Gherkin', category: 'Learning', level: 62, tags:['bdd','specifications'], desc: 'Business-readable domain-specific language for behavior descriptions.', endorsements: 3, experience: 'Implementing in current project documentation' },
  { name: 'Behavior-Driven Development (BDD)', category: 'Learning', level: 60, tags:['agile','collaboration'], desc: 'Development approach emphasizing collaboration between technical and non-technical participants.', endorsements: 2, experience: 'Adopting methodologies for current projects' },
  { name: 'Cucumber in Python', category: 'Learning', level: 55, tags:['bdd','automation'], desc: 'Python implementation of Cucumber for BDD test automation.', endorsements: 1, experience: 'Building test suites with this framework' },
  { name: 'Love', category: 'Learning', level: 95, tags:['passion','dedication'], desc: 'Bringing passion and dedication to all technical endeavors.', endorsements: 8, experience: 'Lifelong commitment to craftsmanship' },

  { name: 'Black Box Testing', category: 'Testing', level: 92, tags:['functional','system','validation'], desc: 'Focus on external behavior without viewing internal code.', endorsements: 15, experience: '5+ years in automotive testing projects' },
  { name: 'Regression Testing', category: 'Testing', level: 88, tags:['stability','maintenance'], desc: 'Ensures unchanged behavior after code modifications.', endorsements: 12, experience: '4 years in software maintenance' },
  { name: 'Integration Testing', category: 'Testing', level: 86, tags:['interfaces','modules'], desc: 'Validates contract between combined modules.', endorsements: 10, experience: '3 years in module integration' },
  { name: 'Unit Testing', category: 'Testing', level: 83, tags:['granular','logic'], desc: 'Isolates functionality for low-level logic validation.', endorsements: 14, experience: '4 years in unit-level validation' },
  { name: 'System Testing', category: 'Testing', level: 84, tags:['end-to-end'], desc: 'Verifies complete system behavior vs requirements.', endorsements: 11, experience: '3 years in end-to-end testing' },
  { name: 'HIL Testing', category: 'Simulation', level: 70, tags:['hardware','realtime'], desc: 'Validates control logic with hardware in loop.', endorsements: 8, experience: '2 years in hardware simulation' },
  { name: 'SIL Testing', category: 'Simulation', level: 68, tags:['simulation','early'], desc: 'Software execution within simulated environment.', endorsements: 7, experience: '2 years in software simulation' },
  { name: 'Embedded C', category: 'Programming', level: 82, tags:['firmware','memory'], desc: 'Low-level language for performance and control.', endorsements: 18, experience: '6 years in embedded systems' },
  { name: 'Python', category: 'Programming', level: 78, tags:['automation','scripting'], desc: 'Automation, reporting & tooling scripts.', endorsements: 16, experience: '5 years in scripting and automation' },
  { name: 'CAPL', category: 'Programming', level: 72, tags:['vector','bus'], desc: 'Vector tool scripting for CAN bus scenarios.', endorsements: 9, experience: '3 years in CAN bus scripting' },
  { name: 'UDS', category: 'Protocols', level: 70, tags:['diagnostics','ecu'], desc: 'Unified Diagnostic Services for ECUs.', endorsements: 6, experience: '2 years in ECU diagnostics' },
  { name: 'CAN', category: 'Protocols', level: 85, tags:['network','bus'], desc: 'Primary automotive communication bus.', endorsements: 20, experience: '7 years in automotive networking' },
  { name: 'AUTOSAR', category: 'Protocols', level: 65, tags:['architecture'], desc: 'Standardized automotive software framework.', endorsements: 5, experience: '2 years in AUTOSAR implementation' },
  { name: 'ISO 26262', category: 'Safety', level: 60, tags:['functional safety'], desc: 'Guidelines for automotive functional safety.', endorsements: 4, experience: '1 year in safety compliance' },
  { name: 'VectorCast', category: 'Tools', level: 80, tags:['unit','coverage'], desc: 'Unit & integration test environment.', endorsements: 13, experience: '4 years using VectorCast' },
  { name: 'Trace32 Debugging', category: 'Tools', level: 74, tags:['jtag','firmware'], desc: 'Hardware level debugging & introspection.', endorsements: 10, experience: '3 years in hardware debugging' },
  { name: 'dSPACE', category: 'Tools', level: 68, tags:['hil','simulation'], desc: 'Real-time hardware in the loop platform.', endorsements: 7, experience: '2 years with dSPACE' },
  { name: 'ECU-Test Tool', category: 'Tools', level: 66, tags:['automation','ecu'], desc: 'Automated functional/integration ECU testing.', endorsements: 8, experience: '2 years in ECU testing automation' },
  { name: 'Structural Coverage', category: 'Coverage', level: 77, tags:['branch','statement'], desc: 'Execution path measurement for untested code.', endorsements: 9, experience: '3 years in coverage analysis' },
  { name: 'MC/DC', category: 'Coverage', level: 78, tags:['safety','logic'], desc: 'Modified Condition/Decision Coverage expertise.', endorsements: 10, experience: '3 years in MC/DC coverage' },
  { name: 'DOORS', category: 'Requirements', level: 75, tags:['traceability'], desc: 'Requirement management & impact tracking.', endorsements: 11, experience: '4 years in requirements management' },
  { name: 'Rhapsody', category: 'Requirements', level: 55, tags:['modeling'], desc: 'UML/SysML model-driven design tool.', endorsements: 3, experience: '1 year in modeling tools' },
  { name: 'Git', category: 'Version Control', level: 82, tags:['branching'], desc: 'Distributed version control & collaboration.', endorsements: 22, experience: '6 years in version control' },
  { name: 'SVN', category: 'Version Control', level: 60, tags:['centralized'], desc: 'Centralized version control (legacy flows).', endorsements: 5, experience: '2 years in legacy systems' }
];

export const CATEGORY_COLORS = ['teal','blue','purple','green','orange','red','gold','rose'];

export function colorForCategory(cat){
  let h=0; for(let i=0;i<cat.length;i++){ h = Math.imul(31,h)+cat.charCodeAt(i)|0; }
  return CATEGORY_COLORS[Math.abs(h)%CATEGORY_COLORS.length];
}
