from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Job, Application

jobs_bp = Blueprint('jobs', __name__)

# --- 1. SEARCH & LIST ALL JOBS ---
@jobs_bp.route('/api/jobs', methods=['GET'])
def get_jobs():
    search_query = request.args.get('search', '')
    
    if search_query:
        # Search filter for title or company name
        jobs = Job.query.filter(
            (Job.title.ilike(f'%{search_query}%')) | 
            (Job.company.ilike(f'%{search_query}%'))
        ).all()
    else:
        jobs = Job.query.all()

    return jsonify([{
        "id": j.id,
        "title": j.title,
        "company": j.company,
        "location": j.location,
        "salary": j.salary
    } for j in jobs]), 200

# --- 2. GET SINGLE JOB DETAILS ---
@jobs_bp.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job_detail(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify({
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "location": job.location,
        "salary": job.salary,
        # In a real app, these could be stored in a separate table
        "requirements": ["Relevant experience", "Technical proficiency", "Strong communication"]
    })

# --- 3. SUBMIT APPLICATION (Protected) ---
@jobs_bp.route('/api/apply', methods=['POST'])
@jwt_required()
def apply_to_job():
    user_identity = get_jwt_identity() # Retrieves the user dict from the token
    user_id = user_identity['id']
    data = request.get_json()
    
    # Validation: Check if job_id is provided
    if not data or 'job_id' not in data:
        return jsonify({"msg": "Missing job_id"}), 400

    # Prevent duplicate applications
    existing = Application.query.filter_by(user_id=user_id, job_id=data['job_id']).first()
    if existing:
        return jsonify({"msg": "You have already applied for this position"}), 400

    new_app = Application(
        user_id=user_id,
        job_id=data['job_id'],
        cover_letter=data.get('cover_letter', '')
    )
    
    db.session.add(new_app)
    db.session.commit()
    
    return jsonify({"msg": "Application submitted successfully!"}), 201