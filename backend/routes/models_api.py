from pathlib import Path
import json

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

models_api_bp = Blueprint("models_api", __name__, url_prefix="/api/models")

ARTIFACTS = Path(__file__).resolve().parent.parent / "ml" / "artifacts"


@models_api_bp.get("/performance")
@jwt_required()
def model_performance():
    path = ARTIFACTS / "model_performance.json"

    if not path.exists():
        return jsonify({"error": "Model performance file not found. Train the model first."}), 404

    with path.open("r", encoding="utf-8") as f:
        return jsonify(json.load(f)), 200


@models_api_bp.get("/features")
@jwt_required()
def feature_importance():
    path = ARTIFACTS / "feature_importance.json"

    if not path.exists():
        return jsonify({"error": "Feature importance file not found."}), 404

    with path.open("r", encoding="utf-8") as f:
        return jsonify(json.load(f)), 200
