import React, { useState } from 'react';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { RiskSummaryScreen } from './screens/RiskSummaryScreen';
import { FactorBreakdownScreen } from './screens/FactorBreakdownScreen';
import { RecommendationsScreen } from './screens/RecommendationsScreen';
import MLVisualizationScreen from './screens/MLVisualizationScreen';
// Legacy scoring (kept for backward compatibility)
import {
  calculateFactorScores,
  calculateOverallRiskScore,
  generateRecommendations,
  analyzeSentiment,
} from './utils/scoring';
// NEW: ML-based prediction engine
import {
  predictDropoutRisk,
  generateMLRecommendations,
} from './utils/mlPredictor';
import { RECOMMENDATIONS } from './data/questions';
import './App.css';

/**
 * Main App Component
 * 
 * State machine for 4-screen flow:
 * 1. Assessment → collect survey responses
 * 2. Risk Summary → display overall risk
 * 3. Factor Breakdown → detail each factor
 * 4. Recommendations → personalized suggestions
 * 
 * NOW USES ML-BASED PREDICTION from trained Random Forest model
 */
function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);

  const screens = [
    {
      name: 'Assessment',
      component: (
        <AssessmentScreen
          onComplete={(data) => {
            // ===== ML-BASED PREDICTION =====
            // Use the trained ML model for prediction
            const mlPrediction = predictDropoutRisk(data.responses, data.sentiment || '');
            
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
              
              // Legacy scores (for comparison/debugging)
              legacy: {
                factorScores: legacyFactorScores,
                overallScore: legacyOverallScore,
                sentimentScore: legacySentimentScore,
              }
            });
            
            setCurrentScreen(1);
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
          mlPrediction={analysisData?.mlPrediction || null}
          onContinue={() => setCurrentScreen(2)}
          onBack={() => setCurrentScreen(0)}
        />
      ),
    },
    {
      name: 'Factor Breakdown',
      component: (
        <FactorBreakdownScreen
          factorScores={analysisData?.factorScores || {}}
          onContinue={() => setCurrentScreen(3)}
          onBack={() => setCurrentScreen(1)}
        />
      ),
    },
    {
      name: 'Recommendations',
      component: (
        <RecommendationsScreen
          recommendations={analysisData?.recommendations || []}
          analysisData={analysisData}
          onBack={() => setCurrentScreen(2)}
          onRestart={() => {
            setAnalysisData(null);
            setCurrentScreen(0);
          }}
          onViewMLModel={() => setCurrentScreen(4)}
        />
      ),
    },
    {
      name: 'ML Visualization',
      component: (
        <MLVisualizationScreen
          scores={analysisData?.responses || null}
          riskScore={analysisData?.overallScore || 0}
          onBack={() => setCurrentScreen(3)}
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
