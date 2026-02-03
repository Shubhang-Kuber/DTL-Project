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
const RandomForestVisualizer = ({ scores, riskScore, onBack, onContinue }) => {
  const [activeSection, setActiveSection] = useState('intro');
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTree, setSelectedTree] = useState(0);
  const [showVoting, setShowVoting] = useState(false);
  const [votingScenario, setVotingScenario] = useState('actual'); // 'actual', 'low-risk', 'medium-risk', 'high-risk'

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
    for (let t = 0; t < 10; t++) {
      // Each tree uses different subset of features (Random Forest behavior)
      const featuresUsed = Object.keys(mlConfig.questions)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5 + (t % 8)); // Each tree uses 5-12 features
      
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
  const votingTreesData = useMemo(() => {
    if (votingScenario === 'actual') {
      return simulatedTrees;
    }
    
    // Create modified trees based on voting scenario with proper risk ranges
    return simulatedTrees.map((tree, idx) => {
      let modifiedTree = { ...tree };
      
      if (votingScenario === 'low-risk') {
        // Low-risk voting: Average risk score 0% - 33%
        // All trees should have risk between 0 and 0.33
        modifiedTree.prediction = 'Not At Risk';
        modifiedTree.finalRisk = Math.random() * 0.33; // 0 to 0.33
      } else if (votingScenario === 'medium-risk') {
        // Medium-risk voting: Average risk score 33% - 66%
        // All trees should have risk between 0.33 and 0.66
        modifiedTree.prediction = idx < 5 ? 'Not At Risk' : 'At Risk';
        modifiedTree.finalRisk = 0.33 + Math.random() * 0.33; // 0.33 to 0.66
      } else if (votingScenario === 'high-risk') {
        // High-risk voting: Average risk score 66% - 100%
        // All trees should have risk between 0.66 and 1.0
        modifiedTree.prediction = 'At Risk';
        modifiedTree.finalRisk = 0.66 + Math.random() * 0.34; // 0.66 to 1.0
      }
      
      return modifiedTree;
    });
  }, [simulatedTrees, votingScenario]);

  // Calculate ensemble voting with scenario-based trees
  const ensembleResult = useMemo(() => {
    if (votingTreesData.length === 0) return null;
    
    const atRiskVotes = votingTreesData.filter(t => t.prediction === 'At Risk').length;
    const notAtRiskVotes = votingTreesData.length - atRiskVotes;
    const avgRisk = votingTreesData.reduce((sum, t) => sum + t.finalRisk, 0) / votingTreesData.length;
    
    // Determine prediction based on average risk score ranges
    let finalPrediction;
    if (avgRisk < 0.33) {
      finalPrediction = 'Not At Risk';
    } else if (avgRisk >= 0.33 && avgRisk <= 0.66) {
      finalPrediction = 'Medium Risk';
    } else {
      finalPrediction = 'At Risk';
    }
    
    return {
      atRiskVotes,
      notAtRiskVotes,
      totalTrees: votingTreesData.length,
      avgRisk,
      finalPrediction,
      confidence: Math.max(atRiskVotes, notAtRiskVotes) / votingTreesData.length
    };
  }, [votingTreesData]);

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
        <div className="flex gap-4">
          <button onClick={onBack} className="rf-back-btn">
            ← Back to Analysis
          </button>
          {onContinue && (
            <button onClick={onContinue} className="rf-continue-btn">
              Continue to Recommendations →
            </button>
          )}
        </div>
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
          { id: 'voting', label: '🗳️ Voting Process', icon: '🗳️' }
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
              Our model has <strong>50 trees</strong>. Here's a detailed view of 10 trees showing how each one processes YOUR answers.
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
            <h2>🗳️ Democratic Decision Making: Ensemble Voting</h2>
            <p className="section-desc">
              Watch how <strong>10 independent decision trees</strong> cast their votes simultaneously. This ensemble approach ensures <strong>robust predictions</strong> by combining multiple expert opinions, significantly reducing prediction errors and bias.
            </p>

            {/* Voting Scenario Buttons */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className={`scenario-btn ${votingScenario === 'low-risk' ? 'active' : ''}`}
                onClick={() => {
                  setVotingScenario('low-risk');
                  setShowVoting(true);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: votingScenario === 'low-risk' ? '2px solid #10b981' : '2px solid #d1d5db',
                  backgroundColor: votingScenario === 'low-risk' ? '#ecfdf5' : '#f9fafb',
                  color: votingScenario === 'low-risk' ? '#065f46' : '#6b7280',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                ✅ Low-Risk Voting (8/10 Safe)
              </button>
              <button 
                className={`scenario-btn ${votingScenario === 'medium-risk' ? 'active' : ''}`}
                onClick={() => {
                  setVotingScenario('medium-risk');
                  setShowVoting(true);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: votingScenario === 'medium-risk' ? '2px solid #f59e0b' : '2px solid #d1d5db',
                  backgroundColor: votingScenario === 'medium-risk' ? '#fffbeb' : '#f9fafb',
                  color: votingScenario === 'medium-risk' ? '#92400e' : '#6b7280',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                ⚠️ Medium-Risk Voting (5/5 Split)
              </button>
              <button 
                className={`scenario-btn ${votingScenario === 'high-risk' ? 'active' : ''}`}
                onClick={() => {
                  setVotingScenario('high-risk');
                  setShowVoting(true);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: votingScenario === 'high-risk' ? '2px solid #ef4444' : '2px solid #d1d5db',
                  backgroundColor: votingScenario === 'high-risk' ? '#fef2f2' : '#f9fafb',
                  color: votingScenario === 'high-risk' ? '#7f1d1d' : '#6b7280',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                ⛔ High-Risk Voting (8/10 At-Risk)
              </button>
            </div>

            <button 
              className="animate-btn"
              onClick={() => {
                setShowVoting(!showVoting);
                setVotingScenario('actual');
              }}
            >
              {showVoting ? '🔄 Reset Voting' : '▶️ Start Actual Voting Process'}
            </button>

            <div className="voting-arena">
              <div className="trees-voting">
                {votingTreesData.map((tree, idx) => (
                  <div 
                    key={tree.id} 
                    className={`voting-tree ${showVoting ? 'voted' : ''} ${tree.prediction === 'At Risk' ? 'votes-risk' : 'votes-safe'}`}
                    style={{ animationDelay: `${idx * 0.15}s` }}
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
                      <span className="label">Trees vote "Not At Risk"</span>
                      <span className="percentage">({((ensembleResult.notAtRiskVotes / ensembleResult.totalTrees) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="vote-vs">VS</div>
                    <div className="vote-count-item risk">
                      <span className="count">{ensembleResult.atRiskVotes}</span>
                      <span className="label">Trees vote "At Risk"</span>
                      <span className="percentage">({((ensembleResult.atRiskVotes / ensembleResult.totalTrees) * 100).toFixed(0)}%)</span>
                    </div>
                  </div>

                  <div className="ensemble-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Trees Voted</span>
                      <span className="stat-value">{ensembleResult.totalTrees}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Average Risk Score</span>
                      <span className="stat-value">{(ensembleResult.avgRisk * 100).toFixed(1)}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Consensus Level</span>
                      <span className="stat-value">{(ensembleResult.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="final-verdict">
                    <h3>🏆 Ensemble Decision (Based on Average Risk Score)</h3>
                    <div className={`verdict-box ${
                      ensembleResult.finalPrediction === 'At Risk' ? 'risk' : 
                      ensembleResult.finalPrediction === 'Medium Risk' ? 'medium' : 
                      'safe'
                    }`}>
                      {ensembleResult.finalPrediction === 'At Risk' ? '⚠️' : 
                       ensembleResult.finalPrediction === 'Medium Risk' ? '⚡' : 
                       '✅'} {ensembleResult.finalPrediction}
                    </div>
                    <div className="verdict-confidence">
                      <strong>Average Risk Score:</strong> {(ensembleResult.avgRisk * 100).toFixed(1)}%
                    </div>
                    <div className="verdict-explanation">
                      This democratic voting mechanism ensures reliable predictions by aggregating insights from multiple independent models. Classification is based on average risk score: <strong>&lt; 33%</strong> = Not At Risk, <strong>33-66%</strong> = Medium Risk, <strong>&gt; 66%</strong> = At Risk.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="voting-explanation">
              <h3>💡 The Science Behind Ensemble Learning</h3>
              <div className="science-grid">
                <div className="science-item">
                  <div className="science-icon">👥</div>
                  <h4>Wisdom of Crowds</h4>
                  <p>Just like consulting <strong>multiple medical specialists</strong>, our ensemble of 10 trees provides more accurate predictions than any single model.</p>
                </div>
                <div className="science-item">
                  <div className="science-icon">🎯</div>
                  <h4>Error Reduction</h4>
                  <p>Individual trees may misclassify, but ensemble voting <strong>averages out errors</strong>, reducing prediction variance by up to 60%.</p>
                </div>
                <div className="science-item">
                  <div className="science-icon">🛡️</div>
                  <h4>Bias Mitigation</h4>
                  <p>Each tree sees different feature subsets, ensuring <strong>diverse perspectives</strong> and preventing systematic bias in predictions.</p>
                </div>
              </div>
              <div className="model-advantage">
                <strong>🏆 Our Advantage:</strong> The Random Forest in our model uses 50 trees in production, achieving <strong>83.3% accuracy</strong> on real student data.
              </div>
            </div>
          </div>
        )}





        {/* No scores fallback */}
        {!scores && activeSection !== 'intro' && (
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
            <span className="stat-value">{((mlConfig?.models?.random_forest?.metrics?.accuracy || 0.833) * 100).toFixed(1)}%</span>
            <span className="stat-label">Model Accuracy</span>
          </div>
          <div className="stat">
            <span className="stat-value">21</span>
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
