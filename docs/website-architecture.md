# Website Architecture & Technical Design

## Overview

The DTL Student Dropout Risk Prediction dashboard is a **single-page React application** that guides students through a 21-question assessment and provides ML-powered risk predictions with personalized recommendations.

---

## Application Architecture

### Technology Stack

```
Frontend Layer:
├── React 18.2         (UI components & state management)
├── Vite 5.0          (Build tool & dev server)
├── Tailwind CSS 3.3  (Utility-first styling)
├── Framer Motion 10  (Animations & transitions)
├── Recharts 2.10     (Interactive charts: radar, bar)
└── jsPDF 4.0         (PDF report generation)

ML Inference Layer:
├── ml_config.json    (Model weights & hyperparameters)
├── mlPredictor.js    (Dual algorithm inference)
└── scoring.js        (Legacy fallback calculations)

Configuration:
├── questions.js      (21 survey questions + metadata)
├── ml_config.json    (Model configurations & keywords)
└── dataLoader.js     (Mock data & CSV parsing)
```

---

## Component Hierarchy

```
App.jsx (Main Component)
├── State: currentScreen, analysisData, selectedAlgorithm
├── Screens (indexed 0-8):
│   ├── 0: AlgorithmSelectionScreen
│   │   └─ Choose Random Forest or XGBoost
│   │
│   ├── 1: AssessmentScreen
│   │   └─ 21 questions (3 per step)
│   │   └─ Sentiment/challenge text input
│   │
│   ├── 2: RiskSummaryScreen
│   │   └─ Overall risk score & classification
│   │   └─ ML confidence level
│   │
│   ├── 3: FactorBreakdownScreen
│   │   └─ Radar chart (4 factors)
│   │   └─ Bar chart (detailed comparison)
│   │
│   ├── 4: RecommendationsScreen
│   │   └─ AI-generated suggestions
│   │   └─ PDF export & email share
│   │
│   ├── 5: MLVisualizationScreen (REMOVED)
│   │
│   ├── 6: RandomForestVisualizer
│   │   └─ RF feature importance detail
│   │
│   ├── 7: XGBoostVisualizer
│   │   └─ XGBoost tree visualizations
│   │
│   └── 8: ModelValidationScreen
│       └─ Accuracy metrics & methodology
│
└── UI Components (reusable):
    ├── Button
    ├── Card
    ├── ScreenContainer
    ├── ProgressBar
    ├── LikertSlider
    ├── RiskBadge
    └── FactorChartCard
```

---

## Data Flow: Assessment to Prediction

### Step 1: User Selects Algorithm

```javascript
// AlgorithmSelectionScreen.jsx
User Clicks: "XGBoost" or "Random Forest"
              ↓
onSelectAlgorithm('xgboost') called
              ↓
App.jsx: setSelectedAlgorithm('xgboost')
setCurrentScreen(1)  // Go to Assessment
```

### Step 2: User Answers 21 Questions

```javascript
// AssessmentScreen.jsx
User answers Q1-Q3 → [Next]
User answers Q4-Q6 → [Next]
...
User answers Q19-Q21 → [Next]
User enters sentiment text (optional)
User clicks [Analyze My Responses]
              ↓
onComplete({
  responses: { q1: 4, q2: 5, ..., q21: 3 },
  sentiment: "I'm stressed about exams..."
}) called
```

### Step 3: ML Prediction (App.jsx)

```javascript
// App.jsx - AssessmentScreen completion handler
const data = onComplete parameter

// Step A: Load ML inference
const mlPrediction = predictDropoutRisk(
  data.responses,           // { q1: 4, q2: 5, ... }
  data.sentiment || '',      // "I'm stressed..."
  selectedAlgorithm          // 'xgboost' or 'random_forest'
);

// Step B: Create analysis data object
setAnalysisData({
  responses: data.responses,
  sentiment: data.sentiment,
  
  // ML Results (PRIMARY)
  overallScore: mlPrediction.overallScore,      // 0.72
  factorScores: mlPrediction.factorScores,      // {Academic: 0.65, ...}
  riskLevel: mlPrediction.riskLevel,            // 'HIGH'
  prediction: mlPrediction.prediction,          // 'At-Risk'
  confidence: mlPrediction.confidence,          // 0.95
  
  // Recommendations
  recommendations: generateMLRecommendations(mlPrediction.factorScores)
});

// Step C: Navigate to Risk Summary
setCurrentScreen(2);
```

### Step 4: Display Results

```javascript
// RiskSummaryScreen.jsx
Displays:
┌──────────────────────────────┐
│  OVERALL RISK SCORE: 72%     │
│  🔴 HIGH RISK                │
│  Prediction: At-Risk Student │
│  Confidence: 95%             │
│  Powered by: XGBoost + SMOTE │
└──────────────────────────────┘

[← Back] [Continue to Factor Breakdown →]
```

