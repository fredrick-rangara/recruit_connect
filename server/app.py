from flask import Flask, request, jsonify, send_from_directory
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS 
from config import app, db, bcrypt
from models import User, Job, Application
from datetime import datetime
from werkzeug.utils import secure_filename
import os

# ==========================================================
# 0. GLOBAL CONFIGURATION
# ==========================================================
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads/resumes')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "token": access_token,
            "role": user.role,
            "username": user.username,
            "user_id": user.id
        }), 200
    return jsonify({"msg": "Invalid email or password"}), 401

# ==========================================================
# 2. JOB LOGIC
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
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json()
            new_job = Job(
                title=data.get('title'),
                description=data.get('description'),
                company=data.get('company'),
                location=data.get('location'),
                category=data.get('category', 'General'),
                salary_max=data.get('salary_max'),
                employer_id=current_user_id
                # Note: 'status' removed to match your current Job model
            )
            db.session.add(new_job)
            db.session.commit()
            return jsonify(new_job.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            print(f"ERROR POSTING JOB: {e}")
            return jsonify({"msg": "Error creating job"}), 500

# ==========================================================
# 3. PIPELINE & APPLICATIONS
# ==========================================================

@app.route('/employer/dashboard-stats', methods=['GET'])
@jwt_required()
def get_employer_stats():
    current_user_id = get_jwt_identity()
    
    # Count jobs created by this employer
    total_jobs = Job.query.filter_by(employer_id=current_user_id).count()
    
    # Get all applications for this employer's jobs
    employer_apps = Application.query.join(Job).filter(Job.employer_id == current_user_id).all()
    
    pipeline = {"applied": 0, "screening": 0, "interview": 0, "offered": 0, "hired": 0}
    
    for app_record in employer_apps:
        status = app_record.status.lower() if app_record.status else "applied"
        if status in pipeline:
            pipeline[status] += 1

    return jsonify({
        "activeJobs": total_jobs,
        "totalApplicants": len(employer_apps),
        "pipeline": pipeline
    }), 200

@app.route('/employer/applications', methods=['GET'])
@jwt_required()
def get_employer_applications():
    current_user_id = get_jwt_identity()
    
    # Join Application with User (Seeker) and Job for the full list
    apps = db.session.query(Application, User, Job).join(
        User, Application.seeker_id == User.id
    ).join(
        Job, Application.job_id == Job.id
    ).filter(Job.employer_id == current_user_id).all()

    results = []
    for app_obj, seeker, job in apps:
        results.append({
            "id": app_obj.id,
            "seeker_name": seeker.username,
            "seeker_id": seeker.id,
            "job_title": job.title,
            "status": app_obj.status,
            "resume_path": seeker.resume_path
        })
    return jsonify(results), 200

@app.route('/applications/<int:app_id>/status', methods=['PATCH'])
@jwt_required()
def update_application_status(app_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_status = data.get('status').lower()

    application = Application.query.get_or_404(app_id)
    job = Job.query.get(application.job_id)
    
    if str(job.employer_id) != str(current_user_id):
        return jsonify({"msg": "Unauthorized"}), 403

    application.status = new_status
    db.session.commit()
    return jsonify({"msg": f"Status updated to {new_status}"}), 200

# ==========================================================
# 4. CV & MISC
# ==========================================================

@app.route('/download-cv/<int:seeker_id>', methods=['GET'])
@jwt_required()
def download_cv(seeker_id):
    user = User.query.get_or_404(seeker_id)
    if not user.resume_path:
        return jsonify({"msg": "CV not found"}), 404
    return send_from_directory(app.config['UPLOAD_FOLDER'], user.resume_path)

@app.route('/seeker/upload-cv', methods=['POST'])
@jwt_required()
def upload_cv():
    file = request.files.get('cv')
    if not file or not file.filename.lower().endswith('.pdf'):
        return jsonify({"msg": "Please upload a PDF CV"}), 400

    current_user_id = get_jwt_identity()
    filename = secure_filename(f"cv_{current_user_id}_{file.filename}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    user = User.query.get(current_user_id)
    user.resume_path = filename
    db.session.commit()
    return jsonify({"msg": "CV uploaded successfully"}), 200

@app.route('/apply/<int:job_id>', methods=['POST'])
@jwt_required()
def apply_to_job(job_id):
    current_user_id = get_jwt_identity()
    if Application.query.filter_by(job_id=job_id, seeker_id=current_user_id).first():
        return jsonify({"msg": "Already applied"}), 400
        
    new_app = Application(job_id=job_id, seeker_id=current_user_id, status='applied')
    db.session.add(new_app)
    db.session.commit()
    return jsonify({"msg": "Applied successfully"}), 201

@app.route('/employer/my-jobs', methods=['GET'])
@jwt_required()
def get_employer_jobs():
    current_user_id = get_jwt_identity()
    jobs = Job.query.filter_by(employer_id=current_user_id).all()
    return jsonify([j.to_dict() for j in jobs]), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)