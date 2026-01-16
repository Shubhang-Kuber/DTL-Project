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
  // Shorten factor names for better radar display
  const factorShortNames = {
    'Academic Consistency': 'Academic',
    'Emotional Well-being': 'Emotional',
    'Engagement & Motivation': 'Engagement',
    'External / Financial Pressure': 'Financial'
  };

  const radarData = Object.entries(factorScores).map(([factorName, score]) => ({
    name: factorShortNames[factorName] || factorName.split(' ')[0],
    fullName: factorName,
    value: Math.round(score * 100),
    fullMark: 100,
  }));

  const barData = Object.entries(factorScores).map(([factorName, score]) => ({
    factor: factorShortNames[factorName] || factorName.split(' ')[0],
    fullName: factorName,
    'Risk Score': Math.round(score * 100),
  }));

  const tooltipFormatter = (value) => `${value}%`;

  // Custom tick component for better text rendering with background
  const renderPolarAngleAxisTick = ({ payload, x, y, cx, cy, ...rest }) => {
    const angle = Math.atan2(y - cy, x - cx);
    const radius = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) + 25;
    const newX = cx + radius * Math.cos(angle);
    const newY = cy + radius * Math.sin(angle);
    
    // Text dimensions for background
    const textWidth = payload.value.length * 9 + 16;
    const textHeight = 24;
    
    return (
      <g>
        {/* Background rectangle for better visibility */}
        <rect
          x={newX - textWidth / 2}
          y={newY - textHeight / 2}
          width={textWidth}
          height={textHeight}
          rx={4}
          ry={4}
          fill="#1f2937"
          fillOpacity={0.9}
        />
        {/* Text label */}
        <text
          x={newX}
          y={newY}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: '12px',
            fontWeight: '700',
            fill: '#ffffff',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

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
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid stroke="#d1d5db" />
            <PolarAngleAxis 
              dataKey="name" 
              tick={renderPolarAngleAxisTick}
              tickLine={false}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              tickCount={5}
            />
            <Radar
              name="Risk Score (%)"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
              strokeWidth={2}
            />
            <Tooltip 
              formatter={tooltipFormatter} 
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }} 
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* How to Read the Radar - Simple Guide */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            📖 How to Read This Chart
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Closer to center</strong> = Lower risk (Good! ✅)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Farther from center</strong> = Higher risk (Needs attention ⚠️)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Balanced shape</strong> = Even risk across all factors
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Spiky shape</strong> = Some factors need more attention
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            💡 <strong>Tip:</strong> Focus on the factors that extend furthest from the center - those are your priority areas for improvement.
          </p>
        </div>
      </Card>

      {/* Bar Chart */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Risk Score by Factor (Bar View)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis 
              dataKey="factor" 
              tick={{ fontSize: 12, fontWeight: 500, fill: '#374151' }} 
              interval={0}
            />
            <YAxis 
              domain={[0, 100]} 
              label={{ value: 'Risk %', angle: -90, position: 'insideLeft', fontSize: 12 }} 
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              formatter={tooltipFormatter}
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #d1d5db',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="Risk Score" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
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
