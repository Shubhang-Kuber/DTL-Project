# 🏗️ Technical Architecture Documentation
## Code Structure, APIs & Implementation Details

---

## 📋 Table of Contents
1. [Application Architecture](#application-architecture)
2. [Screen Flow & Navigation](#screen-flow--navigation)
3. [Component Hierarchy](#component-hierarchy)
4. [Core Utilities](#core-utilities)
5. [Data Structures](#data-structures)
6. [API Reference](#api-reference)
7. [Styling System](#styling-system)

---

## 🏛️ Application Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          REACT APPLICATION                           │
│                            (App.jsx)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                    STATE MANAGEMENT                       │     │
│    │                                                          │     │
│    │  currentScreen: 0-5 (navigation)                        │     │
│    │  responses: {q1: 4, q2: 5, ...} (survey answers)       │     │
│    │  scores: {overall, factors, sentiment} (predictions)    │     │
│    │  isLoading: boolean (loading states)                    │     │
│    └──────────────────────────────────────────────────────────┘     │
│                              │                                       │
│                              ▼                                       │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                      SCREENS                              │     │
│    │                                                          │     │
│    │  [0] AssessmentScreen      - 12-question survey         │     │
│    │  [1] RiskSummaryScreen     - Overall risk display       │     │
│    │  [2] FactorBreakdownScreen - Detailed analysis          │     │
│    │  [3] RecommendationsScreen - Support suggestions        │     │
│    │  [4] RandomForestVisualizer- ML explanation             │     │
│    └──────────────────────────────────────────────────────────┘     │
│                              │                                       │
│                              ▼                                       │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                   UTILITY LAYER                          │     │
│    │                                                          │     │
│    │  mlPredictor.js  - ML prediction engine                 │     │
│    │  scoring.js      - Risk calculation helpers             │     │
│    │  dataLoader.js   - Data loading utilities               │     │
│    └──────────────────────────────────────────────────────────┘     │
│                              │                                       │
│                              ▼                                       │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                     DATA LAYER                           │     │
│    │                                                          │     │
│    │  questions.js    - 12 survey question definitions       │     │
│    │  ml_config.json  - Trained ML weights & config          │     │
│    └──────────────────────────────────────────────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
dashboard-2/
├── 📂 public/
│   └── favicon.ico
│
├── 📂 src/
│   ├── 📄 main.jsx          # React entry point
│   ├── 📄 App.jsx           # Main app component & routing
│   ├── 📄 App.css           # Global styles
│   ├── 📄 index.css         # Tailwind imports
│   │
│   ├── 📂 screens/          # Application screens
│   │   ├── AssessmentScreen.jsx
│   │   ├── RiskSummaryScreen.jsx
│   │   ├── FactorBreakdownScreen.jsx
│   │   ├── RecommendationsScreen.jsx
│   │   └── RandomForestVisualizer.jsx
│   │
│   ├── 📂 components/       # Reusable UI components
│   │   └── index.jsx        # All components exported
│   │
│   ├── 📂 utils/            # Business logic
│   │   ├── mlPredictor.js   # ML prediction engine
│   │   ├── scoring.js       # Risk calculations
│   │   └── dataLoader.js    # Data utilities
│   │
│   └── 📂 data/             # Static data
│       ├── questions.js     # Survey questions
│       └── ml_config.json   # ML model weights
│
├── 📄 package.json          # Dependencies
├── 📄 vite.config.js        # Vite configuration
├── 📄 tailwind.config.js    # Tailwind configuration
└── 📄 postcss.config.js     # PostCSS configuration
```

---

## 🔄 Screen Flow & Navigation

### User Journey

```
┌─────────────┐    Submit    ┌─────────────┐   Continue   ┌─────────────┐
│ ASSESSMENT  │────────────▶│ RISK SUMMARY │────────────▶│   FACTOR    │
│   Screen    │              │   Screen     │              │  BREAKDOWN  │
│  (12 Q's)   │              │ (Overall %)  │              │  (Charts)   │
└─────────────┘              └─────────────┘              └─────────────┘
                                                                 │
                                          ┌──────────────────────┤
                                          │                      │
                                          ▼                      ▼
                              ┌─────────────────┐    ┌─────────────────┐
                              │ RECOMMENDATIONS │    │ RANDOM FOREST   │
                              │    Screen       │    │  VISUALIZER     │
                              │ (Support Tips)  │    │ (ML Education)  │
                              └─────────────────┘    └─────────────────┘
```

### Navigation State

```javascript
// App.jsx state management
const [currentScreen, setCurrentScreen] = useState(0);

// Screen indices
const SCREENS = {
  ASSESSMENT: 0,
  RISK_SUMMARY: 1,
  FACTOR_BREAKDOWN: 2,
  RECOMMENDATIONS: 3,
  RANDOM_FOREST: 4
};
```

---

## 🧩 Component Hierarchy

### Screen Components

#### AssessmentScreen.jsx
```
AssessmentScreen
├── ScreenContainer
├── ProgressBar (shows 1/12, 2/12, etc.)
├── Card (question wrapper)
│   └── LikertSlider (1-5 scale input)
├── Button (Previous)
├── Button (Next / Submit)
└── Optional: TextArea (feedback input)
```

#### RiskSummaryScreen.jsx
```
RiskSummaryScreen
├── ScreenContainer
├── Card (main risk display)
│   ├── RiskGauge (circular indicator)
│   ├── Risk Level Label
│   └── Confidence Score
├── Card (factor overview)
│   └── FactorBar[] (4 horizontal bars)
└── Button (View Details)
```

#### FactorBreakdownScreen.jsx
```
FactorBreakdownScreen
├── ScreenContainer
├── Card (Radar Chart)
│   └── RadarChart (Recharts)
├── Card (Bar Chart)
│   └── BarChart (Recharts)
├── FactorChartCard[] (4 detailed cards)
│   ├── Factor Title
│   ├── Risk Percentage
│   └── Question Breakdown
└── Button (View Recommendations)
```

#### RecommendationsScreen.jsx
```
RecommendationsScreen
├── ScreenContainer
├── Card (high priority)
│   └── RecommendationList
├── Card (medium priority)
│   └── RecommendationList
├── Card (general tips)
│   └── RecommendationList
└── Button (Start New Assessment)
```

### Shared Components (components/index.jsx)

| Component | Props | Description |
|-----------|-------|-------------|
| `ScreenContainer` | children, title | Page wrapper with header |
| `Card` | children, className, hover | Styled container |
| `Button` | onClick, disabled, variant, size | Action button |
| `LikertSlider` | label, minLabel, maxLabel, value, onChange | 1-5 scale input |
| `ProgressBar` | current, total | Progress indicator |
| `FactorChartCard` | factor, score, questions | Factor detail card |
| `RiskGauge` | percentage, level | Circular risk display |

---

## ⚙️ Core Utilities

### mlPredictor.js

The ML prediction engine that runs in the browser.

#### Main Functions

```javascript
/**
 * Predict dropout risk from survey responses
 * 
 * @param {Object} responses - Survey answers {q1: 4, q2: 5, ...}
 * @param {string} sentimentText - Optional feedback text
 * @returns {Object} Prediction result
 */
export function predictDropoutRisk(responses, sentimentText = '') {
  // Returns:
  // {
  //   overallScore: 0.42,        // 0-1 range
  //   prediction: "Medium Risk", // Low/Medium/High
  //   confidence: 0.78,          // 0-1 range
  //   factorScores: {...},       // Per-factor breakdown
  //   questionScores: {...},     // Per-question details
  //   sentimentAnalysis: {...}   // Text analysis results
  // }
}

/**
 * Analyze text for emotional indicators
 * 
 * @param {string} text - User's feedback text
 * @returns {Object} Sentiment analysis result
 */
export function analyzeTextSentiment(text) {
  // Returns:
  // {
  //   score: 0.5,           // -1 (negative) to +1 (positive)
  //   dropoutRisk: 0.2,     // 0-1 risk from text
  //   details: {
  //     positiveCount: 3,
  //     negativeCount: 1,
  //     dropoutSignals: 0,
  //     academicContext: true
  //   }
  // }
}
```

### scoring.js

Helper functions for risk calculations.

```javascript
/**
 * Calculate risk level from score
 * @param {number} score - 0-1 risk score
 * @returns {string} 'Low Risk' | 'Medium Risk' | 'High Risk'
 */
export function getRiskLevel(score) {
  if (score < 0.33) return 'Low Risk';
  if (score < 0.66) return 'Medium Risk';
  return 'High Risk';
}

/**
 * Get color for risk level
 * @param {string} level - Risk level string
 * @returns {string} Tailwind color class
 */
export function getRiskColor(level) {
  switch (level) {
    case 'Low Risk': return 'text-green-500';
    case 'Medium Risk': return 'text-yellow-500';
    case 'High Risk': return 'text-red-500';
    default: return 'text-gray-500';
  }
}
```

---

## 📊 Data Structures

### Question Definition (questions.js)

```javascript
export const QUESTIONS = [
  {
    id: 'q1',                    // Unique identifier
    text: 'How interested...',   // Display text
    factor: 'Engagement',        // Which factor it belongs to
    direction: 'positive',       // 'positive' or 'negative'
    scale: {
      min: 1,
      max: 5,
      labels: ['Not interested', 'Very interested']
    }
  },
  // ... 12 questions total
];

export const FACTORS = {
  'Engagement & Motivation': {
    description: 'Interest and drive to continue education',
    questions: ['q1', 'q2'],
    color: '#60a5fa'
  },
  // ... 4 factors total
};
```

### ML Config (ml_config.json)

```json
{
  "version": "2.0",
  "model_type": "random_forest",
  "n_estimators": 50,
  "baseline_risk": 0.1,
  
  "metrics": {
    "accuracy": 0.875,
    "cross_validation": {
      "accuracy": 0.775,
      "accuracy_std": 0.187
    }
  },
  
  "questions": {
    "q1": {
      "name": "course_interest",
      "direction": "positive",
      "weight": 0.1186
    }
    // ... all 11 questions
  },
  
  "factors": {
    "Engagement & Motivation": {
      "questions": ["q1", "q2"],
      "weight": 0.25
    }
    // ... all 4 factors
  },
  
  "sentiment_analysis": {
    "weight": 0.15,
    "positive_keywords": [...],
    "negative_keywords": [...],
    "dropout_indicators": [...]
  },
  
  "thresholds": {
    "low": 0.33,
    "medium": 0.66,
    "high": 1.0
  }
}
```

### Prediction Result Structure

```javascript
{
  overallScore: 0.42,           // Float 0-1
  prediction: "Medium Risk",    // String
  confidence: 0.78,             // Float 0-1
  
  factorScores: {
    "Engagement & Motivation": 35,        // Percentage
    "Academic Consistency": 28,
    "Emotional Well-being": 45,
    "External / Financial Pressure": 58
  },
  
  questionScores: {
    "q1": {
      raw: 4,                   // Original 1-5 answer
      normalized: 0.75,         // 0-1 normalized
      riskContribution: 0.25,   // After direction adjustment
      weightedRisk: 0.0297      // After weight applied
    },
    // ... all questions
  },
  
  sentimentAnalysis: {
    score: 0.5,
    dropoutRisk: 0.2,
    details: {
      positiveCount: 3,
      negativeCount: 1,
      dropoutSignals: 0,
      academicContext: true,
      textLength: 145
    }
  }
}
```

---

## 📚 API Reference

### mlPredictor.js Exports

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `predictDropoutRisk` | responses: Object, text?: string | PredictionResult | Main prediction function |
| `analyzeTextSentiment` | text: string | SentimentResult | Text sentiment analysis |
| `normalizeValue` | value: number, min?: number, max?: number | number | Normalize to 0-1 |
| `calculateFactorScores` | questionScores: Object | FactorScores | Aggregate by factor |

### Component Props

#### ScreenContainer
```typescript
interface ScreenContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}
```

#### LikertSlider
```typescript
interface LikertSliderProps {
  label: string;
  minLabel: string;
  maxLabel: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
```

#### Button
```typescript
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}
```

---

## 🎨 Styling System

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1f2937',
        'dark-card': '#2d3748'
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite'
      }
    }
  }
}
```

### Color Palette

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `bg-gray-50` | `bg-dark-bg` (#1f2937) |
| Card | `bg-white` | `bg-dark-card` (#2d3748) |
| Text Primary | `text-gray-900` | `text-white` |
| Text Secondary | `text-gray-600` | `text-gray-400` |
| Low Risk | `text-green-500` | `text-green-400` |
| Medium Risk | `text-yellow-500` | `text-yellow-400` |
| High Risk | `text-red-500` | `text-red-400` |
| Accent | `text-blue-500` | `text-blue-400` |

### Animation Classes

```css
/* Custom animations in App.css */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-pulse-risk {
  animation: pulseRisk 2s infinite;
}
```

---

## 🔒 Privacy & Security

### Client-Side Processing

- **No server calls**: All prediction happens in the browser
- **No data storage**: Responses are only in memory
- **No tracking**: No analytics or user identification
- **Refresh clears**: All data cleared on page refresh

### Data Flow

```
User Input → Browser Memory → ML Prediction → Display
     ↓
   (Never sent to server)
```

---

## 📚 Related Documents

- [Project Overview](./01_PROJECT_OVERVIEW.md) - High-level description
- [ML Model Documentation](./02_ML_MODEL_DOCUMENTATION.md) - Algorithm details
- [User Guide](./04_USER_GUIDE.md) - How to use the dashboard

---

*Document Version: 2.0 | Last Updated: January 2026*
