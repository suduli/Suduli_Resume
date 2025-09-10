const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'frontend', 'public', 'data');
const requiredFiles = [
  'profile.json',
  'experience.json',
  'projects.json',
  'skills.json',
  'education.json',
  'awards.json',
  'languages.json',
  'contact-form.json'
];

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse ${filePath}: ${err.message}`);
  }
}

let allOk = true;
requiredFiles.forEach((fname) => {
  const p = path.join(dataDir, fname);
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${fname} not found in ${dataDir}`);
    allOk = false;
    return;
  }

  try {
    const json = loadJson(p);
    // basic validation: ensure non-empty
    if (json === null || (typeof json === 'object' && Object.keys(json).length === 0)) {
      console.error(`INVALID: ${fname} is empty or null`);
      allOk = false;
      return;
    }

    console.log(`OK: ${fname} parsed (${Array.isArray(json) ? json.length + ' items' : Object.keys(json).length + ' keys'})`);
  } catch (err) {
    console.error(`ERROR: ${err.message}`);
    allOk = false;
  }
});

if (!allOk) {
  console.error('\nOne or more checks failed.');
  process.exit(2);
}

console.log('\nAll data files present and parsable.');
