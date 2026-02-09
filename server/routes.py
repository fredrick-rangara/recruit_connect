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

@main_bp.route('/jobs', methods=['POST'])
@jwt_required()
def create_job():
    data = request.get_json()
    identity = get_jwt_identity()

    try:
        user = User.query.get(int(identity))
        
        # Pull the company name from the user who is posting
        # If your field is named 'full_name', use user.full_name
        company = user.full_name 

        new_job = Job(
            title=data.get('title'),
            company_name=company, # This fills the missing NOT NULL column
            description=data.get('description'),
            location=data.get('location'),
            salary_range=data.get('salary_range'),
            category=data.get('category', 'General'), # Default if None
            employer_id=user.id
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify({"msg": "Job posted successfully"}), 201
        
    except Exception as e:
        print(f"DATABASE ERROR: {str(e)}")
        db.session.rollback()
        return jsonify({"msg": "Server error processing request"}), 500