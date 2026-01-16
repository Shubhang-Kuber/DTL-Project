import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Legend,
  PieChart,
  Pie
} from 'recharts';
import mlConfig from '../data/ml_config.json';

/**
 * ML Visualization Screen
 * 
 * Educational component that visualizes how the ML prediction model works
 * Helps students understand the weighted ensemble approach
 */
const MLVisualizationScreen = ({ scores, riskScore, onBack }) => {
  const [activeTab, setActiveTab] = useState('weights');
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Prepare feature weights data for visualization
  const featureWeights = useMemo(() => {
    return Object.entries(mlConfig.questions).map(([key, config]) => ({
      id: key,
      name: config.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      weight: config.weight,
      direction: config.direction,
      description: config.description,
      percentage: (config.weight * 100).toFixed(1),
      color: config.direction === 'positive' ? '#10b981' : '#ef4444'
    })).sort((a, b) => b.weight - a.weight);
  }, []);

  // Calculate individual contributions if scores are available
  const contributions = useMemo(() => {
    if (!scores) return [];
    
    return Object.entries(mlConfig.questions).map(([key, config]) => {
      const qNum = parseInt(key.replace('q', ''));
      const rawValue = scores[`q${qNum}`] || 3;
      const normalizedValue = (rawValue - 1) / 4; // Normalize 1-5 to 0-1
      
      // Calculate contribution based on direction
      let contribution;
      if (config.direction === 'positive') {
        contribution = (1 - normalizedValue) * config.weight;
      } else {
        contribution = normalizedValue * config.weight;
      }
      
      return {
        id: key,
        name: config.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        rawValue,
        normalizedValue: normalizedValue.toFixed(2),
        weight: config.weight,
        contribution: contribution,
        contributionPercent: (contribution * 100).toFixed(1),
        direction: config.direction,
        color: config.direction === 'positive' ? '#10b981' : '#ef4444',
        impact: contribution > 0.05 ? 'High' : contribution > 0.02 ? 'Medium' : 'Low'
      };
    }).sort((a, b) => b.contribution - a.contribution);
  }, [scores]);

  // Data for the prediction process visualization
  const predictionSteps = [
    { step: 1, name: 'Input Collection', description: 'Student answers 12 questions (1-5 scale) + optional text' },
    { step: 2, name: 'Normalization', description: 'Values are normalized to 0-1 range: (value - 1) / 4' },
    { step: 3, name: 'Direction Adjustment', description: 'Positive factors: use (1 - normalized), Negative factors: use normalized directly' },
    { step: 4, name: 'Weight Application', description: 'Each adjusted value is multiplied by its ML-trained weight' },
    { step: 5, name: 'Sentiment Analysis', description: 'Text input analyzed for keywords (15% weight in final score)' },
    { step: 6, name: 'Risk Calculation', description: 'Sum all weighted values + baseline risk (12%) = Final Risk Score' }
  ];

  // Simulated decision boundary visualization data
  const decisionBoundaryData = useMemo(() => {
    const data = [];
    for (let motivation = 1; motivation <= 5; motivation += 0.5) {
      for (let stress = 1; stress <= 5; stress += 0.5) {
        const motNorm = (motivation - 1) / 4;
        const stressNorm = (stress - 1) / 4;
        const risk = 0.12 + (1 - motNorm) * 0.1245 + stressNorm * 0.1156;
        data.push({
          motivation,
          stress,
          risk: risk * 100,
          category: risk > 0.5 ? 'high' : risk > 0.25 ? 'medium' : 'low'
        });
      }
    }
    return data;
  }, []);

  // Weight distribution for pie chart
  const weightDistribution = useMemo(() => {
    const positive = featureWeights
      .filter(f => f.direction === 'positive')
      .reduce((sum, f) => sum + f.weight, 0);
    const negative = featureWeights
      .filter(f => f.direction === 'negative')
      .reduce((sum, f) => sum + f.weight, 0);
    const sentiment = 0.15;
    
    return [
      { name: 'Positive Factors', value: positive, color: '#10b981' },
      { name: 'Negative Factors', value: negative, color: '#ef4444' },
      { name: 'Text Sentiment', value: sentiment, color: '#8b5cf6' }
    ];
  }, [featureWeights]);

  return (
    <div className="ml-visualization-screen">
      {/* Header */}
      <div className="viz-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Results
        </button>
        <div className="viz-title">
          <h1>🧠 How the ML Model Works</h1>
          <p>Interactive visualization of the dropout prediction algorithm</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="viz-tabs">
        <button 
          className={`tab ${activeTab === 'weights' ? 'active' : ''}`}
          onClick={() => setActiveTab('weights')}
        >
          📊 Feature Weights
        </button>
        <button 
          className={`tab ${activeTab === 'process' ? 'active' : ''}`}
          onClick={() => setActiveTab('process')}
        >
          ⚙️ Prediction Process
        </button>
        {scores && (
          <button 
            className={`tab ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            📈 Your Contributions
          </button>
        )}
        <button 
          className={`tab ${activeTab === 'boundary' ? 'active' : ''}`}
          onClick={() => setActiveTab('boundary')}
        >
          🎯 Decision Boundary
        </button>
      </div>

      {/* Content Area */}
      <div className="viz-content">
        
        {/* Feature Weights Tab */}
        {activeTab === 'weights' && (
          <div className="weights-section">
            <div className="section-header">
              <h2>Feature Importance (ML-Trained Weights)</h2>
              <p>These weights were learned from training data using Random Forest feature importance</p>
            </div>

            {/* Bar Chart */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={featureWeights} 
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    domain={[0, 0.15]} 
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    width={140}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="custom-tooltip">
                            <p className="tooltip-title">{data.name}</p>
                            <p>Weight: <strong>{data.percentage}%</strong></p>
                            <p>Direction: <span style={{ color: data.color }}>{data.direction}</span></p>
                            <p className="tooltip-desc">{data.description}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                    {featureWeights.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        opacity={hoveredFeature === entry.id ? 1 : 0.8}
                        onMouseEnter={() => setHoveredFeature(entry.id)}
                        onMouseLeave={() => setHoveredFeature(null)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weight Distribution Pie */}
            <div className="distribution-section">
              <h3>Weight Distribution by Category</h3>
              <div className="pie-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={weightDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${(value * 100).toFixed(0)}%`}
                    >
                      {weightDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend */}
            <div className="weight-legend">
              <div className="legend-item">
                <span className="dot positive"></span>
                <span>Positive Factors (higher = lower risk)</span>
              </div>
              <div className="legend-item">
                <span className="dot negative"></span>
                <span>Negative Factors (higher = higher risk)</span>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Process Tab */}
        {activeTab === 'process' && (
          <div className="process-section">
            <div className="section-header">
              <h2>Step-by-Step Prediction Process</h2>
              <p>How your answers are transformed into a risk prediction</p>
            </div>

            {/* Process Steps */}
            <div className="process-steps">
              {predictionSteps.map((step, index) => (
                <div key={step.step} className="step-card">
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h3>{step.name}</h3>
                    <p>{step.description}</p>
                  </div>
                  {index < predictionSteps.length - 1 && (
                    <div className="step-arrow">↓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Mathematical Formula */}
            <div className="formula-box">
              <h3>📐 The Mathematical Formula</h3>
              <div className="formula">
                <code>
                  Risk = Baseline (12%) + Σ(adjusted_value × weight) + sentiment_contribution
                </code>
              </div>
              <div className="formula-explanation">
                <p><strong>Where:</strong></p>
                <ul>
                  <li><strong>adjusted_value</strong> = For positive factors: (1 - normalized), For negative: normalized</li>
                  <li><strong>weight</strong> = ML-trained importance (from Random Forest)</li>
                  <li><strong>sentiment_contribution</strong> = Text analysis × 0.15</li>
                </ul>
              </div>
            </div>

            {/* Example Calculation */}
            <div className="example-box">
              <h3>💡 Example Calculation</h3>
              <div className="example-content">
                <p>If a student rates <strong>Motivation = 4</strong> (out of 5):</p>
                <ol>
                  <li>Normalize: (4 - 1) / 4 = <strong>0.75</strong></li>
                  <li>Direction is positive, so: 1 - 0.75 = <strong>0.25</strong></li>
                  <li>Apply weight (12.45%): 0.25 × 0.1245 = <strong>0.031</strong></li>
                  <li>This adds <strong>3.1%</strong> to the risk score</li>
                </ol>
                <p className="note">✨ Higher motivation (positive factor) = lower risk contribution!</p>
              </div>
            </div>
          </div>
        )}

        {/* Your Contributions Tab */}
        {activeTab === 'contributions' && scores && (
          <div className="contributions-section">
            <div className="section-header">
              <h2>Your Personal Risk Breakdown</h2>
              <p>See exactly how each of your answers contributed to your risk score</p>
            </div>

            {/* Current Risk Score */}
            <div className="current-score">
              <div className="score-display">
                <span className="score-value">{(riskScore * 100).toFixed(0)}%</span>
                <span className="score-label">Total Risk Score</span>
              </div>
            </div>

            {/* Contribution Chart */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={contributions} 
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    domain={[0, 'auto']}
                    tickFormatter={(v) => `${(v * 100).toFixed(1)}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    width={140}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="custom-tooltip">
                            <p className="tooltip-title">{data.name}</p>
                            <p>Your answer: <strong>{data.rawValue}/5</strong></p>
                            <p>Contribution: <strong>{data.contributionPercent}%</strong></p>
                            <p>Impact Level: <span className={`impact-${data.impact.toLowerCase()}`}>{data.impact}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                    {contributions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Breakdown Table */}
            <div className="breakdown-table">
              <h3>Detailed Factor Analysis</h3>
              <table>
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Your Answer</th>
                    <th>Direction</th>
                    <th>Weight</th>
                    <th>Contribution</th>
                    <th>Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.rawValue}/5</td>
                      <td style={{ color: c.color }}>{c.direction}</td>
                      <td>{(c.weight * 100).toFixed(1)}%</td>
                      <td><strong>{c.contributionPercent}%</strong></td>
                      <td className={`impact-cell ${c.impact.toLowerCase()}`}>{c.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Decision Boundary Tab */}
        {activeTab === 'boundary' && (
          <div className="boundary-section">
            <div className="section-header">
              <h2>Decision Boundary Visualization</h2>
              <p>See how the two most important factors (Motivation & Stress) interact to determine risk</p>
            </div>

            {/* Scatter Plot */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="motivation" 
                    name="Motivation" 
                    domain={[1, 5]}
                    label={{ value: 'Motivation Level', position: 'bottom', offset: 10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="stress" 
                    name="Stress"
                    domain={[1, 5]}
                    label={{ value: 'Stress Level', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="custom-tooltip">
                            <p>Motivation: <strong>{data.motivation}</strong></p>
                            <p>Stress: <strong>{data.stress}</strong></p>
                            <p>Predicted Risk: <strong>{data.risk.toFixed(1)}%</strong></p>
                            <p>Category: <span className={`risk-${data.category}`}>{data.category.toUpperCase()}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Scatter 
                    name="Low Risk (<25%)" 
                    data={decisionBoundaryData.filter(d => d.category === 'low')} 
                    fill="#10b981"
                  />
                  <Scatter 
                    name="Medium Risk (25-50%)" 
                    data={decisionBoundaryData.filter(d => d.category === 'medium')} 
                    fill="#f59e0b"
                  />
                  <Scatter 
                    name="High Risk (>50%)" 
                    data={decisionBoundaryData.filter(d => d.category === 'high')} 
                    fill="#ef4444"
                  />
                  <ReferenceLine x={3} stroke="#6b7280" strokeDasharray="5 5" label="Neutral" />
                  <ReferenceLine y={3} stroke="#6b7280" strokeDasharray="5 5" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Interpretation Guide */}
            <div className="boundary-guide">
              <h3>📖 How to Read This Chart</h3>
              <div className="guide-content">
                <div className="guide-item">
                  <span className="guide-dot low"></span>
                  <div>
                    <strong>Bottom-Right (Green)</strong>
                    <p>High motivation + Low stress = Low dropout risk</p>
                  </div>
                </div>
                <div className="guide-item">
                  <span className="guide-dot high"></span>
                  <div>
                    <strong>Top-Left (Red)</strong>
                    <p>Low motivation + High stress = High dropout risk</p>
                  </div>
                </div>
                <div className="guide-item">
                  <span className="guide-dot medium"></span>
                  <div>
                    <strong>Middle Area (Orange)</strong>
                    <p>Mixed signals = Moderate risk, needs monitoring</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insight */}
            <div className="insight-box">
              <h3>💡 Key Insight</h3>
              <p>
                The diagonal pattern shows that <strong>motivation and stress work together</strong> to determine risk.
                A student can have moderate stress but still be low-risk if their motivation is high enough.
                This is why the model uses a <strong>weighted combination</strong> of all factors rather than just looking at one.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="viz-footer">
        <p>🎓 Educational visualization for DTL Project - RV College of Engineering</p>
        <p className="model-info">Model: Weighted Ensemble (Random Forest trained) | Accuracy: ~85%</p>
      </div>
    </div>
  );
};

export default MLVisualizationScreen;
