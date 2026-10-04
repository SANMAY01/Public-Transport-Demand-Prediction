from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Prediction
from ml.predict import predict_demand

predictions_bp = Blueprint("predictions", __name__, url_prefix="/api/predictions")


REQUIRED_FIELDS = [
    "date", "hour", "route", "weather", "temperature",
    "humidity", "holiday", "weekend", "previous_demand"
]


def _current_user_id():
    return int(get_jwt_identity())


def _validate_payload(data):
    missing = [field for field in REQUIRED_FIELDS if field not in data]
    if missing:
        return f"Missing required fields: {', '.join(missing)}"

    if not 0 <= int(data["hour"]) <= 23:
        return "hour must be between 0 and 23"

    if data["route"] not in {"Route 1", "Route 2", "Route 3", "Route 4", "Route 5"}:
        return "route must be Route 1, Route 2, Route 3, Route 4, or Route 5"

    if data["weather"] not in {"Sunny", "Cloudy", "Rainy"}:
        return "weather must be Sunny, Cloudy, or Rainy"

    return None


@predictions_bp.post("/predict")
@jwt_required()
def create_prediction():
    data = request.get_json(silent=True) or {}
    error = _validate_payload(data)

    if error:
        return jsonify({"error": error}), 400

    try:
        clean = {
            "date": str(data["date"]),
            "hour": int(data["hour"]),
            "route": str(data["route"]),
            "weather": str(data["weather"]),
            "temperature": float(data["temperature"]),
            "humidity": float(data["humidity"]),
            "holiday": int(data["holiday"]),
            "weekend": int(data["weekend"]),
            "previous_demand": float(data["previous_demand"]),
        }

        predicted = predict_demand(clean)

        record = Prediction(
            user_id=_current_user_id(),
            date=datetime.strptime(clean["date"], "%Y-%m-%d").date(),
            hour=clean["hour"],
            route=clean["route"],
            weather=clean["weather"],
            temperature=clean["temperature"],
            humidity=clean["humidity"],
            holiday=clean["holiday"],
            weekend=clean["weekend"],
            previous_demand=clean["previous_demand"],
            predicted_demand=predicted,
        )

        db.session.add(record)
        db.session.commit()

        return jsonify({
            "message": "Prediction created successfully",
            "prediction": {
                "id": record.id,
                "date": clean["date"],
                "hour": clean["hour"],
                "route": clean["route"],
                "weather": clean["weather"],
                "predicted_demand": round(predicted, 2),
                "created_at": record.created_at.isoformat() if record.created_at else None,
            }
        }), 201

    except (TypeError, ValueError) as exc:
        db.session.rollback()
        return jsonify({"error": f"Invalid input: {exc}"}), 400
    except Exception as exc:
        db.session.rollback()
        return jsonify({"error": f"Prediction failed: {exc}"}), 500


@predictions_bp.get("/history")
@jwt_required()
def prediction_history():
    records = (
        Prediction.query
        .filter_by(user_id=_current_user_id())
        .order_by(Prediction.created_at.desc())
        .all()
    )

    return jsonify({
        "count": len(records),
        "predictions": [
            {
                "id": p.id,
                "date": p.date.isoformat() if p.date else None,
                "hour": p.hour,
                "route": p.route,
                "weather": p.weather,
                "temperature": p.temperature,
                "humidity": p.humidity,
                "holiday": p.holiday,
                "weekend": p.weekend,
                "previous_demand": p.previous_demand,
                "predicted_demand": round(p.predicted_demand, 2),
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in records
        ]
    }), 200
