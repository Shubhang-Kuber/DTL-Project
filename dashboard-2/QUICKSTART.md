# 🚀 QUICK START GUIDE - DTL Dashboard 2.0

## What You Just Got

A **production-ready React dashboard** for student dropout risk prediction with:

✅ **4 interactive screens** (assessment form → risk summary → factor analysis → recommendations)  
✅ **Direction-aware scoring** (semantically correct, explainable risk logic)  
✅ **Modern tech stack** (React + Vite + Tailwind + Recharts)  
✅ **Full documentation** (README, terminal instructions, inline code comments)  
✅ **WCAG 2.1 AA accessible** (responsive, dark mode, keyboard-navigable)  

---

## 🎯 What to Do Now

### Option 1: Run Immediately (Recommended)

Open Windows Terminal/PowerShell and copy-paste:

```bash
cd "c:\Shubhang Kuber\Engineering 2024-2028\2nd Year All Docs\3rd Semester\DTL\DTL-Project\dashboard-2"
npm install
npm run dev
```

**Wait 30-45 seconds for dependencies to install.**

Browser opens → http://localhost:3000 → **Dashboard is live!**

---

### Option 2: Step-by-Step (If you're new to Node.js)

1. **Check prerequisites:**
   ```bash
   node --version    # Should show v16+
   npm --version     # Should show v7+
   ```
   
   If not installed → Download from https://nodejs.org/ → Install → Restart terminal

2. **Navigate to dashboard:**
   ```bash
   cd "c:\Shubhang Kuber\Engineering 2024-2028\2nd Year All Docs\3rd Semester\DTL\DTL-Project\dashboard-2"
   ```

3. **Install dependencies (first time only):**
   ```bash
   npm install
   ```
   
   This downloads all packages (React, Vite, Tailwind, Recharts, etc.)
   
   **Takes 30-45 seconds. Be patient.**

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   You'll see:
   ```
   VITE v5.0.0  ready in 200 ms
   
   ➜  Local:   http://localhost:3000/
   ➜  press h to show help
   ```

5. **Browser opens automatically** → Fill out the form → See your risk assessment

6. **Stop the server later:**
   ```bash
   Press Ctrl+C in terminal
   ```

---

## 📋 Key Files to Know

| File | What It Does |
|------|-------------|
| `src/App.jsx` | Main app component (screen routing) |
| `src/utils/scoring.js` | **CRITICAL**: Direction-aware scoring engine |
| `src/data/questions.js` | Survey questions + factor definitions + recommendations |
| `src/screens/*.jsx` | 4 screen components (form, summary, charts, recommendations) |
| `README.md` | Full technical documentation |
| `TERMINAL_INSTRUCTIONS.md` | Detailed setup guide |

---

## 🔴 Critical: Direction-Aware Scoring

**Problem:** Some survey questions are "positive" (higher = healthier), others are "negative" (higher = riskier).

**Solution:** Questions are marked with `direction: 'positive'` or `direction: 'negative'`.

**Result:** System correctly interprets:
- High motivation (positive) → REDUCES risk ✓
- High stress (negative) → INCREASES risk ✓
- Worst answers → HIGH RISK 🔴
- Best answers → LOW RISK 🟢

→ See `src/utils/scoring.js` for the math (with comments!)

---

## 🧪 Test the Dashboard

**Worst-case scenario test:**

1. Go to http://localhost:3000
2. Answer ALL questions with worst possible answers:
   - Motivation: 1 (not motivated)
   - Stress: 5 (extremely stressed)
   - Support: 1 (no support)
   - etc.
3. Click "Analyze My Risk"
4. **Expected result: HIGH RISK 🔴**

**Best-case scenario test:**

1. Go back and retake the form
2. Answer ALL questions with best possible answers:
   - Motivation: 5 (very motivated)
   - Stress: 1 (no stress)
   - Support: 5 (strong support)
   - etc.
3. Click "Analyze My Risk"
4. **Expected result: LOW RISK 🟢**

---

## 📁 Project Structure

