from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from models import Prediction

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.get("/summary")
@jwt_required()
def dashboard_summary():
    user_id = int(get_jwt_identity())
    query = Prediction.query.filter_by(user_id=user_id)

    total = query.count()
    average = query.with_entities(func.avg(Prediction.predicted_demand)).scalar()
    highest = query.with_entities(func.max(Prediction.predicted_demand)).scalar()
    lowest = query.with_entities(func.min(Prediction.predicted_demand)).scalar()

    route_rows = (
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
        "total_predictions": total,
        "average_predicted_demand": round(float(average), 2) if average is not None else 0,
        "highest_predicted_demand": round(float(highest), 2) if highest is not None else 0,
        "lowest_predicted_demand": round(float(lowest), 2) if lowest is not None else 0,
        "by_route": [
            {
                "route": row.route,
                "average_demand": round(float(row.average_demand), 2),
                "count": int(row.count),
            }
            for row in route_rows
        ],
    }), 200
