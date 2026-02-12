# Blueprint for job management routes
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Job, Company, User
from utils.auth_utils import role_required

jobs_bp = Blueprint('jobs', __name__)

# Fetch a list of jobs with optional filters
@jobs_bp.route('', methods=['GET'])
def get_jobs():
    query = Job.query
    
    # Extract query parameters for filtering
    category = request.args.get('category')
    location = request.args.get('location')
    experience = request.args.get('experience_level')
    company_size = request.args.get('company_size')
    title = request.args.get('title') or request.args.get('search')
    
    # Apply filters to the database query
    if title:
        query = query.filter(db.or_(Job.title.ilike(f"%{title}%"), Job.description.ilike(f"%{title}%")))
    if category:
        query = query.filter(Job.category.ilike(f"%{category}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if experience:
        query = query.filter(Job.experience_level == experience)
    if company_size:
        query = query.join(Company).filter(Company.size == company_size)
        
    jobs = query.all()
    # Serialize job results to dictionaries
    return jsonify([job.to_dict(rules=('-applications', '-company.jobs', 'company')) for job in jobs]), 200

@jobs_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or not user.interests:
        # Fallback to latest jobs if no interests
        jobs = Job.query.order_by(Job.posted_at.desc()).limit(5).all()
        return jsonify([j.to_dict(rules=('-applications', '-company.jobs', 'company')) for j in jobs]), 200
    
    # Simple recommendation based on category matching interests
    interests_list = [i.strip() for i in user.interests.split(',')]
    recommended_jobs = Job.query.filter(Job.category.in_(interests_list)).limit(10).all()
    
    return jsonify([j.to_dict(rules=('-applications', '-company.jobs', 'company')) for j in recommended_jobs]), 200

@jobs_bp.route('/<int:id>', methods=['GET'])
def get_job(id):
    job = Job.query.get_or_404(id)
    return jsonify(job.to_dict(rules=('-applications', '-company.jobs'))), 200

@jobs_bp.route('', methods=['POST'])
@jwt_required()
@role_required('employer')
def create_job():
    # In a real app, check if user is an employer
    data = request.get_json()
    
    # For simplicity, assume company exists or create if not
    company_name = data.get('company_name', 'Default Company')
    company = Company.query.filter_by(name=company_name).first()
    if not company:
        company = Company(name=company_name)
        db.session.add(company)
        db.session.commit()
        
    job = Job(
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        location=data.get('location'),
        salary_range=data.get('salary_range'),
        experience_level=data.get('experience_level'),
        benefits=data.get('benefits'),
        company_id=company.id
    )
    
    db.session.add(job)
    db.session.commit()
    
    return jsonify(job.to_dict()), 201

@jobs_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
@role_required('employer')
def update_job(id):
    job = Job.query.get_or_404(id)
    data = request.get_json()
    
    for key in ['title', 'description', 'category', 'location', 'salary_range', 'experience_level', 'benefits']:
        if key in data:
            setattr(job, key, data[key])
            
    db.session.commit()
    return jsonify(job.to_dict()), 200

@jobs_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required('employer')
def delete_job(id):
    job = Job.query.get_or_404(id)
    db.session.delete(job)
    db.session.commit()
    return jsonify({"msg": "Job deleted"}), 200

@jobs_bp.route('/<int:id>/applications', methods=['GET'])
@jwt_required()
@role_required('employer')
def get_job_applications(id):
    job = Job.query.get_or_404(id)
    # In a production app, we'd verify the employer owns this job
    return jsonify([app.to_dict(rules=('-job',)) for app in job.applications]), 200

@jobs_bp.route('/save', methods=['POST'])
@jwt_required()
def save_job():
    user_id = get_jwt_identity()
    data = request.get_json()
    job_id = data.get('job_id')
    
    from models import SavedJob
    # Check if already saved
    existing = SavedJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return jsonify({"msg": "Job already saved"}), 400
        
    saved = SavedJob(user_id=user_id, job_id=job_id)
    db.session.add(saved)
    db.session.commit()
    
    return jsonify({"msg": "Job saved"}), 201

@jobs_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    user_id = get_jwt_identity()
    from models import SavedJob
    saved = SavedJob.query.filter_by(user_id=user_id).all()
    return jsonify([s.job.to_dict(rules=('-company.jobs', 'company')) for s in saved]), 200
