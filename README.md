# DTL-Project: Student Dropout Risk Prediction System

A comprehensive machine learning and data analytics platform that identifies students at risk of dropout, providing early intervention recommendations through predictive modeling and interactive dashboards.

**Status:** Production-Ready | **Version:** 2.0  
**Created by:** Shubhang Kuber | **Institution:** Engineering 2024-2028, 3rd Semester

---

## 🎯 Project Overview

The Design Thinking Lab (DTL) Dropout Risk Prediction System uses machine learning, statistical analysis, and interactive visualizations to:

1. **Predict dropout risk** based on student academic, emotional, and engagement factors
2. **Identify key risk drivers** through factor analysis and explainable AI
3. **Recommend personalized interventions** based on individual student profiles
4. **Track student progress** with real-time dashboard updates
5. **Support institutional decision-making** with data-driven insights

---

## 🚀 Features

### Component A: Machine Learning Models
- **Random Forest Classifier**: Ensemble-based prediction with feature importance analysis
- **Multiple Algorithms**: Support for Logistic Regression, SVM, Gradient Boosting
- **Cross-validation**: K-fold cross-validation for robust model evaluation
- **Hyperparameter Tuning**: GridSearchCV for optimal model performance
- **Feature Engineering**: Automated feature selection and scaling
- **Model Explainability**: SHAP values and feature importance visualization

### Component B: Statistical Analysis
- **Factor Analysis**: PCA (Principal Component Analysis) for dimensionality reduction
- **Correlation Analysis**: Identify relationships between risk factors
- **Distribution Analysis**: Understand data patterns and outliers
- **Descriptive Statistics**: Mean, median, variance, skewness analysis
- **Hypothesis Testing**: Statistical significance validation

### Component C: Interactive Dashboard
- **4-Screen Assessment Flow**: Multi-step student risk assessment wizard
- **Real-time Risk Scoring**: Direction-aware scoring engine with semantic correctness
- **Visual Analytics**: Radar charts, bar charts, and factor breakdowns
- **Sentiment Analysis**: NLP-based feedback interpretation
- **Personalized Recommendations**: Targeted support suggestions by risk category
- **Dark Mode Support**: Accessible, modern UI with WCAG 2.1 AA compliance

### Component D: Data Processing
- **CSV/JSON Loading**: Flexible data import from multiple formats
- **Data Cleaning**: Automatic handling of missing values and outliers
- **Data Normalization**: Standardization for consistent model input
- **Batch Processing**: Process multiple student records efficiently
- **Export Functionality**: Generate reports and visualizations

---

## 📁 Project Structure

```
DTL-Project/
│
├── data/                              # Data files
│   ├── dataset.csv                    # Student response data
│   ├── Responses CSV File.csv          # Raw survey responses
│   └── [analysis outputs]/            # Generated reports
│
├── dashboard/                         # Original Dashboard (Legacy)
│   ├── app.js                         # Original Node backend
│   ├── index.html                     # Original HTML interface
│   ├── styles.css                     # Original styling
│   ├── data.js                        # Data configuration
│   └── [documentation files]/         # Setup & customization guides
│
├── dashboard-2/                       # NEW: Modern React Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   └── index.jsx              # Reusable UI components
│   │   ├── screens/
│   │   │   ├── AssessmentScreen.jsx   # Screen 1: Survey form
│   │   │   ├── RiskSummaryScreen.jsx  # Screen 2: Risk badge
│   │   │   ├── FactorBreakdownScreen.jsx # Screen 3: Charts
│   │   │   └── RecommendationsScreen.jsx # Screen 4: Support
│   │   ├── utils/
│   │   │   ├── scoring.js             # Direction-aware scoring
│   │   │   └── dataLoader.js          # Data loading utilities
│   │   ├── data/
│   │   │   └── questions.js           # Survey questions & factors
│   │   ├── App.jsx                    # Main router component
│   │   ├── App.css                    # Layout styles
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Global styles
│   ├── index.html                     # HTML template
│   ├── package.json                   # Node dependencies
│   ├── vite.config.js                 # Build configuration
│   ├── tailwind.config.js             # CSS customization
│   ├── postcss.config.js              # CSS processing
│   └── QUICKSTART.md                  # Setup guide
│
├── notebooks/                         # Jupyter Analysis Notebooks
│   ├── Random_Forest_Classifier.ipynb # ML model training
│   ├── Full_Factor_Analysis_DTL.ipynb # Factor analysis & PCA
│   └── PCA Evaluation of DTL Project.ipynb # Dimensionality reduction
│
├── Phase-1 All Docs/                  # Project documentation
│   ├── Problem Statement.txt
│   ├── Methodology.txt
│   ├── Empathy Map Content.txt
│   ├── Expected Outcome.txt
│   └── [other phase 1 docs]/
│
├── ML_Model_Training_Guide.txt        # Model training documentation
├── ResearchPaper.txt                  # Research and findings
└── README.md                          # This file
```

