from datetime import datetime
from app.extensions import db

class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, nullable=False)

    title = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)

    location = db.Column(db.String(120), index=True)
    category = db.Column(db.String(100), index=True)

    employment_type = db.Column(db.String(50))
    experience_level = db.Column(db.String(50))

    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)

    is_remote = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default="active", index=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
