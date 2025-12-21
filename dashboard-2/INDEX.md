# DTL Dashboard 2.0 - Project Overview

## 📋 What You Have

A **production-grade React dashboard** implementing the Design Thinking Lab (DTL) Early-Warning System for student dropout risk prediction.

### Key Features

✅ **4-Screen Interactive Wizard**
- Screen 1: Student Assessment (multi-step form)
- Screen 2: Risk Summary (overall classification)
- Screen 3: Factor Breakdown (detailed charts)
- Screen 4: Recommendations (personalized support)

✅ **Direction-Aware Scoring** (CRITICAL)
- Semantically correct handling of positive vs. negative questions
- Ensures worst answers → HIGH RISK, best answers → LOW RISK
- Inline comments explaining logic

✅ **Modern React Stack**
- React 18 with Hooks
- Vite (fast build tool)
- Tailwind CSS (responsive styling)
- Recharts (interactive charts)
- Framer Motion (smooth animations)

✅ **Explainable, Rule-Based System**
- No ML models, no randomness
- 100+ rule-based recommendations
- Sentiment analysis for feedback
- Clear risk thresholds (Low: ≤0.33, Medium: 0.33-0.66, High: >0.66)

✅ **Accessibility & Responsiveness**
- WCAG 2.1 AA compliant
- Mobile (480px), tablet (768px), desktop (1920px+)
- Dark mode support
- Reduced motion support

---

## 📁 File Structure

```
dashboard-2/
│
├── src/
│   ├── components/
│   │   └── index.js               # Reusable React components library
│   │
│   ├── screens/
│   │   ├── AssessmentScreen.jsx   # Screen 1: Multi-step form (wizard)
│   │   ├── RiskSummaryScreen.jsx  # Screen 2: Risk badge + overview
│   │   ├── FactorBreakdownScreen.jsx # Screen 3: Charts + analysis
│   │   └── RecommendationsScreen.jsx # Screen 4: Support suggestions
│   │
│   ├── utils/
│   │   └── scoring.js             # Core scoring engine (direction-aware)
│   │
│   ├── data/
│   │   └── questions.js           # Question config, factors, recommendations
│   │
│   ├── App.jsx                    # Main app (state machine for 4 screens)
│   ├── App.css                    # App layout styles
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind + global styles
│
├── public/                        # Static assets (placeholder)
│
├── index.html                     # HTML template
├── package.json                   # Dependencies + scripts
├── vite.config.js                 # Vite build configuration
├── tailwind.config.js             # Tailwind customization
├── postcss.config.js              # CSS processing
├── .gitignore                     # Git ignore rules
│
├── README.md                      # Full documentation
├── TERMINAL_INSTRUCTIONS.md       # Step-by-step setup guide
└── INDEX.md                       # This file

```

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Navigate to dashboard folder
cd "c:\...\dashboard-2"

# 2. Install dependencies (one-time)
npm install

# 3. Start development server
npm run dev
```

Browser opens automatically to **http://localhost:3000**

→ See [TERMINAL_INSTRUCTIONS.md](TERMINAL_INSTRUCTIONS.md) for detailed walkthrough

---

## 📊 How Direction-Aware Scoring Works

### The Problem
Some questions are **positively worded** (higher = healthier):
- "How motivated are you?" (1=not, 5=very)
- High response (5) = good sign = should REDUCE risk

Some questions are **negatively worded** (higher = riskier):
- "How stressed are you?" (1=not, 5=very)
- High response (5) = bad sign = should INCREASE risk

### The Solution (in scoring.js)

```javascript
// Step 1: Normalize to [0, 1]
normalized = (value - min) / (max - min)

// Step 2: Direction-aware interpretation
if (question.direction === 'positive') {
  // High values should reduce risk
  normalized = 1 - normalized  // Invert
} else if (question.direction === 'negative') {
  // High values already represent risk
  // Use normalized value directly (no inversion)
}

