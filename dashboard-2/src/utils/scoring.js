import { QUESTIONS, FACTORS, RISK_THRESHOLDS } from '../data/questions.js';

/**
 * CRITICAL FUNCTION: Normalize value to 0-1 range
 * 
 * @param {number} value - Raw response value
 * @param {number} min - Minimum scale value (e.g., 1)
 * @param {number} max - Maximum scale value (e.g., 5)
 * @returns {number} Normalized value in range [0, 1]
 */
export function normalizeValue(value, min = 1, max = 5) {
  if (value < min || value > max) return 0.5; // Default neutral
  return (value - min) / (max - min);
}

/**
 * CRITICAL FUNCTION: Invert negative indicator
 * 
 * For negatively-worded questions (e.g., "How stressed are you?"):
 * invertedValue = 6 - originalValue
 * 
 * This ensures semantic correctness:
 * - High stress (5) → inverted to (1) → normalized to (0) → low risk ✗ WRONG
 * - Actually: High stress (5) should increase risk (1) ✓ CORRECT
 * 
 * So for NEGATIVE indicators, we DON'T invert. We use the normalized value directly.
 * 
 * For POSITIVE indicators, we DO invert so high values reduce risk.
 * 
 * @param {number} normalizedValue - Value already in [0, 1]
 * @returns {number} Inverted value
 */
export function invertValue(normalizedValue) {
  return 1 - normalizedValue;
}

/**
 * CRITICAL FUNCTION: Calculate factor scores with direction-aware logic
 * 
 * MANDATORY: Negative indicators are NEVER inverted.
 * Positive indicators ARE inverted so high values reduce risk.
 * 
 * This preserves semantic correctness:
 * - Worst inputs (high stress, no motivation) → HIGH RISK
 * - Best inputs (low stress, high motivation) → LOW RISK
 * 
 * @param {Object} responses - Form responses: { q1: 4, q2: 5, ... }
 * @returns {Object} Factor scores: { 'Academic Consistency': 0.35, ... }
 */
export function calculateFactorScores(responses) {
  const factorScores = {};

  // Initialize factor score arrays
  Object.keys(FACTORS).forEach(factor => {
    factorScores[factor] = [];
  });

  // Process each question
  QUESTIONS.forEach(question => {
    const rawValue = responses[question.id];
    if (rawValue === undefined || rawValue === '') return;

    const intValue = parseInt(rawValue, 10);
    if (isNaN(intValue)) return;

    // Step 1: Normalize to [0, 1]
    let normalized = normalizeValue(intValue, 1, 5);

    // Step 2: DIRECTION-AWARE INTERPRETATION
    // 
    // NEGATIVE indicators (higher = riskier):
    //   Examples: stress, isolation, dropout intention, financial burden
    //   Semantic: normalized_value directly represents risk contribution
    //   Action: Use normalized value as-is (NO inversion)
    //   Result: High stress (1.0) → high risk contribution (1.0) ✓
    //
    // POSITIVE indicators (higher = healthier):
    //   Examples: motivation, confidence, support, attendance, interest
    //   Semantic: high values should REDUCE risk
    //   Action: Invert so high values → low risk
    //   Result: High motivation (1.0) → inverted to (0.0) → low risk ✓
    //
    if (question.direction === 'positive') {
      // For positive indicators: invert so high values reduce risk
      // Example: motivation=5 → normalized=1.0 → inverted=0.0 (low risk)
      normalized = invertValue(normalized);
    }
    // For negative indicators: use normalized value directly
    // Example: stress=5 → normalized=1.0 → (no inversion) → 1.0 (high risk)

    // Step 3: Add to factor's score array
    factorScores[question.factor].push(normalized);
  });

  // Step 4: Calculate mean for each factor
  const finalScores = {};
  Object.keys(FACTORS).forEach(factor => {
    if (factorScores[factor].length > 0) {
      const mean = factorScores[factor].reduce((a, b) => a + b, 0) / factorScores[factor].length;
      // Cap at 1.0 to maintain [0, 1] range
      finalScores[factor] = Math.min(1, mean);
    } else {
      // Default neutral score if no data
      finalScores[factor] = 0.5;
    }
  });

  return finalScores;
}

