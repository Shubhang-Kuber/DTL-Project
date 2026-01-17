"""
🚀 SMOTE + XGBOOST CLASSIFIER FOR STUDENT DROPOUT PREDICTION
=============================================================

This script trains an XGBoost model with SMOTE balancing for improved
at-risk student detection.

WHAT THIS SCRIPT DOES:
----------------------
1. Loads the survey responses (40 students)
2. Applies SMOTE to balance classes (creates synthetic at-risk samples)
3. Saves synthetic data to a folder (for demonstration purposes)
4. Trains XGBoost on the balanced data
5. Compares performance with Random Forest
6. Exports weights to ml_config.json for website use

WHY SMOTE + XGBOOST:
--------------------
- SMOTE: Creates synthetic at-risk samples to balance 36:4 → 36:36
- XGBoost: Sequential learning that focuses on correcting mistakes
- Together: Much better at detecting at-risk students!

SMOTE EXPLAINED:
----------------
SMOTE (Synthetic Minority Over-sampling Technique) creates new synthetic
samples by interpolating between existing minority class samples.

Example:
  Real At-Risk A: [2, 5, 4]
  Real At-Risk B: [3, 4, 5]
  Synthetic:      [2.5, 4.5, 4.5]  ← Point between A and B
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.ensemble import RandomForestClassifier
import json
import os
from datetime import datetime

# Try to import SMOTE and XGBoost
try:
    from imblearn.over_sampling import SMOTE
    print("✓ SMOTE (imbalanced-learn) imported successfully")
except ImportError:
    print("❌ Please install imbalanced-learn: pip install imbalanced-learn")
    exit(1)

try:
    from xgboost import XGBClassifier
    print("✓ XGBoost imported successfully")
except ImportError:
    print("❌ Please install xgboost: pip install xgboost")
    exit(1)

print("\n" + "=" * 70)
print("🚀 SMOTE + XGBOOST TRAINING FOR DROPOUT PREDICTION")
print("=" * 70)

# ============================================
# STEP 1: Load the CSV Data
# ============================================
print("\n📂 STEP 1: Loading your survey data...")

csv_path = "Responses CSV FIle.csv"
df = pd.read_csv(csv_path)

print(f"✓ Loaded {len(df)} student responses")
print(f"✓ Found {len(df.columns)} columns")

# Clean column names
df.columns = df.columns.str.strip()

# ============================================
# STEP 2: Create the Target Variable
# ============================================
print("\n🎯 STEP 2: Creating target variable (Dropout Risk)...")

# Find the dropout intention column
dropout_col = None
for col in df.columns:
    if 'drop' in col.lower() and 'consider' in col.lower():
        dropout_col = col
        break

if dropout_col:
    print(f"✓ Found dropout column: '{dropout_col[:50]}...'")
else:
    print("❌ Could not find dropout column!")
    exit(1)

# Create binary target
def classify_risk(value):
    if pd.isna(value):
        return 0
    value = str(value).lower().strip()
    if any(x in value for x in ['yes', 'maybe', 'already', 'consider']):
        return 1
    return 0

df['target'] = df[dropout_col].apply(classify_risk)

not_at_risk = (df['target'] == 0).sum()
at_risk = (df['target'] == 1).sum()

print(f"\n📊 ORIGINAL Target Distribution:")
print(f"   Not At Risk (0): {not_at_risk} students")
print(f"   At Risk (1):     {at_risk} students")
print(f"   Imbalance Ratio: {not_at_risk}:{at_risk} = {not_at_risk/at_risk:.1f}:1")

# ============================================
# STEP 3: Prepare Features
# ============================================
print("\n🔗 STEP 3: Preparing features...")

column_mapping = {
    'q1': 'Interest in the Course',
    'q2': 'Motivation to Continue Studies',
    'q3': 'How confident are you in understanding engineering subjects this semester?',
    'q4': 'Level of Stress or Anxiety Related to Studies',
    'q5': 'Do financial problems affect your studies?',
    'q6': 'Family Support for Education',
    'q7': 'Quality of Teaching and Learning Resources',
    'q8': 'Do you feel socially isolated or left out in college?',
    'q9': 'Do you have a part-time job or other major commitments?',
    'q10': 'Attendance Rate',
    'q11': 'Do you engage in extracurricular or sports activities?',
}

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

def find_column(df, search_term):
    for col in df.columns:
        if search_term.lower() in col.lower():
            return col
    return None

def encode_to_scale(value, mapping=None):
    if pd.isna(value):
        return 3
    value = str(value).strip()
    try:
        num = float(value)
        if 1 <= num <= 5:
            return int(num)
    except:
        pass
    
    text_mappings = {
        'never': 1, 'rarely': 2, 'sometimes': 3, 'often': 4, 'always': 5,
        'none': 1, 'no': 1, 'yes': 5,
        '90-100%': 5, '80-89%': 4, '70-79%': 3, '60-69%': 2, 'below 60%': 1,
        'above 90%': 5,
        'strongly disagree': 1, 'disagree': 2, 'neutral': 3, 'agree': 4, 'strongly agree': 5,
    }
    
    value_lower = value.lower()
    for key, score in text_mappings.items():
        if key in value_lower:
            return score
    return 3

# Build feature matrix
X = pd.DataFrame()
feature_names = []

for q_id, csv_col in column_mapping.items():
    matched_col = find_column(df, csv_col.split()[0] if len(csv_col.split()) > 0 else csv_col)
    
    if matched_col:
        X[q_id] = df[matched_col].apply(encode_to_scale)
        feature_names.append(q_id)
        print(f"  ✓ {q_id}: Mapped to '{matched_col[:40]}...'")
    else:
        X[q_id] = 3
        feature_names.append(q_id)
        print(f"  ⚠ {q_id}: Not found, using default (3)")

y = df['target']

print(f"\n✓ Feature matrix shape: {X.shape}")
print(f"✓ Features: {feature_names}")

# ============================================
# STEP 4: Apply SMOTE
# ============================================
print("\n🔄 STEP 4: Applying SMOTE to balance classes...")

print(f"\nBEFORE SMOTE:")
print(f"  Not At Risk: {(y == 0).sum()} samples")
print(f"  At Risk:     {(y == 1).sum()} samples")

# Apply SMOTE
smote = SMOTE(random_state=42, k_neighbors=min(3, at_risk-1))
X_resampled, y_resampled = smote.fit_resample(X, y)

print(f"\nAFTER SMOTE:")
print(f"  Not At Risk: {(y_resampled == 0).sum()} samples")
print(f"  At Risk:     {(y_resampled == 1).sum()} samples")
print(f"  Synthetic At-Risk samples created: {(y_resampled == 1).sum() - at_risk}")

# ============================================
# STEP 5: Save Synthetic Data (For Teacher Demo)
# ============================================
print("\n💾 STEP 5: Saving synthetic data for demonstration...")

# Create folder for SMOTE data
smote_folder = "SMOTE_Synthetic_Data"
os.makedirs(smote_folder, exist_ok=True)

# Create DataFrame with resampled data
X_resampled_df = pd.DataFrame(X_resampled, columns=feature_names)
X_resampled_df['target'] = y_resampled
X_resampled_df['is_synthetic'] = ['Original' if i < len(X) else 'Synthetic (SMOTE)' 
                                   for i in range(len(X_resampled_df))]

# Save full balanced dataset
balanced_path = os.path.join(smote_folder, "balanced_dataset_with_smote.csv")
X_resampled_df.to_csv(balanced_path, index=False)
print(f"  ✓ Saved balanced dataset: {balanced_path}")

# Save only synthetic samples
synthetic_samples = X_resampled_df[X_resampled_df['is_synthetic'] == 'Synthetic (SMOTE)']
synthetic_path = os.path.join(smote_folder, "synthetic_at_risk_samples.csv")
synthetic_samples.to_csv(synthetic_path, index=False)
print(f"  ✓ Saved synthetic samples only: {synthetic_path}")

# Save original data for comparison
original_df = X.copy()
original_df['target'] = y
original_df['is_synthetic'] = 'Original'
original_path = os.path.join(smote_folder, "original_data.csv")
original_df.to_csv(original_path, index=False)
print(f"  ✓ Saved original data: {original_path}")

# Create a summary report
summary_report = f"""
SMOTE SYNTHETIC DATA GENERATION REPORT
======================================
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