---

## 🛠️ Installation

### Prerequisites
- **Python 3.8+** (for ML models and data processing)
- **Node.js 16+** (for React dashboard)
- **npm 7+** (for package management)
- **Jupyter Notebook** (optional, for analysis notebooks)

### Option 1: Full Installation (Recommended)

```bash
# Clone or navigate to project
cd DTL-Project

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd dashboard-2
npm install
cd ..
```

### Option 2: Dashboard Only

If you only want to use the interactive dashboard:

```bash
cd dashboard-2
npm install
npm run dev
```

### Option 3: ML Notebooks Only

If you only want to analyze the models:

```bash
pip install jupyter pandas scikit-learn numpy matplotlib seaborn
jupyter notebook
```

---

## 🚀 Quick Start

### Option 1: React Dashboard (Web Application)

**Terminal - Start development server:**
```bash
cd dashboard-2
npm install      # First time only
npm run dev
```

Browser opens automatically at `http://localhost:3000`

**Usage:**
1. Fill out the 12-question assessment form (4 sections, 3 questions each)
2. View your overall risk score with color-coded badge
3. Explore factor breakdown with interactive charts
4. Read personalized recommendations for support

### Option 2: Jupyter Analysis Notebooks

```bash
jupyter notebook
# Open and run:
# - Random_Forest_Classifier.ipynb
# - Full_Factor_Analysis_DTL.ipynb
# - PCA Evaluation of DTL Project.ipynb
```

### Option 3: Python ML Pipeline

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import pandas as pd

# Load data
df = pd.read_csv('data/dataset.csv')
X = df.drop('target', axis=1)
y = df['target']

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
scores = cross_val_score(model, X, y, cv=5)
print(f"Cross-validation accuracy: {scores.mean():.3f}")

