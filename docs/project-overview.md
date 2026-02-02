# DTL Project Overview

## Project Name
**Student Dropout Risk Prediction System** - Design Thinking Lab (DTL), RV College of Engineering

## Vision
Build an **AI-powered early warning system** that identifies engineering students at risk of dropping out and provides personalized, data-driven support recommendations before critical disengagement occurs.

## Problem Statement
- **Challenge**: Many engineering students struggle silently with academic, emotional, or financial challenges
- **Impact**: Uninformed students drop out without accessing available support resources
- **Goal**: Create a confidential self-assessment tool that flags risks early and connects students with help

## Solution Overview

### 4 Core Components

| # | Component | Technology | Purpose |
|---|-----------|-----------|---------|
| 1️⃣ | **Dual ML Models** | XGBoost + Random Forest | Predict dropout risk using 21-question survey |
| 2️⃣ | **Interactive Dashboard** | React + Vite + Tailwind | User-friendly 7-screen assessment flow |
| 3️⃣ | **Direction-Aware Scoring** | Custom algorithms | Intelligently combine positive/negative indicators |
| 4️⃣ | **NLP Sentiment Analysis** | Keyword matching | Extract emotional context from feedback |

---

## Key Statistics

### Dataset
- **Sample Size**: 40 real engineering students
- **Questions**: 21 Likert-scale items (1-5 scale)
- **Time to Complete**: 5-10 minutes
- **Factors Measured**: 4 psychological/academic dimensions

### Model Performance

#### Random Forest
- **Training Accuracy**: 83.3%
- **Cross-Validation**: 98.5% ± 3.1% ✅
- **Confidence**: High (robust validation)
- **Interpretability**: Excellent (feature importance)

#### XGBoost + SMOTE
- **Training Accuracy**: 100% ⚠️
- **Cross-Validation**: 100% ± 0% ✅
- **Confidence**: Very High (perfect validation)
- **SMOTE Impact**: Synthetic samples increase at-risk representation

### Risk Factor Distribution
- **Academic Consistency**: 6 questions
- **Emotional Well-being**: 5 questions
- **Engagement & Motivation**: 5 questions
- **External/Financial Pressure**: 5 questions

---

## Website Features

### Screens (7 Main + 2 Optional)

1. **Algorithm Selection** 
   - Choose between Random Forest or XGBoost
   - View model validation metrics
   - Compare accuracy/benefits

2. **Assessment (21 Questions)**
   - Multi-step form (3 questions per step)
   - Real-time progress tracking
   - Optional sentiment/challenge description

3. **Risk Summary**
   - Overall dropout risk score (0-100%)
   - Risk classification (Low/Medium/High)
   - ML confidence level
   - Clinical impression

4. **Factor Breakdown**
   - Radar chart (4 factors at-a-glance)
   - Bar chart (detailed comparison)
   - Domain descriptions
   - Links to visualizers

5. **Recommendations**
   - AI-generated personalized suggestions
   - Priority levels (High/Medium/Low)
   - Campus resources list
   - Share with advisor via email
   - **Download Professional PDF Report**

6. **Model Validation** (Optional)
   - Accuracy metrics & explanations
   - Cross-validation methodology
   - Why we trust these predictions

7. **Visualizers** (Optional)
   - Random Forest feature importance detail
   - XGBoost tree structure visualization

---

## Technology Stack

### Frontend
```
Framework:    React 18.2
Build:        Vite 5.0
Styling:      Tailwind CSS 3.3 + Framer Motion 10
Charts:       Recharts 2.10
PDF Export:   jsPDF 4.0
```

### ML & Backend
```
Training:     scikit-learn, XGBoost, imbalanced-learn
Data:         pandas, numpy
Validation:   5-fold cross-validation
Model Store:  ml_config.json (weights embedded)
```

### Development
```
Version Control:  Git & GitHub
Editor:           VS Code
Package Manager:  npm
Linting:          ESLint
```

---

## Direction-Aware Scoring Explained

### Positive Questions ➕
"Higher Likert response = Lower Risk"
- Examples: confidence, motivation, support-seeking, attendance
- Scoring: Response value directly normalized to risk score
- Q1: "How confident are you?" → Response 5 = 1.0 (low risk)

### Negative Questions ➖
"Higher Likert response = Higher Risk"
- Examples: stress, isolation, dropout intent, financial burden
- Scoring: Must invert (6 - value) before normalizing
- Q7: "What is your stress level?" → Response 5 (extremely stressed) → Inverted = 1 → Risk 0.0 (high risk)

