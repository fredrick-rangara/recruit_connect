from flask import Blueprint, request, jsonify
from models import db, Job, Application, User
from flask_jwt_extended import jwt_required, get_jwt_identity

main_bp = Blueprint('main', __name__)

# --- JOB SEEKER ENDPOINTS ---

@main_bp.route('/jobs', methods=['GET'])
def get_jobs():
    # Basic search/filter logic
    category = request.args.get('category')
    location = request.args.get('location')
    search_query = request.args.get('search')

    query = Job.query
    if category:
        query = query.filter(Job.category == category)
    if location:
        query = query.filter(Job.location.ilike(f'%{location}%'))
    if search_query:
        query = query.filter(Job.title.ilike(f'%{search_query}%'))

    jobs = query.all()
    return jsonify([{
        "id": j.id, "title": j.title, "company": j.company_name,
        "location": j.location, "salary": j.salary_range, "category": j.category
    } for j in jobs]), 200

@main_bp.route('/apply/<int:job_id>', methods=['POST'])
@jwt_required()
def apply_to_job(job_id):
    current_user = get_jwt_identity()
    if current_user['role'] != 'seeker':
        return jsonify({"msg": "Only seekers can apply"}), 403
    
    data = request.get_json()
    new_app = Application(
        job_id=job_id,
        seeker_id=current_user['id'],
        resume_url=data.get('resume_url') # Link from your Cloudinary/S3
    )
    db.session.add(new_app)
    db.session.commit()
    return jsonify({"msg": "Application submitted!"}), 201

# --- EMPLOYER ENDPOINTS ---

@main_bp.route('/jobs', methods=['POST'])
@jwt_required()
def post_job():
    current_user = get_jwt_identity()
    if current_user['role'] != 'employer':
        return jsonify({"msg": "Unauthorized"}), 403
    
    data = request.get_json()
    new_job = Job(
        title=data['title'],
        company_name=data['company_name'],
        location=data['location'],
        description=data['description'],
        salary_range=data.get('salary_range'),
        category=data.get('category'),
        employer_id=current_user['id']
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify({"msg": "Job posted successfully"}), 201

@main_bp.route('/employer/dashboard', methods=['GET'])
@jwt_required()
def employer_dashboard():
    current_user = get_jwt_identity()
    # Pulling data for the "Recruitment Hub" stats in your Figma
    jobs = Job.query.filter_by(employer_id=current_user['id']).all()
    
    # Simple count for the "Total Applicants" card
    total_apps = 0
    job_list = []
    for j in jobs:
        apps_count = len(j.applications)
        total_apps += apps_count
        job_list.append({
            "title": j.title,
            "applicant_count": apps_count
        })

    return jsonify({
        "total_applicants": total_apps,
        "active_listings": job_list
    }), 200