// Result:
// Motivation=5 → normalized=1.0 → inverted=0.0 → LOW RISK ✓
// Stress=5 → normalized=1.0 → (no inversion) → HIGH RISK ✓
```

→ See [README.md](README.md) for technical details

---

## 🎯 The 4 Screens

### Screen 1: Student Assessment
**User Experience:**
- Multi-step form wizard (3 questions per step)
- Smooth Likert sliders (1–5 scale)
- Progress indicator shows completion
- Optional sentiment text input
- Privacy disclaimer

**Technical:**
- Component: `AssessmentScreen.jsx`
- State: Form responses, current step
- Output: `responses = { q1: 4, q2: 5, ... }`

---

### Screen 2: Risk Summary
**User Experience:**
- Large, prominent risk badge (Low/Medium/High)
- Ethical color coding (green/amber/red)
- Risk percentage score displayed
- Quick factor overview
- Supportive context message
- System disclaimer

**Technical:**
- Component: `RiskSummaryScreen.jsx`
- Input: `overallRiskScore`, `factorScores`
- Uses: `classifyRisk()` from scoring.js

---

### Screen 3: Factor Breakdown
**User Experience:**
- Radar chart (all factors at once)
- Bar chart (easy comparison)
- Circular progress indicators
- Explanatory tooltips
- Technical note about direction-aware scoring

**Technical:**
- Component: `FactorBreakdownScreen.jsx`
- Charts: Recharts library
- Visualization of all 4 factors:
  - Academic Consistency
  - Emotional Well-being
  - Engagement & Motivation
  - External / Financial Pressure

---

### Screen 4: Recommendations
**User Experience:**
- Rule-based suggestions (mapped to low scores)
- Severity indicators (🔴 High / 🟡 Medium)
- Campus resource directory
- System disclaimer (not a final decision)
- Export/share options (copy, PDF)

**Technical:**
- Component: `RecommendationsScreen.jsx`
- Data: `RECOMMENDATIONS` from questions.js
- Logic: `generateRecommendations()` from scoring.js

---

## 🔧 Component Architecture

### Reusable Components (components/index.js)

```javascript
<LikertSlider />        // 5-point scale input
<ProgressBar />         // Visual progress indicator
<RiskBadge />          // Risk classification display
<Card />               // Container with styling
<Button />             // Themed buttons (primary/secondary/success)
<FormSection />        // Section wrapper with blue background
<FactorChartCard />    // Circular progress + factor info
<RecommendationCard /> // Suggestion card with severity
<ScreenContainer />    // Full-screen layout wrapper
```

All components:
- Use Framer Motion for smooth animations
- Support dark mode
- Are fully responsive
- Have proper ARIA labels

---

## 🎨 Styling System

**Stack:** Tailwind CSS + Framer Motion

**Custom Colors (tailwind.config.js):**
```javascript
'risk-low': '#10b981',      // Green
'risk-medium': '#f59e0b',   // Amber
'risk-high': '#ef4444',     // Red
'accent-blue': '#3b82f6',   // Primary
```

**Responsive Breakpoints:**
- Mobile: 480px
- Tablet: 768px
- Desktop: 1920px+

**Features:**
- CSS variables for theming
- Dark mode support (prefers-color-scheme)
- Accessibility (high contrast, focus rings, reduced motion)

---

## 📡 Data Flow

```
User Input (Form)
       ↓
app.responses = { q1: 4, q2: 5, ... }
       ↓
calculateFactorScores(responses)
       ↓
factorScores = { 'Academic Consistency': 0.45, ... }
       ↓
calculateOverallRiskScore(factorScores)
       ↓
overallRiskScore = 0.52 (52%)
       ↓
classifyRisk(overallRiskScore)
       ↓
riskClassification = { level: 'Medium Risk', color: '#f59e0b', ... }
       ↓
generateRecommendations(factorScores)
       ↓
recommendations = [ { factor: '...', suggestions: [...] }, ... ]
       ↓
Screens 2-4 Display Results
```

---

## 🧪 Testing Direction-Aware Scoring

**Test Case 1: Worst Scenario**
```javascript
{
  q1: 1,  // Low motivation (NEGATIVE question)
  q4: 5,  // High stress (NEGATIVE question)
  q8: 5,  // High isolation (NEGATIVE question)
  // ... all negative indicators at worst, positive at worst
}
// Expected: RISK > 0.66 → HIGH RISK 🔴
```

**Test Case 2: Best Scenario**
```javascript
{
  q1: 5,  // High motivation (POSITIVE question)
  q4: 1,  // Low stress (NEGATIVE question)
  q8: 1,  // Low isolation (NEGATIVE question)
  // ... all positive at best, negative at best
}
// Expected: RISK < 0.33 → LOW RISK 🟢
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Creates optimized `dist/` folder.

### Deploy Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Drag-drop `dist/` to Netlify

3. **GitHub Pages**
   - Push to gh-pages branch

4. **Docker**
   ```bash
   docker build -t dtl-dashboard .
   docker run -p 3000:3000 dtl-dashboard
   ```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `App.jsx` | Main state machine, screen routing |
| `scoring.js` | Direction-aware scoring engine (CRITICAL) |
| `questions.js` | Question config, factor definitions, recommendations |
| `AssessmentScreen.jsx` | Multi-step form |
| `RiskSummaryScreen.jsx` | Risk badge display |
| `FactorBreakdownScreen.jsx` | Charts and visualizations |
| `RecommendationsScreen.jsx` | Support suggestions |
| `components/index.js` | Reusable component library |

---

## 🔐 Security & Privacy

✅ **Client-side only** — No backend API calls
✅ **No data storage** — Responses processed in browser, not saved
✅ **No tracking** — No third-party analytics
✅ **HTTPS-ready** — Can be deployed securely

---

## ♿ Accessibility

✅ **WCAG 2.1 AA compliant**
- High contrast text
- Keyboard navigation
- Semantic HTML
- ARIA labels
- Focus indicators
- Dark mode support
- Reduced motion support

---

## 🎓 Academic Context

This dashboard implements a **rule-based, explainable decision-support system**, not machine learning.

**Analytical Foundation:**
- PCA (Principal Component Analysis)
- Factor Analysis with Varimax rotation
- 5-factor model (academic, emotional, engagement, financial, social)
- Sentiment analysis (keyword-based)
- Deterministic risk classification

**NOT:**
- A predictive ML model
- A diagnostic tool
- A final decision system
- A replacement for human judgment

---

## 🤝 Support

**If something breaks:**

1. Check browser console (F12)
2. Verify Node.js is installed: `node --version`
3. Reinstall dependencies: `rm -r node_modules && npm install`
4. Restart dev server: `npm run dev`

**Questions about customization:**
- See README.md
- Review code comments (especially in scoring.js)
- Check component props in components/index.js

---

## 📞 Contact

For implementation or deployment questions, reach out to your institution's student support or IT services.

---

**Built with ❤️ for student success**

Version 2.0 • React + Vite • December 2025
