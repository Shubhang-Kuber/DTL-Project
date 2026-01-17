# 📖 User Guide
## How to Use the Student Wellness Dashboard

---

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Taking the Assessment](#taking-the-assessment)
3. [Understanding Your Results](#understanding-your-results)
4. [Exploring Factor Breakdown](#exploring-factor-breakdown)
5. [Random Forest Visualizer](#random-forest-visualizer)
6. [Recommendations](#recommendations)
7. [Privacy & FAQ](#privacy--faq)

---

## 🚀 Getting Started

### Running the Dashboard

**For Users:**
```bash
# Navigate to the dashboard folder
cd dashboard-2

# Install dependencies (first time only)
npm install

# Start the application
npm run dev

# Opens at http://localhost:5173
```

**Quick Access:**
Once running, the dashboard opens automatically in your browser. If not, go to: `http://localhost:5173`

### What You'll Need

- 5-10 minutes of quiet time
- Honest reflection on your current situation
- Optionally: Thoughts about any challenges you're facing

---

## 📝 Taking the Assessment

### Screen 1: Assessment Survey

The survey consists of **12 questions** measuring different aspects of your academic life.

#### Question Categories

| Questions | Topic | What We're Measuring |
|-----------|-------|---------------------|
| Q1-Q2 | Engagement | Interest in your course, motivation |
| Q3 | Confidence | Academic self-belief |
| Q4 | Stress | Current stress levels |
| Q5 | Finance | Financial impact on studies |
| Q6 | Family | Support from family |
| Q7 | Institution | Support from college/university |
| Q8 | Social | Feelings of isolation |
| Q9 | Commitments | Work/family affecting studies |
| Q10 | Attendance | Class participation |
| Q11 | Activities | Extracurricular involvement |

#### How to Answer

```
Rating Scale: 1 ──────────────────── 5
              │                      │
              └─ Disagree/Low        └─ Agree/High
              
Example:
"How stressed are you?" 
  1 = No stress at all
  5 = Extremely stressed
```

#### Tips for Accurate Results

✅ **DO:**
- Answer based on the LAST 2-4 WEEKS
- Be honest - there are no wrong answers
- Take your time on each question
- Consider how you actually feel, not how you think you should feel

❌ **DON'T:**
- Rush through the questions
- Answer based on how you want to feel
- Overthink - your first instinct is usually accurate

### Optional: Share Your Thoughts

At the end of the survey, you can optionally share any challenges or thoughts in a text box. This helps the system better understand your situation.

**Example inputs:**
- "I've been struggling with balancing work and studies"
- "Feeling overwhelmed with the course load"
- "Really enjoying my classes this semester!"

---

## 📊 Understanding Your Results

### Screen 2: Risk Summary

After submitting, you'll see your overall risk assessment.

#### Risk Levels

| Level | Score | What It Means |
|-------|-------|---------------|
| 🟢 **Low Risk** | 0-33% | You're doing well! Continue your current approach. |
| 🟡 **Medium Risk** | 33-66% | Some areas need attention. Consider support resources. |
| 🔴 **High Risk** | 66-100% | Multiple stressors detected. Please seek support. |

#### Reading the Summary

```
┌─────────────────────────────────────┐
│         YOUR RISK SCORE             │
│                                     │
│            ┌─────┐                  │
│            │ 42% │  ← Overall       │
│            └─────┘    Risk Score    │
│                                     │
│    Level: MEDIUM RISK               │
│    Confidence: 78%  ← How certain   │
│                       the model is  │
└─────────────────────────────────────┘
```

**Confidence Score:**
- Higher confidence (70%+) = More reliable prediction
- Lower confidence (50-70%) = Borderline case, results may vary
- The confidence is based on how consistently the ML model's decision trees agreed

---

## 📈 Exploring Factor Breakdown

### Screen 3: Factor Analysis

This screen shows which specific areas contribute to your risk.

#### The Four Factors

**1. Engagement & Motivation** 🎯
- Your interest in your course
- Your drive to complete your studies
- *Based on: Q1, Q2*

**2. Academic Consistency** 📚
- Confidence in your abilities
- Support from your institution
- Class attendance habits
- *Based on: Q3, Q7, Q10*

**3. Emotional Well-being** 💚
- Stress and anxiety levels
- Family support system
- Social connection/isolation
- *Based on: Q4, Q6, Q8*

**4. External/Financial Pressure** 💼
- Financial impact on studies
- Work/family commitments
- Life balance
- *Based on: Q5, Q9, Q11*

#### Reading the Charts

**Radar Chart (Spider Web):**
```
              Academic
                 ▲
                /|\
               / | \
              /  |  \
Emotional ◄───●──┼──●───► Engagement
              \  |  /
               \ | /
                \|/
                 ▼
              External
              
● = Your score (further from center = higher risk)
```

**Bar Chart:**
```
Engagement      ████████░░ 35%    ← Lower is better
Academic        ██████░░░░ 28%
Emotional       █████████░ 45%    ← Higher = needs attention
External        ███████████ 58%   ← Highest risk area
```

#### What to Focus On

1. **Identify your highest factor** - This needs the most attention
2. **Look at the specific questions** - Which ones scored highest?
3. **Consider the patterns** - Are related factors both high?

---

## 🌲 Random Forest Visualizer

### Screen 4: How the ML Model Works

This educational screen helps you understand how your prediction was calculated.

#### Section 1: Introduction
Learn what Random Forest is and why it's used for this prediction.

#### Section 2: The Forest
See all 50 decision trees that voted on your result.

```
🌲🌲🌲🌲🌲  Each tree = one voter
🌲🌲🌲🌲🌲  
🌲🌲🌲🌲🌲  All trees vote → majority wins
...
```

#### Section 3: Voting Animation
Watch the voting process in action:
- Trees cast votes one by one
- See the count change in real-time
- Final result shows the winning prediction

#### Section 4: Feature Importance
See which questions had the most influence:

```
External Commitments   ████████████████  16.2%  ← Most important
Social Isolation       █████████████     13.2%
Extracurricular        ████████████      12.2%
...
```

#### Section 5: Your Decision Path
Trace how a decision tree might have classified you:

```
Start → Q9 (Commitments) > 3? 
           │
     ┌─────┴─────┐
    YES          NO
     │            │
     ▼            ▼
  Q8 > 3?     Low Risk
     │
  ...etc
```

---

## 💡 Recommendations

### Screen 5: Personalized Support

Based on your factor scores, you receive targeted recommendations.

#### Priority Levels

**🔴 High Priority** (Factor score > 66%)
- Immediate attention needed
- Specific resources and contacts
- Action items with deadlines

**🟡 Medium Priority** (Factor score 33-66%)
- Proactive measures recommended
- Preventive strategies
- Check-in suggestions

**🟢 General Tips** (All users)
- Wellness maintenance
- Study techniques
- Social connection ideas

#### Example Recommendations

**For High External Pressure:**
- Speak with your academic advisor about workload
- Explore financial aid options
- Consider time management workshops
- Look into flexible study arrangements

**For Low Emotional Well-being:**
- Connect with campus counseling services
- Join study groups for social support
- Practice stress management techniques
- Reach out to family or friends

---

## 🔒 Privacy & FAQ

### Privacy Assurance

| Aspect | Status |
|--------|--------|
| Data sent to server | ❌ Never |
| Responses stored | ❌ Only in browser memory |
| Personal info required | ❌ None |
| Tracking/Analytics | ❌ None |
| Data cleared on refresh | ✅ Yes |

**Your assessment is completely anonymous and private.**

### Frequently Asked Questions

**Q: Is this a medical diagnosis?**
> No. This is a wellness screening tool, not a clinical assessment. If you're struggling, please seek professional help.

**Q: How accurate is the prediction?**
> The model has 87.5% accuracy on test data. However, it's a guide, not a certainty. Use it as a starting point for reflection.

**Q: Can I retake the assessment?**
> Yes! Simply refresh the page to start over. Take it weekly or monthly to track changes.

**Q: Why did I get Medium Risk when I feel fine?**
> The model detects patterns that might not be obvious. It's preventive - catching concerns before they grow.

**Q: Who can see my results?**
> Only you. Nothing is saved or transmitted.

**Q: What if I'm in crisis right now?**
> Please contact emergency services or a crisis helpline immediately:
> - National Suicide Prevention: 988 (US)
> - Crisis Text Line: Text HOME to 741741
> - Your campus counseling center

---

## 📞 Getting Help

### Campus Resources
- Academic Advisor
- Counseling Center
- Financial Aid Office
- Student Wellness Center
- Peer Support Groups

### External Resources
- National crisis helplines
- Online therapy platforms
- Mental health apps
- Community support groups

---

## 🔄 Taking Action

### If Low Risk (0-33%)
1. ✅ Continue your current habits
2. ✅ Maintain social connections
3. ✅ Check in with yourself monthly
4. ✅ Help friends who might be struggling

### If Medium Risk (33-66%)
1. ⚠️ Identify your highest-risk factor
2. ⚠️ Try one recommendation this week
3. ⚠️ Talk to someone you trust
4. ⚠️ Retake assessment in 2 weeks

### If High Risk (66-100%)
1. 🆘 Please reach out for support today
2. 🆘 Contact your academic advisor
3. 🆘 Visit campus counseling
4. 🆘 You don't have to face this alone

---

*Remember: Seeking help is a sign of strength, not weakness.*

---

## 📚 Related Documents

- [Project Overview](./01_PROJECT_OVERVIEW.md) - About this project
- [ML Model Documentation](./02_ML_MODEL_DOCUMENTATION.md) - Technical details
- [Technical Architecture](./03_TECHNICAL_ARCHITECTURE.md) - Developer info

---

*Document Version: 2.0 | Last Updated: January 2026*
