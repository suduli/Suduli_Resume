// Shared skills data (subset reused) for variant pages
export const SKILLS = [
  // Learning category (newly added section)
  { name: 'Machine Learning', category: 'Learning', level: 60, tags:['ai','algorithms','data'], desc: 'Statistical modeling techniques for predictive analytics.', experience: 'Currently exploring applications in automotive testing' },
  { name: 'AI', category: 'Learning', level: 55, tags:['deep-learning','neural-networks'], desc: 'Artificial intelligence systems and algorithms.', experience: 'Studying applications for automotive systems' },
  { name: 'Vibe Coding', category: 'Learning', level: 50, tags:['innovative','experimental'], desc: 'Modern coding approach emphasizing aesthetic and intuitive design.', experience: 'Exploring for enhanced UI/UX implementation' },
  { name: 'KDT (Keyword-Driven Testing)', category: 'Learning', level: 65, tags:['automation','frameworks'], desc: 'Framework approach using keywords for test automation.', experience: 'Implementing in current test processes' },
  { name: 'Xray', category: 'Learning', level: 58, tags:['jira','test-management'], desc: 'Test management tool for Jira ecosystems.', experience: 'Adopting for test reporting and management' },
  { name: 'Gherkin', category: 'Learning', level: 62, tags:['bdd','specifications'], desc: 'Business-readable domain-specific language for behavior descriptions.', experience: 'Implementing in current project documentation' },
  { name: 'Behavior-Driven Development (BDD)', category: 'Learning', level: 60, tags:['agile','collaboration'], desc: 'Development approach emphasizing collaboration between technical and non-technical participants.', experience: 'Adopting methodologies for current projects' },
  { name: 'Cucumber in Python', category: 'Learning', level: 55, tags:['bdd','automation'], desc: 'Python implementation of Cucumber for BDD test automation.', experience: 'Building test suites with this framework' },
  { name: 'Love', category: 'Learning', level: 95, tags:['passion','dedication'], desc: 'Bringing passion and dedication to all technical endeavors.', experience: 'Lifelong commitment to craftsmanship' },

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
  { name: 'Structural Coverage', category: 'Coverage', level: 77, tags:['branch','statement'], desc: 'Execution path measurement for untested code.', experience: '3 years in coverage analysis' },
  { name: 'MC/DC', category: 'Coverage', level: 78, tags:['safety','logic'], desc: 'Modified Condition/Decision Coverage expertise.', experience: '3 years in MC/DC coverage' },
  { name: 'DOORS', category: 'Requirements', level: 75, tags:['traceability'], desc: 'Requirement management & impact tracking.', experience: '4 years in requirements management' },
  { name: 'Rhapsody', category: 'Requirements', level: 55, tags:['modeling'], desc: 'UML/SysML model-driven design tool.', experience: '1 year in modeling tools' },
  { name: 'Git', category: 'Version Control', level: 82, tags:['branching'], desc: 'Distributed version control & collaboration.', experience: '6 years in version control' },
  { name: 'SVN', category: 'Version Control', level: 60, tags:['centralized'], desc: 'Centralized version control (legacy flows).', experience: '2 years in legacy systems' }
];

export const CATEGORY_COLORS = ['teal','blue','purple','green','orange','red','gold','rose'];

export function colorForCategory(cat){
  let h=0; for(let i=0;i<cat.length;i++){ h = Math.imul(31,h)+cat.charCodeAt(i)|0; }
  return CATEGORY_COLORS[Math.abs(h)%CATEGORY_COLORS.length];
}
