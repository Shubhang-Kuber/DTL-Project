# Working of XGBoost with SMOTE

XGBoost is a powerful gradient boosting algorithm. SMOTE (Synthetic Minority Over-sampling Technique) is used to balance the dataset by generating synthetic samples for the minority class.

## Steps Involved
1. **Data Balancing:** SMOTE is applied to the training data to address class imbalance.
2. **Model Training:** XGBoost is trained on the balanced dataset, optimizing for accuracy and recall.
3. **Prediction:** The trained model predicts dropout risk for new data.
4. **Evaluation:** Performance is measured using metrics like accuracy, precision, recall, and F1-score.

## Advantages
- Handles imbalanced datasets effectively
- High predictive performance
- Robust to overfitting
