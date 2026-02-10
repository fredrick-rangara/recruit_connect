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

@app.route('/jobs/<int:id>/apply', methods=['POST'])
@jwt_required()
def apply_to_job(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role != 'job_seeker':
        return jsonify({"msg": "Only seekers can apply"}), 403
        
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

# ==========================================================
# 4. NEW: CONTACT US LOGIC
# ==========================================================

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({"msg": "All fields are required"}), 400

    # Logic: Print to terminal for now
    print("\n--- NEW CONTACT MESSAGE ---")
    print(f"From: {name} ({email})")
    print(f"Message: {message}")
    print("---------------------------\n")

    # In a real app, you would save to a 'Messages' table:
    # new_msg = ContactMessage(name=name, email=email, message=message)
    # db.session.add(new_msg)
    # db.session.commit()

    return jsonify({"msg": "Success! Your message was received."}), 200

# ==========================================================
# 5. MISC
# ==========================================================

@app.route('/seeker/upload-cv', methods=['POST'])
@jwt_required()
def upload_cv():
    if 'cv' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['cv']
    return jsonify({"msg": f"File {file.filename} received and processed"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)