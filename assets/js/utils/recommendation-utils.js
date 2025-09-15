// moved from utils/recommendation-utils.js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.RecommendationUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Parse a single CSV line handling quoted fields (including escaped quotes)
  function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  // Parse CSV text to array of objects
  function parseCSV(csvText) {
    const lines = String(csvText || '')
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = parseCSVLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) continue;
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j];
      }
      rows.push(row);
    }
    return rows;
  }

  // Extract year from date string (supports MM/DD/YY and MM/DD/YYYY and optional time suffix after comma)
  function extractYear(dateString) {
    if (!dateString) return null;
    try {
      const datePart = String(dateString).split(',')[0].trim();
      const parts = datePart.split('/');
      if (parts.length === 3) {
        let year = parseInt(parts[2], 10);
        if (Number.isNaN(year)) return null;
        // Convert 2-digit year to 4-digit to preserve existing behavior
        if (year < 50) {
          year += 2000; // 00-49 => 2000-2049
        } else if (year < 100) {
          year += 1900; // 50-99 => 1950-1999
        }
        return year;
      }
    } catch (e) {
      // swallow and return null to match existing tolerance
    }
    return null;
  }

  // Filter rows by Status === 'VISIBLE' (case-sensitive to preserve behavior in summary; cards used to upper)
  function filterVisible(rows, options = { caseInsensitive: false }) {
    if (!Array.isArray(rows)) return [];
    if (options.caseInsensitive) {
      return rows.filter((r) => String(r.Status || '').toUpperCase() === 'VISIBLE');
    }
    return rows.filter((r) => r.Status === 'VISIBLE');
  }

  // Generic deduplication by specified fields
  function dedupeByFields(rows, fields) {
    if (!Array.isArray(rows) || !Array.isArray(fields) || fields.length === 0) return rows || [];
    const seen = new Set();
    const out = [];
    for (const r of rows) {
      const key = fields.map((f) => String(r[f] || '')).join('|');
      if (!seen.has(key)) {
        seen.add(key);
        out.push(r);
      }
    }
    return out;
  }

  return {
    parseCSVLine,
    parseCSV,
    extractYear,
    filterVisible,
    dedupeByFields,
  };
});
