from flask import Flask, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS 
from config import app, db, bcrypt
from models import User, Job, Application
from datetime import datetime
import os

# ==========================================================
# 0. GLOBAL CONFIGURATION
# ==========================================================
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

# ==========================================================
# 3. APPLICATIONS & DASHBOARDS
# ==========================================================

@app.route('/apply/<int:job_id>', methods=['POST'])
@jwt_required()
def apply_to_job(job_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role != 'job_seeker':
        return jsonify({"msg": "Only seekers can apply"}), 403
        
    existing = Application.query.filter_by(job_id=job_id, seeker_id=current_user_id).first()
    if existing:
        return jsonify({"msg": "Already applied to this job"}), 400

    new_app = Application(job_id=job_id, seeker_id=current_user_id, status="Pending")
    db.session.add(new_app)
    db.session.commit()
    return jsonify({"msg": "Application submitted successfully"}), 201

# --- SEEKER: View my applications ---
@app.route('/seeker/my-applications', methods=['GET'])
@jwt_required()
def get_seeker_apps():
    current_user_id = get_jwt_identity()
    apps = Application.query.filter_by(seeker_id=current_user_id).all()
    
    # Building custom list to include Job Details
    res = []
    for app in apps:
        job = Job.query.get(app.job_id)
        res.append({
            "id": app.id,
            "job_id": job.id,
            "job_title": job.title,
            "company": job.company,
            "status": app.status,
            "created_at": app.created_at.strftime("%Y-%m-%d") if app.created_at else "Recent"
        })
    return jsonify(res), 200

# --- EMPLOYER: View applicants for my jobs ---
@app.route('/employer/applications', methods=['GET'])
@jwt_required()
def get_employer_apps():
    current_user_id = get_jwt_identity()
    # Get all jobs posted by this employer
    employer_jobs = Job.query.filter_by(employer_id=current_user_id).all()
    job_ids = [j.id for j in employer_jobs]
    
    # Find applications for those specific job IDs
    apps = Application.query.filter(Application.job_id.in_(job_ids)).all()
    
    res = []
    for app in apps:
        seeker = User.query.get(app.seeker_id)
        job = Job.query.get(app.job_id)
        res.append({
            "id": app.id,
            "job_title": job.title,
            "seeker_name": seeker.username, # Or seeker.name if you have that field
            "seeker_email": seeker.email,
            "seeker_id": seeker.id,
            "status": app.status,
            "created_at": app.created_at.strftime("%Y-%m-%d") if app.created_at else "Recent"
        })
    return jsonify(res), 200

# --- GLOBAL: Update Application Status ---
@app.route('/applications/<int:app_id>/status', methods=['PATCH'])
@jwt_required()
def update_app_status(app_id):
    data = request.get_json()
    new_status = data.get('status')
    
    app_record = Application.query.get_or_404(app_id)
    app_record.status = new_status
    db.session.commit()
    
    return jsonify({"msg": f"Application marked as {new_status}"}), 200

@app.route('/employer/my-jobs', methods=['GET'])
@jwt_required()
def get_employer_jobs():
    current_user_id = get_jwt_identity()
    jobs = Job.query.filter_by(employer_id=current_user_id).all()
    return jsonify([j.to_dict() for j in jobs]), 200

# ==========================================================
# 4. CONTACT US LOGIC
# ==========================================================

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({"msg": "All fields are required"}), 400

    print(f"\n--- CONTACT: {name} ({email}) ---\n{message}\n")
    return jsonify({"msg": "Success! Your message was received."}), 200

# ==========================================================
# 5. CV HANDLING
# ==========================================================

@app.route('/download-cv/<int:seeker_id>', methods=['GET'])
@jwt_required()
def download_cv(seeker_id):
    # This is a placeholder for your file system logic
    # In a real app: return send_from_directory(UPLOAD_FOLDER, f"cv_{seeker_id}.pdf")
    return jsonify({"msg": "Download logic goes here"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)