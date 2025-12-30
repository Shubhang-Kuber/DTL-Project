import React from 'react';
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ScreenContainer, Card, Button, FactorChartCard } from '../components/index.jsx';
import { FACTORS } from '../data/questions.js';

/**
 * Screen 3: Factor Breakdown (Detailed Analysis)
 * 
 * Visualizes each factor's contribution to overall risk
 * with tooltips and causality explanations
 */
export function FactorBreakdownScreen({ factorScores, onContinue, onBack }) {
  // Prepare data for Recharts
  const radarData = Object.entries(factorScores).map(([factorName, score]) => ({
    name: factorName,
    value: Math.round(score * 100),
    fullMark: 100,
  }));

  const barData = Object.entries(factorScores).map(([factorName, score]) => ({
    factor: factorName.split(' ').slice(0, 2).join('\n'), // Shorten for bar chart
    'Risk Score': Math.round(score * 100),
  }));

  const tooltipFormatter = (value) => `${value}%`;

  return (
    <ScreenContainer
      title="Detailed Factor Analysis"
      subtitle="Understanding the drivers behind your risk assessment"
    >
      {/* Radar Chart */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Risk Profile (Radar View)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#d1d5db" />
            <PolarAngleAxis dataKey="name" angle={90} direction="clockwise" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Risk Score (%)"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: '#f3f4f6' }} />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
          The radar chart shows your risk score for each factor. Larger areas indicate higher risk in that domain.
        </p>
      </Card>

      {/* Bar Chart */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Risk Score by Factor (Bar View)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="factor" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey="Risk Score" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
          Taller bars indicate factors requiring more support attention.
        </p>
      </Card>

      {/* Factor Cards */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Factor-by-Factor Analysis
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Hover over each factor card to see detailed information about what it measures.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(factorScores).map(([factorName, score]) => (
            <FactorChartCard
              key={factorName}
              factorName={factorName}
              factorDef={FACTORS[factorName]}
              score={score}
            />
          ))}
        </div>
      </div>

      {/* Causality Explanation */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          How Risk is Calculated
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Your overall risk score is a <strong>weighted average</strong> of these five factors:
        </p>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {Object.entries(FACTORS).map(([factorName, factorDef]) => (
            <li key={factorName} className="flex items-start">
              <span className="mr-3 font-bold text-blue-600">→</span>
              <span>
                <strong>{factorName}</strong> ({Math.round(factorDef.weight * 100)}% weight):
                {' '}
                {factorDef.description}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 pt-4 border-t border-gray-300">
          <strong>Technical Note:</strong> Negative indicators (e.g., stress, isolation) are inverted
          to preserve semantic correctness: worst answers → high risk, best answers → low risk.
        </p>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button onClick={onBack} variant="secondary" size="md">
          ← Back
        </Button>
        <Button onClick={onContinue} variant="primary" size="md">
          View Recommendations →
        </Button>
      </div>
    </ScreenContainer>
  );
}
