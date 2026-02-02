import React, { useState } from 'react';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { RiskSummaryScreen } from './screens/RiskSummaryScreen';
import { FactorBreakdownScreen } from './screens/FactorBreakdownScreen';
import { RecommendationsScreen } from './screens/RecommendationsScreen';
import MLVisualizationScreen from './screens/MLVisualizationScreen';
import RandomForestVisualizer from './screens/RandomForestVisualizer';
import AlgorithmSelectionScreen from './screens/AlgorithmSelectionScreen';
import XGBoostVisualizer from './screens/XGBoostVisualizer';
import ModelValidationScreen from './screens/ModelValidationScreen';
// Legacy scoring (kept for backward compatibility)
import {
  calculateFactorScores,
  calculateOverallRiskScore,
  generateRecommendations,
  analyzeSentiment,
} from './utils/scoring';
// NEW: ML-based prediction engine with dual algorithm support
import {
  predictDropoutRisk,
  generateMLRecommendations,
  ALGORITHMS,
} from './utils/mlPredictor';
import mlConfig from './data/ml_config.json';
import { RECOMMENDATIONS } from './data/questions';
import './App.css';

/**
 * Main App Component
 * 
 * State machine for multi-screen flow:
 * 0. Algorithm Selection → choose between Random Forest and XGBoost
 * 1. Assessment → collect survey responses
 * 2. Risk Summary → display overall risk
 * 3. Factor Breakdown → detail each factor
 * 4. Recommendations → personalized suggestions
 * 8. Model Validation (Optional) → explain how accuracy is measured
 * 
 * NOW USES DUAL ML-BASED PREDICTION: Random Forest OR XGBoost (with SMOTE)
 */
