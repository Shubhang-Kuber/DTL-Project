import React from 'react';
import { motion } from 'framer-motion';

/**
 * LikertSlider Component
 * Five-point scale for survey questions
 */
export function LikertSlider({ label, minLabel, maxLabel, value, onChange, disabled = false }) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 min-w-24">{minLabel}</span>
        <input
          type="range"
          min="1"
          max="5"
          value={value || 3}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     accent-blue-500 disabled:opacity-50"
        />
        <span className="text-xs text-gray-500 min-w-24 text-right">{maxLabel}</span>
      </div>
      <div className="mt-2 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
        {value && `Selected: ${value} / 5`}
      </div>
    </motion.div>
  );
}

/**
 * ProgressBar Component
 */
export function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;
  return (
    <motion.div
      className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

/**
 * RiskBadge Component
 */
export function RiskBadge({ level, color, badge }) {
  const bgColor = {
    'Low Risk': 'bg-green-50 border-green-200',
    'Medium Risk': 'bg-yellow-50 border-yellow-200',
    'High Risk': 'bg-red-50 border-red-200',
  }[level] || 'bg-gray-50 border-gray-200';

  return (
    <motion.div
      className={`border-2 rounded-lg p-6 text-center ${bgColor}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-4xl font-bold" style={{ color }}>
        {badge}
      </div>
      <div className="text-lg font-semibold mt-2">{level}</div>
    </motion.div>
  );
}

/**
 * Card Component
 */
export function Card({ children, className = '', hover = false }) {
  return (
    <motion.div
      className={`bg-white dark:bg-dark-card rounded-lg shadow-md p-6 ${
        hover ? 'hover:shadow-lg hover:scale-105' : ''
      } transition-all ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      {children}
    </motion.div>
  );
}

/**
 * Button Component
 */
export function Button({ children, onClick, disabled = false, variant = 'primary', size = 'md' }) {
  const baseStyles =
    'font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
}

/**
 * FormSection Component
 */
export function FormSection({ title, description, children }) {
  return (
    <motion.div
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
      {children}
    </motion.div>
  );
}

/**
 * FactorChartCard Component
 */
export function FactorChartCard({ factorName, factorDef, score }) {
  const riskColor = score > 0.66 ? '#ef4444' : score > 0.33 ? '#f59e0b' : '#10b981';

  return (
    <Card className="text-center">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 dark:text-white">{factorName}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{factorDef.description}</p>
      </div>
      <div className="relative w-20 h-20 mx-auto mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={riskColor}
            strokeWidth="8"
            strokeDasharray={`${score * 251.2} 251.2`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill={riskColor}
          >
            {Math.round(score * 100)}%
          </text>
        </svg>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {score > 0.66 ? 'High Risk' : score > 0.33 ? 'Medium Risk' : 'Low Risk'}
      </p>
    </Card>
  );
}

/**
 * RecommendationCard Component
 */
export function RecommendationCard({ recommendation }) {
  const severityColor = {
    high: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  };

  return (
    <motion.div
      className={`border-l-4 p-4 rounded-lg ${severityColor[recommendation.severity]}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 dark:text-white">{recommendation.title}</h4>
        <span className="text-xs font-bold uppercase px-2 py-1 rounded">
          {recommendation.severity === 'high' ? '🔴 High' : '🟡 Medium'}
        </span>
      </div>
      <ul className="space-y-2 mt-3">
        {recommendation.suggestions.map((suggestion, idx) => (
          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
            <span className="mr-2">→</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * ScreenContainer Component
 */
export function ScreenContainer({ title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100
                 dark:from-dark-bg dark:to-gray-900 py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`mx-auto ${maxWidth}`}>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </motion.div>
  );
}
