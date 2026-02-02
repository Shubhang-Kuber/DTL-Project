import React from 'react';
import { motion } from 'framer-motion';
import { ScreenContainer, Card, Button } from '../components/index.jsx';

/**
 * AlgorithmSelectionScreen
 * Allows users to choose between Random Forest and XGBoost algorithms
 */
export default function AlgorithmSelectionScreen({ onSelectAlgorithm, onViewValidation, mlConfig }) {
  const algorithms = [
    {
      id: 'random_forest',
      name: 'Random Forest',
      icon: '🌲',
      description: 'Ensemble of 50 decision trees that vote on predictions',
      pros: [
        'Easy to understand (tree voting)',
        'Shows clear feature importance',
        'Good baseline accuracy'
      ],
      accuracy: mlConfig?.models?.random_forest?.metrics?.accuracy || 0.833,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-300 dark:border-green-700'
    },
    {
      id: 'xgboost',
      name: 'XGBoost + SMOTE',
      icon: '🚀',
      description: 'Advanced gradient boosting with synthetic data balancing',
      pros: [
        'Better at detecting at-risk students',
        'Learns from mistakes iteratively',
        'Enhanced with SMOTE balancing'
      ],
      accuracy: mlConfig?.models?.xgboost?.metrics?.accuracy || 0.9125,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-300 dark:border-blue-700',
      recommended: true
    }
  ];

  return (
    <ScreenContainer
      title="Choose Prediction Algorithm"
      subtitle="Select which machine learning model you'd like to use for your risk assessment"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Model Validation Button - Prominent Placement */}
        <Card className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-300 dark:border-orange-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎓</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  How Do We Know It's Accurate?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View our comprehensive model validation methods, accuracy metrics, and statistical analysis
                </p>
              </div>
            </div>
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white 
                       rounded-xl font-semibold shadow-lg hover:shadow-xl 
                       transition-all duration-300 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewValidation}
            >
              📊 View Validation
            </motion.button>
          </div>
        </Card>

        {/* Introduction */}
        <Card className="mb-8 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Two Powerful ML Models Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Both models are trained on real student survey data. Choose the one that best fits your needs.
          </p>
        </Card>

        {/* Algorithm Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {algorithms.map((algo, index) => (
            <motion.div
              key={algo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`relative rounded-2xl border-2 ${algo.borderColor} ${algo.bgColor} 
                           p-6 cursor-pointer transition-all duration-300
                           hover:shadow-xl hover:scale-[1.02]`}
                onClick={() => onSelectAlgorithm(algo.id)}
              >
                {/* Recommended Badge */}
                {algo.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white 
                                   text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ⭐ RECOMMENDED
                    </span>
                  </div>
                )}

                {/* Icon & Name */}
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{algo.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {algo.name}
                  </h3>
                </div>

                {/* Accuracy Badge */}
                <div className="flex justify-center mb-4">
                  <div className={`bg-gradient-to-r ${algo.color} text-white px-4 py-2 rounded-full`}>
                    <span className="text-sm font-medium">Accuracy: </span>
                    <span className="text-lg font-bold">{(algo.accuracy * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  {algo.description}
                </p>

                {/* Pros */}
                <div className="space-y-2">
                  {algo.pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{pro}</span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <motion.button
                  className={`w-full mt-6 py-3 rounded-xl font-semibold text-white
                             bg-gradient-to-r ${algo.color} shadow-lg
                             hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAlgorithm(algo.id);
                  }}
                >
                  Select {algo.name}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Info */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            📊 Quick Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">Feature</th>
                  <th className="text-center py-2 px-3 font-semibold text-green-600">🌲 Random Forest</th>
                  <th className="text-center py-2 px-3 font-semibold text-blue-600">🚀 XGBoost</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-3">Learning Method</td>
                  <td className="text-center py-2 px-3">Parallel (all trees vote)</td>
                  <td className="text-center py-2 px-3">Sequential (learns from mistakes)</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-3">Data Balancing</td>
                  <td className="text-center py-2 px-3">Class weights</td>
                  <td className="text-center py-2 px-3">SMOTE (synthetic samples)</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-3">At-Risk Detection</td>
                  <td className="text-center py-2 px-3">Good</td>
                  <td className="text-center py-2 px-3">Better</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Interpretability</td>
                  <td className="text-center py-2 px-3">Very Easy</td>
                  <td className="text-center py-2 px-3">Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* SMOTE Explanation */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            🔄 What is SMOTE?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            <strong>SMOTE</strong> (Synthetic Minority Over-sampling Technique) creates realistic 
            synthetic at-risk student samples by interpolating between existing examples. This helps 
            the XGBoost model better learn patterns from limited at-risk data.
          </p>
          {mlConfig?.smote_info && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {mlConfig.smote_info.original_samples}
                  </div>
                  <div className="text-xs text-gray-500">Original Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {mlConfig.smote_info.original_at_risk}
                  </div>
                  <div className="text-xs text-gray-500">At-Risk (Original)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    +{mlConfig.smote_info.synthetic_samples_created}
                  </div>
                  <div className="text-xs text-gray-500">Synthetic Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {mlConfig.smote_info.total_after_smote}
                  </div>
                  <div className="text-xs text-gray-500">Total After SMOTE</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </ScreenContainer>
  );
}
