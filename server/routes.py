from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Job, User, Application # Added Application import

main_bp = Blueprint('main', __name__)

# 1. Get ALL jobs
@main_bp.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        jobs = Job.query.all()
        return jsonify([{
            "id": j.id,
            "title": j.title,
            "company_name": j.company_name,
            "location": j.location,
            "salary_range": j.salary_range,
            "description": j.description,
            "employer_id": j.employer_id
        } for j in jobs]), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# 2. Get a SINGLE job by ID
@main_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify({
        "id": job.id,
        "title": job.title,
        "company_name": job.company_name,
        "location": job.location,
        "salary_range": job.salary_range,
        "description": job.description,
        "category": job.category
    }), 200

# 3. Create a job (Employer only)
@main_bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    data = request.get_json()
    identity = get_jwt_identity()

    try:
        user = User.query.get(int(identity))
        if not user or user.role != 'employer':
            return jsonify({"msg": "Unauthorized: Employer role required"}), 403

        new_job = Job(
            title=data.get('title'),
            company_name=user.full_name, 
            description=data.get('description'),
            location=data.get('location'),
            salary_range=data.get('salary_range'),
            category=data.get('category', 'General'),
            employer_id=user.id
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify({"msg": "Job posted successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Server error processing request"}), 500

# 4. Apply to a job (Seeker only)
@main_bp.route('/jobs/<int:job_id>/apply', methods=['POST'])
@jwt_required()
def apply_to_job(job_id):
    identity = get_jwt_identity()
    try:
        user = User.query.get(int(identity))

        if user.role != 'seeker':
            return jsonify({"msg": "Only seekers can apply for jobs"}), 403

        # Check if already applied
        existing = Application.query.filter_by(job_id=job_id, seeker_id=user.id).first()
        if existing:
            return jsonify({"msg": "You have already applied for this job"}), 400

        new_app = Application(job_id=job_id, seeker_id=user.id)
        db.session.add(new_app)
        db.session.commit()

        return jsonify({"msg": "Application submitted successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"APPLICATION ERROR: {str(e)}")
        return jsonify({"msg": "Failed to submit application"}), 500