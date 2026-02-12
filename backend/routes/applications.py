from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Application, Job, Notification
from utils.auth_utils import role_required

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('', methods=['POST'])
@jwt_required()
def apply():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    job_id = data.get('job_id')
    job = Job.query.get_or_404(job_id)
    
    # Check if already applied
    existing = Application.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return jsonify({"msg": "Already applied to this job"}), 400
        
    application = Application(
        user_id=user_id,
        job_id=job_id,
        resume_url=data.get('resume_url'),
        cover_letter=data.get('cover_letter')
    )
    
    db.session.add(application)
    db.session.commit()
    
    return jsonify(application.to_dict()), 201

@applications_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_applications():
    user_id = get_jwt_identity()
    applications = Application.query.filter_by(user_id=user_id).all()
    # Exclude redundant references to avoid recursion
    return jsonify([app.to_dict(rules=('-job.applications', '-user.applications')) for app in applications]), 200

@applications_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
@role_required('employer')
def update_application_status(id):
    application = Application.query.get_or_404(id)
    data = request.get_json()
    
    valid_statuses = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']
    new_status = data.get('status')
    if new_status not in valid_statuses:
        return jsonify({"msg": f"Invalid status. Must be one of {valid_statuses}"}), 400
        
    application.status = new_status
    
    # Trigger notification for the seeker
    notification = Notification(
        user_id=application.user_id,
        message=f"Your application for '{application.job.title}' has been updated to {new_status}.",
        type='application_update'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify(application.to_dict()), 200

@applications_bp.route('/employer', methods=['GET'])
@jwt_required()
@role_required('employer')
def get_employer_applications():
    user_id = get_jwt_identity()
    from models import EmployerProfile
    profile = EmployerProfile.query.filter_by(user_id=user_id).first()
    
    if not profile or not profile.company_id:
         return jsonify([]), 200
         
    # Fetch applications for all jobs belonging to the employer's company
    from models import Job
    job_ids = [j.id for j in Job.query.filter_by(company_id=profile.company_id).all()]
    applications = Application.query.filter(Application.job_id.in_(job_ids)).all()
    
    return jsonify([app.to_dict(rules=('-job.applications', '-user.applications')) for app in applications]), 200
