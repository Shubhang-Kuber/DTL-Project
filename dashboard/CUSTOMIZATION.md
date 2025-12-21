# Configuration & Customization Guide

## 🎨 Quick Customization Reference

This file provides quick references for the most common customizations.

---

## 1. Risk Thresholds (data.js)

**Current Setting:**
```javascript
const RISK_THRESHOLDS = {
    LOW: 0.33,      // score <= 0.33 = Low Risk
    MEDIUM: 0.66,   // 0.33 < score <= 0.66 = Medium Risk
    HIGH: 1.0       // score > 0.66 = High Risk
};
```

**To Change:**
Edit these values based on your institution's risk profile. If you find that most students score in the 0.5–0.8 range, adjust thresholds accordingly.

---

## 2. Color Scheme (styles.css)

**CSS Variables (top of file):**
```css
:root {
    --primary-color: #2c3e50;        /* Navy blue - main text */
    --secondary-color: #34495e;      /* Lighter navy */
    --accent-blue: #3498db;          /* Bright blue - buttons */
    --accent-green: #2ecc71;         /* Green - low risk */
    --accent-orange: #f39c12;        /* Orange - medium risk */
    --accent-red: #e74c3c;           /* Red - high risk */
    --accent-purple: #9b59b6;        /* Purple - factor 5 */
}
```

**To Change:**
Replace hex colors globally. Example:
```css
--accent-blue: #1e90ff;  /* Dodger blue instead */
--accent-green: #228b22; /* Forest green instead */
```

---

## 3. Risk Messaging (index.html & app.js)

**Default Message (Screen 2):**
```html
<p class="risk-explanation" id="riskExplanation">
    This risk level is based on academic, emotional, and engagement factors.
</p>
```

**To Change:**
Edit in `index.html` or dynamically in `app.js` `renderRiskSummary()` function.

---

## 4. Factor Names & Descriptions (data.js)

**Current Factors:**
```javascript
const FACTORS = {
    ACADEMIC_SUPPORT: {
        id: 'academic_support',
        name: 'Academic Support & Quality',
        color: '#3498db',
        description: 'Teaching quality, resources, and academic guidance',
        weight: 0.2
    },
    // ... 4 more factors
};
```

**To Add a New Factor:**
1. Add to `FACTORS` object with unique id
2. Add field mappings to `FIELD_TO_FACTOR_MAPPING`
3. Create recommendation set in `RECOMMENDATIONS_DB`
4. Update form fields in `index.html`

---

## 5. Survey Questions (index.html)

**Adding a New Question:**

```html
<div class="form-group">
    <label for="myNewField">My Question Label</label>
    <select id="myNewField" name="myNewField" class="select-input">
        <option value="">Select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <!-- etc -->
    </select>
</div>
```

**Then map in data.js:**
```javascript
'myNewField': { 
    factor: 'academic_support',  // which factor this contributes to
    inverse: false,              // true if lower is better
    weight: 0.25                 // how much this field weighs
}
```

---

## 6. Recommendation Rules (data.js)

**Structure:**
```javascript
const RECOMMENDATIONS_DB = {
    academic_support: {
        LOW: [        // recommendations when factor score is LOW
            {
                priority: 'high',
                icon: '📚',
                title: 'Seek Academic Support',
                description: 'Your academic...',
                actions: [
                    'Action 1',
                    'Action 2',
                    'Action 3'
                ]
            }
        ],
        MEDIUM: [ /* ... */ ],
        HIGH: [ /* ... */ ]
    }
};
```

**To Customize:**
- Change `priority` to 'high', 'medium', or 'low'
- Change `icon` emoji to something relevant
- Update `title`, `description`, and `actions`

---

## 7. Sentiment Analysis Keywords (data.js)

**Current Keywords:**
```javascript
const SENTIMENT_KEYWORDS = {
    NEGATIVE: ['stress', 'anxiety', 'overwhelm', /* ... */],
    POSITIVE: ['good', 'happy', 'excited', /* ... */],
    ACADEMIC: ['study', 'class', 'course', /* ... */]
};
```

**To Add/Remove Keywords:**
```javascript
SENTIMENT_KEYWORDS.NEGATIVE.push('overwhelmed');
SENTIMENT_KEYWORDS.POSITIVE.push('confident');
```

---

## 8. Form Field Weights (data.js)

**How It Works:**
Each field contributes to one of the 5 factors with a specific weight.

```javascript
'avgPerformance': { 
    factor: 'academic_support', 
    inverse: false, 
    weight: 0.25  // 25% of academic_support score
},
```

**Adjustment Example:**
If attendance is more important than performance at your institution:
```javascript
'attendanceRate': { factor: 'academic_support', inverse: false, weight: 0.35 },
'avgPerformance': { factor: 'academic_support', inverse: false, weight: 0.15 }
```

---

## 9. Chart Appearance (app.js)

**Customize in `renderFactorVisualization()`:**

```javascript
const ctx = canvas.getContext('2d');
chartInstance = new Chart(ctx, {
    type: 'bar',  // or 'radar', 'line', 'doughnut'
    options: {
        // Modify chart options here
        scales: {
            x: {
                max: 100,  // Change scale max
                ticks: {
                    callback: function(value) {
                        return value + '%';  // Format labels
                    }
                }
            }
        }
    }
});
```

