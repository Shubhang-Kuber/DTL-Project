"""
SMOTE + XGBoost + Random Forest Training Script
Updated for 21 Questions

This script trains both models with SMOTE balancing
using the expanded 21-question dataset.
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import os

print("=" * 60)
print("SMOTE + XGBoost + Random Forest Training (21 Questions)")
print("=" * 60)

# ============ LOAD DATA ============
df = pd.read_csv('Responses CSV FIle.csv')
print(f"\n📊 Loaded {len(df)} student responses")

# ============ QUESTION MAPPING (21 Questions) ============
# Map CSV columns to question IDs
question_mapping = {
    'q1': 'How confident are you in understanding engineering subjects this semester?',
    'q2': 'How often do you seek help from faculty or peers when stuck in a course?',
    'q3': 'Quality of Teaching and Learning Resources',
    'q4': 'Availability of Academic Support (e.g., mentoring, tutoring)',
    'q5': 'Satisfaction with College Administration Support',
    'q6': 'Frequency of Counseling or Mentorship Sessions',
    'q7': '  Level of Stress or Anxiety Related to Studies  ',
    'q8': '  Do you feel socially isolated or left out in college?  ',
    'q9': '  Family Support for Education ',
    'q10': 'How often do you feel overwhelmed by academic workload?',
    'q11': 'Do you have any health issues affecting your studies?',
    'q12': '  Interest in the Course',
    'q13': '  Motivation to Continue Studies ',
    'q14': 'Do you engage in extracurricular or sports activities?',
    'q15': 'Attendance Rate',
    'q16': 'Would you consider dropping out of your course?',
    'q17': '  Do financial problems affect your studies? ',
    'q18': 'Do you depend on scholarships or loans? ',
    'q19': 'Do you have a part-time job or other major commitments?',
    'q20': 'Study Hours per Day',
    'q21': 'Number of Dependents in Family',
}

# Question directions (positive = higher is better, negative = higher is worse)
question_directions = {
    'q1': 'positive', 'q2': 'positive', 'q3': 'positive', 'q4': 'positive',
    'q5': 'positive', 'q6': 'positive', 'q7': 'negative', 'q8': 'negative',
    'q9': 'positive', 'q10': 'negative', 'q11': 'negative', 'q12': 'positive',
    'q13': 'positive', 'q14': 'positive', 'q15': 'positive', 'q16': 'negative',
    'q17': 'negative', 'q18': 'negative', 'q19': 'negative', 'q20': 'positive',
    'q21': 'negative'
}

# ============ CATEGORICAL ENCODING MAPS ============
# For questions with categorical values, define encoding
categorical_encodings = {
    'q2': {  # How often do you seek help
        'Never': 1, 'Rarely': 2, 'Sometimes': 3, 'Often': 4, 'Always': 5
    },
    'q6': {  # Frequency of counseling
        'Never': 1, 'Rarely': 2, 'Once a semester': 3, 'Monthly': 4, 'Weekly': 5
    },
    'q10': {  # Overwhelmed by workload
        'Never': 1, 'Sometimes': 2, 'Often': 3, 'Always': 4
    },
    'q11': {  # Health issues
        'No': 1, 'Yes, physical health issues': 3, 'Yes, mental health issues': 4, 'Yes, both': 5
    },
    'q14': {  # Extracurricular
        'Never': 1, 'Rarely': 2, 'Occasionally': 3, 'Regularly': 5
    },
    'q15': {  # Attendance
        'Below 40%': 1, '40–49%': 2, '60–69%': 3, '70–79%': 4, '80–89%': 4.5, '90% and above': 5
    },
    'q16': {  # Dropout consideration
        'No': 1, 'Maybe': 3, 'Yes': 5, 'Already dropped once and rejoined': 4
    },
    'q18': {  # Scholarships/loans
        'None': 1, 'Scholarship': 3, 'Loan': 4, 'Both': 5
    },
    'q19': {  # Part-time job
        'No': 1, 'Yes, family responsibility': 3, 'Yes, part-time job': 4, 'Yes, both': 5
    },
    'q20': {  # Study hours
        'Less than 1 hour': 1, '1–2 hours': 2, '2–4 hours': 3, 'More than 6 hours': 5
    },
}

# ============ EXTRACT FEATURES ============
print("\n🔧 Extracting features from 21 questions...")

def get_column_value(row, col_pattern):
    """Find column matching pattern and return value"""
    for col in df.columns:
        if col_pattern in col or col.strip() == col_pattern.strip():
            return row[col]
    return None

def encode_value(qid, value):
    """Encode a value for a specific question"""
    if pd.isna(value):
        return np.nan
    
    # If categorical encoding exists, use it
    if qid in categorical_encodings:
        encoding = categorical_encodings[qid]
        if value in encoding:
            return encoding[value]
        # Try stripping whitespace
        for k, v in encoding.items():
            if str(value).strip() == k.strip():
                return v
        return np.nan
    
    # Otherwise, try to convert to numeric
    try:
        return float(value)
    except (ValueError, TypeError):
        return np.nan

# Build feature matrix
X_data = []
valid_indices = []

for idx, row in df.iterrows():
    features = []
    valid = True
    
    for qid in [f'q{i}' for i in range(1, 22)]:
        col_pattern = question_mapping[qid]
        value = get_column_value(row, col_pattern)
        encoded = encode_value(qid, value)
        
        if pd.isna(encoded):
            # Use median value (3) for missing
            encoded = 3.0
        
        features.append(encoded)
    
    X_data.append(features)
    valid_indices.append(idx)

X = np.array(X_data)
print(f"✅ Extracted {X.shape[1]} features for {X.shape[0]} students")

# ============ CREATE TARGET VARIABLE ============
# Use "Would you consider dropping out?" as primary target
dropout_col = [c for c in df.columns if 'dropping out' in c.lower()][0]

def encode_dropout(value):
    """Encode dropout consideration as binary target"""
    if pd.isna(value):
        return 0
    value = str(value).strip().lower()
    if value in ['yes', 'already dropped once and rejoined']:
        return 1  # At-risk
    elif value == 'maybe':
        return 1  # Also consider at-risk
    return 0  # Not at-risk

y = df[dropout_col].apply(encode_dropout).values
print(f"\n📊 Target distribution:")
print(f"   Not at risk: {sum(y == 0)}")
print(f"   At risk: {sum(y == 1)}")

# ============ NORMALIZE FEATURES ============
# Normalize to 0-1 range and apply direction correction
X_normalized = np.zeros_like(X, dtype=float)

for i, qid in enumerate([f'q{j}' for j in range(1, 22)]):
    col = X[:, i]
    min_val, max_val = 1, 5
    normalized = (col - min_val) / (max_val - min_val)
    normalized = np.clip(normalized, 0, 1)
    
    # For negative direction questions, invert so higher = more risk
    if question_directions[qid] == 'negative':
        normalized = 1 - normalized
    
    X_normalized[:, i] = normalized

X = X_normalized
print(f"✅ Features normalized and direction-corrected")

# ============ APPLY SMOTE ============
print("\n🔄 Applying SMOTE to balance classes...")

# Split first (before SMOTE)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, stratify=y
)

print(f"   Training set: {len(y_train)} samples ({sum(y_train)} at-risk)")
print(f"   Test set: {len(y_test)} samples ({sum(y_test)} at-risk)")

# Apply SMOTE to training data only
n_at_risk = sum(y_train)
k_neighbors = min(n_at_risk - 1, 3) if n_at_risk > 1 else 1

if n_at_risk >= 2:
    smote = SMOTE(k_neighbors=k_neighbors, random_state=42)
    X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
    print(f"\n✅ SMOTE applied successfully!")
    print(f"   Original training: {len(y_train)} ({sum(y_train)} at-risk)")
    print(f"   After SMOTE: {len(y_train_smote)} ({sum(y_train_smote)} at-risk)")
    synthetic_count = len(y_train_smote) - len(y_train)
else:
    print("⚠️ Not enough at-risk samples for SMOTE, using original data")
    X_train_smote, y_train_smote = X_train, y_train
    synthetic_count = 0

# ============ TRAIN XGBOOST ============
print("\n🚀 Training XGBoost classifier...")

xgb_model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss'
)

xgb_model.fit(X_train_smote, y_train_smote)
xgb_pred = xgb_model.predict(X_test)
xgb_accuracy = accuracy_score(y_test, xgb_pred)
xgb_f1 = f1_score(y_test, xgb_pred, zero_division=0)

# Cross-validation
xgb_cv_scores = cross_val_score(xgb_model, X_train_smote, y_train_smote, cv=5)

print(f"   Test Accuracy: {xgb_accuracy:.2%}")
print(f"   F1 Score: {xgb_f1:.2%}")
print(f"   CV Accuracy: {xgb_cv_scores.mean():.2%} (+/- {xgb_cv_scores.std():.2%})")

# Feature importance
xgb_importance = xgb_model.feature_importances_

# ============ TRAIN RANDOM FOREST ============
print("\n🌲 Training Random Forest classifier...")

rf_model = RandomForestClassifier(
    n_estimators=50,
    max_depth=5,
    random_state=42
)

rf_model.fit(X_train_smote, y_train_smote)
rf_pred = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_test, rf_pred)
rf_f1 = f1_score(y_test, rf_pred, zero_division=0)

# Cross-validation
rf_cv_scores = cross_val_score(rf_model, X_train_smote, y_train_smote, cv=5)

print(f"   Test Accuracy: {rf_accuracy:.2%}")
print(f"   F1 Score: {rf_f1:.2%}")
print(f"   CV Accuracy: {rf_cv_scores.mean():.2%} (+/- {rf_cv_scores.std():.2%})")

# Feature importance
rf_importance = rf_model.feature_importances_

# ============ SAVE ML CONFIG ============
print("\n💾 Saving ML configuration...")

# Build question weights from both models
question_ids = [f'q{i}' for i in range(1, 22)]

ml_config = {
    "version": "4.0",
    "description": "Dual model support with 21 questions: XGBoost (SMOTE) and Random Forest",
    "trained_on": "Responses CSV File.csv",
    "num_questions": 21,
    "smote_applied": True,
    "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "models": {
        "xgboost": {
            "name": "XGBoost + SMOTE",
            "display_name": "XGBoost (Enhanced)",
            "n_estimators": 100,
            "max_depth": 4,
            "learning_rate": 0.1,
            "metrics": {
                "accuracy": float(xgb_accuracy),
                "f1_score": float(xgb_f1),
                "cv_accuracy": float(xgb_cv_scores.mean()),
                "cv_std": float(xgb_cv_scores.std()),
            },
            "feature_importance": {qid: float(xgb_importance[i]) for i, qid in enumerate(question_ids)}
        },
        "random_forest": {
            "name": "Random Forest + SMOTE",
            "display_name": "Random Forest",
            "n_estimators": 50,
            "max_depth": 5,
            "metrics": {
                "accuracy": float(rf_accuracy),
                "f1_score": float(rf_f1),
                "cv_accuracy": float(rf_cv_scores.mean()),
                "cv_std": float(rf_cv_scores.std()),
            },
            "feature_importance": {qid: float(rf_importance[i]) for i, qid in enumerate(question_ids)}
        }
    },
    "smote_info": {
        "original_samples": int(len(y)),
        "original_at_risk": int(sum(y)),
        "synthetic_samples_created": int(synthetic_count),
        "total_after_smote": int(len(y_train_smote)),
        "k_neighbors_used": int(k_neighbors)
    },
    "questions": {},
    "factors": {
        "Academic Consistency": {
            "description": "Academic confidence, faculty support, teaching quality, institutional support",
            "weight": 0.25,
            "questions": ["q1", "q2", "q3", "q4", "q5", "q6"]
        },
        "Emotional Well-being": {
            "description": "Stress levels, social integration, family support, health, workload management",
            "weight": 0.25,
            "questions": ["q7", "q8", "q9", "q10", "q11"]
        },
        "Engagement & Motivation": {
            "description": "Course interest, motivation, extracurricular involvement, attendance, dropout consideration",
            "weight": 0.25,
            "questions": ["q12", "q13", "q14", "q15", "q16"]
        },
        "External / Financial Pressure": {
            "description": "Financial challenges, scholarships/loans, work commitments, study time, family dependents",
            "weight": 0.25,
            "questions": ["q17", "q18", "q19", "q20", "q21"]
        }
    },
    "sentiment_analysis": {
        "weight": 0.15,
        "positive_keywords": ["enjoy", "love", "excited", "happy", "confident", "motivated", "interested", "supported", "grateful", "optimistic"],
        "negative_keywords": ["stressed", "anxious", "overwhelmed", "struggling", "worried", "lonely", "isolated", "depressed", "hopeless", "frustrated", "exhausted", "tired", "failing"],
        "dropout_indicators": ["want to quit", "drop out", "give up", "can't continue", "thinking of leaving", "want to leave"],
        "academic_keywords": ["study", "class", "exam", "grade", "course", "college", "university", "professor", "assignment"]
    },
    "thresholds": {
        "low": 0.33,
        "medium": 0.66,
        "high": 0.85
    }
}

# Add question details with weights for both algorithms
question_names = {
    'q1': 'academic_confidence',
    'q2': 'faculty_help_seeking',
    'q3': 'teaching_quality',
    'q4': 'academic_support_availability',
    'q5': 'admin_support_satisfaction',
    'q6': 'counseling_frequency',
    'q7': 'stress_level',
    'q8': 'social_isolation',
    'q9': 'family_support',
    'q10': 'workload_overwhelm',
    'q11': 'health_issues',
    'q12': 'course_interest',
    'q13': 'study_motivation',
    'q14': 'extracurricular_engagement',
    'q15': 'attendance_rate',
    'q16': 'dropout_consideration',
    'q17': 'financial_problems',
    'q18': 'scholarship_loan_dependency',
    'q19': 'external_commitments',
    'q20': 'study_hours',
    'q21': 'family_dependents'
}

question_factors = {
    'q1': 'Academic Consistency', 'q2': 'Academic Consistency', 'q3': 'Academic Consistency',
    'q4': 'Academic Consistency', 'q5': 'Academic Consistency', 'q6': 'Academic Consistency',
    'q7': 'Emotional Well-being', 'q8': 'Emotional Well-being', 'q9': 'Emotional Well-being',
    'q10': 'Emotional Well-being', 'q11': 'Emotional Well-being',
    'q12': 'Engagement & Motivation', 'q13': 'Engagement & Motivation', 'q14': 'Engagement & Motivation',
    'q15': 'Engagement & Motivation', 'q16': 'Engagement & Motivation',
    'q17': 'External / Financial Pressure', 'q18': 'External / Financial Pressure',
    'q19': 'External / Financial Pressure', 'q20': 'External / Financial Pressure',
    'q21': 'External / Financial Pressure'
}

for i, qid in enumerate(question_ids):
    ml_config["questions"][qid] = {
        "name": question_names[qid],
        "factor": question_factors[qid],
        "direction": question_directions[qid],
        "xgboost_weight": float(xgb_importance[i]),
        "random_forest_weight": float(rf_importance[i])
    }

# Save to dashboard
config_path = 'dashboard-2/src/data/ml_config.json'
with open(config_path, 'w') as f:
    json.dump(ml_config, f, indent=2)
print(f"✅ Saved to {config_path}")

# ============ UPDATE SMOTE SYNTHETIC DATA ============
print("\n📁 Updating SMOTE synthetic data folder...")

smote_dir = 'SMOTE_Synthetic_Data'
os.makedirs(smote_dir, exist_ok=True)

# Save report
report = f"""SMOTE SYNTHETIC DATA REPORT (21 Questions)
==========================================
Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

