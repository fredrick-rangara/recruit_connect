from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Job, User

main_bp = Blueprint('main', __name__)

# 1. Get all jobs (For the Dashboard/Home)
@main_bp.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        jobs = Job.query.all()
        return jsonify([{
            "id": j.id,
            "title": j.title,
            "location": j.location,
            "salary_range": j.salary_range,
            "description": j.description,
            "employer_id": j.employer_id
        } for j in jobs]), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# 2. Create a new job (Employer only)
@main_bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Check if the user is actually an employer
    user = User.query.get(current_user_id)
    if not user or user.role != 'employer':
        return jsonify({"msg": "Unauthorized: Only employers can post jobs"}), 403

    try:
        new_job = Job(
            title=data.get('title'),
            description=data.get('description'),
            location=data.get('location'),
            salary_range=data.get('salary_range'),
            employer_id=current_user_id
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify({"msg": "Job posted successfully", "job_id": new_job.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 400