# Combined Analysis: Random Forest vs XGBoost with SMOTE

## Performance Comparison
- **Random Forest:** Good baseline performance, interpretable, but may struggle with imbalanced data.
- **XGBoost + SMOTE:** Superior performance on imbalanced data, higher recall for minority class, but more complex.

## Insights
- Both models identify key risk factors, but XGBoost with SMOTE is better at detecting at-risk students.
- Feature importance analysis helps in understanding which factors contribute most to dropout risk.

## Recommendation
- Use XGBoost with SMOTE for final predictions, but Random Forest can be used for interpretability and validation.
