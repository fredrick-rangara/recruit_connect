from flask import Flask, request, jsonify, make_response, send_from_directory
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

@app.route('/jobs/<int:job_id>', methods=['GET', 'DELETE'])
@jwt_required(optional=True)
def job_detail(job_id):
    """GET allows anyone to view. DELETE requires ownership."""
    job = Job.query.get_or_404(job_id)
    
    if request.method == 'GET':
        return jsonify(job.to_dict()), 200
        
    if request.method == 'DELETE':
        current_user_id = get_jwt_identity()
        if not current_user_id or str(job.employer_id) != str(current_user_id):
            return jsonify({"msg": "Unauthorized"}), 403
        db.session.delete(job)
        db.session.commit()
        return jsonify({"msg": "Job deleted successfully"}), 200

# ==========================================================
# 3. APPLICATIONS & DASHBOARD STATS
# ==========================================================

@app.route('/apply/<int:job_id>', methods=['POST'])
@jwt_required()
def apply_to_job(job_id):
    """Handles seeker applications."""
    current_user_id = get_jwt_identity()
    
    # Verify job exists
    job = Job.query.get_or_404(job_id)
    
    # Prevent duplicate applications
    existing = Application.query.filter_by(job_id=job_id, seeker_id=current_user_id).first()
    if existing:
        return jsonify({"msg": "You have already applied for this role"}), 400
        
    new_app = Application(
        job_id=job_id,
        seeker_id=current_user_id,
        status='Pending'
    )
    db.session.add(new_app)
    db.session.commit()
    return jsonify({"msg": "Application submitted successfully"}), 201

@app.route('/employer/dashboard-stats', methods=['GET'])
@jwt_required()
def get_employer_stats():
    current_user_id = get_jwt_identity()
    active_jobs = Job.query.filter_by(employer_id=current_user_id).count()
    total_apps = db.session.query(Application).join(Job).filter(Job.employer_id == current_user_id).count()
    interviews = db.session.query(Application).join(Job).filter(
        Job.employer_id == current_user_id, 
        Application.status.in_(['Accepted', 'Interviewing'])
    ).count()

    return jsonify({
        "activeJobs": active_jobs,
        "totalApplicants": total_apps,
        "interviews": interviews
    }), 200

@app.route('/seeker/my-applications', methods=['GET'])
@jwt_required()
def get_seeker_applications():
    current_user_id = get_jwt_identity()
    apps = Application.query.filter_by(seeker_id=current_user_id).all()
    return jsonify([a.to_dict() for a in apps]), 200

@app.route('/employer/my-jobs', methods=['GET'])
@jwt_required()
def get_employer_jobs():
    current_user_id = get_jwt_identity()
    jobs = Job.query.filter_by(employer_id=current_user_id).all()
    all_apps = []
    for job in jobs:
        for app_record in job.applications:
            all_apps.append(app_record.to_dict())
    return jsonify(all_apps), 200

@app.route('/applications/<int:app_id>/status', methods=['PATCH'])
@jwt_required()
def update_application_status(app_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_status = data.get('status') 

    application = Application.query.get_or_404(app_id)
    job = Job.query.get(application.job_id)
    
    if str(job.employer_id) != str(current_user_id):
        return jsonify({"msg": "Unauthorized"}), 403

    application.status = new_status
    db.session.commit()
    return jsonify({"msg": f"Status updated to {new_status}"}), 200

# ==========================================================
# 4. CV LOGIC & CONTACT
# ==========================================================

@app.route('/download-cv/<int:seeker_id>', methods=['GET'])
@jwt_required()
def download_cv(seeker_id):
    user = User.query.get_or_404(seeker_id)
    if not user.resume_path:
        return jsonify({"msg": "CV not found"}), 404
        
    try:
        # We use mimetype='application/pdf' to ensure the browser doesn't treat it as text
        # as_attachment=False allows the browser to 'preview' it in your iframe modal.
        return send_from_directory(
            app.config['UPLOAD_FOLDER'], 
            user.resume_path,
            mimetype='application/pdf',
            as_attachment=False 
        )
    except FileNotFoundError:
        return jsonify({"msg": "File not found on server"}), 404

@app.route('/seeker/upload-cv', methods=['POST'])
@jwt_required()
def upload_cv():
    if 'cv' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['cv']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    # Ensure the file is actually a PDF
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"msg": "Only PDF files are allowed"}), 400

    current_user_id = get_jwt_identity()
    filename = secure_filename(file.filename)
    # Using a timestamp or UUID is safer, but this works for now:
    unique_filename = f"cv_{current_user_id}_{filename}"
    
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    
    user = User.query.get(current_user_id)
    user.resume_path = unique_filename
    db.session.commit()
    return jsonify({"msg": "CV uploaded successfully"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)