---

## ML Inference Engine (mlPredictor.js)

### Function: `predictDropoutRisk(responses, sentiment, algorithm)`

**Input:**
```javascript
responses: {
  q1: 4,    // Likert scale: 1-5
  q2: 5,
  ...,
  q21: 2
}
sentiment: "I'm overwhelmed by coursework and feeling isolated"
algorithm: 'xgboost' or 'random_forest'
```

**Processing:**

```javascript
1. Normalize Responses (1-5 → 0-1)
   ├─ POSITIVE questions: normalized = (value - 1) / 4
   └─ NEGATIVE questions: 
       ├─ Invert: inverted = 6 - value
       └─ Normalize: normalized = (inverted - 1) / 4

2. Calculate Factor Scores (average of 4-6 questions each)
   Academic Consistency    = avg(q1,q2,q3,q4,q5,q6)
   Emotional Well-being    = avg(invQ7,invQ8,Q9,Q10,Q11)
   Engagement & Motivation = avg(q12,q13,q14,q15,q16)
   Financial Pressure      = avg(invQ17,invQ18,Q19,invQ20,invQ21)

3. Analyze Sentiment (NLP)
   ├─ Count positive keywords: confident, motivated, ...
   ├─ Count negative keywords: stressed, isolated, ...
   ├─ Check for dropout signals: dropout, leave, quit, ...
   └─ Calculate sentiment score: (-1 to +1)

4. Run ML Inference (based on selected algorithm)
   
   IF algorithm === 'random_forest':
   ├─ Load RF weights from ml_config.json
   ├─ Apply Random Forest ensemble voting
   └─ Output: riskScore, confidence
   
   IF algorithm === 'xgboost':
   ├─ Load XGBoost weights from ml_config.json
   ├─ Apply XGBoost gradient boosting
   └─ Output: riskScore, confidence

5. Generate Prediction
   IF riskScore >= 0.66:
   │   riskLevel = 'HIGH'
   │   prediction = 'At-Risk'
   │
   ELSE IF riskScore >= 0.33:
   │   riskLevel = 'MEDIUM'
   │   prediction = 'Monitor Closely'
   │
   ELSE:
   │   riskLevel = 'LOW'
   │   prediction = 'Not At-Risk'

6. Create Recommendations
   ├─ Match factorScores to recommendation templates
   ├─ Prioritize by severity (high/medium/low)
   └─ Include sentiment-specific suggestions
```

**Output:**
```javascript
{
  overallScore: 0.72,               // 72% dropout risk
  prediction: 'At-Risk',
  confidence: 0.95,                 // 95% confidence
  riskLevel: 'HIGH',
  algorithmUsed: 'xgboost',
  algorithmName: 'XGBoost + SMOTE',
  
  factorScores: {
    'Academic Consistency': 0.65,
    'Emotional Well-being': 0.78,
    'Engagement & Motivation': 0.81,
    'External / Financial Pressure': 0.68
  },
  
  sentimentAnalysis: {
    score: -0.35,                   // Negative
    dropoutRisk: 2,                 // 2 dropout keywords found
    details: {
      positiveCount: 1,
      negativeCount: 5,
      academicContext: true
    }
  },
  
  description: "Your assessment indicates significant risk factors...",
  
  mlPrediction: { /* full prediction object */ }
}
```

---

## Feature Importance & Weights

### Random Forest Feature Importance

Each question's contribution to overall prediction:

```javascript
q1  (Academic Confidence):              2.3%
q2  (Help Seeking):                     3.8%
q3  (Teaching Quality):                 0.9%
q4  (Academic Support):                 0.4%
q5  (Admin Satisfaction):              12.5%  ← important
q6  (Counseling Attendance):            0.8%
q7  (Study Stress):                     0.6%
q8  (Social Isolation):                 6.9%   ← important
q9  (Family Support):                   0.9%
q10 (Health Status):                    0.5%
q11 (Mental Health):                    0.2%
q12 (Course Interest):                  2.0%
q13 (Study Motivation):                 2.9%
q14 (Extracurricular):                  2.6%
q15 (Class Attendance):                 5.3%   ← important
q16 (Academic Self-Efficacy):          30.1%  ← DOMINANT ⭐
q17 (Financial Stress):                 9.1%   ← important
q18 (Work/Family Commitment):           0.1%
q19 (Study Time):                       0.2%
q20 (External Pressure):               13.3%   ← important
q21 (Economic Constraints):             4.6%

Total: 100%
```

**Interpretation:**
- Q16 (Academic Self-Efficacy) is THE strongest predictor (30.1%)
- Q20 (External Pressure) is 2nd strongest (13.3%)
- Q5 (Admin Satisfaction) is 3rd (12.5%)
- These 3 questions account for 55.9% of the model's decision

