from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from models import Prediction

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")


@analytics_bp.get("")
@jwt_required()
def analytics():
    user_id = int(get_jwt_identity())
    query = Prediction.query.filter_by(user_id=user_id)

    hourly = (
        query.with_entities(
            Prediction.hour,
            func.avg(Prediction.predicted_demand).label("average_demand"),
        )
        .group_by(Prediction.hour)
        .order_by(Prediction.hour)
        .all()
    )

    weather = (
        query.with_entities(
            Prediction.weather,
            func.avg(Prediction.predicted_demand).label("average_demand"),
            func.count(Prediction.id).label("count"),
        )
        .group_by(Prediction.weather)
        .order_by(Prediction.weather)
        .all()
    )

    route = (
        query.with_entities(
            Prediction.route,
            func.avg(Prediction.predicted_demand).label("average_demand"),
            func.count(Prediction.id).label("count"),
        )
        .group_by(Prediction.route)
        .order_by(Prediction.route)
        .all()
    )

    return jsonify({
        "hourly": [
            {"hour": int(r.hour), "average_demand": round(float(r.average_demand), 2)}
            for r in hourly
        ],
        "weather": [
            {"weather": r.weather, "average_demand": round(float(r.average_demand), 2), "count": int(r.count)}
            for r in weather
        ],
        "route": [
            {"route": r.route, "average_demand": round(float(r.average_demand), 2), "count": int(r.count)}
            for r in route
        ],
    }), 200
