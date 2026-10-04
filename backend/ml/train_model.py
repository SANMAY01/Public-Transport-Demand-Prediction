from pathlib import Path
import json
import joblib
import numpy as np

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from preprocessing import load_and_clean, prepare_xy, build_preprocessor


BASE = Path(__file__).resolve().parent
ARTIFACTS = BASE / "artifacts"
ARTIFACTS.mkdir(exist_ok=True)


def evaluate(model, X_test, y_test):
    predictions = model.predict(X_test)

    return {
        "MAE": round(float(mean_absolute_error(y_test, predictions)), 4),
        "RMSE": round(
            float(np.sqrt(mean_squared_error(y_test, predictions))), 4
        ),
        "R2": round(float(r2_score(y_test, predictions)), 4),
    }


def main():

    print("Loading dataset...")

    df = load_and_clean()

    print(f"Records loaded: {len(df)}")

    X, y = prepare_xy(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42
    )

    print("Preprocessing data...")

    preprocessor = build_preprocessor()

    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    models = {

        "Linear Regression":
            LinearRegression(),

        "Random Forest":
            RandomForestRegressor(
                n_estimators=250,
                random_state=42,
                n_jobs=-1
            ),

        "Gradient Boosting":
            GradientBoostingRegressor(
                n_estimators=200,
                random_state=42
            )
    }

    results = {}
    trained_models = {}

    print("\nTraining models...")

    for name, model in models.items():

        print(f"Training {name}...")

        model.fit(X_train_processed, y_train)

        results[name] = evaluate(
            model,
            X_test_processed,
            y_test
        )

        trained_models[name] = model

    # Select best model using highest R2
    best_model_name = max(
        results,
        key=lambda name: (
            results[name]["R2"],
            -results[name]["RMSE"]
        )
    )

    best_model = trained_models[best_model_name]

    # Save model
    joblib.dump(
        best_model,
        ARTIFACTS / "model.pkl"
    )

    # Save preprocessing pipeline
    joblib.dump(
        preprocessor,
        ARTIFACTS / "preprocessor.pkl"
    )

    # Save performance
    performance = {
        "best_model": best_model_name,
        "metrics": results,
        "dataset_records": int(len(df))
    }

    with open(
        ARTIFACTS / "model_performance.json",
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            performance,
            f,
            indent=2
        )

    # Save feature importance for tree models
    if hasattr(best_model, "feature_importances_"):

        feature_names = preprocessor.get_feature_names_out()

        importance = {
            str(name): round(float(value), 6)
            for name, value in sorted(
                zip(
                    feature_names,
                    best_model.feature_importances_
                ),
                key=lambda x: -x[1]
            )
        }

        with open(
            ARTIFACTS / "feature_importance.json",
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                importance,
                f,
                indent=2
            )

    print("\n==============================")
    print("MODEL PERFORMANCE")
    print("==============================")

    for name, metrics in results.items():

        print(
            f"{name}: "
            f"MAE={metrics['MAE']}, "
            f"RMSE={metrics['RMSE']}, "
            f"R2={metrics['R2']}"
        )

    print("==============================")

    print(f"\nBest model: {best_model_name}")

    print(
        f"Artifacts saved in: {ARTIFACTS}"
    )


if __name__ == "__main__":
    main()