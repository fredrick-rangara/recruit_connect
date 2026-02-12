# Import necessary modules from Flask-SQLAlchemy for database interactions
# SerializerMixin allows us to easily convert model instances to dictionaries (JSON-ready)
# Bcrypt is used for secure password hashing and verification
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt

# Initialize database and bcrypt extensions
db = SQLAlchemy()
bcrypt = Bcrypt()

# User model represents both job seekers and employers
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-password_hash', '-applications.user', '-employer_profile.user', '-notifications.user',)
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='seeker') # 'seeker' or 'employer'
    
    # Relationships
    applications = db.relationship('Application', backref='user', lazy=True)
    employer_profile = db.relationship('EmployerProfile', backref='user', uselist=False)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    
    # Profile details
    biography = db.Column(db.Text)
    interests = db.Column(db.String(255)) # Comma-separated categories

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Company(db.Model, SerializerMixin):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    website = db.Column(db.String(200))
    location = db.Column(db.String(100))
    
    size = db.Column(db.String(50)) # e.g., "1-10", "51-200", "500+"
    industry = db.Column(db.String(100))
    culture_description = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    
    serialize_rules = ('-jobs.company',)
    jobs = db.relationship('Job', backref='company', lazy=True)

class Job(db.Model, SerializerMixin):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    location = db.Column(db.String(100))
    salary_range = db.Column(db.String(50))
    experience_level = db.Column(db.String(50))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    posted_at = db.Column(db.DateTime, server_default=db.func.now())
    benefits = db.Column(db.Text)
    
    serialize_rules = ('-applications.job', '-saved_by_users.job')
    applications = db.relationship('Application', backref='job', lazy=True)

class Application(db.Model, SerializerMixin):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    status = db.Column(db.String(20), default='applied') # applied, screening, interview, offer, hired, rejected
    applied_at = db.Column(db.DateTime, server_default=db.func.now())
    resume_url = db.Column(db.String(200))
    cover_letter = db.Column(db.Text)

    serialize_rules = ('-user.applications', '-job.applications')

class EmployerProfile(db.Model, SerializerMixin):
    __tablename__ = 'employer_profiles'
    
    serialize_rules = ('-user.employer_profile', '-company.employer_profiles',)
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    job_title = db.Column(db.String(100))

    company = db.relationship('Company', backref='employer_profiles', lazy=True)

class SavedJob(db.Model, SerializerMixin):
    __tablename__ = 'saved_jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    saved_at = db.Column(db.DateTime, server_default=db.func.now())
    
    job = db.relationship('Job', backref='saved_by_users')

class Notification(db.Model, SerializerMixin):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50)) # 'application_update', 'new_job', 'general'
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    serialize_rules = ('-user',)