### Combined Scoring
```
Academic Factor = avg(Q1, Q2, Q3, Q4, Q5, Q6)
Emotional Factor = avg(6-Q7, 6-Q8, Q9, Q10, Q11) 
  ↑ inverts Q7 & Q8 (negative questions)
Engagement Factor = avg(Q12, Q13, Q14, Q15, Q16)
Financial Factor = avg(6-Q17, 6-Q18, Q19, 6-Q20, 6-Q21)
  ↑ inverts Q17, Q18, Q20, Q21 (negative questions)

Overall Risk = weighted average of 4 factors
```

---

## SMOTE Balancing: Why It Matters

### The Problem
- Original dataset: 36 not-at-risk vs 4 at-risk (90% vs 10%)
- ML models naturally predict "not-at-risk" (easier path)
- Miss actual at-risk students (false negatives = dangerous)

### The Solution: SMOTE
- Creates synthetic at-risk samples by interpolating between real ones
- Transforms: 4 at-risk → 32 at-risk samples (8x increase)
- Result: 36 not-at-risk + 36 at-risk (50-50 balanced)
- Both Random Forest and XGBoost trained on balanced data

### Example
```
Real At-Risk Student A: [4, 5, 3, 2, ...]  (low confidence)
Real At-Risk Student B: [3, 4, 4, 1, ...]  (high stress)

Synthetic Sample (blend): [3.5, 4.5, 3.5, 1.5, ...]
                          (interpolated between A & B)
```

---

## Recommendations Engine

### AI-Generated Suggestions

Recommendations prioritized by **factor severity** and **student profile**:

```
IF Academic Consistency Risk > 0.66:
├─ Priority: HIGH
├─ Suggestions:
│  • Schedule meeting with academic advisor
│  • Attend tutoring sessions
│  • Join study groups
│  └─ Form study circles with peers

IF Emotional Well-being Risk > 0.66:
├─ Priority: HIGH
├─ Suggestions:
│  • Contact student counseling services
│  • Attend stress management workshops
│  • Practice mindfulness/meditation
│  └─ Build social connections (clubs, events)

IF Engagement Risk > 0.66:
├─ Priority: HIGH
├─ Suggestions:
│  • Explore course relevance to career goals
│  • Attend interesting seminars/webinars
│  • Join student organizations
│  └─ Increase class participation

IF Financial Pressure > 0.66:
├─ Priority: HIGH
├─ Suggestions:
│  • Explore emergency financial aid
│  • Meet with financial counselor
│  • Look for part-time work/scholarships
│  └─ Create budget with financial advisor
```

---

## Sentiment Analysis Integration

### What It Does

Analyzes optional student feedback for emotional context:

```
Student Input: "I'm overwhelmed by coursework and feeling really 
                isolated from my peers. Not sure if engineering is 
                right for me."

Analysis:
├─ Negative keywords: 2 (overwhelmed, isolated)
├─ Positive keywords: 0
├─ Dropout signals: 1 ("not right for me")
├─ Sentiment score: -0.4 (negative)
└─ Result: 🚨 HIGH ALERT - Potential at-risk indicator
```

### Keyword Categories

**Positive**: confident, engaged, motivated, supported, improving
**Negative**: stressed, overwhelmed, isolated, depressed, anxious
**Dropout Signals**: dropout, quit, leave, give up, fail, ending
**Academic Context**: course, exam, grade, subject, professor

---

## Privacy & Ethical Design

### What's Protected ✅
- **Anonymous**: No student IDs or identifiers stored
- **Confidential**: Assessment private to student only
- **Client-Side**: All processing in browser, no server transmission
- **No Tracking**: No cookies, analytics, or data collection
- **Independent**: Each student's assessment completely private

### Important Disclaimers ⚠️
- **Screening Tool, Not Diagnosis**: Indicators for further exploration, not medical judgment
- **Not a Prediction of Failure**: High risk ≠ guaranteed dropout
- **Always Consult Humans**: AI supports advisor conversations, doesn't replace them
- **Crisis Support**: For mental health emergencies → 911 or crisis hotline
- **Informed Consent**: Student willingly takes assessment

---

## Project Timeline

### Phase 1: Discovery (Sep-Oct 2025)
- Problem identification & empathy mapping
- Literature review on student dropout
- Survey design with 21 validated questions
- Identify 4 core risk factors

