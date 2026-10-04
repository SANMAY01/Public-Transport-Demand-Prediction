# Public Transport Demand Prediction - Phase 1

Phase 1 provides the Flask backend foundation with SQLite, SQLAlchemy, JWT authentication, user roles, and database models.

## Setup on Windows PowerShell

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python app.py
```

Backend:
http://127.0.0.1:5000

Health check:
http://127.0.0.1:5000/api/health

## Authentication endpoints

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout

## Create an admin

Stop the Flask server and run:

```powershell
python create_admin.py
```

The SQLite database is created automatically when the application starts.
