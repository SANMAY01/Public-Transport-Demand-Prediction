from flask import Flask, jsonify

from config import Config
from extensions import db, init_extensions

from routes.auth import auth_bp
from routes.predictions import predictions_bp
from routes.dashboard import dashboard_bp
from routes.analytics import analytics_bp
from routes.models_api import models_api_bp
from routes.admin import admin_bp


def create_app():
    """Application factory for the Public Transport Demand API."""

    app = Flask(__name__)

    # =========================================================
    # Configuration
    # =========================================================
    app.config.from_object(Config)

    # =========================================================
    # Initialize Extensions
    # =========================================================
    init_extensions(app)

    # =========================================================
    # Register API Blueprints
    # =========================================================
    app.register_blueprint(auth_bp)
    app.register_blueprint(predictions_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(models_api_bp)
    app.register_blueprint(admin_bp)

    # =========================================================
    # Health Check
    # =========================================================
    @app.get("/api/health")
    def health():
        return jsonify({
            "success": True,
            "status": "healthy",
            "message": "Public Transport Demand API is running."
        }), 200

    # =========================================================
    # API Information
    # =========================================================
    @app.get("/api")
    def api_info():
        return jsonify({
            "success": True,
            "name": "Public Transport Demand Prediction API",
            "version": "1.0.0",
            "status": "online",
            "features": [
                "Authentication",
                "Demand Prediction",
                "Prediction History",
                "Analytics",
                "Machine Learning Model Performance",
                "Admin Management"
            ]
        }), 200

    # =========================================================
    # Error Handlers
    # =========================================================

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": "Bad Request",
            "message": "The request could not be processed."
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            "success": False,
            "error": "Unauthorized",
            "message": "Authentication is required or the token is invalid."
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            "success": False,
            "error": "Forbidden",
            "message": "You do not have permission to perform this action."
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": "Not Found",
            "message": "The requested API endpoint was not found."
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "success": False,
            "error": "Method Not Allowed",
            "message": "The HTTP method is not allowed for this endpoint."
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        db.session.rollback()

        return jsonify({
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected server error occurred."
        }), 500

    # =========================================================
    # Database Initialization
    # =========================================================
    with app.app_context():
        db.create_all()

    return app


# =============================================================
# Create Flask Application
# =============================================================
app = create_app()


# =============================================================
# Development Server
# =============================================================
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )