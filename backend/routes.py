from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Job, User, Application

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_identity = get_jwt_identity()
    user_id = user_identity['id']
    role = user_identity.get('role')

    if role == 'seeker':
        # Get all jobs this seeker applied for
        apps = Application.query.filter_by(user_id=user_id).all()
        data = [{
            "job_title": app.job.title if app.job else "Unknown",
            "company": app.job.company.name if app.job and app.job.company else "Unknown",
            "status": app.status,
            "applied_at": app.applied_at.strftime("%Y-%m-%d") if app.applied_at else "Unknown"
        } for app in apps]
        return jsonify({"role": "seeker", "applications": data}), 200

    else:
        # Employer: Get all jobs they posted and the applicants for each
        from models import EmployerProfile
        profile = EmployerProfile.query.filter_by(user_id=user_id).first()
        if not profile or not profile.company_id:
            return jsonify({"role": "employer", "postings": []}), 200
            
        my_jobs = Job.query.filter_by(company_id=profile.company_id).all()
        data = []
        for job in my_jobs:
            applicants = []
            for app in job.applications:
                applicants.append({
                    "app_id": app.id,
                    "candidate_name": app.user.username if app.user else "Unknown",
                    "email": app.user.email if app.user else "Unknown",
                    "status": app.status,
                    "resume_url": app.resume_url,
                    "cover_letter": app.cover_letter
                })
            
            data.append({
                "job_id": job.id,
                "title": job.title,
                "applicant_count": len(applicants),
                "applicants": applicants
            })
        return jsonify({"role": "employer", "postings": data}), 200

