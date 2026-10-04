from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import User, Prediction

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def admin_required():
    user = db.session.get(User, int(get_jwt_identity()))
    if not user or user.role != "ADMIN":
        return None
    return user


@admin_bp.get("/users")
@jwt_required()
def list_users():
    if not admin_required():
        return jsonify({"error": "Admin access required"}), 403

    users = User.query.order_by(User.created_at.desc()).all()

    return jsonify({
        "count": len(users),
        "users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "created_at": u.created_at.isoformat() if u.created_at else None,
            }
            for u in users
        ]
    }), 200


@admin_bp.put("/users/<int:user_id>/role")
@jwt_required()
def change_role(user_id):
    current = admin_required()
    if not current:
        return jsonify({"error": "Admin access required"}), 403

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    role = str(data.get("role", "")).upper()

    if role not in {"USER", "ADMIN"}:
        return jsonify({"error": "role must be USER or ADMIN"}), 400

    if user.id == current.id and role != "ADMIN":
        return jsonify({"error": "You cannot remove your own admin role"}), 400

    user.role = role
    db.session.commit()

    return jsonify({"message": "Role updated", "user_id": user.id, "role": user.role}), 200


@admin_bp.delete("/users/<int:user_id>")
@jwt_required()
def delete_user(user_id):
    current = admin_required()
    if not current:
        return jsonify({"error": "Admin access required"}), 403

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.id == current.id:
        return jsonify({"error": "You cannot delete your own account"}), 400

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200


@admin_bp.get("/predictions")
@jwt_required()
def all_predictions():
    if not admin_required():
        return jsonify({"error": "Admin access required"}), 403

    records = Prediction.query.order_by(Prediction.created_at.desc()).all()

    return jsonify({
        "count": len(records),
        "predictions": [
            {
                "id": p.id,
                "user_id": p.user_id,
                "date": p.date.isoformat() if p.date else None,
                "hour": p.hour,
                "route": p.route,
                "weather": p.weather,
                "predicted_demand": round(p.predicted_demand, 2),
                "created_at": p.created_at.isoformat() if p.created_at else None,
            }
            for p in records
        ]
    }), 200
