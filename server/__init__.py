from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin123@localhost:5432/recruit_connect'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'dev-secret-key-123' # In production, use an environment variable

    # Initialize Extensions
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # --- ROUTES ---

    @app.route('/', methods=['GET'])
    def index():
        return jsonify({"message": "RecruitConnect API is Running"}), 200

    # AUTH: Register
    @app.route('/register', methods=['POST'])
    def register():
        from .models import User
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password required"}), 400
        
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({"error": "Email already registered"}), 400
            
        try:
            new_user = User(
                full_name=data.get('full_name'),
                email=data.get('email'),
                role=data.get('role', 'job-seeker')
            )
            new_user.set_password(data.get('password'))
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "User registered successfully"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    # AUTH: Login
    @app.route('/login', methods=['POST'])
    def login():
        from .models import User
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        
        if user and user.check_password(data.get('password')):
            token = create_access_token(identity=str(user.id))
            return jsonify({
                "token": token,
                "user": {"id": user.id, "full_name": user.full_name, "role": user.role}
            }), 200
        return jsonify({"error": "Invalid credentials"}), 401

    # JOBS: Get All
    @app.route('/jobs', methods=['GET'])
    def get_jobs():
        from .models import Job
        jobs = Job.query.all()
        return jsonify([job.to_dict() for job in jobs]), 200

    # JOBS: Create (Protected)
    @app.route('/jobs', methods=['POST'])
    @jwt_required()
    def create_job():
        from .models import Job
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            new_job = Job(
                title=data.get('title'),
                company=data.get('company'),
                location=data.get('location'),
                salary=data.get('salary'),
                job_type=data.get('job_type'),
                experience=data.get('experience'),
                description=data.get('description'),
                user_id=current_user_id
            )
            db.session.add(new_job)
            db.session.commit()
            return jsonify(new_job.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    # JOBS: Delete (Protected)
    @app.route('/jobs/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_job(id):
        from .models import Job
        current_user_id = get_jwt_identity()
        job = Job.query.get_or_404(id)
        
        if str(job.user_id) != str(current_user_id):
            return jsonify({"error": "Unauthorized to delete this job"}), 403
            
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": "Job deleted"}), 200

    return app