ORIGINAL DATA:
- Total students: {len(X)}
- Not At Risk: {(y == 0).sum()}
- At Risk: {(y == 1).sum()}
- Imbalance Ratio: {(y == 0).sum()}:{(y == 1).sum()}

AFTER SMOTE:
- Total samples: {len(X_resampled)}
- Not At Risk: {(y_resampled == 0).sum()}
- At Risk: {(y_resampled == 1).sum()}
- Synthetic samples created: {(y_resampled == 1).sum() - (y == 1).sum()}

HOW SMOTE WORKS:
1. Takes existing at-risk students
2. Finds their nearest neighbors (similar students)
3. Creates new points along the line between them
4. These synthetic points have realistic at-risk patterns

FILES GENERATED:
1. original_data.csv - Your original 40 student responses
2. synthetic_at_risk_samples.csv - Only the SMOTE-generated samples
3. balanced_dataset_with_smote.csv - Combined dataset for training
"""

report_path = os.path.join(smote_folder, "SMOTE_REPORT.txt")
with open(report_path, 'w') as f:
    f.write(summary_report)
print(f"  ✓ Saved SMOTE report: {report_path}")

# ============================================
# STEP 6: Train/Test Split (Using Original for Testing!)
# ============================================
print("\n📊 STEP 6: Preparing train/test split...")

# IMPORTANT: Test on ORIGINAL data only (not synthetic)
# Use smaller test size due to limited at-risk samples
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, stratify=y
)

# Count at-risk in training set
at_risk_train = (y_train == 1).sum()
print(f"  At-risk samples in training: {at_risk_train}")

# Train on SMOTE-balanced data with adjusted k_neighbors
smote_train = SMOTE(random_state=42, k_neighbors=min(2, at_risk_train-1) if at_risk_train > 1 else 1)
X_train_smote, y_train_smote = smote_train.fit_resample(X_train, y_train)

print(f"  Training set (with SMOTE): {len(X_train_smote)} samples")
print(f"  Test set (original only): {len(X_test)} samples")

# ============================================
# STEP 7: Train XGBoost
# ============================================
print("\n🚀 STEP 7: Training XGBoost model...")

xgb_model = XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss',
    scale_pos_weight=1  # Already balanced with SMOTE
)

xgb_model.fit(X_train_smote, y_train_smote)
print("✓ XGBoost model trained!")

# ============================================
# STEP 8: Train Random Forest (for comparison)
# ============================================
print("\n🌲 STEP 8: Training Random Forest (for comparison)...")

rf_model = RandomForestClassifier(
    n_estimators=50,
    max_depth=5,
    random_state=42,
    class_weight='balanced'
)

rf_model.fit(X_train_smote, y_train_smote)
print("✓ Random Forest model trained!")

# ============================================
# STEP 9: Evaluate Both Models
# ============================================
print("\n📈 STEP 9: Evaluating models...")

# Predictions
y_pred_xgb = xgb_model.predict(X_test)
y_pred_rf = rf_model.predict(X_test)

# XGBoost Metrics
xgb_accuracy = accuracy_score(y_test, y_pred_xgb)
xgb_f1 = f1_score(y_test, y_pred_xgb, zero_division=0)
xgb_cm = confusion_matrix(y_test, y_pred_xgb)

# Random Forest Metrics  
rf_accuracy = accuracy_score(y_test, y_pred_rf)
rf_f1 = f1_score(y_test, y_pred_rf, zero_division=0)
rf_cm = confusion_matrix(y_test, y_pred_rf)

print("\n" + "=" * 50)
print("📊 MODEL COMPARISON")
print("=" * 50)

print(f"\n🚀 XGBOOST (with SMOTE):")
print(f"   Accuracy: {xgb_accuracy:.1%}")
print(f"   F1-Score: {xgb_f1:.3f}")
print(f"   Confusion Matrix:")
print(f"   {xgb_cm}")

print(f"\n🌲 RANDOM FOREST (with SMOTE):")
print(f"   Accuracy: {rf_accuracy:.1%}")
print(f"   F1-Score: {rf_f1:.3f}")
print(f"   Confusion Matrix:")
print(f"   {rf_cm}")

# Cross-validation
print("\n🔄 Cross-Validation (5-fold):")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

xgb_cv_scores = cross_val_score(xgb_model, X_resampled, y_resampled, cv=cv, scoring='accuracy')
rf_cv_scores = cross_val_score(rf_model, X_resampled, y_resampled, cv=cv, scoring='accuracy')

print(f"   XGBoost CV Accuracy: {xgb_cv_scores.mean():.1%} ± {xgb_cv_scores.std():.1%}")
print(f"   Random Forest CV Accuracy: {rf_cv_scores.mean():.1%} ± {rf_cv_scores.std():.1%}")

# ============================================
# STEP 10: Extract Feature Importance
# ============================================
print("\n🎯 STEP 10: Extracting feature importance...")

xgb_importance = xgb_model.feature_importances_
rf_importance = rf_model.feature_importances_

print("\n📊 Feature Importance Comparison:")
print("-" * 60)
print(f"{'Feature':<25} {'XGBoost':<15} {'Random Forest':<15}")
print("-" * 60)

for i, q_id in enumerate(feature_names):
    name = question_meta[q_id]['name']
    print(f"{name:<25} {xgb_importance[i]:.4f}         {rf_importance[i]:.4f}")

# ============================================
# STEP 11: Export to ml_config.json
# ============================================
print("\n💾 STEP 11: Exporting model weights to ml_config.json...")

# Build config with BOTH models
config = {
    "version": "3.0",
    "description": "Dual model support: XGBoost (SMOTE) and Random Forest",
    "trained_on": "Responses CSV File.csv",
    "smote_applied": True,
    "training_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    
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
                "confusion_matrix": {
                    "true_negatives": int(xgb_cm[0][0]) if len(xgb_cm) > 1 else int(xgb_cm[0][0]),
                    "false_positives": int(xgb_cm[0][1]) if len(xgb_cm) > 1 and len(xgb_cm[0]) > 1 else 0,
                    "false_negatives": int(xgb_cm[1][0]) if len(xgb_cm) > 1 else 0,
                    "true_positives": int(xgb_cm[1][1]) if len(xgb_cm) > 1 and len(xgb_cm[1]) > 1 else 0
                }
            },
            "feature_importance": {}
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
                "confusion_matrix": {
                    "true_negatives": int(rf_cm[0][0]) if len(rf_cm) > 1 else int(rf_cm[0][0]),
                    "false_positives": int(rf_cm[0][1]) if len(rf_cm) > 1 and len(rf_cm[0]) > 1 else 0,
                    "false_negatives": int(rf_cm[1][0]) if len(rf_cm) > 1 else 0,
                    "true_positives": int(rf_cm[1][1]) if len(rf_cm) > 1 and len(rf_cm[1]) > 1 else 0
                }
            },
            "feature_importance": {}
        }
    },
    
    "questions": {},
    
    "factors": {
        "Engagement & Motivation": {
            "questions": ["q1", "q2"],
            "weight": 0.25
        },
        "Academic Consistency": {
            "questions": ["q3", "q7", "q10"],
            "weight": 0.25
        },
        "Emotional Well-being": {
            "questions": ["q4", "q6", "q8"],
            "weight": 0.25
        },
        "External / Financial Pressure": {
            "questions": ["q5", "q9", "q11"],
            "weight": 0.25
        }
    },
    
    "sentiment_analysis": {
        "weight": 0.15,
        "positive_keywords": [
            "excited", "happy", "confident", "supported", "engaged", "motivated",
            "enjoy", "good", "great", "excellent", "wonderful", "grateful", "thriving",
            "successful", "proud", "optimistic", "hopeful", "passionate", "interested",
            "love", "amazing", "comfortable", "satisfied", "strong"
        ],
        "negative_keywords": [
            "stressed", "anxious", "overwhelmed", "depressed", "hopeless", "struggling",
            "isolated", "lonely", "exhausted", "difficult", "hard", "worried", "failing",
            "lost", "confused", "frustrated", "burnout", "dropout", "quit", "leave",
            "hate", "boring", "useless", "terrible", "scared", "pressure", "burden",
            "stuck", "trapped", "helpless", "miserable"
        ],
        "academic_keywords": [
            "academic", "course", "class", "study", "studies", "assignment", "exam",
            "test", "grade", "performance", "learning", "lecture", "professor", "faculty",
            "college", "university", "semester", "subject"
        ],
        "dropout_indicators": [
            "want to quit", "thinking of leaving", "dropping out", "can't continue",
            "giving up", "no point", "waste of time", "wrong choice", "hate college",
            "want to stop", "considering leaving", "might drop", "should quit"
        ]
    },
    
    "thresholds": {
        "low": 0.33,
        "medium": 0.66,
        "high": 1.0
    },
    
    "smote_info": {
        "original_samples": int(len(X)),
        "original_at_risk": int((y == 1).sum()),
        "synthetic_samples_created": int((y_resampled == 1).sum() - (y == 1).sum()),
        "total_after_smote": int(len(X_resampled))
    }
}

# Add feature importance for both models
for i, q_id in enumerate(feature_names):
    meta = question_meta[q_id]
    
    config["questions"][q_id] = {
        "name": meta['name'],
        "direction": meta['direction'],
        "xgboost_weight": float(xgb_importance[i]),
        "random_forest_weight": float(rf_importance[i]),
        "description": f"Question {i+1}"
    }
    
    config["models"]["xgboost"]["feature_importance"][q_id] = float(xgb_importance[i])
    config["models"]["random_forest"]["feature_importance"][q_id] = float(rf_importance[i])

# Save config
config_path = "dashboard-2/src/data/ml_config.json"
with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)
print(f"✓ Saved model config: {config_path}")

# ============================================
# FINAL SUMMARY
# ============================================
print("\n" + "=" * 70)
print("🎉 TRAINING COMPLETE!")
print("=" * 70)

print(f"""
📁 FILES CREATED:
   
   SMOTE Data (for teacher demo):
   ├── {smote_folder}/original_data.csv
   ├── {smote_folder}/synthetic_at_risk_samples.csv
   ├── {smote_folder}/balanced_dataset_with_smote.csv
   └── {smote_folder}/SMOTE_REPORT.txt
   
   Model Config:
   └── {config_path}

📊 MODEL PERFORMANCE:
   
   XGBoost (Recommended):
   ├── Accuracy: {xgb_accuracy:.1%}
   ├── F1-Score: {xgb_f1:.3f}
   └── CV Accuracy: {xgb_cv_scores.mean():.1%} ± {xgb_cv_scores.std():.1%}
   
   Random Forest:
   ├── Accuracy: {rf_accuracy:.1%}
   ├── F1-Score: {rf_f1:.3f}
   └── CV Accuracy: {rf_cv_scores.mean():.1%} ± {rf_cv_scores.std():.1%}

🚀 NEXT STEPS:
   1. The website now supports both algorithms
   2. Users can choose XGBoost or Random Forest
   3. Both visualizers are available in detailed analysis
""")
