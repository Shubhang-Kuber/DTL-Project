# 🎓 Student Dropout Risk Prediction System
## Complete Project Overview & Workflow

---

## 📋 Table of Contents
1. [Project Vision](#project-vision)
2. [Problem Statement](#problem-statement)
3. [System Architecture](#system-architecture)
4. [Complete Workflow](#complete-workflow)
5. [Technology Stack](#technology-stack)
6. [Project Structure](#project-structure)
7. [Key Features](#key-features)

---

## 🎯 Project Vision

This project combines **empathy-driven design thinking** with **machine learning** to create a comprehensive student support system that:

- **Predicts** dropout risk before it's too late
- **Identifies** specific factors causing academic distress
- **Provides** personalized recommendations for support
- **Empowers** students to understand their own well-being

### Personal Motivation

> "As a student myself, I've witnessed many classmates struggle with academic pressure, peer comparison, and the overwhelming pace of engineering coursework. I've seen friends burn out, lose confidence, detach from classes, and even question their future because they felt isolated or 'not good enough.'"

The ultimate goal is to build something that creates awareness, encourages early intervention, and contributes to a healthier, more supportive academic environment.

---

## 🔍 Problem Statement

**The Challenge:**
Many college students silently disengage and drop out due to a combination of:
- Academic disinterest
- Emotional fatigue
- Mental health struggles
- Lack of early guidance

**Current Gap:**
Faculty often detect these issues only after students have already decided to leave, primarily due to:
- Large class sizes
- Limited monitoring systems
- Lack of predictive frameworks

**Our Solution:**
A predictive model for student dropout risk that combines empathy-driven insights and machine learning to help colleges detect and support vulnerable students early.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE LAYER                        │
│              (React Dashboard - 5 Interactive Screens)           │
├─────────────────────────────────────────────────────────────────┤
│  Assessment  →  Risk Summary  →  Factor Breakdown  →  Recommendations
│                                        ↓
│                             Random Forest Visualizer
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ML PREDICTION ENGINE                       │
│                        (mlPredictor.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  • Direction-aware scoring (positive/negative indicators)        │
│  • Weighted risk calculation using trained feature weights      │
│  • NLP sentiment analysis for text input                        │
│  • Factor-based aggregation (4 risk categories)                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ML MODEL LAYER                          │
│                  (Random Forest Classifier)                      │
├─────────────────────────────────────────────────────────────────┤
│  • 50 Decision Trees (n_estimators=50)                         │
│  • max_depth=5 (prevents overfitting)                          │
│  • Trained on 40 student survey responses                       │
│  • Feature importance extracted as weights                      │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                             │
│                    (Responses CSV File.csv)                     │
├─────────────────────────────────────────────────────────────────┤
│  • 40 engineering student responses                             │
│  • 12 survey questions (Likert 1-5 scale)                      │
│  • Target: Dropout consideration (Yes/No/Maybe)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Workflow

### Phase 1: Empathy & Problem Understanding
```
📍 Activities:
├── Collected insights from students, parents, and teachers
├── Identified emotional, academic, social, and financial factors
├── Created empathy maps to understand real experiences
└── Documented pain points and behavioral patterns
```

### Phase 2: Data Collection & Preprocessing
```
📍 Activities:
├── Designed Google Forms survey (12 questions)
├── Gathered 40 student responses
├── Cleaned and filtered raw data
├── Encoded categorical values to 1-5 scale
├── Handled missing data (defaulted to middle value)
└── Created structured CSV dataset
```

### Phase 3: Exploratory Data Analysis (EDA)
```
📍 Activities:
├── Computed correlations between inputs and dropout tendency
├── Identified strong predictors (stress, motivation, attendance)
├── Performed PCA analysis (12 variables → 3-4 components)
├── Created visualizations (heatmaps, boxplots, distributions)
└── Documented statistical findings
```

### Phase 4: ML Model Development
```
📍 Activities:
├── Trained Random Forest Classifier
├── Extracted feature importance weights
├── Cross-validated (5-fold) for robustness
├── Evaluated with accuracy, precision, recall, F1
├── Exported weights to JSON for browser use
└── Documented model performance
```

### Phase 5: Web Application Development
```
📍 Activities:
├── Built React dashboard with Vite
├── Implemented 5-screen assessment flow
├── Created direction-aware scoring algorithm
├── Added NLP sentiment analysis
├── Built interactive visualizations (Recharts)
├── Added Random Forest educational visualizer
└── Deployed privacy-first client-side processing
```

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 | Component-based UI |
| **Build Tool** | Vite 5.0 | Fast development server |
| **Styling** | Tailwind CSS 3.3 | Utility-first CSS |
| **Animations** | Framer Motion | Smooth transitions |
| **Charts** | Recharts | Interactive visualizations |
| **ML Training** | scikit-learn | Random Forest model |
| **Data Analysis** | pandas, numpy | Data processing |
| **Notebooks** | Jupyter | EDA & experimentation |

---

## 📁 Project Structure

```
DTL-Project/
├── 📂 dashboard-2/                    # Main React Application
│   ├── 📂 src/
│   │   ├── 📂 screens/               # 5 Application Screens
│   │   │   ├── AssessmentScreen.jsx  # 12-question survey
│   │   │   ├── RiskSummaryScreen.jsx # Overall risk display
│   │   │   ├── FactorBreakdownScreen.jsx # Detailed analysis
│   │   │   ├── RecommendationsScreen.jsx # Support suggestions
│   │   │   └── RandomForestVisualizer.jsx # ML explanation
│   │   ├── 📂 components/            # Reusable UI components
│   │   ├── 📂 utils/
│   │   │   ├── mlPredictor.js       # ML prediction engine
│   │   │   ├── scoring.js           # Risk calculation
│   │   │   └── dataLoader.js        # Data utilities
│   │   └── 📂 data/
│   │       ├── questions.js         # 12 survey questions
│   │       └── ml_config.json       # Trained model weights
│   └── package.json
│
├── 📂 docs/                          # Documentation (YOU ARE HERE)
│   ├── 01_PROJECT_OVERVIEW.md
│   ├── 02_ML_MODEL_DOCUMENTATION.md
│   ├── 03_TECHNICAL_ARCHITECTURE.md
│   └── 04_USER_GUIDE.md
│
├── 📂 Phase-1 All Docs/              # Design Thinking artifacts
│   ├── Problem Statement.txt
│   ├── Motivation.txt
│   ├── Methodology.txt
│   └── Empathy Map Content.txt
│
├── 📄 train_random_forest.py         # ML training script
├── 📄 Responses CSV File.csv         # Raw survey data
├── 📄 Random_Forest_Classifier.ipynb # Training notebook
└── 📄 README.md                      # Quick start guide
```

---

## ✨ Key Features

### 1. 🧠 ML-Powered Risk Prediction
- Random Forest Classifier with 87.5% accuracy
- Direction-aware scoring (distinguishes positive vs negative indicators)
- Real-time browser-side prediction (no server required)

### 2. 📊 4-Factor Risk Analysis
| Factor | Questions | What It Measures |
|--------|-----------|------------------|
| **Engagement & Motivation** | Q1, Q2 | Interest & drive to continue |
| **Academic Consistency** | Q3, Q7, Q10 | Confidence, support, attendance |
| **Emotional Well-being** | Q4, Q6, Q8 | Stress, family support, isolation |
| **External/Financial Pressure** | Q5, Q9, Q11 | Financial impact, commitments |

### 3. 🎨 Interactive Visualizations
- **Radar Chart**: Multi-dimensional risk profile
- **Bar Chart**: Factor comparison view
- **Progress Bars**: Risk levels with animations
- **Random Forest Visualizer**: Educational ML explanation

### 4. 💬 NLP Sentiment Analysis
- Analyzes optional text feedback
- Detects positive/negative emotional indicators
- Identifies explicit dropout signals
- Adjusts risk score based on context

### 5. 🔒 Privacy-First Design
- All processing happens client-side
- No data sent to any server
- Anonymous assessment
- No personal information required

### 6. 📱 Accessible & Responsive
- WCAG 2.1 AA compliant
- Dark mode support
- Mobile-responsive design
- Keyboard navigation

---

## 📈 Risk Classification

| Risk Level | Score Range | Recommended Action |
|------------|-------------|-------------------|
| 🟢 **Low Risk** | 0-33% | Continue current support |
| 🟡 **Medium Risk** | 33-66% | Consider proactive outreach |
| 🔴 **High Risk** | 66-100% | Immediate intervention needed |

---

## 🚀 How to Run

### Quick Start
```bash
cd dashboard-2
npm install
npm run dev
# Opens at http://localhost:5173
```

### Train New Model
```bash
python train_random_forest.py
# Updates ml_config.json with new weights
```

---

## 📚 Related Documents

- [ML Model Documentation](./02_ML_MODEL_DOCUMENTATION.md) - Complete ML algorithm details
- [Technical Architecture](./03_TECHNICAL_ARCHITECTURE.md) - Code structure & APIs
- [User Guide](./04_USER_GUIDE.md) - How to use the dashboard

---

*Document Version: 2.0 | Last Updated: January 2026*
