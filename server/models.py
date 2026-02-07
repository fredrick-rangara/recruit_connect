from config import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    # Serialization rules to prevent infinite loops
    serialize_rules = ('-password_hash', '-jobs.employer', '-applications.seeker')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False) # 'employer' or 'job_seeker'
    
    # Relationships
    jobs = db.relationship('Job', backref='employer', lazy=True, cascade="all, delete-orphan")
    applications = db.relationship('Application', backref='seeker', lazy=True, cascade="all, delete-orphan")