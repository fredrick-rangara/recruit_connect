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

class Job(db.Model, SerializerMixin):
    __tablename__ = 'jobs'
    
    serialize_rules = ('-employer.jobs', '-applications.job')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    company = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    
    # Figma-specific fields for filtering
    category = db.Column(db.String) 
    salary_max = db.Column(db.Integer)
    
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationship to applications
    applications = db.relationship('Application', backref='job', lazy=True, cascade="all, delete-orphan")

class Application(db.Model, SerializerMixin):
    __tablename__ = 'applications'
    
    serialize_rules = ('-job.applications', '-seeker.applications')

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    seeker_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Status and Date for Member 5's ATS logic
    status = db.Column(db.String, default='Pending') 
    resume_url = db.Column(db.String)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow) # Added for sorting and display