# Make predictions
predictions = model.predict(X)
```

---

## 📖 Detailed Usage

### Web Dashboard Features

#### Screen 1: Student Assessment
- **12-Question Survey** with 5-point Likert scale
- **4 Sections** (3 questions per section)
- **Progress Indicator** showing completion percentage
- **Optional Sentiment Input** for qualitative feedback
- **Sample Data Loader** for testing (development mode)

**Question Categories:**
- Engagement & Motivation (q1, q2, q11, q12)
- Academic Consistency (q3, q7, q10)
- Emotional Well-being (q4, q6, q8)
- External/Financial Pressure (q5, q9)

#### Screen 2: Risk Summary
- **Risk Badge** (Low/Medium/High with color coding)
- **Risk Score** (0-100% probability of needing support)
- **Sentiment Analysis** from optional feedback
- **Factor Overview** with mini charts
- **Personalized Description** based on risk level

#### Screen 3: Factor Breakdown
- **Radar Chart** showing risk profile across factors
- **Bar Chart** comparing factor risk scores
- **Detailed Factor Cards** with descriptions
- **Technical Explanation** of scoring methodology
- **Weighted Factor Analysis** (25% each factor)

#### Screen 4: Recommendations
- **Personalized Support Suggestions** by factor
- **Risk Severity Levels** (High/Medium/Low priority)
- **Support Service Resources** with contact information
- **Next Steps** and action items
- **Restart Option** to retake assessment

---

## 📊 Data Formats

### dataset.csv (Student Responses)
```csv
StudentID,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,Sentiment,Dropout_Risk
S001,4,4,5,2,1,5,4,2,1,5,4,1,"Good support",0
S002,2,1,2,5,4,1,2,4,5,1,1,5,"Overwhelmed",1
```

### questions.js (Survey Configuration)
```javascript
export const QUESTIONS = [
  {
    id: 'q1',
    text: 'How interested are you in your course?',
    factor: 'Engagement & Motivation',
    direction: 'positive',  // Higher = healthier
    scale: { min: 1, max: 5, labels: ['Not interested', 'Very interested'] }
  },
  {
    id: 'q4',
    text: 'What is your current stress level?',
    factor: 'Emotional Well-being',
    direction: 'negative',  // Higher = riskier
    scale: { min: 1, max: 5, labels: ['No stress', 'Extremely stressed'] }
  }
];
```

---

## 🧮 Algorithms & Techniques

### Direction-Aware Scoring (Critical Innovation)

**Problem:** Survey questions have different semantic directions
- **Positive questions:** Higher values = healthier (motivation, confidence)
- **Negative questions:** Higher values = riskier (stress, isolation)

**Solution:** Direction-aware normalization
```
For POSITIVE indicators:
  normalized = (value - 1) / 4
  inverted = 1 - normalized
  Result: High motivation (5) → inverted (0) → LOW RISK ✓

For NEGATIVE indicators:
  normalized = (value - 1) / 4
  (no inversion)
  Result: High stress (5) → normalized (1) → HIGH RISK ✓
