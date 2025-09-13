// Shared skills data (subset reused) for variant pages
export const SKILLS = [
  { name: 'Black Box Testing', category: 'Testing', level: 92, tags:['functional','system','validation'], desc: 'Focus on external behavior without viewing internal code.' },
  { name: 'Regression Testing', category: 'Testing', level: 88, tags:['stability','maintenance'], desc: 'Ensures unchanged behavior after code modifications.' },
  { name: 'Integration Testing', category: 'Testing', level: 86, tags:['interfaces','modules'], desc: 'Validates contract between combined modules.' },
  { name: 'Unit Testing', category: 'Testing', level: 83, tags:['granular','logic'], desc: 'Isolates functionality for low-level logic validation.' },
  { name: 'System Testing', category: 'Testing', level: 84, tags:['end-to-end'], desc: 'Verifies complete system behavior vs requirements.' },
  { name: 'HIL Testing', category: 'Simulation', level: 70, tags:['hardware','realtime'], desc: 'Validates control logic with hardware in loop.' },
  { name: 'SIL Testing', category: 'Simulation', level: 68, tags:['simulation','early'], desc: 'Software execution within simulated environment.' },
  { name: 'Embedded C', category: 'Programming', level: 82, tags:['firmware','memory'], desc: 'Low-level language for performance and control.' },
  { name: 'Python', category: 'Programming', level: 78, tags:['automation','scripting'], desc: 'Automation, reporting & tooling scripts.' },
  { name: 'CAPL', category: 'Programming', level: 72, tags:['vector','bus'], desc: 'Vector tool scripting for CAN bus scenarios.' },
  { name: 'UDS', category: 'Protocols', level: 70, tags:['diagnostics','ecu'], desc: 'Unified Diagnostic Services for ECUs.' },
  { name: 'CAN', category: 'Protocols', level: 85, tags:['network','bus'], desc: 'Primary automotive communication bus.' },
  { name: 'AUTOSAR', category: 'Protocols', level: 65, tags:['architecture'], desc: 'Standardized automotive software framework.' },
  { name: 'ISO 26262', category: 'Safety', level: 60, tags:['functional safety'], desc: 'Guidelines for automotive functional safety.' },
  { name: 'VectorCast', category: 'Tools', level: 80, tags:['unit','coverage'], desc: 'Unit & integration test environment.' },
  { name: 'Trace32 Debugging', category: 'Tools', level: 74, tags:['jtag','firmware'], desc: 'Hardware level debugging & introspection.' },
  { name: 'dSPACE', category: 'Tools', level: 68, tags:['hil','simulation'], desc: 'Real-time hardware in the loop platform.' },
  { name: 'ECU-Test Tool', category: 'Tools', level: 66, tags:['automation','ecu'], desc: 'Automated functional/integration ECU testing.' },
  { name: 'Structural Coverage', category: 'Coverage', level: 77, tags:['branch','statement'], desc: 'Execution path measurement for untested code.' },
  { name: 'MC/DC', category: 'Coverage', level: 78, tags:['safety','logic'], desc: 'Modified Condition/Decision Coverage expertise.' },
  { name: 'DOORS', category: 'Requirements', level: 75, tags:['traceability'], desc: 'Requirement management & impact tracking.' },
  { name: 'Rhapsody', category: 'Requirements', level: 55, tags:['modeling'], desc: 'UML/SysML model-driven design tool.' },
  { name: 'Git', category: 'Version Control', level: 82, tags:['branching'], desc: 'Distributed version control & collaboration.' },
  { name: 'SVN', category: 'Version Control', level: 60, tags:['centralized'], desc: 'Centralized version control (legacy flows).' }
];

export const CATEGORY_COLORS = ['teal','blue','purple','green','orange','red','gold','rose'];

export function colorForCategory(cat){
  let h=0; for(let i=0;i<cat.length;i++){ h = Math.imul(31,h)+cat.charCodeAt(i)|0; }
  return CATEGORY_COLORS[Math.abs(h)%CATEGORY_COLORS.length];
}
