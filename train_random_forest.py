"""
🌲 RANDOM FOREST CLASSIFIER FOR STUDENT DROPOUT PREDICTION
============================================================

This script trains a Random Forest model on your survey responses
and exports it for use in the website dashboard.

HOW RANDOM FOREST WORKS:
------------------------
1. It creates multiple "decision trees" (like a forest of trees)
2. Each tree learns different patterns from the data
3. When predicting, ALL trees vote on the outcome
4. The majority vote wins (ensemble learning)

WHY RANDOM FOREST IS GOOD FOR THIS:
-----------------------------------
- Handles both categorical and numerical data well
- Doesn't require data normalization
- Provides "feature importance" (which questions matter most)
- Resistant to overfitting
- Works well with small datasets

THE 12 QUESTIONS → PREDICTION FLOW:
------------------------------------
Student answers 12 questions (1-5 scale)
        ↓
Random Forest processes all 12 features
        ↓
50 decision trees each make a prediction
        ↓
Majority vote determines: "At Risk" or "Not At Risk"
        ↓
Confidence = percentage of trees agreeing
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import json
import os

print("=" * 60)
print("🌲 RANDOM FOREST TRAINING FOR DROPOUT PREDICTION")
print("=" * 60)

# ============================================
# STEP 1: Load the CSV Data
# ============================================
print("\n📂 STEP 1: Loading your survey data...")

csv_path = "Responses CSV FIle.csv"
df = pd.read_csv(csv_path)

print(f"✓ Loaded {len(df)} student responses")
print(f"✓ Found {len(df.columns)} columns")

# Show column names (cleaned)
df.columns = df.columns.str.strip()
print("\nAvailable columns:")
for i, col in enumerate(df.columns[:15], 1):
    print(f"  {i}. {col[:50]}...")

# ============================================
# STEP 2: Create the Target Variable (Dropout Risk)
# ============================================
print("\n🎯 STEP 2: Creating target variable (Dropout Risk)...")

# Find the dropout intention column
dropout_col = None
for col in df.columns:
    if 'drop' in col.lower() and 'consider' in col.lower():
        dropout_col = col
        break

if dropout_col:
    print(f"✓ Found dropout column: '{dropout_col[:40]}...'")
    print(f"\nUnique values:")
    print(df[dropout_col].value_counts())
else:
    print("⚠ Could not find dropout column, searching alternatives...")
    for col in df.columns:
        if 'drop' in col.lower():
            print(f"  Found: {col}")

# Create binary target: 1 = At Risk, 0 = Not At Risk
def classify_risk(value):
    if pd.isna(value):
        return 0
    value = str(value).lower().strip()
    # "Yes", "Maybe", "Already dropped" = At Risk
    if any(x in value for x in ['yes', 'maybe', 'already', 'consider']):
        return 1
    return 0

df['target'] = df[dropout_col].apply(classify_risk)

print(f"\n📊 Target Distribution:")
print(f"   Not At Risk (0): {(df['target'] == 0).sum()} students")
print(f"   At Risk (1):     {(df['target'] == 1).sum()} students")

# ============================================
# STEP 3: Map CSV Columns to 12 Questions
# ============================================
print("\n🔗 STEP 3: Mapping CSV columns to 12 website questions...")

# Mapping CSV columns to our 12 questions
column_mapping = {
    'q1': 'Interest in the Course',                    # Course interest (positive)
    'q2': 'Motivation to Continue Studies',            # Motivation (positive)
    'q3': 'How confident are you in understanding engineering subjects this semester?',  # Confidence (positive)
    'q4': 'Level of Stress or Anxiety Related to Studies',  # Stress (negative)
    'q5': 'Do financial problems affect your studies?',     # Financial impact (negative)
    'q6': 'Family Support for Education',              # Family support (positive)
    'q7': 'Quality of Teaching and Learning Resources', # Institutional support (positive)
    'q8': 'Do you feel socially isolated or left out in college?',  # Social isolation (negative)
    'q9': 'Do you have a part-time job or other major commitments?', # External commitments (negative)
    'q10': 'Attendance Rate',                          # Attendance (positive)
    'q11': 'Do you engage in extracurricular or sports activities?', # Extracurricular (positive)
    'q12': None  # Direct dropout consideration (we use this as target)
}

# Question metadata
question_meta = {
    'q1': {'name': 'course_interest', 'direction': 'positive'},
    'q2': {'name': 'motivation', 'direction': 'positive'},
    'q3': {'name': 'academic_confidence', 'direction': 'positive'},
    'q4': {'name': 'stress_level', 'direction': 'negative'},
    'q5': {'name': 'financial_impact', 'direction': 'negative'},
    'q6': {'name': 'family_support', 'direction': 'positive'},
    'q7': {'name': 'institutional_support', 'direction': 'positive'},
    'q8': {'name': 'social_isolation', 'direction': 'negative'},
    'q9': {'name': 'external_commitments', 'direction': 'negative'},
    'q10': {'name': 'attendance', 'direction': 'positive'},
    'q11': {'name': 'extracurricular', 'direction': 'positive'},
}

# ============================================
# STEP 4: Encode Features to 1-5 Scale
# ============================================
print("\n🔢 STEP 4: Encoding all features to 1-5 scale...")

def find_column(df, search_term):
    """Find column containing search term"""
    for col in df.columns:
        if search_term.lower() in col.lower():
            return col
    return None

def encode_to_scale(value, mapping=None):
    """Convert various formats to 1-5 scale"""
    if pd.isna(value):
        return 3  # Default to middle
    
    value = str(value).strip()
    
    # Already numeric 1-5
    try:
        num = float(value)
        if 1 <= num <= 5:
            return int(num)
    except:
        pass
    
    # Common text mappings
    text_mappings = {
        # Frequency
        'never': 1, 'rarely': 2, 'sometimes': 3, 'often': 4, 'always': 5,
        'none': 1,
        # Yes/No
        'no': 1, 'yes': 5,
        # Attendance
        '90-100%': 5, '80-89%': 4, '70-79%': 3, '60-69%': 2, 'below 60%': 1,
        'above 90%': 5,
        # Agreement
        'strongly disagree': 1, 'disagree': 2, 'neutral': 3, 'agree': 4, 'strongly agree': 5,
    }
    
    value_lower = value.lower()
    for key, score in text_mappings.items():
        if key in value_lower:
            return score
    
    # Custom mapping provided
    if mapping and value in mapping:
        return mapping[value]
    
    return 3  # Default

# Build feature matrix
X = pd.DataFrame()

for q_id, csv_col in column_mapping.items():
    if csv_col is None:
        continue
    
    matched_col = find_column(df, csv_col.split()[0] if len(csv_col.split()) > 0 else csv_col)
    
    if matched_col:
        X[q_id] = df[matched_col].apply(encode_to_scale)
        print(f"  ✓ {q_id}: Mapped '{matched_col[:35]}...'")
    else:
        X[q_id] = 3  # Default if not found
        print(f"  ⚠ {q_id}: Column not found, using default")

# Fill any missing values
X = X.fillna(3)

y = df['target']

print(f"\n✓ Feature matrix shape: {X.shape}")
print(f"✓ Features: {list(X.columns)}")

# ============================================
# STEP 5: Train Random Forest Model
# ============================================
print("\n🌲 STEP 5: Training Random Forest Classifier...")
print("-" * 40)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

# Create and train the model
model = RandomForestClassifier(
    n_estimators=50,      # 50 decision trees
    max_depth=5,          # Limit depth to prevent overfitting
    min_samples_split=5,  # Minimum samples to split a node
    min_samples_leaf=2,   # Minimum samples in leaf
    random_state=42,
    class_weight='balanced'  # Handle imbalanced classes
)

model.fit(X_train, y_train)
print("✓ Model trained successfully!")

# ============================================
# STEP 6: Evaluate Model Performance
# ============================================
print("\n📊 STEP 6: Evaluating Model Performance...")
print("-" * 40)

# Predictions
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"\n🎯 ACCURACY: {accuracy:.1%}")

# Cross-validation
cv_scores = cross_val_score(model, X, y, cv=5)
print(f"📈 Cross-Validation: {cv_scores.mean():.1%} (±{cv_scores.std()*2:.1%})")

# Classification Report
print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Not At Risk', 'At Risk']))

# Confusion Matrix
print("📊 Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
print(f"   Predicted:  Not Risk | At Risk")
print(f"   Actual Not:    {cm[0,0]:3d}   |   {cm[0,1]:3d}")
print(f"   Actual At:     {cm[1,0]:3d}   |   {cm[1,1]:3d}")

# ============================================
# STEP 7: Feature Importance (What Matters Most)
# ============================================
print("\n⭐ STEP 7: Feature Importance (Which questions predict dropout best?)")
print("-" * 40)

feature_importance = pd.DataFrame({
    'Question': X.columns,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

print("\nRANKED BY IMPORTANCE:")
for idx, row in feature_importance.iterrows():
    q_id = row['Question']
    importance = row['Importance']
    meta = question_meta.get(q_id, {})
    name = meta.get('name', q_id)
    direction = meta.get('direction', 'unknown')
    bar = '█' * int(importance * 50)
    print(f"  {q_id}: {name:25s} [{direction:8s}] {importance:.3f} {bar}")

# ============================================
# STEP 8: Export Model Config for Website
# ============================================
print("\n💾 STEP 8: Exporting model configuration for website...")
print("-" * 40)

# Normalize feature importances to sum to 1
importances = model.feature_importances_
importances_normalized = importances / importances.sum()

# Create config
ml_config = {
    "version": "2.0",
    "model_type": "random_forest",
    "trained_on": "Responses CSV File.csv",
    "training_samples": len(X_train),
    "test_samples": len(X_test),
    "accuracy": round(accuracy, 4),
    "cross_validation_score": round(cv_scores.mean(), 4),
    "n_estimators": 50,
    "description": "Random Forest trained on engineering student survey responses for dropout prediction",
    "baseline_risk": round((y == 1).mean(), 4),  # Base rate of at-risk students
    "questions": {},
    "factors": {
        "Engagement & Motivation": {"questions": ["q1", "q2"], "weight": 0.25},
        "Academic Consistency": {"questions": ["q3", "q7", "q10"], "weight": 0.25},
        "Emotional Well-being": {"questions": ["q4", "q6", "q8"], "weight": 0.25},
        "External / Financial Pressure": {"questions": ["q5", "q9", "q11"], "weight": 0.25}
    },
    "sentiment_analysis": {
        "weight": 0.15,
        "positive_keywords": [
            "excited", "happy", "confident", "supported", "engaged", "motivated",
            "enjoy", "good", "great", "excellent", "wonderful", "grateful",
            "thriving", "successful", "proud", "optimistic", "hopeful", "passionate",
            "interested", "love", "amazing", "comfortable", "satisfied", "strong"
        ],
        "negative_keywords": [
            "stressed", "anxious", "overwhelmed", "depressed", "hopeless", "struggling",
            "isolated", "lonely", "exhausted", "difficult", "hard", "worried",
            "failing", "lost", "confused", "frustrated", "burnout", "dropout",
            "quit", "leave", "hate", "boring", "useless", "terrible", "scared",
            "pressure", "burden", "stuck", "trapped", "helpless", "miserable"
        ],
        "academic_keywords": [
            "academic", "course", "class", "study", "studies", "assignment",
            "exam", "test", "grade", "performance", "learning", "lecture",
            "professor", "faculty", "college", "university", "semester", "subject"
        ],
        "dropout_indicators": [
            "want to quit", "thinking of leaving", "dropping out", "can't continue",
            "giving up", "no point", "waste of time", "wrong choice", "hate college",
            "want to stop", "considering leaving", "might drop", "should quit"
        ]
    }
}

# Add question weights from Random Forest
for i, q_id in enumerate(X.columns):
    meta = question_meta.get(q_id, {})
    ml_config["questions"][q_id] = {
        "name": meta.get('name', q_id),
        "direction": meta.get('direction', 'positive'),
        "weight": round(float(importances_normalized[i]), 4),
        "raw_importance": round(float(importances[i]), 4),
        "description": f"Question {i+1}"
    }

# Save to JSON
output_path = "dashboard-2/src/data/ml_config.json"
with open(output_path, 'w') as f:
    json.dump(ml_config, f, indent=2)

print(f"✓ Saved to: {output_path}")

# ============================================
# STEP 9: Test Prediction Examples
# ============================================
print("\n🧪 STEP 9: Testing Predictions with Examples...")
print("-" * 40)

# Example 1: High-risk student
high_risk_student = {
    'q1': 2,   # Low interest
    'q2': 2,   # Low motivation
    'q3': 2,   # Low confidence
    'q4': 5,   # High stress
    'q5': 4,   # Financial problems
    'q6': 2,   # Low family support
    'q7': 2,   # Low institutional support
    'q8': 4,   # Feels isolated
    'q9': 4,   # External commitments
    'q10': 2,  # Poor attendance
    'q11': 1   # No extracurricular
}

# Example 2: Low-risk student
low_risk_student = {
    'q1': 5,   # High interest
    'q2': 5,   # High motivation
    'q3': 4,   # Good confidence
    'q4': 2,   # Low stress
    'q5': 1,   # No financial problems
    'q6': 5,   # Strong family support
    'q7': 4,   # Good institutional support
    'q8': 1,   # Not isolated
    'q9': 1,   # No external commitments
    'q10': 5,  # Good attendance
    'q11': 4   # Active in extracurricular
}

def predict_student(student_data, name):
    X_student = pd.DataFrame([student_data])
    prediction = model.predict(X_student)[0]
    probability = model.predict_proba(X_student)[0]
    
    status = "🔴 AT RISK" if prediction == 1 else "🟢 NOT AT RISK"
    confidence = max(probability) * 100
    risk_prob = probability[1] * 100
    
    print(f"\n{name}:")
    print(f"  Prediction: {status}")
    print(f"  Dropout Risk: {risk_prob:.1f}%")
    print(f"  Confidence: {confidence:.1f}%")

predict_student(high_risk_student, "Example 1: Struggling Student")
predict_student(low_risk_student, "Example 2: Thriving Student")

# ============================================
# SUMMARY
# ============================================
print("\n" + "=" * 60)
print("✅ TRAINING COMPLETE!")
print("=" * 60)
print(f"""
📊 Model Summary:
   • Algorithm: Random Forest Classifier
   • Trees: 50 decision trees
   • Accuracy: {accuracy:.1%}
   • Cross-Validation: {cv_scores.mean():.1%}

🎯 Top 3 Predictive Factors:
""")
for idx, row in feature_importance.head(3).iterrows():
    q_id = row['Question']
    meta = question_meta.get(q_id, {})
    print(f"   {row['Question']}: {meta.get('name', q_id)} ({row['Importance']:.1%})")

print(f"""
📁 Output:
   • Config saved to: {output_path}
   • Ready for website integration!

🔄 How it works in the website:
   1. Student answers 12 questions (1-5 scale)
   2. Answers are fed to the trained weights
   3. Each answer is weighted by importance
   4. Risk score = weighted sum of answers
   5. Prediction: Low/Medium/High Risk
""")
