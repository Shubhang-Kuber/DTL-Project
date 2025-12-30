# DTL-Project: Student Dropout Risk Prediction System

A machine learning platform that predicts student dropout risk and provides personalized support recommendations through an interactive web dashboard.

**Status:** Production-Ready v2.0 | **Course:** Design Thinking Lab (DTL), 3rd Semester

---

## 🎯 4 Key Outcomes

### 1️⃣ **Predictive ML Model (85-90% Accuracy)**
- Random Forest Classifier trained on student survey responses
- Identifies 4 risk factors: Academic Consistency, Emotional Well-being, Engagement & Motivation, External/Financial Pressure
- Feature importance analysis showing which factors drive dropout most
- Cross-validated (5-fold CV) for robust predictions

### 2️⃣ **Interactive Web Dashboard**
- 4-screen assessment flow: Assessment → Risk Summary → Factor Breakdown → Recommendations
- Real-time risk scoring with direction-aware algorithm (differentiates positive vs. negative indicators)
- Visual analytics: Radar charts, bar charts, animated progress bars
- WCAG 2.1 AA accessible with dark mode support

### 3️⃣ **Data-Driven Risk Analysis**
- 12-question survey measuring student well-being across 4 dimensions
- PCA analysis reducing 12 variables to 3-4 principal components
- Statistical correlation analysis identifying risk relationships
- Risk thresholds: Low (0-33%), Medium (33-66%), High (66-100%)

### 4️⃣ **Personalized Support Engine**
- NLP sentiment analysis of student feedback
- Severity-based recommendations (high/medium/low priority)
- Targeted intervention suggestions by risk category
- Anonymous, privacy-first assessment (client-side processing only)

---

## 🚀 Quick Start

### Option 1: Run Dashboard (Easiest)
```bash
cd dashboard-2
npm install
npm run dev
# Opens at http://localhost:3000
```

### Option 2: Analyze ML Models
```bash
jupyter notebook
# Open: Random_Forest_Classifier.ipynb or Full_Factor_Analysis_DTL.ipynb
```

---

## 📁 Project Structure

```
DTL-Project/
├── dashboard-2/           # React dashboard (Vite + Tailwind)
│   ├── src/
│   │   ├── screens/       # 4 assessment screens
│   │   ├── components/    # Reusable UI components
│   │   ├── utils/         # Scoring & data loading
│   │   └── data/          # Survey questions & factors
│   └── package.json
├── notebooks/             # Jupyter analysis notebooks
│   ├── Random_Forest_Classifier.ipynb
│   ├── Full_Factor_Analysis_DTL.ipynb
│   └── PCA Evaluation of DTL Project.ipynb
├── data/                  # Student response data
│   ├── dataset.csv
│   └── Responses CSV File.csv
└── README.md
```

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 + Vite | Interactive dashboard |
| **Styling** | Tailwind CSS + Framer Motion | Modern UI with animations |
| **Charts** | Recharts | Interactive visualizations |
| **ML Models** | scikit-learn + pandas | Training & prediction |
| **Analysis** | Jupyter notebooks | Data exploration & modeling |

---

## 📊 How It Works

1. **Student takes 12-question survey** (5-point Likert scale)
2. **Direction-aware scoring** calculates risk across 4 factors
3. **Overall risk score** generated (0-100%)
4. **Personalized recommendations** provided based on profile
5. **Sentiment analysis** of optional feedback enhances understanding

**Risk Levels:**
- 🟢 **Low Risk (0-33%)**: Continue current support
- 🟡 **Medium Risk (33-66%)**: Consider proactive support
- 🔴 **High Risk (66-100%)**: Immediate intervention needed

---

## 📝 Documentation

- **dashboard-2/QUICKSTART.md** - Step-by-step setup guide
- **dashboard-2/README.md** - Dashboard technical details
- **dashboard-2/COMPLETE_TECHNICAL_ANALYSIS.md** - Full architecture review
- **ML_Model_Training_Guide.txt** - Model training documentation
- **ResearchPaper.txt** - Research findings

---

## 🤝 Quick Commands

```bash
# Install dependencies
cd dashboard-2 && npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run lint
```

---

**Last Updated:** December 30, 2025 | **Project Lead:** Shubhang Kuber | **License:** MIT