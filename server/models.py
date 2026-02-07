from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

# ==========================================================
# 0. CONSTANTS
# ==========================================================
class UserRole:
    EMPLOYER = 'employer'
    JOB_SEEKER = 'job_seeker'

class ApplicationStatus:
    PENDING = 'Pending'
    ACCEPTED = 'Accepted'
    REJECTED = 'Rejected'

# ==========================================================
# 1. USER MODEL
# ==========================================================
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    # Prevents password and recursion issues in JSON
    serialize_rules = ('-password_hash', '-jobs.employer', '-applications.seeker', '-applications.job')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False, default=UserRole.JOB_SEEKER)
    
    # Extra fields from main
    full_name = db.Column(db.String(100))
    company_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    jobs = db.relationship('Job', backref='employer', lazy=True, cascade="all, delete-orphan")
    applications = db.relationship('Application', backref='seeker', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<User {self.email} ({self.role})>'

# ==========================================================
# 2. JOB MODEL
# ==========================================================
class Job(db.Model, SerializerMixin):
    __tablename__ = 'jobs'
    
    serialize_rules = ('-employer.jobs', '-applications.job', '-applications.seeker')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    company = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    
    # Fields for Figma filtering
    category = db.Column(db.String) 
    salary_max = db.Column(db.Integer)
    job_type = db.Column(db.String(50), default="Full-time")
    
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to applications
    applications = db.relationship('Application', backref='job', lazy=True, cascade="all, delete-orphan")

# ==========================================================
# 3. APPLICATION MODEL
# ==========================================================
class Application(db.Model, SerializerMixin):
    __tablename__ = 'applications'
    
    serialize_rules = ('-job.applications', '-seeker.applications', '-job.employer')

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    seeker_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    status = db.Column(db.String, default=ApplicationStatus.PENDING) 
    resume_url = db.Column(db.String)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)