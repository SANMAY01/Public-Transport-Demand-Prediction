from pathlib import Path

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler


BASE = Path(__file__).resolve().parent

DATASET = (
    BASE.parents[1]
    / "dataset"
    / "transport_demand.csv"
)

TARGET = "passenger_demand"

NUMERIC_FEATURES = [
    "hour",
    "temperature",
    "humidity",
    "holiday",
    "weekend",
    "previous_demand"
]

CATEGORICAL_FEATURES = [
    "route",
    "weather"
]


def load_and_clean(path=DATASET):

    df = pd.read_csv(path)

    # Convert date column
    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce"
    )

    # Remove invalid rows
    df = df.dropna(
        subset=["date", TARGET]
    )

    # Remove duplicate records
    df = df.drop_duplicates()

    # Create date-based features
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day

    return df


def prepare_xy(df):

    features = (
        NUMERIC_FEATURES
        + [
            "day_of_week",
            "month",
            "day"
        ]
        + CATEGORICAL_FEATURES
    )

    X = df[features]

    y = df[TARGET]

    return X, y


def build_preprocessor():

    numeric_features = (
        NUMERIC_FEATURES
        + [
            "day_of_week",
            "month",
            "day"
        ]
    )

    preprocessor = ColumnTransformer(

        transformers=[

            (
                "numeric",
                StandardScaler(),
                numeric_features
            ),

            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore"
                ),
                CATEGORICAL_FEATURES
            )
        ]
    )

    return preprocessor