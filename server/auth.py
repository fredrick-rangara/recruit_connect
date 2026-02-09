from flask import Blueprint, request, jsonify
from models import db, User, bcrypt  # Added bcrypt import
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation
    if not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Email and password are required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "User already exists"}), 400
    
    try:
        new_user = User(
            full_name=data.get('full_name'),
            email=data.get('email'),
            role=data.get('role', 'seeker') # Default to seeker if not provided
        )
        # Use the method defined in your User model to hash the password
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Registration failed: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    
    # Verify user exists and password matches
    if user and user.check_password(password):
        # Identity must be a string representing the ID for SQLAlchemy get() compatibility
        access_token = create_access_token(identity=str(user.id)) 
        
        return jsonify({
            "access_token": access_token,
            "name": user.full_name,
            "role": user.role,
            "user_id": user.id
        }), 200
    
    # If login fails, this code executes
    return jsonify({"msg": "Invalid email or password"}), 401