/**
 * ML-Based Prediction Engine
 * 
 * This module implements the trained ML model for student dropout prediction.
 * It uses weights derived from Random Forest training on the Responses CSV data.
 * 
 * Features:
 * - ML-trained feature weights
 * - Direction-aware scoring (positive/negative indicators)
 * - Enhanced sentiment analysis for text input
 * - Dropout keyword detection
 */

import mlConfig from '../data/ml_config.json';

/**
 * Normalize a value to [0, 1] range
 * @param {number} value - Raw value (1-5 Likert scale)
 * @param {number} min - Minimum value (default: 1)
 * @param {number} max - Maximum value (default: 5)
 * @returns {number} Normalized value in [0, 1]
 */
function normalizeValue(value, min = 1, max = 5) {
  if (value < min || value > max) return 0.5;
  return (value - min) / (max - min);
}

/**
 * Advanced sentiment analysis using ML config keywords
 * Analyzes text for emotional indicators and dropout signals
 * 
 * @param {string} text - User's text input (problems/challenges)
 * @returns {Object} { score: number, dropoutRisk: number, details: object }
 */
export function analyzeTextSentiment(text) {
  if (!text || text.trim().length === 0) {
    return { score: 0, dropoutRisk: 0, details: null };
  }

  const lowerText = text.toLowerCase();
  const config = mlConfig.sentiment_analysis;

  let positiveCount = 0;
  let negativeCount = 0;
  let academicContext = false;
  let dropoutSignals = 0;

  // Check for academic context (increases weight of sentiment)
  academicContext = config.academic_keywords.some(keyword => 
    lowerText.includes(keyword)
  );

  // Count positive words
  config.positive_keywords.forEach(word => {
    if (lowerText.includes(word)) {
      positiveCount += academicContext ? 2 : 1;
    }
  });

  // Count negative words
  config.negative_keywords.forEach(word => {
    if (lowerText.includes(word)) {
      negativeCount += academicContext ? 2 : 1;
    }
  });

  // Check for direct dropout indicators (high weight)
  config.dropout_indicators.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      dropoutSignals += 3; // Strong signal
    }
  });

  const total = positiveCount + negativeCount;
  
  // Calculate sentiment score: +1 = very positive, -1 = very negative
  let sentimentScore = 0;
  if (total > 0) {
    sentimentScore = (positiveCount - negativeCount) / total;
  }

  // Calculate dropout risk from text (0 to 1)
  // Dropout signals directly contribute to risk
  const dropoutRisk = Math.min(1, dropoutSignals * 0.2 + (negativeCount * 0.05));

  return {
    score: sentimentScore,
    dropoutRisk,
    details: {
      positiveCount,
      negativeCount,
      dropoutSignals,
      academicContext,
      textLength: text.length
    }
  };
}

/**
 * ML-Based Risk Prediction
 * Uses trained weights from Random Forest model
 * 
 * @param {Object} responses - Survey responses { q1: 4, q2: 5, ... }
 * @param {string} sentimentText - Optional text input for sentiment analysis
 * @returns {Object} { 
 *   overallScore: number,
 *   prediction: 'Low Risk' | 'Medium Risk' | 'High Risk',
 *   confidence: number,
 *   factorScores: object,
 *   sentimentAnalysis: object
 * }
 */