### Phase 2: Model Training (Nov-Dec 2025)
- Collect 40 student responses
- Build Random Forest model (83% accuracy)
- Implement SMOTE balancing
- Train XGBoost model (100% CV accuracy)
- Feature importance analysis

### Phase 3: Dashboard Development (Dec-Jan 2026)
- Design 7-screen assessment flow
- Implement React components
- Integrate ML models (mlPredictor.js)
- Add visualization (Recharts)
- PDF export functionality

### Phase 4: Testing & Refinement (Jan-Feb 2026)
- User testing with sample students
- Bug fixes & UX improvements
- Model validation & documentation
- Final deployment

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| **Model Accuracy** | >85% | ✅ RF: 98.5% CV, XGB: 100% CV |
| **Assessment Completion** | <10 min | ✅ ~7-8 minutes typical |
| **User Satisfaction** | >80% | 📝 Pending user feedback |
| **Privacy Compliance** | 100% | ✅ No data transmission |
| **Accessibility** | WCAG 2.1 AA | ✅ Dark mode, keyboard nav, screen reader |
| **Mobile Responsiveness** | 100% | ✅ Tested on iPhone, Android, tablets |

---

## Future Enhancements

### Short-term (Months 1-3)
- Collect feedback from pilot users
- Iterate on recommendation suggestions
- Add more visualization options
- Implement user preference settings

### Medium-term (Months 3-6)
- Expand dataset (100+ students)
- Retrain models with new data
- Add longitudinal tracking (multiple assessments)
- Integrate with campus advisor scheduling

### Long-term (6-12 months)
- Expand to other programs (not just engineering)
- Add multi-language support
- Create advisor dashboard (aggregate insights)
- Research publication of findings

---

## Team & Credits

- **Project Lead**: Shubhang Kuber
- **Institution**: RV College of Engineering
- **Course**: Design Thinking Lab (DTL)
- **Semester**: 3rd Year (2025-2026)

---

## Resources & References

### Documentation
- `docs/methodology-workflow.md` - Data collection & training process
- `docs/website-architecture.md` - Technical implementation details
- `docs/random-forest-working.md` - RF algorithm explanation
- `docs/xgboost-smote-working.md` - XGBoost + SMOTE deep dive
- `ML_Model_Training_Guide.txt` - Step-by-step training tutorial

### Code Notebooks
- `Random_Forest_Classifier.ipynb` - RF model & evaluation
- `Full_Factor_Analysis_DTL.ipynb` - PCA & correlation analysis
- `PCA Evaluation of DTL Project.ipynb` - Dimensionality reduction

### Research
- `ResearchPaper.txt` - Literature review & findings
- `Phase-1 All Docs/` - Discovery phase documentation

---

## How to Use This Project

### For Students
1. Visit dashboard (localhost:3000 if local, or deployed URL)
2. Choose assessment algorithm (RF or XGBoost)
3. Answer 21 questions honestly
4. Provide optional feedback about challenges
5. Receive personalized risk assessment & recommendations
6. Download PDF report to share with advisor

### For Developers
1. Clone repository from GitHub
2. Navigate to `dashboard-2/`
3. Run `npm install` (install dependencies)
4. Run `npm run dev` (start dev server)
5. Edit files & see changes live (hot reload)
6. Modify ML models by updating `src/data/ml_config.json`

### For Educators
1. Review `docs/` folder for complete methodology
2. Check `Random_Forest_Classifier.ipynb` for model details
3. Adapt survey questions to your institution
4. Retrain models with your student data
5. Deploy dashboard to campus network

---

## Questions?

Refer to:
- **Technical Questions**: See `docs/website-architecture.md`
- **Model Questions**: See `docs/xgboost-smote-working.md`
- **Data Questions**: See `docs/methodology-workflow.md`
- **Implementation**: See `/dashboard-2/README.md` or `QUICKSTART.md`

**Contact**: Academic advisor or project team 🎓

This project aims to predict student dropout risk using machine learning models based on survey responses and other relevant data. The dashboard provides a user-friendly interface for students to self-assess their risk and receive personalized recommendations. The models used include Random Forest and XGBoost (with SMOTE for class balancing), and the workflow is designed to ensure both accuracy and interpretability.

## Key Features
- Multi-step survey for risk assessment
- Sentiment analysis of user input
- Random Forest and XGBoost (with SMOTE) models
- Visualizations and recommendations
- Confidential and privacy-focused design