---

## Sentiment Analysis Engine

### Keyword Categories

```javascript
// Positive keywords (confidence, support, engagement)
"confident", "engaged", "motivated", "supported", "improving",
"helpful", "interested", "attending", "connected", "optimistic"

// Negative keywords (stress, struggle, isolation)
"stressed", "overwhelmed", "isolated", "depressed", "anxious",
"exhausted", "struggling", "failing", "alone", "worried"

// Academic context keywords (increases weight of sentiment)
"course", "exam", "grade", "subject", "professor", "assignment",
"deadline", "study", "lecture", "homework"

// Dropout signals (red flags)
"dropout", "leave", "quit", "stop", "fail", "give up",
"suicidal", "harm", "ending"
```

### Sentiment Calculation

```javascript
// Count keywords in user's free-text input
text = "I'm feeling really stressed about exams. The course content 
         is overwhelming and I'm thinking about dropping out."

positive_count = 0  (no positive keywords found)
negative_count = 2  ("stressed", "overwhelmed")
academic_context = true (has "exams", "course")
dropout_signals = 1 ("dropping out")

// Calculate sentiment score
sentiment_score = (positive - negative) / total_words
               = (0 - 2) / 14 ≈ -0.143 (negative)

// Classify
IF sentiment_score < -0.2:
    sentiment_label = "Negative" 🔴
    
IF sentiment_score > 0.2:
    sentiment_label = "Positive" 🟢
    
ELSE:
    sentiment_label = "Neutral" 🟡

// Check for critical signals
IF dropout_signals > 0:
    ALERT: Student mentioned dropout language
    FLAG for immediate advisor contact
```

---

## State Management (App.jsx)

### Core State Variables

```javascript
const [currentScreen, setCurrentScreen] = useState(0);
// Values: 0-8 (Algorithm Selection → Model Validation)
// Updated by: user navigation clicks

const [analysisData, setAnalysisData] = useState(null);
// Structure: {
//   responses: { q1: 4, ... },
//   overallScore: 0.72,
//   factorScores: { Academic: 0.65, ... },
//   recommendations: [ ... ],
//   ...
// }
// Updated when: AssessmentScreen completes (ML prediction runs)

const [selectedAlgorithm, setSelectedAlgorithm] = useState(
  ALGORITHMS.XGBOOST
);
// Values: 'xgboost' or 'random_forest'
// Updated by: AlgorithmSelectionScreen
// Used by: App.jsx to select which ML model to run
```

### State Transitions

```
Screen 0 (Algorithm Selection)
    ↓ [Click: Select XGBoost]
Screen 1 (Assessment)
    ↓ [Click: Analyze] → Run ML prediction
Screen 2 (Risk Summary)
    ↓ [Click: Continue]
Screen 3 (Factor Breakdown)
    ↓ [Click: Continue]
Screen 4 (Recommendations)
    ↓ [Click: Download PDF] → jsPDF.save()
    ↓ [Click: Retake] → Reset state, go to Screen 0

Alternative:
Screen 0 (Algorithm Selection)
    ↓ [Click: View Validation]
Screen 8 (Model Validation)
    ↓ [Click: Back]
Screen 0 (Algorithm Selection)
```

---

## PDF Export (jsPDF Integration)

### PDF Report Structure

```
┌─────────────────────────────────────────┐
│ STUDENT WELLNESS ASSESSMENT REPORT      │
│ Confidential Psychological Evaluation   │
└─────────────────────────────────────────┘

ASSESSMENT INFORMATION
├─ Date of Assessment: February 2, 2026
├─ Time of Completion: 2:30 PM
├─ ML Algorithm Used: XGBoost + SMOTE
└─ Report Type: Comprehensive Wellness Evaluation

EXECUTIVE SUMMARY
├─ Overall Risk Classification: HIGH RISK
├─ Risk Score: 72%
├─ Prediction: At-Risk Student
└─ Confidence Level: 95%

CLINICAL IMPRESSION
    "The assessment indicates significant risk factors that warrant 
     immediate attention and intervention..."

MULTI-DIMENSIONAL ANALYSIS
├─ ACADEMIC CONSISTENCY: 65% Risk
├─ EMOTIONAL WELL-BEING: 78% Risk
├─ ENGAGEMENT & MOTIVATION: 81% Risk
└─ EXTERNAL/FINANCIAL PRESSURE: 68% Risk

PERSONALIZED RECOMMENDATIONS
├─ 1. ACADEMIC SUPPORT (HIGH PRIORITY)
│   • Schedule meeting with academic advisor
│   • Attend tutoring sessions
│   ...
├─ 2. EMOTIONAL WELL-BEING (HIGH PRIORITY)
│   • Contact student counseling services
│   ...
└─ 3. EXTERNAL SUPPORT (MEDIUM PRIORITY)

CLINICAL RECOMMENDATIONS & FOLLOW-UP PLAN
├─ Schedule meeting within 3-5 business days
├─ Referral to student counseling (urgent)
├─ Weekly check-ins for first month
└─ Re-assessment in 30 days

CAMPUS RESOURCES
├─ Student Counseling Services
├─ Academic Support & Tutoring Center
├─ Financial Aid & Emergency Assistance
├─ Career Development Services
├─ Disability Support Services
├─ Student Health & Wellness Center
└─ Peer Mentoring Programs

IMPORTANT DISCLAIMERS
├─ CONFIDENTIALITY NOTICE
├─ LIMITATION OF ASSESSMENT
├─ CRISIS INTERVENTION
└─ TECHNICAL APPENDIX

FOOTER
    Generated: February 2, 2026
    RV College of Engineering
    DTL Student Dropout Risk Prediction System
```