---

## 10. Responsive Breakpoints (styles.css)

**Current Breakpoints:**
```css
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

**To Add Another Breakpoint:**
```css
@media (max-width: 1200px) { /* Large screens */ }
@media (max-width: 1600px) { /* Extra large */ }
```

---

## 🔧 Common Customizations Workflow

### Scenario 1: Change Factor Weights
**Goal**: Make stress management more important (30% vs 20%)

1. Open `data.js`
2. Find `FIELD_TO_FACTOR_MAPPING`
3. Increase `weight` for stress-related fields
4. Decrease other factor weights proportionally
5. Test with sample data

### Scenario 2: Add Institutional Branding
**Goal**: Add university logo and colors

1. Edit `index.html` header section
2. Add `<img src="logo.png" class="logo">` 
3. Update `styles.css` color variables
4. Add custom CSS for logo styling

### Scenario 3: Modify Risk Classifications
**Goal**: Use different risk labels (e.g., "Green", "Yellow", "Red")

1. Update `classifyRisk()` function in `data.js`
2. Change label strings in `renderRiskSummary()` in `app.js`
3. Update CSS classes for color coding
4. Verify throughout all screens

### Scenario 4: Add New Analysis Metric
**Goal**: Add a "Burnout Index" calculation

1. Add calculation function in `data.js`
2. Call from `performAnalysis()` in `app.js`
3. Store in `currentAnalysis` object
4. Display on Screen 2 or Screen 3
5. Use in recommendations logic

---

## 📊 Factor Weight Calibration

### Default Distribution
```
Academic Support & Quality        : 20%
Financial & Stress Management     : 20%
Institutional & Academic Environment: 20%
Course Interest & Motivation      : 20%
Social Integration & Well-being   : 20%
```

### For High-Stress Environments
```
Academic Support & Quality        : 15%
Financial & Stress Management     : 30%  ← Increased
Institutional & Academic Environment: 20%
Course Interest & Motivation      : 20%
Social Integration & Well-being   : 15%
```

### For Research-Heavy Institutions
```
Academic Support & Quality        : 30%  ← Increased
Financial & Stress Management     : 15%
Institutional & Academic Environment: 25%
Course Interest & Motivation      : 20%
Social Integration & Well-being   : 10%
```

---

## 🎯 Testing Your Customizations

### Unit Testing Checklist
- [ ] Load sample data works
- [ ] Form validates correctly
- [ ] Factor scores calculate within 0–1 range
- [ ] Risk classification assigns correct level
- [ ] Recommendations appear and are relevant
- [ ] Chart displays without errors
- [ ] Mobile layout is responsive
- [ ] Accessibility features work (keyboard nav, focus)

### Integration Testing
- [ ] Form → Screen 2 flow works
- [ ] Screen 2 → Screen 3 → Screen 4 navigation
- [ ] Reset form clears all data
- [ ] Chart cleans up on screen change
- [ ] Back buttons work correctly

### User Acceptance Testing
- [ ] Questions are clear and unambiguous
- [ ] Recommendations feel supportive (not judgmental)
- [ ] Color coding makes sense to students
- [ ] Mobile experience is usable
- [ ] Performance is acceptable

---

## 🐛 Debugging Tips

### Check Form Data
```javascript
console.log(window.currentAnalysis.formData);
```

### Verify Factor Scores
```javascript
console.log(window.currentAnalysis.factorScores);
```

### Test Risk Classification
```javascript
console.log(window.currentAnalysis.riskClassification);
```

### Check Recommendations
```javascript
console.log(window.currentAnalysis.recommendations);
```

### Full Analysis Dump
```javascript
window.logAnalysis();
```

---

## 📱 Device Testing

**Recommended Testing Devices:**
- Desktop: Chrome, Firefox, Safari, Edge
- Tablet: iPad (iOS), Android tablet
- Mobile: iPhone (iOS), Android phone
- Screen readers: NVDA (Windows), JAWS, VoiceOver (Mac)

---

## ⚡ Performance Optimization

### Already Optimized
- Minimal CSS repaints
- Efficient DOM updates
- Single Chart.js instance
- No external API calls
- Client-side processing only

### Further Optimizations (if needed)
- Lazy load Chart.js only on Screen 3
- Compress images/assets
- Minify CSS/JS for production
- Implement service worker for offline
- Cache form data in localStorage

---

## 🔐 Security Considerations

**Current Approach:**
- All data processed client-side (no server)
- No data transmission by default
- No authentication required

**For Production Deployment:**
- Add HTTPS enforcement
- Implement CSRF protection if adding backend
- Sanitize user inputs before display
- Hash/encrypt sensitive data if persisted
- Implement rate limiting if API-backed
- Add audit logging for compliance

---

## 📚 Reference Documents

- **Main README**: Dashboard overview and features
- **data.js Comments**: Detailed factor definitions
- **app.js Comments**: Function-level documentation
- **styles.css Comments**: Styling logic and breakpoints

---

**Last Updated**: December 20, 2024  
**For**: DTL Project v1.0