function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS.XGBOOST);

  const screens = [
    {
      name: 'Algorithm Selection',
      component: (
        <AlgorithmSelectionScreen
          onSelectAlgorithm={(algorithm) => {
            setSelectedAlgorithm(algorithm);
            setCurrentScreen(1);
          }}
          onViewValidation={() => setCurrentScreen(8)}
          mlConfig={mlConfig}
        />
      ),
    },
    {
      name: 'Assessment',
      component: (
        <AssessmentScreen
          onComplete={(data) => {
            // ===== ML-BASED PREDICTION WITH SELECTED ALGORITHM =====
            console.log('Received data in App.jsx:', data);
            console.log('Sentiment value:', data.sentiment);
            
            // Use the selected ML model for prediction
            const mlPrediction = predictDropoutRisk(data.responses, data.sentiment || '', selectedAlgorithm);
            
            // Generate ML-prioritized recommendations
            const mlRecs = generateMLRecommendations(mlPrediction.factorScores, RECOMMENDATIONS);
            
            // Also keep legacy scoring for comparison (optional)
            const legacyFactorScores = calculateFactorScores(data.responses);
            const legacySentimentScore = analyzeSentiment(data.sentiment || '');
            const legacyOverallScore = calculateOverallRiskScore(legacyFactorScores, legacySentimentScore);
            
            setAnalysisData({
              // Survey data
              responses: data.responses,
              sentiment: data.sentiment,
              
              // ML Prediction Results (PRIMARY)
              overallScore: mlPrediction.overallScore,
              factorScores: mlPrediction.factorScores,
              sentimentScore: mlPrediction.sentimentAnalysis.score,
              sentimentAnalysis: mlPrediction.sentimentAnalysis,
              recommendations: mlRecs,
              
              // ML Metadata
              mlPrediction: mlPrediction,
              riskLevel: mlPrediction.riskLevel,
              prediction: mlPrediction.prediction,
              confidence: mlPrediction.confidence,
              mlModelUsed: true,
              algorithmUsed: mlPrediction.algorithmUsed,
              algorithmName: mlPrediction.algorithmName,
              
              // Legacy scores (for comparison/debugging)
              legacy: {
                factorScores: legacyFactorScores,
                overallScore: legacyOverallScore,
                sentimentScore: legacySentimentScore,
              }
            });
            
            setCurrentScreen(2);
          }}
        />
      ),
    },
    {
      name: 'Risk Summary',
      component: (
        <RiskSummaryScreen
          overallRiskScore={analysisData?.overallScore || 0}
          factorScores={analysisData?.factorScores || {}}
          sentimentScore={analysisData?.sentimentScore || 0}
          sentimentAnalysis={analysisData?.sentimentAnalysis || null}
          sentimentText={analysisData?.sentiment || ''}
          mlPrediction={analysisData?.mlPrediction || null}
          algorithmUsed={analysisData?.algorithmName || selectedAlgorithm}
          onContinue={() => setCurrentScreen(3)}
          onBack={() => setCurrentScreen(1)}
        />
      ),
    },
    {
      name: 'Factor Breakdown',
      component: (
        <FactorBreakdownScreen
          factorScores={analysisData?.factorScores || {}}
          onContinue={() => setCurrentScreen(4)}
          onBack={() => setCurrentScreen(2)}
          onViewRandomForest={() => setCurrentScreen(6)}
          onViewXGBoost={() => setCurrentScreen(7)}
          algorithmUsed={selectedAlgorithm}
        />
      ),
    },
    {
      name: 'Recommendations',
      component: (
        <RecommendationsScreen
          recommendations={analysisData?.recommendations || []}
          analysisData={analysisData}
          onBack={() => setCurrentScreen(3)}
          onRestart={() => {
            setAnalysisData(null);
            setCurrentScreen(0);
          }}
          onViewMLModel={() => setCurrentScreen(5)}
        />
      ),
    },
    {
      name: 'ML Visualization',
      component: (
        <MLVisualizationScreen
          scores={analysisData?.responses || null}
          riskScore={analysisData?.overallScore || 0}
          onBack={() => setCurrentScreen(4)}
        />
      ),
    },
    {
      name: 'Random Forest Visualizer',
      component: (
        <RandomForestVisualizer
          scores={analysisData?.responses || null}
          riskScore={analysisData?.overallScore || 0}
          onBack={() => setCurrentScreen(3)}
          onContinue={() => setCurrentScreen(4)}
        />
      ),
    },
    {
      name: 'XGBoost Visualizer',
      component: (
        <XGBoostVisualizer
          scores={analysisData}
          onBack={() => setCurrentScreen(3)}
          onContinue={() => setCurrentScreen(4)}
        />
      ),
    },
    {
      name: 'Model Validation',
      component: (
        <ModelValidationScreen
          onContinue={() => setCurrentScreen(0)}
          mlConfig={mlConfig}
        />
      ),
    },
  ];

  return (
    <div className="app">
      {/* Header - Calming & Welcoming Design */}
      <header className="app-header">
        <div className="app-header-content">
          <div className="header-brand">
            <div className="header-icon-wrapper">
              <span className="header-icon">🎓</span>
            </div>
            <div className="header-text">
              <h1 className="app-title">
                <span className="title-highlight">Student</span> Wellness Check
              </h1>
              <p className="app-subtitle">
                <span className="subtitle-icon">💙</span>
                Your well-being matters. Take a moment to reflect.
              </p>
            </div>
          </div>
          <div className="header-right">
            {currentScreen > 0 && (
              <div className="app-progress">
                <span className="progress-label">Progress</span>
                <span className="progress-value">{currentScreen} / {screens.length - 1}</span>
              </div>
            )}
            <div className="header-badge">
              <span>🔒 Anonymous & Confidential</span>
            </div>
          </div>
        </div>
        {/* Calming Message Bar */}
        <div className="calming-bar">
          <p>✨ Take your time. There are no right or wrong answers. Be honest with yourself.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {screens[currentScreen].component}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p className="text-xs">
          This dashboard uses confidential assessment data only for personalized support recommendations.
          <br />
          For emergencies, contact your institution's crisis services.
        </p>
      </footer>
    </div>
  );
}

export default App;
