from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, Job, User, Application, EmployerProfile
import os
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI") or "sqlite:///recruitconnect.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY") or "super-secret-key"

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app=app, db=db)

db.init_app(app)

from routes import jobs_bp, applications_bp, auth_bp, companies_bp, users_bp, notifications_bp, upload_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
app.register_blueprint(applications_bp, url_prefix='/api/applications')
app.register_blueprint(companies_bp, url_prefix='/api/companies')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(upload_bp, url_prefix='/api/upload')

@app.route('/')
def index():
    return {"message": "RecruitConnect API is running"}

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_identity = get_jwt_identity()
    user_id = user_identity['id'] if isinstance(user_identity, dict) else user_identity
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    if user.role == 'seeker':
        apps = Application.query.filter_by(user_id=user_id).all()
        data = [{
            "job_title": app.job.title if app.job else "Unknown",
            "company": app.job.company.name if app.job and app.job.company else "Unknown",
            "status": app.status,
            "applied_at": app.applied_at.strftime("%Y-%m-%d") if app.applied_at else "Unknown"
        } for app in apps]
        return jsonify({"role": "seeker", "applications": data}), 200

    else:
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)

