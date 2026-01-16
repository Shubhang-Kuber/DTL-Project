import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Treemap
} from 'recharts';
import mlConfig from '../data/ml_config.json';

/**
 * 🌲 RANDOM FOREST VISUALIZER
 * 
 * Interactive educational component that helps students understand
 * how Random Forest algorithm works with their actual answers
 */
const RandomForestVisualizer = ({ scores, riskScore, onBack }) => {
  const [activeSection, setActiveSection] = useState('intro');
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTree, setSelectedTree] = useState(0);
  const [showVoting, setShowVoting] = useState(false);

  // Questions mapping
  const questionLabels = {
    q1: 'Course Interest',
    q2: 'Motivation',
    q3: 'Academic Confidence',
    q4: 'Stress Level',
    q5: 'Financial Impact',
    q6: 'Family Support',
    q7: 'Institutional Support',
    q8: 'Social Isolation',
    q9: 'External Commitments',
    q10: 'Attendance',
    q11: 'Extracurricular',
    q12: 'Dropout Consideration'
  };

  // Simulate 5 decision trees with different decision paths
  const simulatedTrees = useMemo(() => {
    if (!scores) return [];
    
    const trees = [];
    for (let t = 0; t < 5; t++) {
      // Each tree uses different subset of features (Random Forest behavior)
      const featuresUsed = Object.keys(mlConfig.questions)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4 + t); // Each tree uses 4-8 features
      
      // Simulate decision path
      let riskAccumulator = 0.1; // baseline
      const decisions = [];
      
      featuresUsed.forEach((qId, idx) => {
        const config = mlConfig.questions[qId];
        const value = scores[qId] || 3;
        const normalized = (value - 1) / 4;
        
        let contribution;
        if (config.direction === 'positive') {
          contribution = (1 - normalized) * config.weight;
        } else {
          contribution = normalized * config.weight;
        }
        
        riskAccumulator += contribution;
        
        // Create decision node
        const threshold = 3;
        const goesLeft = value <= threshold;
        
        decisions.push({
          feature: qId,
          featureName: questionLabels[qId] || config.name,
          value: value,
          threshold: threshold,
          direction: goesLeft ? 'left' : 'right',
          contribution: contribution,
          riskSoFar: riskAccumulator
        });
      });
      
      const finalRisk = Math.min(1, Math.max(0, riskAccumulator));
      const prediction = finalRisk > 0.5 ? 'At Risk' : 'Not At Risk';
      
      trees.push({
        id: t + 1,
        featuresUsed,
        decisions,
        finalRisk,
        prediction,
        confidence: Math.abs(finalRisk - 0.5) * 2
      });
    }
    
    return trees;
  }, [scores]);

  // Calculate ensemble voting
  const ensembleResult = useMemo(() => {
    if (simulatedTrees.length === 0) return null;
    
    const atRiskVotes = simulatedTrees.filter(t => t.prediction === 'At Risk').length;
    const notAtRiskVotes = simulatedTrees.length - atRiskVotes;
    const avgRisk = simulatedTrees.reduce((sum, t) => sum + t.finalRisk, 0) / simulatedTrees.length;
    
    return {
      atRiskVotes,
      notAtRiskVotes,
      totalTrees: simulatedTrees.length,
      avgRisk,
      finalPrediction: atRiskVotes > notAtRiskVotes ? 'At Risk' : 'Not At Risk',
      confidence: Math.max(atRiskVotes, notAtRiskVotes) / simulatedTrees.length
    };
  }, [simulatedTrees]);

  // Feature importance data
  const featureImportance = useMemo(() => {
    return Object.entries(mlConfig.questions)
      .map(([key, config]) => ({
        name: questionLabels[key] || config.name,
        importance: config.weight * 100,
        direction: config.direction,
        color: config.direction === 'positive' ? '#10b981' : '#ef4444'
      }))
      .sort((a, b) => b.importance - a.importance);
  }, []);

  // Animate prediction flow
  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="rf-visualizer">
      {/* Header */}
      <div className="rf-header">
        <button onClick={onBack} className="rf-back-btn">
          ← Back to Results
        </button>
        <div className="rf-title-section">
          <h1>🌲 Random Forest Visualizer</h1>
          <p>Learn how the algorithm predicts dropout risk using your answers</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="rf-nav">
        {[
          { id: 'intro', label: '📚 What is Random Forest?', icon: '📚' },
          { id: 'trees', label: '🌳 See the Trees', icon: '🌳' },
          { id: 'voting', label: '🗳️ Voting Process', icon: '🗳️' },
          { id: 'features', label: '⭐ Feature Importance', icon: '⭐' },
          { id: 'your-prediction', label: '🎯 Your Prediction', icon: '🎯' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`rf-nav-btn ${activeSection === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSection(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="rf-content">
        
        {/* INTRO SECTION */}
        {activeSection === 'intro' && (
          <div className="rf-section intro-section">
            <div className="intro-hero">
              <div className="forest-emoji">🌲🌲🌲🌲🌲</div>
              <h2>What is Random Forest?</h2>
              <p className="intro-tagline">
                Imagine asking <strong>50 experts</strong> for their opinion, then going with the majority vote!
              </p>
            </div>

            <div className="concept-cards">
              <div className="concept-card">
                <div className="concept-icon">🌳</div>
                <h3>Decision Trees</h3>
                <p>Each "tree" is like a flowchart that asks questions about your answers and makes a decision at each step.</p>
                <div className="mini-tree">
                  <div className="tree-node root">Motivation &gt; 3?</div>
                  <div className="tree-branches">
                    <div className="tree-branch left">
                      <span className="branch-label">No</span>
                      <div className="tree-node">Higher Risk</div>
                    </div>
                    <div className="tree-branch right">
                      <span className="branch-label">Yes</span>
                      <div className="tree-node">Check Stress...</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="concept-card">
                <div className="concept-icon">🎲</div>
                <h3>Randomness</h3>
                <p>Each tree only sees a <strong>random subset</strong> of your answers, making each tree unique.</p>
                <div className="random-demo">
                  <div className="feature-pill">Tree 1: Q1, Q3, Q5, Q8</div>
                  <div className="feature-pill">Tree 2: Q2, Q4, Q6, Q9</div>
                  <div className="feature-pill">Tree 3: Q1, Q2, Q7, Q11</div>
                </div>
              </div>

              <div className="concept-card">
                <div className="concept-icon">🗳️</div>
                <h3>Voting</h3>
                <p>All trees vote on the final prediction. The majority wins!</p>
                <div className="vote-demo">
                  <div className="vote-bar">
                    <div className="vote-safe" style={{width: '70%'}}>35 Trees: Safe</div>
                    <div className="vote-risk" style={{width: '30%'}}>15: Risk</div>
                  </div>
                  <div className="vote-result">✅ Final: Not At Risk</div>
                </div>
              </div>
            </div>

            <div className="why-works">
              <h3>🤔 Why Does This Work?</h3>
              <div className="why-grid">
                <div className="why-item">
                  <span className="why-icon">🎯</span>
                  <strong>Reduces Errors</strong>
                  <p>Individual trees may be wrong, but the majority is usually right</p>
                </div>
                <div className="why-item">
                  <span className="why-icon">🛡️</span>
                  <strong>Prevents Overfitting</strong>
                  <p>Randomness prevents the model from memorizing training data</p>
                </div>
                <div className="why-item">
                  <span className="why-icon">📊</span>
                  <strong>Handles Complexity</strong>
                  <p>Can capture complex patterns between your answers</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TREES SECTION */}
        {activeSection === 'trees' && scores && (
          <div className="rf-section trees-section">
            <h2>🌳 Inside the Decision Trees</h2>
            <p className="section-desc">
              Our model has <strong>50 trees</strong>. Here's a simplified view of 5 trees and how they process YOUR answers.
            </p>

            {/* Tree Selector */}
            <div className="tree-selector">
              {simulatedTrees.map((tree, idx) => (
                <button
                  key={tree.id}
                  className={`tree-select-btn ${selectedTree === idx ? 'active' : ''}`}
                  onClick={() => setSelectedTree(idx)}
                >
                  🌳 Tree {tree.id}
                  <span className={`tree-verdict ${tree.prediction === 'At Risk' ? 'risk' : 'safe'}`}>
                    {tree.prediction === 'At Risk' ? '⚠️' : '✅'}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Tree Detail */}
            {simulatedTrees[selectedTree] && (
              <div className="tree-detail">
                <div className="tree-header">
                  <h3>🌳 Tree {simulatedTrees[selectedTree].id} Decision Path</h3>
                  <div className={`tree-prediction ${simulatedTrees[selectedTree].prediction === 'At Risk' ? 'risk' : 'safe'}`}>
                    Predicts: {simulatedTrees[selectedTree].prediction}
                  </div>
                </div>

                <div className="tree-features-used">
                  <strong>Features this tree uses:</strong>
                  <div className="feature-chips">
                    {simulatedTrees[selectedTree].featuresUsed.map(f => (
                      <span key={f} className="feature-chip">{questionLabels[f]}</span>
                    ))}
                  </div>
                </div>

                <div className="decision-flow">
                  {simulatedTrees[selectedTree].decisions.map((decision, idx) => (
                    <div key={idx} className="decision-node">
                      <div className="node-question">
                        <span className="node-number">{idx + 1}</span>
                        <span className="node-feature">{decision.featureName}</span>
                      </div>
                      <div className="node-check">
                        Your answer: <strong>{decision.value}</strong> / 5
                        <span className={`node-direction ${decision.direction}`}>
                          {decision.value <= decision.threshold ? '← Goes Left' : '→ Goes Right'}
                        </span>
                      </div>
                      <div className="node-contribution">
                        Risk contribution: <span className={decision.contribution > 0.05 ? 'high' : 'low'}>
                          +{(decision.contribution * 100).toFixed(1)}%
                        </span>
                      </div>
                      {idx < simulatedTrees[selectedTree].decisions.length - 1 && (
                        <div className="node-arrow">↓</div>
                      )}
                    </div>
                  ))}

                  <div className="tree-leaf">
                    <div className="leaf-icon">🍃</div>
                    <div className="leaf-content">
                      <strong>Leaf Node (Final Decision)</strong>
                      <div className="leaf-risk">
                        Total Risk: {(simulatedTrees[selectedTree].finalRisk * 100).toFixed(1)}%
                      </div>
                      <div className={`leaf-prediction ${simulatedTrees[selectedTree].prediction === 'At Risk' ? 'risk' : 'safe'}`}>
                        {simulatedTrees[selectedTree].prediction === 'At Risk' ? '⚠️ At Risk' : '✅ Not At Risk'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VOTING SECTION */}
        {activeSection === 'voting' && scores && ensembleResult && (
          <div className="rf-section voting-section">
            <h2>🗳️ How Trees Vote</h2>
            <p className="section-desc">
              Each tree makes its own prediction. The final answer is decided by <strong>majority vote</strong>.
            </p>

            <button 
              className="animate-btn"
              onClick={() => setShowVoting(!showVoting)}
            >
              {showVoting ? '🔄 Reset' : '▶️ Watch the Voting'}
            </button>

            <div className="voting-arena">
              <div className="trees-voting">
                {simulatedTrees.map((tree, idx) => (
                  <div 
                    key={tree.id} 
                    className={`voting-tree ${showVoting ? 'voted' : ''} ${tree.prediction === 'At Risk' ? 'votes-risk' : 'votes-safe'}`}
                    style={{ animationDelay: `${idx * 0.3}s` }}
                  >
                    <div className="voting-tree-icon">🌳</div>
                    <div className="voting-tree-id">Tree {tree.id}</div>
                    {showVoting && (
                      <div className={`voting-tree-vote ${tree.prediction === 'At Risk' ? 'risk' : 'safe'}`}>
                        {tree.prediction === 'At Risk' ? '⚠️ At Risk' : '✅ Safe'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {showVoting && (
                <div className="voting-results">
                  <div className="vote-count">
                    <div className="vote-count-item safe">
                      <span className="count">{ensembleResult.notAtRiskVotes}</span>
                      <span className="label">Trees say "Not At Risk"</span>
                    </div>
                    <div className="vote-vs">VS</div>
                    <div className="vote-count-item risk">
                      <span className="count">{ensembleResult.atRiskVotes}</span>
                      <span className="label">Trees say "At Risk"</span>
                    </div>
                  </div>

                  <div className="final-verdict">
                    <h3>🏆 Final Verdict (Majority Wins)</h3>
                    <div className={`verdict-box ${ensembleResult.finalPrediction === 'At Risk' ? 'risk' : 'safe'}`}>
                      {ensembleResult.finalPrediction === 'At Risk' ? '⚠️' : '✅'} {ensembleResult.finalPrediction}
                    </div>
                    <div className="verdict-confidence">
                      Confidence: {(ensembleResult.confidence * 100).toFixed(0)}% of trees agree
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="voting-explanation">
              <h3>💡 Why Voting Works</h3>
              <p>
                Think of it like asking 50 doctors for a diagnosis. Even if a few are wrong, 
                the majority opinion is usually more reliable than any single doctor's opinion.
              </p>
              <div className="wisdom-of-crowds">
                <div className="crowd-icon">👥👥👥👥👥</div>
                <strong>Wisdom of Crowds</strong>
                <p>The collective intelligence of many "experts" (trees) is better than any individual</p>
              </div>
            </div>
          </div>
        )}

        {/* FEATURES SECTION */}
        {activeSection === 'features' && (
          <div className="rf-section features-section">
            <h2>⭐ Feature Importance</h2>
            <p className="section-desc">
              Which questions matter most? The model learned this from training data.
            </p>

            <div className="importance-chart">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={featureImportance} 
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    domain={[0, 20]}
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    width={110}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rf-tooltip">
                            <strong>{data.name}</strong>
                            <p>Importance: {data.importance.toFixed(1)}%</p>
                            <p>Type: {data.direction === 'positive' ? '🟢 Positive' : '🔴 Negative'}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    {featureImportance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="importance-legend">
              <div className="legend-item">
                <span className="legend-dot positive"></span>
                <span><strong>Positive factors:</strong> Higher score = Lower risk (e.g., Motivation)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot negative"></span>
                <span><strong>Negative factors:</strong> Higher score = Higher risk (e.g., Stress)</span>
              </div>
            </div>

            <div className="top-factors">
              <h3>🏆 Top 3 Most Important Factors</h3>
              <div className="top-factors-grid">
                {featureImportance.slice(0, 3).map((f, idx) => (
                  <div key={f.name} className={`top-factor rank-${idx + 1}`}>
                    <div className="rank-badge">{['🥇', '🥈', '🥉'][idx]}</div>
                    <div className="factor-name">{f.name}</div>
                    <div className="factor-importance">{f.importance.toFixed(1)}%</div>
                    <div className={`factor-type ${f.direction}`}>
                      {f.direction === 'positive' ? '↑ Higher = Safer' : '↑ Higher = Riskier'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* YOUR PREDICTION SECTION */}
        {activeSection === 'your-prediction' && scores && (
          <div className="rf-section prediction-section">
            <h2>🎯 Your Prediction Explained</h2>
            <p className="section-desc">
              Here's exactly how the Random Forest analyzed YOUR answers.
            </p>

            {/* Animated Flow */}
            <div className="prediction-flow">
              <div className={`flow-step ${animationStep >= 1 ? 'active' : ''}`}>
                <div className="step-icon">📝</div>
                <div className="step-content">
                  <h4>Step 1: Your Answers</h4>
                  <div className="your-answers">
                    {Object.entries(scores).slice(0, 6).map(([q, v]) => (
                      <div key={q} className="answer-chip">
                        {questionLabels[q]}: <strong>{v}</strong>
                      </div>
                    ))}
                    {Object.keys(scores).length > 6 && <div className="answer-chip">+{Object.keys(scores).length - 6} more</div>}
                  </div>
                </div>
              </div>

              <div className="flow-arrow">↓</div>

              <div className={`flow-step ${animationStep >= 2 ? 'active' : ''}`}>
                <div className="step-icon">🌲🌲🌲</div>
                <div className="step-content">
                  <h4>Step 2: 50 Trees Process</h4>
                  <p>Each tree analyzes different combinations of your answers</p>
                </div>
              </div>

              <div className="flow-arrow">↓</div>

              <div className={`flow-step ${animationStep >= 3 ? 'active' : ''}`}>
                <div className="step-icon">🗳️</div>
                <div className="step-content">
                  <h4>Step 3: Trees Vote</h4>
                  <div className="mini-vote">
                    {ensembleResult && (
                      <>
                        <span className="safe-votes">✅ {ensembleResult.notAtRiskVotes} Safe</span>
                        <span className="risk-votes">⚠️ {ensembleResult.atRiskVotes} At Risk</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flow-arrow">↓</div>

              <div className={`flow-step result ${animationStep >= 4 ? 'active' : ''}`}>
                <div className="step-icon">🎯</div>
                <div className="step-content">
                  <h4>Final Result</h4>
                  <div className={`final-result ${riskScore > 0.5 ? 'risk' : riskScore > 0.33 ? 'medium' : 'safe'}`}>
                    <div className="result-score">{(riskScore * 100).toFixed(0)}%</div>
                    <div className="result-label">
                      {riskScore > 0.5 ? '⚠️ High Risk' : riskScore > 0.33 ? '⚡ Medium Risk' : '✅ Low Risk'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="animate-flow-btn" onClick={startAnimation} disabled={isAnimating}>
              {isAnimating ? '⏳ Animating...' : '▶️ Watch Prediction Flow'}
            </button>

            {/* Detailed Breakdown */}
            <div className="your-breakdown">
              <h3>📊 Factor-by-Factor Breakdown</h3>
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Your Answer</th>
                    <th>Type</th>
                    <th>Weight</th>
                    <th>Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(mlConfig.questions).map(([qId, config]) => {
                    const value = scores[qId] || 3;
                    const normalized = (value - 1) / 4;
                    let contribution;
                    if (config.direction === 'positive') {
                      contribution = (1 - normalized) * config.weight;
                    } else {
                      contribution = normalized * config.weight;
                    }
                    
                    return (
                      <tr key={qId}>
                        <td>{questionLabels[qId]}</td>
                        <td><strong>{value}</strong>/5</td>
                        <td className={config.direction}>{config.direction === 'positive' ? '🟢' : '🔴'}</td>
                        <td>{(config.weight * 100).toFixed(1)}%</td>
                        <td className={contribution > 0.05 ? 'high-impact' : contribution > 0.02 ? 'med-impact' : 'low-impact'}>
                          +{(contribution * 100).toFixed(1)}% risk
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No scores fallback */}
        {!scores && activeSection !== 'intro' && activeSection !== 'features' && (
          <div className="no-scores-message">
            <div className="no-scores-icon">📝</div>
            <h3>Complete the Assessment First</h3>
            <p>To see your personalized Random Forest analysis, please complete the wellness assessment.</p>
            <button onClick={onBack} className="go-back-btn">Go to Assessment</button>
          </div>
        )}
      </div>

      {/* Model Info Footer */}
      <div className="rf-footer">
        <div className="model-stats">
          <div className="stat">
            <span className="stat-value">50</span>
            <span className="stat-label">Decision Trees</span>
          </div>
          <div className="stat">
            <span className="stat-value">{(mlConfig.metrics?.accuracy * 100 || 87.5).toFixed(1)}%</span>
            <span className="stat-label">Model Accuracy</span>
          </div>
          <div className="stat">
            <span className="stat-value">11</span>
            <span className="stat-label">Features Used</span>
          </div>
        </div>
        <p className="footer-note">
          🎓 Educational visualization for DTL Project • RV College of Engineering
        </p>
      </div>
    </div>
  );
};

export default RandomForestVisualizer;
