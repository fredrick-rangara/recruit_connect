from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Job, User, Application

main_bp = Blueprint('main', __name__)

# ... (Previous routes 1, 2, 3, and 4 stay the same) ...

# 5. Get applications for the logged-in Seeker
@main_bp.route('/my-applications', methods=['GET'])
@jwt_required()
def get_my_applications():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    
    if user.role != 'seeker':
        return jsonify({"msg": "Only seekers can view personal applications"}), 403

    # user.applications comes from the backref in models.py
    return jsonify([{
        "id": app.id,
        "job_title": app.job.title,
        "company": app.job.company_name,
        "status": app.status,
        "applied_at": app.applied_at.strftime("%Y-%m-%d")
    } for app in user.applications]), 200

# 6. Get applications for jobs posted by the logged-in Employer
@main_bp.route('/employer/applications', methods=['GET'])
@jwt_required()
def get_employer_applications():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))

    if user.role != 'employer':
        return jsonify({"msg": "Only employers can view job candidates"}), 403

    # Find all jobs owned by this employer
    employer_jobs = Job.query.filter_by(employer_id=user.id).all()
    
    all_apps = []
    for job in employer_jobs:
        for app in job.job_applications: # 'job_applications' is the backref on the Job model
            all_apps.append({
                "id": app.id,
                "job_title": job.title,
                "applicant_name": app.seeker.full_name, # 'seeker' is the backref on Application
                "applicant_email": app.seeker.email,
                "status": app.status,
                "applied_at": app.applied_at.strftime("%Y-%m-%d")
            })

    return jsonify(all_apps), 200