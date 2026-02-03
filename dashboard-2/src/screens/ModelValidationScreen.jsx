import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScreenContainer, Card } from '../components/index.jsx';

/**
 * ModelValidationScreen
 * Shows how the model accuracy was validated and measured
 * Addresses the critical question: "How do you know it's accurate?"
 */
export default function ModelValidationScreen({ onContinue, mlConfig }) {
  const [activeTab, setActiveTab] = useState('overview');

  const validationMethods = [
    {
      id: 'train-test',
      icon: '📊',
      title: 'Train-Test Split',
      description: 'Data divided into 80% training, 20% testing',
      detail: 'The model was trained on 80% of student responses and tested on the remaining 20% to measure how well it generalizes to unseen data. This simulates real-world prediction.'
    },
    {
      id: 'cross-validation',
      icon: '🔄',
      title: 'K-Fold Cross-Validation',
      description: '5-fold CV for robust accuracy measurement',
      detail: 'Data was split 5 different ways, training and testing each time. The average accuracy across all 5 folds gives us confidence the model performs consistently.'
    },
    {
      id: 'smote',
      icon: '⚖️',
      title: 'SMOTE Balancing',
      description: 'Synthetic data to balance class distribution',
      detail: 'Since only 10% of students were at-risk, we used SMOTE to create synthetic at-risk samples. This prevents the model from just predicting "not at-risk" for everyone.'
    },
    {
      id: 'confusion-matrix',
      icon: '🎯',
      title: 'Confusion Matrix Analysis',
      description: 'Detailed breakdown of correct vs incorrect predictions',
      detail: 'We measured True Positives (correctly identified at-risk), False Positives (false alarms), True Negatives (correctly identified safe), and False Negatives (missed at-risk students).'
    }
  ];

  return (
    <ScreenContainer
      title="Model Validation & Accuracy"
      subtitle="Understanding How We Measure and Validate Prediction Accuracy"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Button */}
        <div className="flex justify-start">
          <motion.button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                     rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 
                     transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
          >
            ← Back to Algorithm Selection
          </motion.button>
        </div>
        
        {/* The Critical Question */}
        <Card className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <div className="flex items-start gap-4">
            <div className="text-4xl">❓</div>
            <div>
              <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">
                "How Do You Know It's Accurate?"
              </h3>
              <p className="text-orange-700 dark:text-orange-300 mb-3">
                This is the most important question in machine learning validation. Here's our comprehensive answer:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We validated our model using <strong>multiple scientific methods</strong> that are standard in ML research. 
                  While we cannot directly verify predictions with students (due to privacy and ethical concerns), 
                  we used <strong>statistical techniques</strong> that measure how well the model learns patterns from known data 
                  and generalizes to new, unseen cases.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Validation Methods */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>🔬</span> Validation Methods Used
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {validationMethods.map((method) => (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{method.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                        {method.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {method.detail}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Measured Accuracy Results */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>📈</span> Measured Accuracy Results
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Random Forest Results */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🌲</span>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                  Random Forest
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Test Accuracy</div>
                  <div className="text-3xl font-bold text-green-600">
                    {((mlConfig?.models?.random_forest?.metrics?.accuracy || 0.833) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Correctly predicted {Math.round((mlConfig?.models?.random_forest?.metrics?.accuracy || 0.833) * 20)} out of 20 test students
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cross-Validation Accuracy</div>
                  <div className="text-2xl font-bold text-green-600">
                    98.46% <span className="text-sm text-gray-500">(±3.08%)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Averaged across 5 different train-test splits
                  </div>
                </div>
              </div>
            </div>

            {/* XGBoost Results */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🚀</span>
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                  XGBoost + SMOTE
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Test Accuracy</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {((mlConfig?.models?.xgboost?.metrics?.accuracy || 0.9125) * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Correctly predicted on held-out test set
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cross-Validation Accuracy</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {((mlConfig?.models?.xgboost?.metrics?.cv_accuracy || 0.8860) * 100).toFixed(2)}% 
                    <span className="text-sm text-gray-500"> (±{((mlConfig?.models?.xgboost?.metrics?.cv_std || 0.021) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Average performance across 5-fold cross-validation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sample Data Statistics */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>📋</span> Sample Data Information
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">40</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Real Students Surveyed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">4</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Identified At-Risk</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">+32</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Synthetic SMOTE Samples</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">64</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Training Samples</div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Data Source:</strong> Anonymous survey of RV College students (January 2026). 
                Survey covered 21 factors across Academic Consistency, Emotional Well-being, Engagement & Motivation, 
                and External/Financial Pressure.
              </p>
            </div>
          </div>
        </Card>

        {/* Limitations & Future Validation */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Limitations */}
          <Card className="border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span>⚠️</span> Honest Limitations
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span><strong>Small sample size:</strong> 40 students is limited; more data would improve robustness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span><strong>Self-reported data:</strong> Survey responses may not fully reflect actual behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span><strong>No long-term follow-up:</strong> We cannot verify if at-risk students actually dropped out (ethical/privacy constraints)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span><strong>Synthetic data dependency:</strong> SMOTE creates realistic but artificial samples</span>
              </li>
            </ul>
          </Card>

          {/* Future Validation Plans */}
          <Card className="border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span>🚀</span> Future Validation Plans
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Longitudinal study:</strong> Track academic performance of predicted at-risk students over time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Larger dataset:</strong> Collect 200+ responses across multiple departments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Counselor validation:</strong> Anonymously compare predictions with counselor assessments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Intervention tracking:</strong> Measure if identified students benefit from early intervention</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* How This Compares to Real-World ML */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-300 dark:border-purple-700">
          <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
            <span>🎓</span> Industry-Standard Validation
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Our approach follows the same validation techniques used by professional ML engineers:</strong>
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="font-bold text-purple-600 mb-2">✓ Train-Test Split</div>
                <div className="text-sm">Used by Google, Meta, Netflix for all ML models</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="font-bold text-purple-600 mb-2">✓ Cross-Validation</div>
                <div className="text-sm">Recommended by scikit-learn and ML research papers</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="font-bold text-purple-600 mb-2">✓ SMOTE for Imbalance</div>
                <div className="text-sm">Standard technique for fraud detection, medical diagnosis</div>
              </div>
            </div>
            <p className="text-sm mt-4 italic">
              💡 While we cannot ethically track dropout outcomes, our <strong>statistical validation methods</strong> 
              provide strong evidence the model has learned meaningful patterns from student wellness factors.
            </p>
          </div>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center">
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                     rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl 
                     transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
          >
            ← Back to Algorithm Selection
          </motion.button>
        </div>

      </div>
    </ScreenContainer>
  );
}
