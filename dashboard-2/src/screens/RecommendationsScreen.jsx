import React from 'react';
import { ScreenContainer, RecommendationCard, Card, Button } from '../components/index.jsx';
import { RECOMMENDATIONS } from '../data/questions.js';

/**
 * Screen 4: Recommendations & Insights
 * 
 * Personalized, rule-based suggestions mapped to low factor scores
 * with supportive language and system disclaimer
 */
export function RecommendationsScreen({ recommendations, onBack }) {
  const hasRecommendations = recommendations && recommendations.length > 0;

  return (
    <ScreenContainer
      title="Personalized Support Recommendations"
      subtitle="Based on your assessment, here are targeted resources and next steps"
    >
      {/* Introduction */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Your Support Plan
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          The following recommendations are tailored to the areas where you indicated needing support.
          These are suggestions—not requirements. You are in control of what resources to explore.
        </p>
      </Card>

      {/* Recommendations */}
      {hasRecommendations ? (
        <div className="space-y-4 mb-8">
          {recommendations.map((rec, idx) => (
            <RecommendationCard key={idx} recommendation={rec} />
          ))}
        </div>
      ) : (
        <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 mb-8 text-center">
          <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
            ✓ You're Doing Well!
          </h3>
          <p className="text-green-800 dark:text-green-300 text-sm">
            Your assessment indicates strong engagement and support. Keep up the excellent work!
          </p>
        </Card>
      )}

      {/* Additional Resources Section */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Campus Resources Available to All Students
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            {
              title: 'Student Counseling Services',
              description: 'Free, confidential mental health support',
            },
            {
              title: 'Academic Support Center',
              description: 'Tutoring, study groups, and academic coaching',
            },
            {
              title: 'Financial Aid Office',
              description: 'Emergency grants, loans, and financial planning',
            },
            {
              title: 'Career Services',
              description: 'Career planning and employment resources',
            },
            {
              title: 'Disability Services',
              description: 'Accommodations and accessibility support',
            },
            {
              title: 'Student Health Services',
              description: 'Medical care and wellness programs',
            },
          ].map((resource, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded border border-purple-200 dark:border-purple-700">
              <p className="font-semibold text-gray-800 dark:text-white">{resource.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* System Disclaimer */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 mb-8">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
          ⚠️ Important: System Disclaimer
        </h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
          <strong>This is an early-warning support tool, not a final decision system.</strong>
        </p>
        <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-2">
          <li>✓ This assessment is <strong>confidential and anonymous</strong>.</li>
          <li>✓ Results are used <strong>only for personalized support recommendations</strong>.</li>
          <li>✓ No data is shared with faculty, parents, or other systems.</li>
          <li>✓ This is <strong>not a prediction of failure or success</strong>.</li>
          <li>✓ If you're experiencing mental health crises, contact emergency services or your institution's crisis hotline immediately.</li>
        </ul>
      </Card>

      {/* Call to Action */}
      <Card className="text-center mb-8">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
          Ready to Take Action?
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Reach out to one of the resources above, or speak with your academic advisor about next steps.
        </p>
        <Button variant="success" size="lg">
          Get Started Today
        </Button>
      </Card>

      {/* Export / Share Options */}
      <Card className="bg-gray-50 dark:bg-gray-800 mb-8">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
          Keep Your Results
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          You can share these recommendations with your academic advisor or counselor.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="md">
            📋 Copy Summary
          </Button>
          <Button variant="secondary" size="md">
            📥 Download PDF
          </Button>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 mb-8">
        <Button onClick={onBack} variant="secondary" size="md">
          ← Back to Analysis
        </Button>
        <Button variant="primary" size="md">
          Retake Assessment
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-300 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Design Thinking Lab • Student Dropout Risk Prediction System
          <br />
          Questions? Contact your academic advisor or student support services.
        </p>
      </div>
    </ScreenContainer>
  );
}
