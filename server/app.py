"""
Recruit Connect - Flask Backend Server
Auth API with JWT and Role-Based Access Control (RBAC)
"""

from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt,
    verify_jwt_in_request
)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import HTTPException
import os

# Import models
from models import db, User, Job, Application, UserRole

def create_app(config=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-super-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/recruit_connect'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    }
    
    # Apply custom config if provided
    if config:
        app.config.update(config)
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Error handlers
    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return jsonify({'error': error.description}), error.code
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # ========== ROLE-BASED ACCESS CONTROL DECORATORS ==========
    
    def employer_required(fn):
        """Decorator that requires employer role"""
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_current_user()
            if current_user.role != UserRole.EMPLOYER and current_user.role != UserRole.ADMIN:
                return jsonify({'error': 'Employer access required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    
    def job_seeker_required(fn):
        """Decorator that requires job seeker role"""
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_current_user()
            if current_user.role != UserRole.JOB_SEEKER and current_user.role != UserRole.ADMIN:
                return jsonify({'error': 'Job seeker access required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    
    def admin_required(fn):
        """Decorator that requires admin role"""
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_current_user()
            if current_user.role != UserRole.ADMIN:
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    
    def get_current_user():
        """Get current authenticated user"""
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return None
            return user
        except:
            return None
    
    # ========== AUTHENTICATION ROUTES ==========
    
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        """Register a new user"""
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        # Validate role
        valid_roles = [UserRole.JOB_SEEKER, UserRole.EMPLOYER]
        if data['role'] not in valid_roles:
            return jsonify({'error': f'Invalid role. Must be one of: {valid_roles}'}), 400
        
        # Check if email exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
            company_name=data.get('company_name'),
            phone=data.get('phone'),
            resume_url=data.get('resume_url'),
            linkedin_url=data.get('linkedin_url')
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        """Login user and return JWT tokens"""
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
    
    @app.route('/api/auth/refresh', methods=['POST'])
    @jwt_required(refresh=True)
    def refresh_token():
        """Refresh access token using refresh token"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token
        }), 200
    
    @app.route('/api/auth/me', methods=['GET'])
    @jwt_required()
    def get_current_user_info():
        """Get current authenticated user info"""
        user = get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    @app.route('/api/auth/update-profile', methods=['PUT'])
    @jwt_required()
    def update_profile():
        """Update current user profile"""
        user = get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'resume_url' in data:
            user.resume_url = data['resume_url']
        if 'linkedin_url' in data:
            user.linkedin_url = data['linkedin_url']
        if 'company_name' in data:
            user.company_name = data['company_name']
        
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    
    # ========== JOB ROUTES (Employer Only) ==========
    
    @app.route('/api/jobs', methods=['GET'])
    @jwt_required()
    def get_all_jobs():
        """Get all jobs (filtered by role)"""
        user = get_current_user()
        
        if user.role == UserRole.EMPLOYER:
            # Employers see only their own jobs
            jobs = Job.query.filter_by(employer_id=user.id).all()
        else:
            # Job seekers see all active jobs
            jobs = Job.query.filter_by(status='active').all()
        
        return jsonify({
            'jobs': [job.to_dict() for job in jobs],
            'count': len(jobs)
        }), 200
    
    @app.route('/api/jobs/<int:job_id>', methods=['GET'])
    @jwt_required()
    def get_job(job_id):
        """Get a specific job"""
        job = Job.query.get(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify({'job': job.to_dict()}), 200
    
    @app.route('/api/jobs', methods=['POST'])
    @employer_required
    def create_job():
        """Create a new job posting (Employer only)"""
        user = get_current_user()
        
        data = request.get_json()
        
        required_fields = ['title', 'description', 'location']
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        job = Job(
            title=data['title'],
            description=data['description'],
            requirements=data.get('requirements'),
            location=data['location'],
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            job_type=data.get('job_type'),
            experience_level=data.get('experience_level'),
            remote_type=data.get('remote_type'),
            skills_required=data.get('skills_required'),
            employer_id=user.id
        )
        
        db.session.add(job)
        db.session.commit()
        
        return jsonify({
            'message': 'Job created successfully',
            'job': job.to_dict()
        }), 201
    
    @app.route('/api/jobs/<int:job_id>', methods=['PUT'])
    @employer_required
    def update_job(job_id):
        """Update a job posting (Employer only - own jobs)"""
        user = get_current_user()
        
        job = Job.query.filter_by(id=job_id, employer_id=user.id).first()
        
        if not job:
            return jsonify({'error': 'Job not found or unauthorized'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            job.title = data['title']
        if 'description' in data:
            job.description = data['description']
        if 'requirements' in data:
            job.requirements = data['requirements']
        if 'location' in data:
            job.location = data['location']
        if 'salary_min' in data:
            job.salary_min = data['salary_min']
        if 'salary_max' in data:
            job.salary_max = data['salary_max']
        if 'job_type' in data:
            job.job_type = data['job_type']
        if 'experience_level' in data:
            job.experience_level = data['experience_level']
        if 'remote_type' in data:
            job.remote_type = data['remote_type']
        if 'skills_required' in data:
            job.skills_required = data['skills_required']
        if 'status' in data:
            job.status = data['status']
        
        job.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Job updated successfully',
            'job': job.to_dict()
        }), 200
    
    @app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
    @employer_required
    def delete_job(job_id):
        """Delete a job posting (Employer only - own jobs)"""
        user = get_current_user()
        
        job = Job.query.filter_by(id=job_id, employer_id=user.id).first()
        
        if not job:
            return jsonify({'error': 'Job not found or unauthorized'}), 404
        
        db.session.delete(job)
        db.session.commit()
        
        return jsonify({'message': 'Job deleted successfully'}), 200
    
    @app.route('/api/jobs/<int:job_id>/applications', methods=['GET'])
    @employer_required
    def get_job_applications(job_id):
        """Get all applications for a job (Employer only - own jobs)"""
        user = get_current_user()
        
        job = Job.query.filter_by(id=job_id, employer_id=user.id).first()
        
        if not job:
            return jsonify({'error': 'Job not found or unauthorized'}), 404
        
        applications = Application.query.filter_by(job_id=job_id).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications],
            'count': len(applications)
        }), 200
    
    # ========== APPLICATION ROUTES (Job Seeker Only) ==========
    
    @app.route('/api/applications', methods=['GET'])
    @jwt_required()
    def get_my_applications():
        """Get all applications for current user"""
        user = get_current_user()
        
        if user.role == UserRole.JOB_SEEKER:
            # Job seekers see their own applications
            applications = Application.query.filter_by(applicant_id=user.id).all()
        else:
            # Employers see applications for their jobs
            jobs = Job.query.filter_by(employer_id=user.id).all()
            job_ids = [job.id for job in jobs]
            applications = Application.query.filter(Application.job_id.in_(job_ids)).all()
        
        return jsonify({
            'applications': [app.to_dict() for app in applications],
            'count': len(applications)
        }), 200
    
    @app.route('/api/applications/<int:application_id>', methods=['GET'])
    @jwt_required()
    def get_application(application_id):
        """Get a specific application"""
        user = get_current_user()
        
        application = Application.query.get(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Authorization check
        if user.role == UserRole.JOB_SEEKER and application.applicant_id != user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if user.role == UserRole.EMPLOYER:
            job = Job.query.get(application.job_id)
            if job.employer_id != user.id:
                return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify({'application': application.to_dict()}), 200
    
    @app.route('/api/applications', methods=['POST'])
    @job_seeker_required
    def create_application():
        """Apply to a job (Job Seeker only)"""
        user = get_current_user()
        
        data = request.get_json()
        
        if 'job_id' not in data:
            return jsonify({'error': 'Job ID is required'}), 400
        
        job = Job.query.get(data['job_id'])
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Check if job is active
        if job.status != 'active':
            return jsonify({'error': 'This job is no longer accepting applications'}), 400
        
        # Check if already applied
        existing = Application.query.filter_by(
            job_id=data['job_id'],
            applicant_id=user.id
        ).first()
        
        if existing:
            return jsonify({'error': 'You have already applied to this job'}), 409
        
        application = Application(
            job_id=data['job_id'],
            applicant_id=user.id,
            cover_letter=data.get('cover_letter'),
            resume_url=data.get('resume_url') or user.resume_url
        )
        
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }), 201
    
    @app.route('/api/applications/<int:application_id>', methods=['PUT'])
    @job_seeker_required
    def update_application(application_id):
        """Update application (Job Seeker only - own applications, only if pending)"""
        user = get_current_user()
        
        application = Application.query.filter_by(
            id=application_id,
            applicant_id=user.id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found or unauthorized'}), 404
        
        # Can only update if still pending
        if application.status != 'pending':
            return jsonify({'error': 'Cannot update application after review'}), 400
        
        data = request.get_json()
        
        if 'cover_letter' in data:
            application.cover_letter = data['cover_letter']
        if 'resume_url' in data:
            application.resume_url = data['resume_url']
        
        application.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Application updated successfully',
            'application': application.to_dict()
        }), 200
    
    @app.route('/api/applications/<int:application_id>', methods=['DELETE'])
    @job_seeker_required
    def withdraw_application(application_id):
        """Withdraw application (Job Seeker only - own applications)"""
        user = get_current_user()
        
        application = Application.query.filter_by(
            id=application_id,
            applicant_id=user.id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found or unauthorized'}), 404
        
        db.session.delete(application)
        db.session.commit()
        
        return jsonify({'message': 'Application withdrawn successfully'}), 200
    
    @app.route('/api/applications/<int:application_id>/status', methods=['PUT'])
    @employer_required
    def update_application_status(application_id):
        """Update application status (Employer only - their jobs)"""
        user = get_current_user()
        
        application = Application.query.get(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        job = Job.query.get(application.job_id)
        
        if job.employer_id != user.id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'reviewed', 'accepted', 'rejected']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        application.status = data['status']
        
        if 'notes' in data:
            application.notes = data['notes']
        
        application.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Application status updated successfully',
            'application': application.to_dict()
        }), 200
    
    # ========== PUBLIC ROUTES ==========
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    
    @app.route('/api/public/jobs', methods=['GET'])
    def get_public_jobs():
        """Get all active jobs (public access)"""
        jobs = Job.query.filter_by(status='active').all()
        
        # Remove employer_id from public response for privacy
        job_dicts = []
        for job in jobs:
            jd = job.to_dict()
            jd['employer_id'] = None
            job_dicts.append(jd)
        
        return jsonify({
            'jobs': job_dicts,
            'count': len(jobs)
        }), 200
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