```
dashboard-2/
├── src/
│   ├── components/       # Reusable React components
│   ├── screens/          # 4 screen components
│   ├── utils/            # Scoring logic
│   ├── data/             # Questions config
│   ├── App.jsx           # Main app
│   └── ...
├── index.html
├── package.json          # Dependencies
├── vite.config.js        # Build config
├── tailwind.config.js    # Styling config
└── README.md             # Full docs
```

---

## 🛠️ Common Commands

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Create production build (optimized for deployment) |
| `npm run preview` | View production build locally |
| `npm install <package>` | Add new dependency |
| `npm update` | Update all dependencies |

---

## 🚢 When You Want to Deploy

Create production build:

```bash
npm run build
```

This creates an optimized `dist/` folder.

**Deploy options:**
- **Vercel** (recommended): `npm install -g vercel && vercel`
- **Netlify**: Drag-drop `dist/` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **Any web server**: Upload `dist/` folder

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:
```javascript
'risk-low': '#10b981',     // Low risk (green)
'risk-medium': '#f59e0b',  // Medium risk (amber)
'risk-high': '#ef4444',    // High risk (red)
```

### Add/Modify Questions

Edit `src/data/questions.js` → add to `QUESTIONS` array:
```javascript
{
  id: 'q13',
  text: 'Your new question?',
  factor: 'Emotional Well-being',
  direction: 'positive',  // or 'negative'
  scale: { min: 1, max: 5, labels: ['Not at all', 'Very much'] }
}
```

### Change Risk Thresholds

Edit `src/data/questions.js`:
```javascript
export const RISK_THRESHOLDS = {
  LOW: 0.33,     // Change these numbers
  MEDIUM: 0.66
};
```

→ See `README.md` for more customization options

---

## 🐛 Troubleshooting

**"Port 3000 already in use"**
```bash
npm run dev -- --port 3001
```

**"command not found: npm"**
- Node.js not installed
- Download from https://nodejs.org/
- Restart terminal after install

**"npm ERR! code EACCES"**
```bash
npm install --global npm@latest
```

**Styles not loading**
```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 Documentation

- **README.md** — Full technical guide, customization, deployment
- **TERMINAL_INSTRUCTIONS.md** — Detailed setup walkthrough
- **INDEX.md** — Project overview and architecture
- **Inline code comments** — Every key function explained

---

## ✨ Key Features

✅ **4 Screen Flow:**
- Screen 1: Multi-step assessment form
- Screen 2: Risk badge + summary
- Screen 3: Factor breakdown (radar + bar charts)
- Screen 4: Personalized recommendations

✅ **Responsive Design:**
- Mobile (480px) ✓
- Tablet (768px) ✓
- Desktop (1920px) ✓

✅ **Accessibility (WCAG 2.1 AA):**
- High contrast
- Keyboard navigation
- Dark mode
- Reduced motion

✅ **Direction-Aware Scoring:**
- Semantically correct interpretation
- Explainable logic
- Clear inline comments

✅ **No Backend Required:**
- Client-side only
- Process responses in browser
- No data storage

---

## 🎓 Remember

This is an **explainable, rule-based decision-support system**, not machine learning.

It helps identify students who may benefit from support resources.

It's **NOT:**
- A prediction model
- A diagnostic tool
- A final decision maker

---

## 🚀 Next Steps

1. **Run the dashboard:** `npm run dev`
2. **Test both scenarios:** Worst case (HIGH RISK) + Best case (LOW RISK)
3. **Explore the screens:** Form → Summary → Charts → Recommendations
4. **Read the comments:** Understanding the direction-aware logic
5. **Customize as needed:** Edit questions, recommendations, colors (see README.md)
6. **Deploy when ready:** `npm run build` + upload `dist/` folder

---

## 💡 Pro Tips

- **Hot reload:** Changes to code apply instantly (no restart needed)
- **Browser DevTools:** F12 to inspect components and styles
- **Source maps:** Vite generates source maps for easy debugging
- **Dark mode:** System automatically detects dark mode preference

---

## 📞 Support

**If something breaks:**
1. Check browser console (F12)
2. Verify Node.js: `node --version`
3. Reinstall: `rm -r node_modules && npm install`
4. Restart: `npm run dev`

**For questions:** See README.md or review code comments

---

**You're all set! Happy analyzing! 🎉**

Version 2.0 • React + Vite • December 2025