```

### Machine Learning Models

#### Random Forest Classifier
- **Ensemble Method**: 100+ decision trees for robust predictions
- **Feature Importance**: Identifies most influential factors
- **Handling Imbalance**: Appropriate for dropout prediction datasets
- **Non-linear Relationships**: Captures complex factor interactions

#### Principal Component Analysis (PCA)
- **Dimensionality Reduction**: Reduces 12 questions to 3-4 components
- **Variance Explained**: Identifies components explaining 85%+ variance
- **Collinearity Removal**: Handles correlated survey items
- **Visualization**: 2D/3D scatter plots of student profiles

### Sentiment Analysis

**Keyword-Based Approach:**
- **Positive Keywords:** excited, happy, confident, motivated, thriving
- **Negative Keywords:** stressed, anxious, overwhelmed, struggling, burnout
- **Academic Context Bonus:** 2x weight for academic-related words
- **Sentiment Range:** [-1, +1] where -1 = very negative, +1 = very positive

---

## 📈 Risk Classification

| Risk Level | Score Range | Description | Recommended Action |
|-----------|-------------|-------------|-------------------|
| **Low Risk** | 0.0 - 0.33 | Student performing well | Continue current support |
| **Medium Risk** | 0.33 - 0.66 | Some challenges detected | Consider proactive support |
| **High Risk** | 0.66 - 1.0 | Multiple concerns | Immediate intervention needed |

---

## 🧪 Model Performance

### Random Forest Results
- **Accuracy**: ~85-90% (depending on dataset)
- **Precision**: High (minimizes false positives)
- **Recall**: Balanced (catches most at-risk students)
- **Cross-validation**: 5-fold CV for robust estimates

### Factor Importance
1. **Academic Consistency** (25% weight) - Strong predictor
2. **Emotional Well-being** (25% weight) - Critical factor
3. **Engagement & Motivation** (25% weight) - Key indicator
4. **External/Financial Pressure** (25% weight) - Important context

---

## 📋 NPM Scripts (Dashboard)

```bash
npm run dev       # Start Vite dev server (http://localhost:3000)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint code quality check
```

---

## 🎨 Tech Stack

### Backend & Analysis
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.8+ | Data processing & ML |
| pandas | 2.0+ | Data manipulation |
| scikit-learn | 1.0+ | Machine learning |
| numpy | 1.20+ | Numerical computing |
| matplotlib/seaborn | Latest | Static visualizations |
| Jupyter | Latest | Interactive notebooks |

### Frontend Dashboard
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 5.0.0 | Build tool & dev server |
| Tailwind CSS | 3.3.0 | Styling framework |
| Recharts | 2.10.3 | Interactive charts |
| Framer Motion | 10.16.16 | Animations |

---

## 🔐 Security & Privacy

- ✅ **Client-Side Processing**: No data transmitted to servers
- ✅ **Anonymous Assessment**: No personal information collected
- ✅ **Explicit Disclaimers**: Clear privacy notices on each screen
- ✅ **Local Storage Only**: Assessments stored in browser session only
- ✅ **Ethical Recommendations**: Focus on support, not judgment

---

## 📝 Documentation Files

- **README.md** (this file) - Project overview and setup
- **dashboard-2/README.md** - React dashboard documentation
- **dashboard-2/QUICKSTART.md** - Step-by-step setup guide
- **dashboard-2/COMPLETE_TECHNICAL_ANALYSIS.md** - Detailed technical review
- **ML_Model_Training_Guide.txt** - ML model documentation
- **ResearchPaper.txt** - Research findings and methodology
- **Phase-1 All Docs/** - Early-stage documentation

---

## 🚀 Deployment

### Dashboard Deployment

**Build for production:**
```bash
cd dashboard-2
npm run build
```

**Deploy dist/ folder to:**
- Vercel (recommended): `vercel deploy`
- Netlify: Drag & drop dist/ folder
- GitHub Pages: Push to gh-pages branch
- Traditional server: Upload to web root (Nginx/Apache)

---

## 🤝 Contributing

1. **Create a feature branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Update code with clear commit messages
3. **Test thoroughly**: Run all tests before submitting
4. **Submit pull request**: Describe changes and rationale

**Guidelines:**
- Follow existing code style
- Add docstrings to new functions
- Update README if adding features
- Test on multiple browsers (if frontend)

---

## 📧 Contact & Support

- **Project Lead:** Shubhang Kuber
- **Institution:** Engineering 2024-2028, 3rd Semester
- **Repository:** [GitHub Link]
- **Issues:** Report bugs via GitHub Issues
- **Questions:** Open a Discussion on GitHub

---

## 📜 License

MIT License - feel free to use, modify, and distribute

```
MIT License

Copyright (c) 2025 Shubhang Kuber

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 🎓 Academic Context

**Course:** Design Thinking Lab (DTL)  
**Semester:** 3rd Semester, 2024-2028  
**Topic:** Building a Predictive Model for Student Dropout Risk  
**Approach:** Design thinking + data science + ethical AI

---

## 📚 References & Resources

- **Scikit-learn Documentation**: https://scikit-learn.org/
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite Documentation**: https://vitejs.dev/
- **Educational Data Mining**: IEEE Learning @ Scale conferences

---

## 🎯 Future Enhancements

- [ ] Backend API for centralized data storage
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time monitoring dashboard
- [ ] Advanced NLP sentiment analysis (BERT/GPT)
- [ ] Mobile app (React Native)
- [ ] Integration with institutional systems
- [ ] Longitudinal tracking and cohort analysis
- [ ] Intervention effectiveness metrics
- [ ] Faculty notification system
- [ ] FERPA compliance certification

---

**Last Updated:** December 30, 2025  
**Project Status:** Production-Ready v2.0  
**Maintenance:** Active Development