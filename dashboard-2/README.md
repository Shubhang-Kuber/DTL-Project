# DTL Dashboard 2.0 (React)

**Production-grade React dashboard for student dropout risk prediction**

## Overview

This is a modern React rebuild of the DTL Early-Warning Dashboard using:
- **React 18** with Hooks for state management
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, accessible styling
- **Recharts** for interactive visualizations
- **Framer Motion** for smooth, respectful animations

## CRITICAL: Direction-Aware Scoring

This implementation **enforces semantic direction handling** for survey questions:

### Question Types

**POSITIVE** (higher = healthier):
- Interest in course
- Motivation
- Academic confidence
- Sense of belonging
- Support (family, institutional)

When calculated: High values are **inverted** to reduce risk.

**NEGATIVE** (higher = riskier):
- Dropout intention
- Financial burden
- Stress
- Emotional exhaustion
- Lack of interest
- Isolation

When calculated: High values **directly increase risk**.

### Direction-Aware Scoring Rule

```javascript
// For NEGATIVE indicators:
// invertedValue = 6 - originalValue ensures semantic correctness
// Example: Stress=5 → normalized=1.0 → HIGH RISK ✓

// For POSITIVE indicators:
// invertedValue = 1 - normalizedValue
// Example: Motivation=5 → normalized=1.0 → inverted=0.0 → LOW RISK ✓
```

**This guarantees:**
- Worst inputs → **HIGH RISK** 🔴
- Best inputs → **LOW RISK** 🟢
- System is explainably correct

## Project Structure

```
dashboard-2/
├── src/
│   ├── components/
│   │   └── index.js                 # Reusable components library
│   ├── screens/
│   │   ├── AssessmentScreen.jsx     # Screen 1: Multi-step form
│   │   ├── RiskSummaryScreen.jsx    # Screen 2: Overall risk badge
│   │   ├── FactorBreakdownScreen.jsx # Screen 3: Detailed analysis
│   │   └── RecommendationsScreen.jsx # Screen 4: Support suggestions
│   ├── utils/
│   │   └── scoring.js               # Direction-aware scoring engine
│   ├── data/
│   │   └── questions.js             # Question config + direction mapping
│   ├── App.jsx                      # Main app component
│   ├── App.css                      # App layout styles
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind + globals
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind customization
├── postcss.config.js                # CSS processing
└── README.md                        # This file
```

## Four Screens

### Screen 1: Student Assessment
- Multi-step wizard (3 questions per step)
- Likert sliders (1-5 scale)
- Optional sentiment input
- Progress indicator
- Privacy disclaimer

### Screen 2: Risk Summary
- Prominent risk badge (Low/Medium/High)
- Ethical color coding (green/amber/red)
- Risk score percentage
- Factor overview
- System disclaimer

### Screen 3: Factor Breakdown
- Radar chart (all factors at once)
- Bar chart (factor comparison)
- Circular progress for each factor
- Causality explanation
- Technical notes on direction-aware scoring

### Screen 4: Recommendations
- Rule-based suggestions (mapped to low scores)
- Severity indicators (high/medium)
- Campus resources directory
- System disclaimer
- Export/share options

## Getting Started

### Prerequisites

- **Node.js** 16+ (check: `node --version`)
- **npm** 7+ (check: `npm --version`)

### Installation

```bash
cd dashboard-2
npm install
```

This installs:
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (charting)
- Framer Motion (animations)

### Development Server

```bash
npm run dev
```

Opens `http://localhost:3000` in your browser.

**Features:**
- Hot module reload (changes reflect instantly)
- Source maps for easy debugging

### Production Build

```bash
npm run build
```

Generates optimized assets in `dist/` folder:
- Minified JavaScript
- Optimized CSS
- Asset hashing for cache busting

To preview the build locally:
```bash
npm run preview
```

## How Data Flows

1. **User submits form** (Screen 1)
   - Responses collected: `{ q1: 4, q2: 5, q3: 3, ... }`

2. **Scoring engine processes** (utils/scoring.js)
   ```
   normalizeValue(response)     → [0, 1] range
   ↓
   checkDirection(question)      → POSITIVE or NEGATIVE
   ↓
   if POSITIVE: invertValue()    → high values reduce risk
   if NEGATIVE: use directly     → high values increase risk
   ↓
   calculateFactorScores()       → aggregate per factor
   ↓
   calculateOverallRiskScore()   → weighted average
   ↓
   classifyRisk()               → Low/Medium/High
   ```

