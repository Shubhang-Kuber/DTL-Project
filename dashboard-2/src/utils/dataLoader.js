/**
 * Data Loading Utility
 * 
 * Provides functions to load and process CSV/JSON data
 * for testing and integration with backend analysis outputs.
 * 
 * This utility supports:
 * - Loading CSV files (for student response data)
 * - Loading JSON files (for processed factor scores)
 * - Converting CSV rows to form-compatible format
 * - Mock data generation for testing
 */

/**
 * Parse CSV string into array of objects
 * 
 * @param {string} csvText - CSV file content as string
 * @param {string} delimiter - CSV delimiter (default: ',')
 * @returns {Array<Object>} Array of row objects
 */
export function parseCSV(csvText, delimiter = ',') {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(delimiter).map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    if (values.length !== headers.length) continue;

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Load CSV file from URL or local path
 * 
 * @param {string} url - URL or path to CSV file
 * @returns {Promise<Array<Object>>} Promise resolving to array of row objects
 */
export async function loadCSV(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
}

/**
 * Load JSON file from URL or local path
 * 
 * @param {string} url - URL or path to JSON file
 * @returns {Promise<Object>} Promise resolving to JSON object
 */
export async function loadJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON:', error);
    throw error;
  }
}

/**
 * Convert CSV row to form-compatible response format
 * 
 * Maps CSV columns to question IDs based on field names.
 * This is a simplified mapping - adjust based on your actual CSV structure.
 * 
 * @param {Object} csvRow - Single row from CSV
 * @param {Object} fieldMapping - Mapping from CSV columns to question IDs
 * @returns {Object} Form responses: { q1: 4, q2: 5, ... }
 */
export function csvRowToFormResponses(csvRow, fieldMapping = {}) {
  const responses = {};
  
  // Default mapping (adjust based on your CSV structure)
  const defaultMapping = {
    // Example mappings - customize based on your dataset
    'Interest': 'q1',
    'Motivation': 'q2',
    'Confidence': 'q3',
    'Stress': 'q4',
    'Financial': 'q5',
    'Family Support': 'q6',
    'Institutional Support': 'q7',
    'Isolation': 'q8',
    'External Commitments': 'q9',
    'Attendance': 'q10',
    'Extracurricular': 'q11',
    'Dropout Consideration': 'q12',
  };

  const mapping = { ...defaultMapping, ...fieldMapping };

  Object.entries(mapping).forEach(([csvColumn, questionId]) => {
    const value = csvRow[csvColumn];
    if (value !== undefined && value !== null && value !== '') {
      // Convert to integer if possible, otherwise use as-is
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        responses[questionId] = numValue;
      }
    }
  });

  return responses;
}

/**
 * Generate mock form responses for testing
 * 
 * @param {string} scenario - 'low', 'medium', 'high', or 'random'
 * @returns {Object} Form responses: { q1: 4, q2: 5, ... }
 */
export function generateMockResponses(scenario = 'random') {
  const responses = {};

  const scenarios = {
    low: {
      // Low risk: high positive indicators, low negative indicators
      q1: 5, q2: 5, q3: 5, q4: 1, q5: 1, q6: 5, q7: 5, q8: 1, q9: 1, q10: 5, q11: 5, q12: 1,
    },
    medium: {
      // Medium risk: mixed responses
      q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3, q7: 3, q8: 3, q9: 3, q10: 3, q11: 3, q12: 3,
    },
    high: {
      // High risk: low positive indicators, high negative indicators
      q1: 1, q2: 1, q3: 1, q4: 5, q5: 5, q6: 1, q7: 1, q8: 5, q9: 5, q10: 1, q11: 1, q12: 5,
    },
    random: () => {
      // Random responses
      const mock = {};
      for (let i = 1; i <= 12; i++) {
        mock[`q${i}`] = Math.floor(Math.random() * 5) + 1;
      }
      return mock;
    },
  };

  if (scenario === 'random') {
    return scenarios.random();
  }

  return scenarios[scenario] || scenarios.random();
}

/**
 * Process factor scores from backend analysis output
 * 
 * Converts backend factor analysis results (e.g., from PCA) into
 * the format expected by the dashboard.
 * 
 * @param {Object} backendData - Backend analysis output
 * @param {Object} factorMapping - Mapping from backend factor names to dashboard factor names
 * @returns {Object} Factor scores: { 'Academic Consistency': 0.35, ... }
 */
export function processBackendFactorScores(backendData, factorMapping = {}) {
  const defaultMapping = {
    'Factor1': 'Academic Consistency',
    'Factor2': 'Emotional Well-being',
    'Factor3': 'Engagement & Motivation',
    'Factor4': 'External / Financial Pressure',
  };

  const mapping = { ...defaultMapping, ...factorMapping };
  const factorScores = {};

  Object.entries(mapping).forEach(([backendName, dashboardName]) => {
    if (backendData[backendName] !== undefined) {
      // Normalize to [0, 1] range if needed
      let score = backendData[backendName];
      if (score < 0) score = 0;
      if (score > 1) score = 1;
      factorScores[dashboardName] = score;
    }
  });

  return factorScores;
}

/**
 * Export analysis data to JSON format
 * 
 * @param {Object} analysisData - Complete analysis data object
 * @returns {string} JSON string
 */
export function exportAnalysisToJSON(analysisData) {
  return JSON.stringify(analysisData, null, 2);
}

/**
 * Import analysis data from JSON format
 * 
 * @param {string} jsonString - JSON string
 * @returns {Object} Analysis data object
 */
export function importAnalysisFromJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON format');
  }
}

