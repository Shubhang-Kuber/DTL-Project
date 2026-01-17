# 📊 Data Dictionary & Question Reference
## Complete Reference for Survey Questions and Data Mapping

---

## 📋 Table of Contents
1. [Survey Questions Reference](#survey-questions-reference)
2. [CSV Column Mapping](#csv-column-mapping)
3. [Feature Encoding](#feature-encoding)
4. [Factor Groupings](#factor-groupings)

---

## 📝 Survey Questions Reference

### Complete Question List

| ID | Question Text | Factor | Direction | Scale |
|----|---------------|--------|-----------|-------|
| **Q1** | How interested are you in your course? | Engagement & Motivation | Positive | 1-5 |
| **Q2** | How motivated are you to complete your studies? | Engagement & Motivation | Positive | 1-5 |
| **Q3** | How confident are you in your academic abilities? | Academic Consistency | Positive | 1-5 |
| **Q4** | What is your current stress level? | Emotional Well-being | Negative | 1-5 |
| **Q5** | How much do financial challenges affect your studies? | External / Financial Pressure | Negative | 1-5 |
| **Q6** | How supported do you feel by your family? | Emotional Well-being | Positive | 1-5 |
| **Q7** | How supported do you feel by your institution? | Academic Consistency | Positive | 1-5 |
| **Q8** | How often do you feel socially isolated at university? | Emotional Well-being | Negative | 1-5 |
| **Q9** | How much are external work/family commitments affecting your studies? | External / Financial Pressure | Negative | 1-5 |
| **Q10** | How often do you attend classes? | Academic Consistency | Positive | 1-5 |
| **Q11** | How involved are you in extracurricular activities? | Engagement & Motivation | Positive | 1-5 |
| **Q12** | Have you considered dropping out? | *Target Variable* | Negative | Yes/No/Maybe |

---

## 📁 CSV Column Mapping

### Responses CSV File.csv → Questions

| Question ID | CSV Column Name | Feature Name |
|-------------|-----------------|--------------|
| Q1 | Interest in the Course | course_interest |
| Q2 | Motivation to Continue Studies | motivation |
| Q3 | How confident are you in understanding engineering subjects this semester? | academic_confidence |
| Q4 | Level of Stress or Anxiety Related to Studies | stress_level |
| Q5 | Do financial problems affect your studies? | financial_impact |
| Q6 | Family Support for Education | family_support |
| Q7 | Quality of Teaching and Learning Resources | institutional_support |
| Q8 | Do you feel socially isolated or left out in college? | social_isolation |
| Q9 | Do you have a part-time job or other major commitments? | external_commitments |
| Q10 | Attendance Rate | attendance |
| Q11 | Do you engage in extracurricular or sports activities? | extracurricular |
| Q12 | Have you ever considered dropping out of your current course? | *TARGET* |

---

## 🔢 Feature Encoding

### Likert Scale (1-5)

| Value | Meaning (Positive) | Meaning (Negative) |
|-------|-------------------|-------------------|
| 1 | Strongly Disagree / Very Low | Strongly Disagree / Very Low |
| 2 | Disagree / Low | Disagree / Low |
| 3 | Neutral / Medium | Neutral / Medium |
| 4 | Agree / High | Agree / High |
| 5 | Strongly Agree / Very High | Strongly Agree / Very High |

### Text to Scale Encoding

```python
# Common text mappings used during training
text_mappings = {
    # Frequency
    'never': 1, 'rarely': 2, 'sometimes': 3, 'often': 4, 'always': 5,
    
    # Yes/No
    'no': 1, 'yes': 5,
    
    # Attendance
    '90-100%': 5, '80-89%': 4, '70-79%': 3, '60-69%': 2, 'below 60%': 1,
    
    # Agreement
    'strongly disagree': 1, 'disagree': 2, 'neutral': 3, 
    'agree': 4, 'strongly agree': 5,
}
```

### Target Variable Encoding

```python
# Dropout Risk Classification
def classify_risk(value):
    if 'yes' in value or 'maybe' in value or 'already' in value:
        return 1  # At Risk
    return 0      # Not At Risk
```

---

## 📊 Factor Groupings

### Factor 1: Engagement & Motivation
**Weight: 25%**

| Question | Feature | Direction | Trained Weight |
|----------|---------|-----------|----------------|
| Q1 | course_interest | Positive | 0.1186 |
| Q2 | motivation | Positive | 0.1138 |

**What it measures:** Student's interest in their course and drive to complete their studies.

---

### Factor 2: Academic Consistency
**Weight: 25%**

| Question | Feature | Direction | Trained Weight |
|----------|---------|-----------|----------------|
| Q3 | academic_confidence | Positive | 0.0879 |
| Q7 | institutional_support | Positive | 0.1158 |
| Q10 | attendance | Positive | 0.0000* |

*Note: Attendance showed 0% importance in training - likely due to low variance in responses.

**What it measures:** Academic self-efficacy, institutional support quality, and class participation.

---

### Factor 3: Emotional Well-being
**Weight: 25%**

| Question | Feature | Direction | Trained Weight |
|----------|---------|-----------|----------------|
| Q4 | stress_level | Negative | 0.0000* |
| Q6 | family_support | Positive | 0.0546 |
| Q8 | social_isolation | Negative | 0.1320 |

*Note: Stress showed 0% importance - may need more training data.

**What it measures:** Mental health indicators, support systems, and social connectedness.

---

### Factor 4: External / Financial Pressure
**Weight: 25%**

| Question | Feature | Direction | Trained Weight |
|----------|---------|-----------|----------------|
| Q5 | financial_impact | Negative | 0.0931 |
| Q9 | external_commitments | Negative | 0.1619 |
| Q11 | extracurricular | Positive | 0.1223 |

**What it measures:** Financial stress, work-life balance, and campus engagement.

---

## 🔄 Direction-Aware Scoring Rules

### Positive Questions (Higher = Better)
```
Risk Contribution = 1 - Normalized Value

Example: Q1 (Interest) = 4
  Normalized = (4-1)/(5-1) = 0.75
  Risk = 1 - 0.75 = 0.25 (Low risk)
```

### Negative Questions (Higher = Worse)
```
Risk Contribution = Normalized Value

Example: Q4 (Stress) = 4
  Normalized = (4-1)/(5-1) = 0.75
  Risk = 0.75 (High risk)
```

---

## 📈 Weight Summary Table

| Rank | Question | Feature | Weight | Direction |
|------|----------|---------|--------|-----------|
| 1 | Q9 | external_commitments | 16.19% | Negative |
| 2 | Q8 | social_isolation | 13.20% | Negative |
| 3 | Q11 | extracurricular | 12.23% | Positive |
| 4 | Q1 | course_interest | 11.86% | Positive |
| 5 | Q7 | institutional_support | 11.58% | Positive |
| 6 | Q2 | motivation | 11.38% | Positive |
| 7 | Q5 | financial_impact | 9.31% | Negative |
| 8 | Q3 | academic_confidence | 8.79% | Positive |
| 9 | Q6 | family_support | 5.46% | Positive |
| 10 | Q4 | stress_level | 0.00% | Negative |
| 11 | Q10 | attendance | 0.00% | Positive |

---

## 📚 Related Documents

- [Project Overview](./01_PROJECT_OVERVIEW.md)
- [ML Model Documentation](./02_ML_MODEL_DOCUMENTATION.md)
- [Technical Architecture](./03_TECHNICAL_ARCHITECTURE.md)
- [User Guide](./04_USER_GUIDE.md)

---

*Document Version: 2.0 | Last Updated: January 2026*