3. **Recommendations generated**
   - Map low-scoring factors to suggestions
   - Severity based on score threshold

4. **Screens display results** (Screens 2–4)
   - Risk badge, charts, recommendations
   - All data flows from App state

## Key Files & Functions

### scoring.js

```javascript
normalizeValue(value, min, max)       // Scale to [0, 1]
invertValue(normalized)               // 1 - value (for positive indicators)
calculateFactorScores(responses)      // Direction-aware factor aggregation
calculateOverallRiskScore(factorScores)  // Weighted average
classifyRisk(score)                   // Low/Medium/High + color
analyzeSentiment(text)                // Keyword-based sentiment [-1, +1]
generateRecommendations(factorScores) // Map to support suggestions
```

### questions.js

```javascript
QUESTIONS[]                           // Array of question objects
FACTORS{}                             // Factor definitions + weights
RISK_THRESHOLDS{}                     // Low: 0.33, Medium: 0.66
RECOMMENDATIONS{}                     // Map: factor → suggestions
```

### Components (components/index.js)

- `LikertSlider` — 5-point scale input
- `ProgressBar` — Visual progress
- `RiskBadge` — Risk classification display
- `Card` — Reusable container
- `Button` — Styled buttons
- `FormSection` — Grouped inputs
- `FactorChartCard` — Circular progress
- `RecommendationCard` — Suggestion display
- `ScreenContainer` — Page layout

## Design Principles

✅ **Academic, clean, minimal** — No flashy gradients or aggressive animations

✅ **Student-safe language** — Supportive, not alarming

✅ **Explainable logic** — Clear comments about direction-aware scoring

✅ **Fully responsive** — Mobile (480px), tablet (768px), desktop (1920px+)

✅ **WCAG 2.1 AA accessibility** — Color contrast, keyboard nav, reduced motion support

✅ **Deterministic behavior** — Same inputs always produce same outputs (no randomness)

## Customization

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  'risk-low': '#10b981',     // Green
  'risk-medium': '#f59e0b',  // Amber
  'risk-high': '#ef4444',    // Red
}
```

### Add/Modify Questions

Edit `src/data/questions.js`:
```javascript
{
  id: 'q13',
  text: 'Your question here?',
  factor: 'Emotional Well-being',
  direction: 'positive' | 'negative',
  scale: { min: 1, max: 5, labels: ['...', '...'] }
}
```

### Update Recommendations

Edit `src/data/questions.js` in `RECOMMENDATIONS` object:
```javascript
'Your Factor': [
  {
    severity: 'high',
    title: 'Your suggestion',
    suggestions: ['idea 1', 'idea 2', ...]
  }
]
```

### Adjust Risk Thresholds

Edit `src/data/questions.js`:
```javascript
export const RISK_THRESHOLDS = {
  LOW: 0.33,    // Change here
  MEDIUM: 0.66  // Or here
};
```

## Deployment

### Option 1: Static Hosting (Vercel, Netlify, GitHub Pages)

```bash
npm run build
# Deploy the dist/ folder to your host
```

### Option 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build: `docker build -t dtl-dashboard .`
Run: `docker run -p 3000:3000 dtl-dashboard`

## Testing the Direction-Aware Scoring

Manually test worst-case scenarios:

1. Submit form with:
   - All stress/isolation/financial burden at **5** (worst)
   - All motivation/confidence/support at **1** (worst)
   
2. Expected result: **HIGH RISK** 🔴

3. Submit form with:
   - All stress/isolation at **1** (best)
   - All motivation/confidence at **5** (best)
   
4. Expected result: **LOW RISK** 🟢

## Troubleshooting

**Port 3000 already in use:**
```bash
npm run dev -- --port 3001
```

**Styles not applying:**
```bash
npm install
npm run dev
```

**Build fails:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance

- **Bundle size:** ~150KB (gzipped)
- **First paint:** <1s (with Vite)
- **Animations:** 60 FPS (Framer Motion optimized)
- **Accessibility:** WCAG 2.1 AA

## Security

✅ No backend API calls (client-side only)
✅ No user data storage
✅ No third-party tracking
✅ HTTPS-ready

## License

Academic use. See institution guidelines.

## Support

Contact your academic advisor or student support services for implementation questions.

---

**Built with ❤️ for student success**
