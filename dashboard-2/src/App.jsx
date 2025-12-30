import React, { useState } from 'react';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { RiskSummaryScreen } from './screens/RiskSummaryScreen';
import { FactorBreakdownScreen } from './screens/FactorBreakdownScreen';
import { RecommendationsScreen } from './screens/RecommendationsScreen';
import {
  calculateFactorScores,
  calculateOverallRiskScore,
  generateRecommendations,
  analyzeSentiment,
} from './utils/scoring';
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
            // Calculate analysis on submission
            const factorScores = calculateFactorScores(data.responses);
            const sentimentScore = analyzeSentiment(data.sentiment || '');
            const overallScore = calculateOverallRiskScore(factorScores, sentimentScore);
            const recs = generateRecommendations(factorScores, RECOMMENDATIONS);
            
            setAnalysisData({
              responses: data.responses,
              sentiment: data.sentiment,
              sentimentScore,
              factorScores,
              overallScore,
              recommendations: recs,
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
        />
      ),
    },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1 className="app-title">DTL Dashboard</h1>
            <p className="app-subtitle">Early-Warning System for Student Support</p>
          </div>
          {currentScreen > 0 && (
            <div className="app-progress">
              <span>Screen {currentScreen} of {screens.length - 1}</span>
            </div>
          )}
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
