import React, { useState } from 'react';
import { QUESTIONS } from '../data/questions.js';
import { generateMockResponses } from '../utils/dataLoader.js';
import {
  ScreenContainer,
  FormSection,
  LikertSlider,
  ProgressBar,
  Button,
  Card,
} from '../components/index.jsx';

/**
 * Screen 1: Student Assessment (Multi-step Form)
 * 
 * User-friendly wizard for collecting survey responses
 * with progress tracking and optional sentiment input
 */
export function AssessmentScreen({ onComplete }) {
  const [responses, setResponses] = useState({});
  const [sentiment, setSentiment] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const questionsPerStep = 3;

  const totalSteps = Math.ceil(QUESTIONS.length / questionsPerStep);
  const startIdx = currentStep * questionsPerStep;
  const endIdx = Math.min(startIdx + questionsPerStep, QUESTIONS.length);
  const currentQuestions = QUESTIONS.slice(startIdx, endIdx);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isStepComplete = currentQuestions.every(q => responses[q.id] !== undefined);
  const allQuestionsAnswered = QUESTIONS.every(q => responses[q.id] !== undefined);

  const handleAnalyze = () => {
    if (allQuestionsAnswered) {
      onComplete({ responses, sentiment });
    }
  };

  const handleLoadSample = (scenario = 'random') => {
    const sampleResponses = generateMockResponses(scenario);
    setResponses(sampleResponses);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ScreenContainer
      title="Student Risk Assessment"
      subtitle="Anonymous, confidential self-assessment to identify support opportunities"
    >
      {/* Progress Indicator */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Section {currentStep + 1} of {totalSteps}
          </h3>
          <span className="text-sm text-gray-500">{Object.keys(responses).length} / {QUESTIONS.length} answered</span>
        </div>
        <ProgressBar current={currentStep + 1} total={totalSteps} />
      </Card>

      {/* Questions for Current Step */}
      <FormSection
        title={`Questions ${startIdx + 1} - ${endIdx}`}
        description="Please answer honestly. Your responses are confidential and used only to provide personalized support."
      >
        {currentQuestions.map(question => (
          <LikertSlider
            key={question.id}
            label={question.text}
            minLabel={question.scale.labels[0]}
            maxLabel={question.scale.labels[1]}
            value={responses[question.id]}
            onChange={(value) => handleResponseChange(question.id, value)}
          />
        ))}
      </FormSection>

      {/* Optional Sentiment Input (Last Step) */}
      {currentStep === totalSteps - 1 && (
        <Card className="mb-6 border-2 border-blue-200">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Optional: Additional Comments</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Share any additional thoughts or challenges you'd like us to consider.
          </p>
          <textarea
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            placeholder="e.g., 'I'm struggling with time management and would appreciate study strategies...'"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="secondary"
          size="md"
        >
          ← Previous
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepComplete}
            variant="primary"
            size="md"
          >
            Next →
          </Button>
        ) : (
          <Button
            onClick={handleAnalyze}
            disabled={!allQuestionsAnswered}
            variant="success"
            size="md"
          >
            Analyze My Risk
          </Button>
        )}
      </div>

      {/* Sample Data Loader (for testing) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mb-6 border-2 border-purple-200">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">🧪 Testing Tools</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Load sample responses to test the dashboard (development mode only).
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => handleLoadSample('low')}>
              Load Low Risk Sample
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleLoadSample('medium')}>
              Load Medium Risk Sample
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleLoadSample('high')}>
              Load High Risk Sample
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleLoadSample('random')}>
              Load Random Sample
            </Button>
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Privacy Notice:</strong> This assessment is confidential. Your responses are used only
          to generate personalized support recommendations. No personal data is stored or shared.
        </p>
      </div>
    </ScreenContainer>
  );
}
