# Phase 2 ML

From the existing backend folder with venv active:

`pip install -r ml/requirements-phase2.txt`

`python ml/generate_dataset.py`

`python ml/train_model.py`

`python ml/predict.py`

The included CSV has 6,000 realistic records. Training compares Linear Regression, Random Forest and Gradient Boosting using MAE, RMSE and R2.
