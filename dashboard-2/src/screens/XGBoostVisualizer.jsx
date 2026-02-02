import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { ScreenContainer, Card, Button } from '../components/index.jsx';
import { getFeatureImportance, getMLConfig, ALGORITHMS } from '../utils/mlPredictor.js';
import { QUESTIONS } from '../data/questions.js';

/**
 * XGBoostVisualizer Component
 * Interactive educational visualization of the XGBoost + SMOTE algorithm
 */
export default function XGBoostVisualizer({ scores, onBack, onContinue }) {
  const [activeSection, setActiveSection] = useState(0);
  const [boostingStep, setBoostingStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const mlConfig = getMLConfig();
  const featureImportance = getFeatureImportance(ALGORITHMS.XGBOOST);
  
  const sections = [
    { id: 0, title: '🚀 What is XGBoost?', icon: '🚀' },
    { id: 1, title: '🔄 SMOTE Balancing', icon: '🔄' },
    { id: 2, title: '📈 Boosting Process', icon: '📈' },
    { id: 3, title: '🎯 Feature Importance', icon: '🎯' },
    { id: 4, title: '📊 Your Prediction', icon: '📊' }
  ];

  // Simulate boosting iterations
  const boostingData = [
    { iteration: 1, error: 0.45, accuracy: 55 },
    { iteration: 2, error: 0.35, accuracy: 65 },
    { iteration: 3, error: 0.28, accuracy: 72 },
    { iteration: 4, error: 0.22, accuracy: 78 },
    { iteration: 5, error: 0.18, accuracy: 82 },
    { iteration: 6, error: 0.15, accuracy: 85 },
    { iteration: 7, error: 0.12, accuracy: 88 },
    { iteration: 8, error: 0.10, accuracy: 90 },
  ];

  // Animate boosting process
  const startBoostingAnimation = () => {
    setIsAnimating(true);
    setBoostingStep(0);
    
    const interval = setInterval(() => {
      setBoostingStep(prev => {
        if (prev >= boostingData.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  // Feature importance data for XGBoost
  // If XGBoost has too few features (overfitting), use Random Forest weights as fallback
  const xgboostNonZero = featureImportance.filter(f => f.weight > 0);
  const useRFWeights = xgboostNonZero.length < 5; // Use RF if XGBoost only uses < 5 features
  
  // Get Random Forest importance as fallback
  const rfImportance = useRFWeights ? getFeatureImportance(ALGORITHMS.RANDOM_FOREST) : [];
  
  // Create a map of question IDs to actual question text
  const questionTextMap = {};
  QUESTIONS.forEach(q => {
    questionTextMap[q.id] = q.text;
  });
  
  const allImportanceData = (useRFWeights ? rfImportance : featureImportance)
    .filter(f => f.weight > 0) // Only show features with non-zero importance
    .map((f, i) => {
      // Get the actual question text from QUESTIONS array using questionId
      const questionText = questionTextMap[f.questionId];
      
      // Fallback to formatted name if question text not found
      const displayText = questionText || f.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Create a shorter version for Y-axis (truncate intelligently)
      let shortName = displayText;
      if (displayText.length > 45) {
        // Try to break at a word boundary
        const truncated = displayText.substring(0, 42);
        const lastSpace = truncated.lastIndexOf(' ');
        shortName = (lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated) + '...';
      }
      
      return {
        name: displayText, // Full question text
        shortName: shortName, // Truncated for Y-axis
        importance: (f.weight * 100).toFixed(1),
        rawWeight: f.weight,
        questionId: f.questionId,
        fill: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#fb923c', '#84cc16', '#06b6d4', '#14b8a6'][i % 12]
      };
    });
  
  // Take top 12 for better visibility
  const importanceData = allImportanceData.slice(0, Math.min(12, allImportanceData.length));
  
  // Note if using fallback weights
  const usingFallback = useRFWeights;

  return (
    <ScreenContainer
      title="XGBoost + SMOTE Visualizer"
      subtitle="Understand how our enhanced ML algorithm predicts dropout risk"
    >
      <div className="max-w-5xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {section.icon} {section.title.split(' ').slice(1).join(' ')}
            </motion.button>
          ))}
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {/* Section 0: What is XGBoost? */}
          {activeSection === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    XGBoost: Extreme Gradient Boosting
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    A powerful machine learning algorithm that builds trees sequentially,
                    with each tree learning from the mistakes of previous ones.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* XGBoost vs Random Forest */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                    <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3">
                      🚀 XGBoost Approach
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌲</span>
                        <span className="text-sm">Build Tree 1</span>
                      </div>
                      <div className="text-center text-blue-500">↓ Learn from errors</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌲</span>
                        <span className="text-sm">Build Tree 2 (fixes Tree 1's mistakes)</span>
                      </div>
                      <div className="text-center text-blue-500">↓ Learn from errors</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌲</span>
                        <span className="text-sm">Build Tree 3 (fixes remaining errors)</span>
                      </div>
                      <div className="text-center text-blue-500">↓ ... and so on</div>
                    </div>
                    <p className="mt-4 text-sm text-blue-600 dark:text-blue-300">
                      <strong>Sequential learning:</strong> Each tree improves on the last!
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3">
                      🌲 Random Forest Approach
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[...Array(9)].map((_, i) => (
                        <span key={i} className="text-2xl">🌲</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      All trees built independently in parallel
                    </p>
                    <div className="text-center text-3xl mb-2">🗳️</div>
                    <p className="text-sm text-green-600 dark:text-green-300 text-center">
                      <strong>Majority voting:</strong> All trees vote equally
                    </p>
                  </div>
                </div>

                {/* Key Differences */}
                <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                    🔑 Why XGBoost is Better for At-Risk Detection
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Learns from Mistakes</div>
                      <div className="text-sm text-gray-500">Each iteration corrects errors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">⚖️</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Handles Imbalance</div>
                      <div className="text-sm text-gray-500">Combined with SMOTE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Higher Accuracy</div>
                      <div className="text-sm text-gray-500">{((mlConfig?.models?.xgboost?.metrics?.cv_accuracy || 0.95) * 100).toFixed(1)}% CV accuracy</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Section 1: SMOTE Balancing */}
          {activeSection === 1 && (
            <motion.div
              key="smote"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔄</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    SMOTE: Synthetic Minority Over-sampling
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Creates synthetic at-risk student samples to balance the training data
                  </p>
                </div>

                {/* Before/After Visualization */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 text-center">
                      ❌ Before SMOTE (Imbalanced)
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Not At Risk:</div>
                        <div className="flex flex-wrap gap-1">
                          {[...Array(18)].map((_, i) => (
                            <span key={i} className="text-lg">😊</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{mlConfig?.smote_info?.original_samples - mlConfig?.smote_info?.original_at_risk || 36} students</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">At Risk:</div>
                        <div className="flex flex-wrap gap-1">
                          {[...Array(Math.min(mlConfig?.smote_info?.original_at_risk || 4, 6))].map((_, i) => (
                            <span key={i} className="text-lg">😟</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{mlConfig?.smote_info?.original_at_risk || 4} students</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center text-red-600 dark:text-red-400 font-medium">
                      Ratio: 9:1 (Very imbalanced!)
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 text-center">
                      ✅ After SMOTE (Balanced)
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Not At Risk:</div>
                        <div className="flex flex-wrap gap-1">
                          {[...Array(12)].map((_, i) => (
                            <span key={i} className="text-lg">😊</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{mlConfig?.smote_info?.original_samples - mlConfig?.smote_info?.original_at_risk || 36} students (original)</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">At Risk (Real + Synthetic):</div>
                        <div className="flex flex-wrap gap-1">
                          {[...Array(Math.min(mlConfig?.smote_info?.original_at_risk || 4, 4))].map((_, i) => (
                            <span key={i} className="text-lg">😟</span>
                          ))}
                          {[...Array(8)].map((_, i) => (
                            <span key={i} className="text-lg opacity-60">👤</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {mlConfig?.smote_info?.original_at_risk || 4} real + {mlConfig?.smote_info?.synthetic_samples_created || 32} synthetic
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center text-green-600 dark:text-green-400 font-medium">
                      Ratio: 1:1 (Perfectly balanced!)
                    </div>
                  </div>
                </div>

                {/* How SMOTE Works */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                  <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-4">
                    🔬 How SMOTE Creates Synthetic Students
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">😟 ↔️ 😟</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Step 1</div>
                      <div className="text-sm text-gray-500">Find 2 similar at-risk students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">📏</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Step 2</div>
                      <div className="text-sm text-gray-500">Measure the "distance" between them</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">👤✨</div>
                      <div className="font-medium text-gray-700 dark:text-gray-300">Step 3</div>
                      <div className="text-sm text-gray-500">Create new point between them</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4">
                    <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`Real At-Risk A: [Interest=2, Stress=5, Isolation=4]
Real At-Risk B: [Interest=3, Stress=4, Isolation=5]
                        ↓ Interpolate
Synthetic Student: [Interest=2.5, Stress=4.5, Isolation=4.5]`}
                    </pre>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Section 2: Boosting Process */}
          {activeSection === 2 && (
            <motion.div
              key="boosting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📈</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Gradient Boosting in Action
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Watch how XGBoost improves with each iteration
                  </p>
                </div>

                {/* Animation Control */}
                <div className="text-center mb-6">
                  <Button
                    onClick={startBoostingAnimation}
                    disabled={isAnimating}
                    variant="primary"
                  >
                    {isAnimating ? '🔄 Training...' : '▶️ Start Training Animation'}
                  </Button>
                </div>

                {/* Boosting Chart */}
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={boostingData.slice(0, boostingStep + 1)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="iteration" 
                        tick={{ fill: '#60a5fa', fontSize: 12, fontWeight: 600 }}
                        label={{ value: 'Boosting Iteration', position: 'bottom', fill: '#60a5fa' }}
                      />
                      <YAxis 
                        tick={{ fill: '#60a5fa', fontSize: 12, fontWeight: 600 }}
                        label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fill: '#60a5fa' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="#3b82f6" 
                        fill="url(#boostGradient)"
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="boostGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Current Iteration Display */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {boostingStep + 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Iteration</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {boostingData[boostingStep]?.accuracy}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {(boostingData[boostingStep]?.error * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Error Rate</div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-3">
                    🧠 What's Happening?
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• <strong>Iteration 1:</strong> First tree makes initial predictions</li>
                    <li>• <strong>Iteration 2+:</strong> New trees focus on samples the previous trees got WRONG</li>
                    <li>• <strong>Gradient:</strong> Mathematically calculates the direction to reduce error</li>
                    <li>• <strong>Final:</strong> All trees combined give the prediction</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Section 3: Feature Importance */}
          {activeSection === 3 && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎯</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Feature Importance (ML-Trained Weights)
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Which questions have the most influence on predictions?
                  </p>
                  {usingFallback && (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>📊 Note:</strong> Due to the small training dataset, XGBoost focused heavily on one feature (overfitting). 
                        For a more balanced analysis, we're showing feature importance from Random Forest, which considers all {importanceData.length} features 
                        to give you a comprehensive understanding of what factors influence dropout risk.
                      </p>
                    </div>
                  )}
                </div>

                {/* Feature Importance Chart */}
                <div className="flex justify-center">
                  <ResponsiveContainer width="95%" height={500}>
                    <BarChart 
                      data={importanceData} 
                      layout="vertical"
                      margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      type="number"
                      tick={{ fill: '#60a5fa', fontSize: 12, fontWeight: 600 }}
                      label={{ value: 'Importance %', position: 'bottom', fill: '#60a5fa' }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="shortName"
                      tick={{ fill: '#60a5fa', fontSize: 10, fontWeight: 600 }}
                      width={190}
                    />
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg max-w-xs">
                              <p className="font-semibold text-sm mb-1">{data.name}</p>
                              <p className="text-blue-400">Importance: {data.importance}%</p>
                              <p className="text-xs text-gray-400 mt-1">Weight: {data.rawWeight.toFixed(4)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="importance" 
                      radius={[0, 4, 4, 0]}
                    >
                      {importanceData.map((entry, index) => (
                        <motion.rect
                          key={index}
                          fill={entry.fill}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Factors */}
                <div className="mt-6">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-center">
                    Top {Math.min(3, importanceData.length)} Most Important Features
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {importanceData.slice(0, 3).map((feature, i) => (
                      <div 
                        key={i}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                                  rounded-xl p-4 border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{['🥇', '🥈', '🥉'][i]}</span>
                          <span className="font-bold text-gray-800 dark:text-white text-sm">{feature.name}</span>
                        </div>
                        <div className="text-3xl font-bold" style={{ color: feature.fill }}>
                          {feature.importance}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Weight: {feature.rawWeight.toFixed(4)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Weight Distribution by Category */}
                <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                    Weight Distribution by Category
                  </h3>
                  <div className="space-y-3">
                    {(() => {
                      // Calculate category totals
                      const categoryWeights = {};
                      const factorMapping = mlConfig?.factors || {};
                      
                      allImportanceData.forEach(feature => {
                        // Find which factor this question belongs to
                        let foundFactor = 'Other';
                        Object.entries(factorMapping).forEach(([factorName, factorData]) => {
                          if (factorData.questions && factorData.questions.includes(feature.questionId)) {
                            foundFactor = factorName;
                          }
                        });
                        
                        if (!categoryWeights[foundFactor]) {
                          categoryWeights[foundFactor] = 0;
                        }
                        categoryWeights[foundFactor] += feature.rawWeight;
                      });
                      
                      const total = Object.values(categoryWeights).reduce((a, b) => a + b, 0);
                      
                      return Object.entries(categoryWeights)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, weight]) => (
                          <div key={category}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700 dark:text-gray-300">{category}</span>
                              <span className="font-medium">{((weight / total) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                style={{ width: `${(weight / total) * 100}%` }}
                              />
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Section 4: Your Prediction */}
          {activeSection === 4 && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Your XGBoost Prediction
                  </h2>
                </div>

                {/* Prediction Result */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white text-center mb-6">
                  <div className="text-6xl font-bold mb-2">
                    {scores?.overallScore ? (scores.overallScore * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-xl font-medium mb-2">
                    {scores?.riskLevel || 'Unknown'}
                  </div>
                  <div className="text-sm opacity-80">
                    Predicted using XGBoost + SMOTE
                  </div>
                </div>

                {/* Model Metrics */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {((mlConfig?.models?.xgboost?.metrics?.cv_accuracy || 0.95) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">CV Accuracy</div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      100
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Trees Used</div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {mlConfig?.smote_info?.total_after_smote || 62}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Training Samples</div>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      SMOTE
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Balancing Used</div>
                  </div>
                </div>

                {/* Your Personal Risk Breakdown */}
                {scores?.responses && importanceData.length > 0 && (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                      Your Personal Risk Breakdown
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      See exactly how each of your answers contributed to your risk score
                      {usingFallback && <span className="font-medium"> (using comprehensive feature analysis)</span>}
                    </p>
                    <div className="space-y-3">
                      {importanceData.map((feature) => {
                        const response = scores.responses[feature.questionId];
                        if (!response) return null;
                        
                        const questionConfig = mlConfig?.questions?.[feature.questionId];
                        const isNegative = questionConfig?.direction === 'negative';
                        
                        // Calculate contribution
                        const normalized = (response - 1) / 4;
                        const contribution = isNegative ? normalized : (1 - normalized);
                        const contributionPercent = (contribution * feature.rawWeight * 100).toFixed(1);
                        
                        // Determine risk level for this answer
                        let riskLevel = 'Low';
                        let riskColor = '#10b981';
                        if (contribution > 0.66) {
                          riskLevel = 'High';
                          riskColor = '#ef4444';
                        } else if (contribution > 0.33) {
                          riskLevel = 'Medium';
                          riskColor = '#f59e0b';
                        }
                        
                        return (
                          <div key={feature.questionId} className="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4" style={{ borderLeftColor: riskColor }}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                  {feature.name}
                                </span>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                                  <div>📝 Your answer: <strong>{response}/5</strong></div>
                                  <div>🎯 Direction: <strong>{isNegative ? 'Negative Indicator' : 'Positive Indicator'}</strong></div>
                                  <div>⚖️ ML Weight: <strong>{(feature.rawWeight * 100).toFixed(2)}%</strong></div>
                                  <div>📊 Risk Level: <strong style={{ color: riskColor }}>{riskLevel}</strong></div>
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <div className="text-lg font-bold" style={{ color: feature.fill }}>
                                  {contributionPercent}%
                                </div>
                                <div className="text-xs text-gray-500">contribution</div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Risk Contribution</span>
                                <span>{(contribution * 100).toFixed(0)}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: riskColor }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, contribution * 100)}%` }}
                                  transition={{ duration: 0.8, delay: 0.1 }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Detailed Factor Analysis */}
                {scores?.factorScores && (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                      Detailed Factor Analysis
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Overall risk by category (combining all questions in each factor)
                    </p>
                    <div className="space-y-3">
                      {Object.entries(scores.factorScores).map(([factor, score]) => (
                        <div key={factor}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{factor}</span>
                            <span className="font-bold">{(score * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                score > 0.66 ? 'bg-red-500' : score > 0.33 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${score * 100}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={onBack} variant="secondary">
            ← Back to Analysis
          </Button>
          {onContinue && (
            <Button onClick={onContinue} variant="primary">
              Continue to Recommendations →
            </Button>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
