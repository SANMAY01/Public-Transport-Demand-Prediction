from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from extensions import db

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="USER")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    predictions = db.relationship(
        "Prediction", back_populates="user",
        cascade="all, delete-orphan", lazy=True
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class Prediction(db.Model):
    __tablename__ = "predictions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False)
    hour = db.Column(db.Integer, nullable=False)
    route = db.Column(db.String(100), nullable=False)
    weather = db.Column(db.String(50), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    holiday = db.Column(db.Boolean, nullable=False, default=False)
    weekend = db.Column(db.Boolean, nullable=False, default=False)
    previous_demand = db.Column(db.Float, nullable=False)
    predicted_demand = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", back_populates="predictions")

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id,
            "date": self.date.isoformat() if self.date else None,
            "hour": self.hour, "route": self.route, "weather": self.weather,
            "temperature": self.temperature, "humidity": self.humidity,
            "holiday": self.holiday, "weekend": self.weekend,
            "previous_demand": self.previous_demand,
            "predicted_demand": self.predicted_demand,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class TransportData(db.Model):
    __tablename__ = "transport_data"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, index=True)
    hour = db.Column(db.Integer, nullable=False)
    route = db.Column(db.String(100), nullable=False, index=True)
    weather = db.Column(db.String(50), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    holiday = db.Column(db.Boolean, nullable=False, default=False)
    weekend = db.Column(db.Boolean, nullable=False, default=False)
    passenger_demand = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.isoformat() if self.date else None,
            "hour": self.hour, "route": self.route, "weather": self.weather,
            "temperature": self.temperature, "humidity": self.humidity,
            "holiday": self.holiday, "weekend": self.weekend,
            "passenger_demand": self.passenger_demand,
        }
