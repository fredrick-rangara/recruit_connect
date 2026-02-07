from flask import request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS  # Import CORS
from config import app, db, bcrypt
from models import User, Job, Application
from datetime import datetime
import os

# ==========================================================
# 0. GLOBAL CONFIGURATION (Fixes CORS Errors)
# ==========================================================
# This allows your Vite frontend (port 5173) to talk to this Flask server
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# ==========================================================
# 1. AUTHENTICATION
# ==========================================================

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Missing email or password"}), 400
        
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"msg": "User already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_pw,
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if user and bcrypt.check_password_hash(user.password_hash, data.get('password')):
        # identity must be a string for JWT Extended
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "token": access_token,
            "role": user.role,
            "username": user.username,
            "user_id": user.id
        }), 200
    return jsonify({"msg": "Invalid email or password"}), 401

# ==========================================================
# 2. JOB LOGIC (General & Single)
# ==========================================================

@app.route('/jobs', methods=['GET', 'POST'])
@jwt_required(optional=True)
def handle_jobs():
    if request.method == 'GET':
        keyword = request.args.get('keyword')
        category = request.args.get('category')
        location = request.args.get('location')
        query = Job.query
        
        if keyword:
            query = query.filter(Job.title.ilike(f'%{keyword}%') | Job.company.ilike(f'%{keyword}%'))
        if category:
            query = query.filter(Job.category == category)
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))
            
        return jsonify([j.to_dict() for j in query.all()]), 200

    if request.method == 'POST':
        current_user_id = get_jwt_identity()
        data = request.get_json()
        new_job = Job(
            title=data['title'],
            description=data['description'],
            company=data['company'],
            location=data['location'],
            category=data.get('category', 'General'),
            salary_max=data.get('salary_max'),
            employer_id=current_user_id
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify(new_job.to_dict()), 201

@app.route('/jobs/<int:id>', methods=['GET'])
def get_job_by_id(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"msg": "Job not found"}), 404
    return jsonify(job.to_dict()), 200

@app.route('/jobs/<int:id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def modify_job(id):
    current_user_id = get_jwt_identity()
    job = Job.query.get_or_404(id)

    if str(job.employer_id) != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    if request.method == 'DELETE':
        db.session.delete(job)
        db.session.commit()
        return jsonify({"msg": "Job deleted"}), 200

    data = request.get_json()
    job.title = data.get('title', job.title)
    job.description = data.get('description', job.description)
    job.location = data.get('location', job.location)
    job.salary_max = data.get('salary_max', job.salary_max)
    db.session.commit()
    return jsonify(job.to_dict()), 200

# ==========================================================
# 3. APPLICATIONS & DASHBOARDS
# ==========================================================

@app.route('/jobs/<int:id>/apply', methods=['POST'])
@jwt_required()
def apply_to_job(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role != 'job_seeker':
        return jsonify({"msg": "Only seekers can apply"}), 403
        
    # Check if already applied
    existing = Application.query.filter_by(job_id=id, seeker_id=current_user_id).first()
    if existing:
        return jsonify({"msg": "Already applied to this job"}), 400

    new_app = Application(job_id=id, seeker_id=current_user_id, status="Pending")
    db.session.add(new_app)
    db.session.commit()
    return jsonify({"msg": "Application submitted successfully"}), 201

@app.route('/employer/my-jobs', methods=['GET'])
@jwt_required()
def get_employer_jobs():
    current_user_id = get_jwt_identity()
    jobs = Job.query.filter_by(employer_id=current_user_id).all()
    return jsonify([j.to_dict() for j in jobs]), 200

@app.route('/employer/applications', methods=['GET'])
@jwt_required()
def view_all_applicants():
    current_user_id = get_jwt_identity()
    results = db.session.query(Application, Job, User).\
        join(Job, Application.job_id == Job.id).\
        join(User, Application.seeker_id == User.id).\
        filter(Job.employer_id == current_user_id).all()

    return jsonify([{
        "id": app_inst.id,
        "job_title": job_inst.title,
        "applicant_name": user_inst.username,
        "status": app_inst.status,
        "date": app_inst.applied_at.strftime("%Y-%m-%d") if app_inst.applied_at else "Today"
    } for app_inst, job_inst, user_inst in results]), 200

@app.route('/applications/<int:id>', methods=['PATCH'])
@jwt_required()
def update_status(id):
    application = Application.query.get_or_404(id)
    data = request.get_json()
    application.status = data.get('status', application.status)
    db.session.commit()
    return jsonify({"msg": "Status updated"}), 200

# ==========================================================
# 4. MISC
# ==========================================================

@app.route('/seeker/upload-cv', methods=['POST'])
@jwt_required()
def upload_cv():
    if 'cv' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['cv']
    # Add actual file saving logic here if needed
    return jsonify({"msg": f"File {file.filename} received and processed"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)