/**
 * Calculate overall risk score (weighted average of factors)
 * 
 * @param {Object} factorScores - Factor scores from calculateFactorScores()
 * @returns {number} Overall risk score in [0, 1]
 */
export function calculateOverallRiskScore(factorScores) {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  Object.entries(FACTORS).forEach(([factorName, factorDef]) => {
    const score = factorScores[factorName] || 0.5;
    const weight = factorDef.weight;
    totalWeightedScore += score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalWeightedScore : 0.5;
}

/**
 * Classify risk level based on score
 * 
 * @param {number} score - Overall risk score in [0, 1]
 * @returns {Object} { level: 'Low Risk' | 'Medium Risk' | 'High Risk', color: '#...', badge: '...' }
 */
export function classifyRisk(score) {
  if (score <= RISK_THRESHOLDS.LOW) {
    return {
      level: 'Low Risk',
      color: '#10b981',
      badge: '✓ Low Risk',
      description: 'You are performing well. Continue supporting your academic journey.',
    };
  } else if (score <= RISK_THRESHOLDS.MEDIUM) {
    return {
      level: 'Medium Risk',
      color: '#f59e0b',
      badge: '⚠ Medium Risk',
      description: 'Some challenges detected. Consider reaching out to support services.',
    };
  } else {
    return {
      level: 'High Risk',
      color: '#ef4444',
      badge: '! High Risk',
      description: 'Multiple challenges identified. Please connect with support services immediately.',
    };
  }
}

/**
 * Analyze sentiment from optional feedback text
 * 
 * @param {string} text - User feedback
 * @returns {number} Sentiment score in [-1, +1]
 */
export function analyzeSentiment(text) {
  if (!text || text.trim().length === 0) return 0;

  const lowerText = text.toLowerCase();
  const positiveWords = [
    'excited', 'happy', 'confident', 'supported', 'engaged', 'motivated',
    'enjoy', 'good', 'great', 'excellent', 'wonderful', 'grateful',
  ];
  const negativeWords = [
    'stressed', 'anxious', 'overwhelmed', 'depressed', 'hopeless', 'struggling',
    'isolated', 'lonely', 'exhausted', 'struggling', 'difficult', 'hard',
  ];

  let positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  let negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  const total = positiveCount + negativeCount;
  if (total === 0) return 0;

  return (positiveCount - negativeCount) / total;
}

/**
 * Generate recommendations based on factor scores
 * 
 * @param {Object} factorScores - Factor scores
 * @returns {Array} List of recommendations
 */
export function generateRecommendations(factorScores, recommendationsDb) {
  const recommendations = [];

  Object.entries(factorScores).forEach(([factorName, score]) => {
    // Identify factors with low scores (potential concern areas)
    if (score > RISK_THRESHOLDS.MEDIUM) {
      // High risk score for this factor
      const factorRecs = recommendationsDb[factorName];
      if (factorRecs) {
        // Add high-severity recommendations
        const highSevereity = factorRecs.find(rec => rec.severity === 'high');
        if (highSevereity) {
          recommendations.push({
            factor: factorName,
            severity: 'high',
            ...highSevereity,
          });
        }
      }
    } else if (score > RISK_THRESHOLDS.LOW) {
      // Medium risk score
      const factorRecs = recommendationsDb[factorName];
      if (factorRecs) {
        // Add medium-severity recommendations
        const mediumSeverity = factorRecs.find(rec => rec.severity === 'medium');
        if (mediumSeverity) {
          recommendations.push({
            factor: factorName,
            severity: 'medium',
            ...mediumSeverity,
          });
        }
      }
    }
  });

  return recommendations;
}
