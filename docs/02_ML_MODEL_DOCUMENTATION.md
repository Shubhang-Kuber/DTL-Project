# 🌲 Random Forest ML Model Documentation
## Complete In-Depth Technical Description

---

## 📋 Table of Contents
1. [Algorithm Overview](#algorithm-overview)
2. [How Random Forest Works](#how-random-forest-works)
3. [Model Configuration](#model-configuration)
4. [Feature Weights & Importance](#feature-weights--importance)
5. [Direction-Aware Scoring](#direction-aware-scoring)
6. [Prediction Pipeline](#prediction-pipeline)
7. [Model Performance](#model-performance)
8. [Sentiment Analysis](#sentiment-analysis)
9. [Risk Thresholds](#risk-thresholds)

---

## 🧠 Algorithm Overview

### What is Random Forest?

**Random Forest** is an **ensemble learning** algorithm that builds multiple decision trees and combines their predictions through voting. It's called a "forest" because it creates many trees that work together.

```
┌─────────────────────────────────────────────────────────────────┐
│                    RANDOM FOREST CLASSIFIER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    Student Answers 12 Questions (1-5 scale)                     │
│                        │                                         │
│                        ▼                                         │
│    ┌─────────────────────────────────────────────┐              │
│    │   50 Decision Trees Process Independently    │              │
│    │                                              │              │
│    │   🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲    │              │
│    │   🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲    │              │
│    │   🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲    │              │
│    │   🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲    │              │
│    │   🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲  🌲    │              │
│    └─────────────────────────────────────────────┘              │
│                        │                                         │
│                        ▼                                         │
│              Majority Voting System                              │
│         (Count votes from all 50 trees)                         │
│                        │                                         │
│                        ▼                                         │
│    Final Prediction: "At Risk" or "Not At Risk"                 │
│    Confidence = % of trees that agreed                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why Random Forest for Dropout Prediction?

| Advantage | Explanation |
|-----------|-------------|
| **Handles mixed data** | Works with both numerical (1-5 scale) and categorical data |
| **No normalization needed** | Decision trees don't require standardized inputs |
| **Feature importance** | Tells us which questions matter most for prediction |
| **Resistant to overfitting** | Multiple trees reduce the chance of memorizing noise |
| **Works with small datasets** | Performs well even with our 40 student responses |
| **Interpretable** | Can trace decision paths to understand predictions |

---

## 🔄 How Random Forest Works

### Step 1: Bootstrap Sampling
Each of the 50 trees is trained on a **random subset** of the data (sampling with replacement).

```
Original Data: 40 students
              ↓
    Tree 1: Random 32 students
    Tree 2: Different random 32 students
    Tree 3: Another random 32 students
    ...
    Tree 50: Yet another random 32 students
```

### Step 2: Random Feature Selection
At each split in a tree, only a **random subset of features** (questions) is considered.

```
For each split decision:
    Available features: 11 questions
    Features considered: √11 ≈ 3-4 questions randomly selected
    Best split chosen from those 3-4
```

### Step 3: Tree Building
Each tree learns patterns by making yes/no decisions based on thresholds.

```
Example Decision Tree Path:
                    ┌─────────────────┐
                    │ Q9 (Commitments)│
                    │    Value > 3?   │
                    └────────┬────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
            YES (High)                  NO (Low)
               │                           │
               ▼                           ▼
    ┌─────────────────┐          ┌─────────────────┐
    │ Q8 (Isolation)  │          │ Q1 (Interest)   │
    │    Value > 3?   │          │    Value < 3?   │
    └────────┬────────┘          └────────┬────────┘
             │                            │
    ┌────────┴────────┐          ┌────────┴────────┐
    │                 │          │                 │
 YES→AT RISK      NO→CHECK    YES→MEDIUM      NO→LOW RISK
                    MORE         RISK
```

### Step 4: Ensemble Voting
All 50 trees vote, and the majority wins.

```
Prediction Example:
├── 42 trees vote "Not At Risk"  ──→  84%
└──  8 trees vote "At Risk"      ──→  16%

Final: "Not At Risk" with 84% confidence
```

---

## ⚙️ Model Configuration

### Hyperparameters Used

| Parameter | Value | Description |
|-----------|-------|-------------|
| **n_estimators** | 50 | Number of decision trees in the forest |
| **max_depth** | 5 | Maximum depth of each tree (prevents overfitting) |
| **random_state** | 42 | Seed for reproducibility |
| **bootstrap** | True | Use bootstrap sampling |
| **class_weight** | balanced | Handle class imbalance |

### Training Data

| Metric | Value |
|--------|-------|
| **Total samples** | 40 students |
| **Training set** | 32 students (80%) |
| **Test set** | 8 students (20%) |
| **Features** | 11 questions (Q1-Q11) |
| **Target** | Q12 (Dropout consideration) |

### Class Distribution

```
Target Distribution:
├── Not At Risk (0): 36 students (90%)
└── At Risk (1):      4 students (10%)

⚠️ Note: Severe class imbalance affects minority class detection
```

---

## 📊 Feature Weights & Importance

The Random Forest training process determines how important each question is for predicting dropout risk. Higher weights = more predictive power.

### Trained Feature Importance (Weights)

| Question | Feature Name | Weight | Rank | Direction |
|----------|--------------|--------|------|-----------|
| **Q9** | External Commitments | **0.1619** | 1st | Negative |
| **Q8** | Social Isolation | **0.1320** | 2nd | Negative |
| **Q11** | Extracurricular | **0.1223** | 3rd | Positive |
| **Q1** | Course Interest | **0.1186** | 4th | Positive |
| **Q7** | Institutional Support | **0.1158** | 5th | Positive |
| **Q2** | Motivation | **0.1138** | 6th | Positive |
| **Q5** | Financial Impact | **0.0931** | 7th | Negative |
| **Q3** | Academic Confidence | **0.0879** | 8th | Positive |
| **Q6** | Family Support | **0.0546** | 9th | Positive |
| **Q4** | Stress Level | **0.0000** | 10th | Negative |
| **Q10** | Attendance | **0.0000** | 11th | Positive |

### Visual Weight Distribution

```
Q9  (External)      ████████████████  16.2%
Q8  (Isolation)     █████████████     13.2%
Q11 (Extracurric)   ████████████      12.2%
Q1  (Interest)      ████████████      11.9%
Q7  (Institution)   ███████████       11.6%
Q2  (Motivation)    ███████████       11.4%
Q5  (Financial)     █████████          9.3%
Q3  (Confidence)    ████████           8.8%
Q6  (Family)        █████              5.5%
Q4  (Stress)        ░                  0.0%
Q10 (Attendance)    ░                  0.0%
```

### Key Insight

**Most Predictive Factors:**
1. **External Commitments (Q9)** - Work/family balance strongly predicts dropout
2. **Social Isolation (Q8)** - Feeling disconnected is a major risk signal
3. **Extracurricular Activities (Q11)** - Campus engagement is protective

**Surprising Finding:**
- Stress level (Q4) and Attendance (Q10) showed 0% importance in this dataset
- This may be due to limited variance in responses or class imbalance

---

## 🔀 Direction-Aware Scoring

### The Problem with Simple Scoring

Not all questions work the same way:
- **Q1 (Interest)**: High value = GOOD → Low risk
- **Q4 (Stress)**: High value = BAD → High risk

Simply averaging scores would give wrong results!

### Our Solution: Direction-Aware Inversion

```
SCORING RULES:

For POSITIVE questions (higher = healthier):
    Examples: Interest, Motivation, Confidence, Support, Attendance
    Formula: riskContribution = 1 - normalizedValue
    
    Student answers 5 (very interested) →
        normalized = (5-1)/(5-1) = 1.0
        risk = 1 - 1.0 = 0.0 (LOW RISK) ✓

For NEGATIVE questions (higher = riskier):
    Examples: Stress, Financial Impact, Isolation, Commitments
    Formula: riskContribution = normalizedValue
    
    Student answers 5 (very stressed) →
        normalized = (5-1)/(5-1) = 1.0
        risk = 1.0 (HIGH RISK) ✓
```

### Question Direction Map

| Question | Type | Scoring Logic |
|----------|------|---------------|
| Q1 - Course Interest | 🟢 Positive | Invert (high value → low risk) |
| Q2 - Motivation | 🟢 Positive | Invert |
| Q3 - Academic Confidence | 🟢 Positive | Invert |
| Q4 - Stress Level | 🔴 Negative | Keep (high value → high risk) |
| Q5 - Financial Impact | 🔴 Negative | Keep |
| Q6 - Family Support | 🟢 Positive | Invert |
| Q7 - Institutional Support | 🟢 Positive | Invert |
| Q8 - Social Isolation | 🔴 Negative | Keep |
| Q9 - External Commitments | 🔴 Negative | Keep |
| Q10 - Attendance | 🟢 Positive | Invert |
| Q11 - Extracurricular | 🟢 Positive | Invert |

---

## 🔄 Prediction Pipeline

### Complete Prediction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ INPUT: Student Survey Responses                                  │
│ {q1: 4, q2: 5, q3: 3, q4: 2, q5: 3, q6: 4, q7: 4, q8: 2, ...}  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: NORMALIZE VALUES                                        │
│                                                                  │
│ For each response:                                              │
│   normalized = (value - 1) / (5 - 1)                           │
│   Example: q1=4 → (4-1)/(5-1) = 0.75                           │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: APPLY DIRECTION-AWARE SCORING                           │
│                                                                  │
│ For POSITIVE questions: risk = 1 - normalized                   │
│   q1 (interest): normalized=0.75 → risk=0.25                    │
│                                                                  │
│ For NEGATIVE questions: risk = normalized                       │
│   q4 (stress): normalized=0.25 → risk=0.25                      │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: APPLY ML-TRAINED WEIGHTS                                │
│                                                                  │
│ weightedRisk = risk × weight                                    │
│                                                                  │
│ q1: 0.25 × 0.1186 = 0.0297                                     │
│ q8: 0.25 × 0.1320 = 0.0330                                     │
│ q9: 0.50 × 0.1619 = 0.0810                                     │
│ ...                                                             │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: AGGREGATE SCORES                                        │
│                                                                  │
│ totalWeightedRisk = Σ(weightedRisk for all questions)          │
│ totalWeight = Σ(all weights)                                    │
│                                                                  │
│ rawScore = totalWeightedRisk / totalWeight                      │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: ADD SENTIMENT ANALYSIS (if text provided)               │
│                                                                  │
│ Analyze optional text for:                                      │
│   - Positive keywords (confident, happy, motivated)            │
│   - Negative keywords (stressed, struggling, overwhelmed)      │
│   - Dropout indicators (want to quit, dropping out)            │
│                                                                  │
│ sentimentAdjustment = dropoutRisk × 0.15                        │
│ finalScore = rawScore + sentimentAdjustment                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: CALCULATE FACTOR SCORES                                 │
│                                                                  │
│ Group questions into 4 factors:                                 │
│                                                                  │
│ Engagement & Motivation:      avg(q1, q2)                       │
│ Academic Consistency:         avg(q3, q7, q10)                  │
│ Emotional Well-being:         avg(q4, q6, q8)                   │
│ External/Financial Pressure:  avg(q5, q9, q11)                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ OUTPUT: Prediction Result                                        │
│                                                                  │
│ {                                                               │
│   overallScore: 0.42 (42%),                                     │
│   prediction: "Medium Risk",                                    │
│   confidence: 0.78,                                             │
│   factorScores: {                                               │
│     "Engagement & Motivation": 35,                              │
│     "Academic Consistency": 28,                                 │
│     "Emotional Well-being": 45,                                 │
│     "External/Financial Pressure": 58                           │
│   }                                                             │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 Model Performance

### Evaluation Metrics

| Metric | Value | Interpretation |
|--------|-------|----------------|
| **Accuracy** | 87.5% | 7 out of 8 test predictions correct |
| **Cross-Validation** | 77.5% ± 18.7% | Average across 5 folds |
| **Precision** | 0.0% | No at-risk correctly identified* |
| **Recall** | 0.0% | Missed all at-risk students* |
| **Specificity** | 100% | All not-at-risk correctly identified |

*Due to severe class imbalance (only 4/40 at-risk students)

### Confusion Matrix

```
                    Predicted
                 Not Risk  At Risk
Actual  Not Risk    7         0      ← All correct
        At Risk     1         0      ← 1 missed

True Negatives:  7 (correctly identified not at risk)
False Positives: 0 (no false alarms)
False Negatives: 1 (missed 1 at-risk student)
True Positives:  0 (no at-risk correctly caught)
```

### Limitations & Notes

⚠️ **Class Imbalance Issue:**
The dataset has only 4 students (10%) marked as "at risk." This makes it difficult for the model to learn patterns for the minority class.

**Implications:**
- Model is conservative (tends to predict "Not At Risk")
- Low recall means some at-risk students may be missed
- Feature importance reflects what distinguishes the few at-risk cases

**Recommended Solutions:**
1. Collect more at-risk student data
2. Use SMOTE (Synthetic Minority Oversampling)
3. Adjust classification threshold
4. Use weighted scoring (implemented)

---

## 💬 Sentiment Analysis

### How It Works

The system analyzes optional text input for emotional indicators that adjust the risk score.

### Keyword Categories

#### Positive Keywords (Reduce Risk)
```
excited, happy, confident, supported, engaged, motivated, 
enjoy, good, great, excellent, wonderful, grateful, thriving, 
successful, proud, optimistic, hopeful, passionate, interested, 
love, amazing, comfortable, satisfied, strong
```

#### Negative Keywords (Increase Risk)
```
stressed, anxious, overwhelmed, depressed, hopeless, struggling, 
isolated, lonely, exhausted, difficult, hard, worried, failing, 
lost, confused, frustrated, burnout, dropout, quit, leave, hate, 
boring, useless, terrible, scared, pressure, burden, stuck, 
trapped, helpless, miserable
```

#### Dropout Indicators (Strong Risk Signals)
```
want to quit, thinking of leaving, dropping out, can't continue, 
giving up, no point, waste of time, wrong choice, hate college, 
want to stop, considering leaving, might drop, should quit
```

#### Academic Context Keywords
```
academic, course, class, study, studies, assignment, exam, test, 
grade, performance, learning, lecture, professor, faculty, 
college, university, semester, subject
```

### Sentiment Calculation

```javascript
// If text contains academic context, double the weight
if (academicContext) {
    positiveCount *= 2;
    negativeCount *= 2;
}

// Sentiment score: -1 (very negative) to +1 (very positive)
sentimentScore = (positiveCount - negativeCount) / total;

// Dropout risk from text (0 to 1)
dropoutRisk = min(1, dropoutSignals × 0.2 + negativeCount × 0.05);

// Applied to final score with 15% weight
finalScore += dropoutRisk × 0.15;
```

---

## 🎯 Risk Thresholds

### Classification Boundaries

| Risk Level | Score Range | Color | Action |
|------------|-------------|-------|--------|
| 🟢 **Low Risk** | 0% - 33% | Green | Continue monitoring |
| 🟡 **Medium Risk** | 33% - 66% | Yellow | Proactive outreach |
| 🔴 **High Risk** | 66% - 100% | Red | Immediate intervention |

### Threshold Configuration

```json
{
  "thresholds": {
    "low": 0.33,
    "medium": 0.66,
    "high": 1.0
  }
}
```

### Factor-Level Interpretation

For each of the 4 factors, the same thresholds apply:

| Factor Score | Interpretation |
|--------------|----------------|
| 0-33% | This area is healthy, continue current approach |
| 33-66% | Some concern, monitor and offer support |
| 66-100% | Critical area needing immediate attention |

---

## 🔧 Using the Model

### In the Web Dashboard

The model runs entirely in the browser via `mlPredictor.js`:

```javascript
import { predictDropoutRisk } from './utils/mlPredictor.js';

const responses = {
  q1: 4, q2: 5, q3: 3, q4: 2, q5: 3,
  q6: 4, q7: 4, q8: 2, q9: 3, q10: 5, q11: 4
};

const optionalText = "I'm feeling a bit overwhelmed with coursework";

const result = predictDropoutRisk(responses, optionalText);

console.log(result);
// {
//   overallScore: 0.38,
//   prediction: "Medium Risk",
//   confidence: 0.74,
//   factorScores: {...},
//   sentimentAnalysis: {...}
// }
```

### Retraining the Model

To retrain with new data:

```bash
python train_random_forest.py
```

This will:
1. Load data from `Responses CSV File.csv`
2. Train a new Random Forest model
3. Export updated weights to `ml_config.json`
4. Print evaluation metrics

---

## 📚 Related Documents

- [Project Overview](./01_PROJECT_OVERVIEW.md) - High-level project description
- [Technical Architecture](./03_TECHNICAL_ARCHITECTURE.md) - Code structure details
- [User Guide](./04_USER_GUIDE.md) - How to use the dashboard

---

*Document Version: 2.0 | Last Updated: January 2026*
