"""
Database models for Recruit Connect
Tables: Users, Jobs, Applications
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Enum-like class for user roles
class UserRole:
    JOB_SEEKER = 'job_seeker'
    EMPLOYER = 'employer'
    ADMIN = 'admin'


class User(db.Model):
    """User model for both job seekers and employers"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default=UserRole.JOB_SEEKER)
    company_name = db.Column(db.String(200), nullable=True)  # For employers
    phone = db.Column(db.String(20), nullable=True)
    resume_url = db.Column(db.String(500), nullable=True)  # For job seekers
    linkedin_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    jobs = db.relationship('Job', backref='employer', lazy='dynamic', cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='applicant', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'company_name': self.company_name,
            'phone': self.phone,
            'resume_url': self.resume_url,
            'linkedin_url': self.linkedin_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<User {self.email} ({self.role})>'


class Job(db.Model):
    """Job posting model"""
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(200), nullable=False)
    salary_min = db.Column(db.Integer, nullable=True)
    salary_max = db.Column(db.Integer, nullable=True)
    job_type = db.Column(db.String(50), nullable=True)  # full-time, part-time, contract, etc.
    experience_level = db.Column(db.String(50), nullable=True)  # entry, mid, senior
    remote_type = db.Column(db.String(50), nullable=True)  # remote, hybrid, on-site
    skills_required = db.Column(db.Text, nullable=True)  # JSON string of skills
    status = db.Column(db.String(20), default='active')  # active, closed, draft
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    applications = db.relationship('Application', backref='job', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert job to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'requirements': self.requirements,
            'location': self.location,
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'job_type': self.job_type,
            'experience_level': self.experience_level,
            'remote_type': self.remote_type,
            'skills_required': self.skills_required,
            'status': self.status,
            'employer_id': self.employer_id,
            'employer_name': self.employer.company_name if self.employer else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Job {self.title}>'


class Application(db.Model):
    """Application model for job applications"""
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    applicant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cover_letter = db.Column(db.Text, nullable=True)
    resume_url = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, reviewed, accepted, rejected
    notes = db.Column(db.Text, nullable=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Ensure one application per job per applicant
    __table_args__ = (
        db.UniqueConstraint('job_id', 'applicant_id', name='unique_job_application'),
    )
    
    def to_dict(self):
        """Convert application to dictionary"""
        return {
            'id': self.id,
            'job_id': self.job_id,
            'job_title': self.job.title if self.job else None,
            'applicant_id': self.applicant_id,
            'applicant_name': f"{self.applicant.first_name} {self.applicant.last_name}" if self.applicant else None,
            'cover_letter': self.cover_letter,
            'resume_url': self.resume_url,
            'status': self.status,
            'notes': self.notes,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Application {self.applicant_id} -> {self.job_id}>'

