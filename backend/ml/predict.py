from pathlib import Path

import joblib
import pandas as pd


BASE = Path(__file__).resolve().parent

ARTIFACTS = BASE / "artifacts"


def load_artifacts():

    model = joblib.load(
        ARTIFACTS / "model.pkl"
    )

    preprocessor = joblib.load(
        ARTIFACTS / "preprocessor.pkl"
    )

    return model, preprocessor


def predict_demand(data):

    model, preprocessor = load_artifacts()

    df = pd.DataFrame([data])

    df["date"] = pd.to_datetime(
        df["date"]
    )

    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day

    features = [
        "hour",
        "temperature",
        "humidity",
        "holiday",
        "weekend",
        "previous_demand",
        "day_of_week",
        "month",
        "day",
        "route",
        "weather"
    ]

    transformed = preprocessor.transform(
        df[features]
    )

    prediction = model.predict(
        transformed
    )[0]

    return float(prediction)


if __name__ == "__main__":

    sample_data = {

        "date": "2026-09-07",

        "hour": 8,

        "route": "Route 1",

        "weather": "Sunny",

        "temperature": 28,

        "humidity": 60,

        "holiday": 0,

        "weekend": 0,

        "previous_demand": 120
    }

    prediction = predict_demand(
        sample_data
    )

    print("==============================")
    print("PUBLIC TRANSPORT DEMAND")
    print("==============================")

    print(
        f"Predicted passenger demand: "
        f"{prediction:.2f}"
    )

    print("==============================")