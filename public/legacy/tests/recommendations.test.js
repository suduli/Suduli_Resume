const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('🧪 Starting Recommendation Utils Tests...');

const utils = require('../assets/js/utils/recommendation-utils.js');

// Sample CSV content
const csv = [
  'First Name,Last Name,Company,Job Title,Text,Creation Date,Status',
  'John,Doe,Acme Inc,Lead,"Great work, strong delivery",06/30/25, VISIBLE',
  'Jane,Smith,Globex,Mgr,"Outstanding support",12/05/24, VISIBLE',
  'John,Doe,Acme Inc,Lead,"Great work, strong delivery",06/30/25, VISIBLE',
  'Amy,Ross,Initrode,Eng,"""Dependable"" and skilled",01/15/2025, HIDDEN'
].join('\n');

// Test parseCSV
const rows = utils.parseCSV(csv);
assert(Array.isArray(rows) && rows.length === 4, 'CSV should parse into 4 rows');
assert(rows[0].Company === 'Acme Inc', 'Company field parsed');
assert(rows[2].Text === 'Great work, strong delivery', 'Quoted text parsed');
assert(rows[3].Text === '"Dependable" and skilled', 'Escaped quotes handled');

// Test extractYear
assert.strictEqual(utils.extractYear('06/30/25, 12:37 PM'), 2025, '2-digit year expanded to 2025');
assert.strictEqual(utils.extractYear('01/15/2025'), 2025, '4-digit year parsed');
assert.strictEqual(utils.extractYear(''), null, 'Empty returns null');

// Test filterVisible (case insensitive option)
const visibleStrict = utils.filterVisible(rows);
// Parser trims values; strict comparison now counts 3 exact 'VISIBLE' rows
assert.strictEqual(visibleStrict.length, 3, 'Strict filter should count exactly 3 rows');
const visibleCI = utils.filterVisible(rows, { caseInsensitive: true });
assert(visibleCI.length === 3, 'Case-insensitive visible count should be 3');

// Test dedupeByFields
const deduped = utils.dedupeByFields(visibleCI, ['First Name','Last Name','Company','Text']);
assert(deduped.length === 2, 'Deduped by fields should collapse duplicates');

console.log('✅ Recommendation Utils tests passed');

console.log('🧪 Starting Recommendation Summary Tests...');

// Mock DOM for summary
global.document = {
  getElementById: () => ({ innerHTML: '' }),
  addEventListener: () => {}
};
global.window = {};
global.fetch = async () => ({ ok: true, text: async () => csv });

const RecommendationSummary = require('../assets/js/features/recommendations/recommendation-summary.js');
const summary = new RecommendationSummary();
summary.currentYear = 2025;

summary.loadRecommendations().then((res) => {
  assert.strictEqual(res.currentYearCount, 1, 'One current year visible unique rec');
  assert.strictEqual(res.totalCount >= 2, true, 'Total visible count matches or exceeds 2');
  console.log('✅ Recommendation Summary tests passed');
}).catch((e) => {
  console.error('❌ Recommendation Summary tests failed', e);
  process.exitCode = 1;
});