ORIGINAL DATA:
- Total students: {len(y)}
- At-risk students: {sum(y)}
- Not at-risk students: {sum(y == 0)}
- Class ratio: {sum(y == 0)}:{sum(y)} (imbalanced)

SMOTE PARAMETERS:
- k_neighbors: {k_neighbors}
- random_state: 42

AFTER SMOTE:
- Total training samples: {len(y_train_smote)}
- At-risk samples: {sum(y_train_smote)}
- Synthetic samples created: {synthetic_count}

MODEL PERFORMANCE:
XGBoost:
- Test Accuracy: {xgb_accuracy:.2%}
- CV Accuracy: {xgb_cv_scores.mean():.2%} (+/- {xgb_cv_scores.std():.2%})

Random Forest:
- Test Accuracy: {rf_accuracy:.2%}
- CV Accuracy: {rf_cv_scores.mean():.2%} (+/- {rf_cv_scores.std():.2%})

QUESTIONS USED (21 total):
"""

for qid in question_ids:
    report += f"- {qid}: {question_names[qid]} ({question_factors[qid]})\n"

with open(f'{smote_dir}/SMOTE_REPORT_21Q.txt', 'w') as f:
    f.write(report)

print(f"✅ Report saved to {smote_dir}/SMOTE_REPORT_21Q.txt")

# ============ PRINT SUMMARY ============
print("\n" + "=" * 60)
print("TRAINING COMPLETE!")
print("=" * 60)
print(f"""
📊 Dataset: {len(y)} students, 21 questions
🔄 SMOTE: {synthetic_count} synthetic at-risk samples created
🚀 XGBoost: {xgb_cv_scores.mean():.1%} CV accuracy
🌲 Random Forest: {rf_cv_scores.mean():.1%} CV accuracy

Top 5 Most Important Features (XGBoost):""")

# Sort by importance
xgb_sorted = sorted(zip(question_ids, xgb_importance), key=lambda x: x[1], reverse=True)
for i, (qid, imp) in enumerate(xgb_sorted[:5]):
    print(f"  {i+1}. {question_names[qid]}: {imp:.1%}")

print("\n✅ Configuration saved to dashboard-2/src/data/ml_config.json")
print("🔄 Restart the dashboard to see changes!")
