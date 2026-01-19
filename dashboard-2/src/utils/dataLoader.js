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
 * Updated for 21 questions with predefined values that result in expected risk levels.
 * 
 * Question directions:
 * - POSITIVE (higher = better): q1, q2, q3, q4, q5, q6, q9, q12, q13, q14, q15, q20
 * - NEGATIVE (higher = worse): q7, q8, q10, q11, q16, q17, q18, q19, q21
 * 
 * @param {string} scenario - 'low', 'medium', 'high', or 'random'
 * @returns {Object} Form responses: { q1: 4, q2: 5, ... }
 */
export function generateMockResponses(scenario = 'random') {
  const scenarios = {
    // ============ LOW RISK PROFILE ============
    // High positive indicators, low negative indicators
    // Expected: Overall risk < 33%, "Low Risk" classification
    low: {
      // Academic Consistency (positive direction - high values = good)
      q1: 5,  // Academic confidence - Very confident
      q2: 5,  // Faculty help seeking - Always seek help
      q3: 5,  // Teaching quality - Excellent
      q4: 5,  // Academic support availability - Very available
      q5: 5,  // Admin support satisfaction - Very satisfied
      q6: 4,  // Counseling frequency - Monthly

      // Emotional Well-being (mixed directions)
      q7: 1,  // Stress level (negative) - No stress
      q8: 1,  // Social isolation (negative) - Never isolated
      q9: 5,  // Family support (positive) - Strong support
      q10: 1, // Workload overwhelm (negative) - Never overwhelmed
      q11: 1, // Health issues (negative) - No issues

      // Engagement & Motivation (mixed directions)
      q12: 5, // Course interest (positive) - Very interested
      q13: 5, // Study motivation (positive) - Very motivated
      q14: 5, // Extracurricular (positive) - Regularly engaged
      q15: 5, // Attendance rate (positive) - 90% and above
      q16: 1, // Dropout consideration (negative) - Never considered

      // External / Financial Pressure (mixed directions)
      q17: 1, // Financial problems (negative) - No problems
      q18: 1, // Scholarship/loan dependency (negative) - No dependency
      q19: 1, // External commitments (negative) - No commitments
      q20: 5, // Study hours (positive) - More than 6 hours
      q21: 1, // Family dependents (negative) - None
    },

    // ============ MEDIUM RISK PROFILE ============
    // Mixed indicators, moderate scores
    // Expected: Overall risk 33-66%, "Medium Risk" classification
    medium: {
      // Academic Consistency
      q1: 3,  // Academic confidence - Moderate
      q2: 3,  // Faculty help seeking - Sometimes
      q3: 3,  // Teaching quality - Average
      q4: 3,  // Academic support availability - Moderate
      q5: 3,  // Admin support satisfaction - Neutral
      q6: 2,  // Counseling frequency - Rarely

      // Emotional Well-being
      q7: 3,  // Stress level - Moderate stress
      q8: 3,  // Social isolation - Sometimes isolated
      q9: 3,  // Family support - Moderate support
      q10: 3, // Workload overwhelm - Sometimes
      q11: 2, // Health issues - Minor issues

      // Engagement & Motivation
      q12: 3, // Course interest - Moderate interest
      q13: 3, // Study motivation - Moderate
      q14: 3, // Extracurricular - Occasionally
      q15: 3, // Attendance rate - 70-79%
      q16: 3, // Dropout consideration - Maybe

      // External / Financial Pressure
      q17: 3, // Financial problems - Some impact
      q18: 3, // Scholarship/loan dependency - Moderate
      q19: 2, // External commitments - Some
      q20: 3, // Study hours - 2-4 hours
      q21: 3, // Family dependents - Moderate
    },

    // ============ HIGH RISK PROFILE ============
    // Low positive indicators, high negative indicators
    // Expected: Overall risk > 66%, "High Risk" classification
    high: {
      // Academic Consistency (low values for positive direction)
      q1: 1,  // Academic confidence - Not confident
      q2: 1,  // Faculty help seeking - Never seek help
      q3: 2,  // Teaching quality - Poor
      q4: 1,  // Academic support availability - Not available
      q5: 1,  // Admin support satisfaction - Not satisfied
      q6: 1,  // Counseling frequency - Never

      // Emotional Well-being (high values for negative direction)
      q7: 5,  // Stress level - Extremely stressed
      q8: 5,  // Social isolation - Always isolated
      q9: 1,  // Family support - No support
      q10: 5, // Workload overwhelm - Always overwhelmed
      q11: 4, // Health issues - Significant issues

      // Engagement & Motivation
      q12: 1, // Course interest - Not interested
      q13: 1, // Study motivation - Not motivated
      q14: 1, // Extracurricular - Never
      q15: 1, // Attendance rate - Below 40%
      q16: 5, // Dropout consideration - Definitely yes

      // External / Financial Pressure
      q17: 5, // Financial problems - Greatly affected
      q18: 5, // Scholarship/loan dependency - Fully dependent
      q19: 5, // External commitments - Multiple commitments
      q20: 1, // Study hours - Less than 1 hour
      q21: 5, // Family dependents - 5 or more
    },

    // ============ RANDOM PROFILE ============
    random: () => {
      const mock = {};
      for (let i = 1; i <= 21; i++) {
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