export function predictDropoutRisk(responses, sentimentText = '') {
  const questionConfig = mlConfig.questions;
  const factors = mlConfig.factors;
  
  // Step 1: Calculate weighted risk score from responses
  let totalWeightedRisk = 0;
  let totalWeight = 0;
  const questionScores = {};

  Object.entries(questionConfig).forEach(([qId, config]) => {
    const value = responses[qId];
    if (value === undefined || value === null || value === '') return;

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    // Normalize to [0, 1]
    let normalized = normalizeValue(numValue, 1, 5);

    // Apply direction-aware scoring
    // For POSITIVE indicators: high value = LOW risk, so invert
    // For NEGATIVE indicators: high value = HIGH risk, use as-is
    let riskContribution;
    if (config.direction === 'positive') {
      riskContribution = 1 - normalized; // Invert: high value → low risk
    } else {
      riskContribution = normalized; // Keep: high value → high risk
    }

    // Apply ML-trained weight
    const weightedRisk = riskContribution * config.weight;
    totalWeightedRisk += weightedRisk;
    totalWeight += config.weight;

    questionScores[qId] = {
      raw: numValue,
      normalized,
      riskContribution,
      weighted: weightedRisk
    };
  });

  // Calculate base risk score
  const baseRiskScore = totalWeight > 0 ? totalWeightedRisk / totalWeight : 0.5;

  // Step 2: Calculate factor scores
  const factorScores = {};
  Object.entries(factors).forEach(([factorName, factorDef]) => {
    const factorQuestions = factorDef.questions;
    let factorTotal = 0;
    let factorCount = 0;

    factorQuestions.forEach(qId => {
      if (questionScores[qId]) {
        factorTotal += questionScores[qId].riskContribution;
        factorCount++;
      }
    });

    factorScores[factorName] = factorCount > 0 ? factorTotal / factorCount : 0.5;
  });

  // Step 3: Analyze sentiment from text input
  const sentimentAnalysis = analyzeTextSentiment(sentimentText);
  
  // Step 4: Combine scores
  // Base risk (85%) + Sentiment risk adjustment (15%)
  const sentimentWeight = mlConfig.sentiment_analysis.weight;
  
  let sentimentAdjustment = 0;
  if (sentimentAnalysis.score !== 0 || sentimentAnalysis.dropoutRisk > 0) {
    // Negative sentiment increases risk, positive decreases
    const sentimentRiskFactor = (1 - sentimentAnalysis.score) / 2; // Maps [-1,+1] to [1,0]
    
    // Add direct dropout risk from keywords
    const combinedSentimentRisk = (sentimentRiskFactor * 0.7) + (sentimentAnalysis.dropoutRisk * 0.3);
    
    // Calculate adjustment from neutral (0.5)
    sentimentAdjustment = (combinedSentimentRisk - 0.5) * sentimentWeight;
  }

  // Final risk score
  let overallScore = baseRiskScore + sentimentAdjustment;
  overallScore = Math.max(0, Math.min(1, overallScore)); // Clamp to [0, 1]

  // Step 5: Classify risk level
  const thresholds = mlConfig.thresholds;
  let prediction, riskLevel, color, description;

  if (overallScore <= thresholds.low) {
    prediction = 'Not At Risk';
    riskLevel = 'Low Risk';
    color = '#10b981';
    description = 'Based on ML analysis, you show strong indicators of academic success. Continue your current approach!';
  } else if (overallScore <= thresholds.medium) {
    prediction = 'Moderate Risk';
    riskLevel = 'Medium Risk';
    color = '#f59e0b';
    description = 'ML analysis detected some risk factors. Consider reaching out to support services proactively.';
  } else {
    prediction = 'At Risk';
    riskLevel = 'High Risk';
    color = '#ef4444';
    description = 'ML analysis identified significant risk factors. Please connect with academic counseling for support.';
  }

  // Calculate confidence based on how many questions were answered
  const answeredQuestions = Object.keys(questionScores).length;
  const totalQuestions = Object.keys(questionConfig).length;
  const confidence = answeredQuestions / totalQuestions;

  return {
    overallScore,
    prediction,
    riskLevel,
    color,
    description,
    confidence,
    factorScores,
    sentimentAnalysis,
    questionScores,
    mlModelUsed: true,
    modelVersion: mlConfig.version
  };
}

/**
 * Get feature importance from ML model
 * @returns {Array} Sorted list of features by importance
 */
export function getFeatureImportance() {
  const questions = mlConfig.questions;
  return Object.entries(questions)
    .map(([qId, config]) => ({
      questionId: qId,
      name: config.name,
      description: config.description,
      weight: config.weight,
      direction: config.direction
    }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * Generate ML-based recommendations
 * Prioritizes factors with highest risk scores
 * 
 * @param {Object} factorScores - Factor scores from prediction
 * @param {Object} recommendationsDb - Recommendations database
 * @returns {Array} Prioritized recommendations
 */
export function generateMLRecommendations(factorScores, recommendationsDb) {
  const recommendations = [];
  const thresholds = mlConfig.thresholds;

  // Sort factors by risk score (highest first)
  const sortedFactors = Object.entries(factorScores)
    .sort(([, a], [, b]) => b - a);

  sortedFactors.forEach(([factorName, score]) => {
    const factorRecs = recommendationsDb[factorName];
    if (!factorRecs) return;

    if (score > thresholds.medium) {
      // High risk - get high severity recommendation
      const rec = factorRecs.find(r => r.severity === 'high');
      if (rec) {
        recommendations.push({
          factor: factorName,
          score,
          severity: 'high',
          priority: 1,
          ...rec
        });
      }
    } else if (score > thresholds.low) {
      // Medium risk
      const rec = factorRecs.find(r => r.severity === 'medium');
      if (rec) {
        recommendations.push({
          factor: factorName,
          score,
          severity: 'medium',
          priority: 2,
          ...rec
        });
      }
    }
  });

  // Sort by priority
  return recommendations.sort((a, b) => a.priority - b.priority);
}

export default {
  predictDropoutRisk,
  analyzeTextSentiment,
  getFeatureImportance,
  generateMLRecommendations,
  mlConfig
};