### Code Example

```javascript
const handleDownloadPDF = () => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  
  // Set header
  pdf.setFillColor(41, 98, 255);
  pdf.rect(0, 0, pageWidth, 100, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.text('STUDENT WELLNESS ASSESSMENT REPORT', pageWidth/2, 40);
  
  // Add content sections
  addText('ASSESSMENT INFORMATION', 14, 'bold');
  addText(`Date: ${new Date().toLocaleDateString()}`, 10);
  addText(`Risk Score: ${(overallScore * 100).toFixed(1)}%`, 10);
  
  // Save file
  pdf.save(`Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
```

---

## Styling Architecture (Tailwind CSS)

### Color System

```
Primary: Blue (#2962FF, #1E40AF)
Success: Green (#10B981, #059669)
Warning: Amber (#F59E0B, #D97706)
Danger: Red (#EF4444, #DC2626)
Gray: #1F2937, #6B7280, #D1D5DB

Dark Mode:
├─ Background: #111827 (dark-gray-900)
├─ Cards: #1F2937 (dark-gray-800)
└─ Text: #F3F4F6 (dark-gray-100)
```

### Component Structure

```
ScreenContainer (full-width wrapper)
├─ Max width: 1200px
├─ Padding: 2rem vertical, 1rem horizontal
└─ Dark mode: bg-white dark:bg-gray-900

Card (content block)
├─ Background: white dark:gray-800
├─ Border: 1px gray-200 dark:gray-700
├─ Padding: 1.5rem
└─ Border radius: 0.75rem

Button (interactive)
├─ Primary: bg-blue-500 hover:bg-blue-600
├─ Secondary: bg-gray-300 hover:bg-gray-400
├─ Rounded: 0.5rem
└─ Padding: 0.75rem 1.5rem

ProgressBar (visual indicator)
├─ Height: 8px
├─ Color: gradient blue to purple
└─ Border radius: full
```

---

## Performance Considerations

### Optimizations

1. **Lazy Loading**: Screens load only when selected
2. **Memoization**: Component re-renders minimized
3. **Bundle Size**: Only necessary dependencies (Recharts, not D3)
4. **Client-Side ML**: No server calls (all processing in browser)

### File Sizes (Production Build)

```
main.js:              ~250 KB (React + app code)
recharts.js:          ~180 KB (charting library)
Other libraries:      ~100 KB (jsPDF, Framer, Tailwind)
Total:                ~530 KB (gzipped: ~150 KB)

Load Time (typical):
├─ First Paint: 0.5s
├─ Interactive: 1.2s
└─ Full Load: 1.5s
```

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (not supported)

---

## Security & Privacy

### Data Handling

```
✅ NO data sent to servers
✅ NO cookies or tracking
✅ NO user identification
✅ Entire assessment runs locally in browser
✅ Results only seen by student
```

### Best Practices

```
1. Input Validation
   ├─ Likert responses: 1-5 range check
   ├─ Text input: XSS prevention
   └─ No SQL injection risk (client-side only)

2. Error Handling
   ├─ Try-catch blocks in ML inference
   ├─ Graceful fallback to legacy scoring
   └─ Error logging (console, not sent)

3. Accessibility
   ├─ WCAG 2.1 AA compliant
   ├─ Keyboard navigation support
   ├─ Screen reader compatible
   └─ Color contrast >4.5:1
```

---

## Summary

The DTL website is a **sophisticated React single-page application** that:
1. Guides users through 21-question assessment
2. Loads user responses into dual ML models
3. Generates personalized predictions & recommendations
4. Exports professional PDF reports
5. All computation happens client-side (browser)
6. Privacy-first design (no server communication)
7. Modern, accessible, mobile-responsive UI
