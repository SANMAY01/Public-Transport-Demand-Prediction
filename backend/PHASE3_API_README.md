# Phase 3 - Flask API Integration

## 1. Copy files
Copy the files from `routes/` into your existing `backend/routes/`.

## 2. Update `app.py`
Add these imports:
```python
from routes.predictions import predictions_bp
from routes.dashboard import dashboard_bp
from routes.analytics import analytics_bp
from routes.models_api import models_api_bp
from routes.admin import admin_bp
```

After the existing auth blueprint registration, add:
```python
app.register_blueprint(predictions_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(models_api_bp)
app.register_blueprint(admin_bp)
```

## 3. Run
From the backend folder with `(venv)` active:
```powershell
python app.py
```

## 4. Main endpoints
- POST `/api/predictions/predict` (JWT required)
- GET `/api/predictions/history` (JWT required)
- GET `/api/dashboard/summary` (JWT required)
- GET `/api/analytics` (JWT required)
- GET `/api/models/performance` (JWT required)
- GET `/api/models/features` (JWT required)
- GET `/api/admin/users` (ADMIN only)
- PUT `/api/admin/users/<id>/role` (ADMIN only)
- DELETE `/api/admin/users/<id>` (ADMIN only)
- GET `/api/admin/predictions` (ADMIN only)

## Prediction JSON
```json
{
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
```

The API uses the saved ML artifacts under `backend/ml/artifacts/` and stores each prediction in SQLite.
