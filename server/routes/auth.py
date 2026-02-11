# Blueprint for authentication related routes
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

auth_bp = Blueprint('auth', __name__)

# Register a new user
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Check if a user with the provided email already exists
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"msg": "Email already exists"}), 400
        
    # Create a new user instance and set its password hash
    user = User(
        username=data.get('username'),
        email=data.get('email'),
        role=data.get('role', 'seeker')
    )
    user.set_password(data.get('password'))
    
    db.session.add(user)
    db.session.commit()
    
    # Generate a JWT token for the user and return user data
    access_token = create_access_token(identity=user.id)
    user_data = user.to_dict(only=('id', 'username', 'email', 'role'))
    if user.role == 'employer' and user.employer_profile and user.employer_profile.company:
        user_data['company_name'] = user.employer_profile.company.name
    return jsonify(access_token=access_token, user=user_data), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=user.id)
        user_data = user.to_dict(only=('id', 'username', 'email', 'role'))
        if user.role == 'employer' and user.employer_profile and user.employer_profile.company:
            user_data['company_name'] = user.employer_profile.company.name
        return jsonify(access_token=access_token, user=user_data), 200
        
    return jsonify({"msg": "Bad email or password"}), 401

@auth_bp.route('/me', methods=['GET', 'PATCH'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if request.method == 'GET':
        user_data = user.to_dict(only=('id', 'username', 'email', 'role', 'biography', 'interests'))
        if user.role == 'employer' and user.employer_profile and user.employer_profile.company:
            user_data['company_name'] = user.employer_profile.company.name
        return jsonify(user_data), 200
        
    data = request.get_json()
    for key in ['biography', 'interests', 'username']:
        if key in data:
            setattr(user, key, data[key])
            
    db.session.commit()
    user_data = user.to_dict(only=('id', 'username', 'email', 'role', 'biography', 'interests'))
    if user.role == 'employer' and user.employer_profile and user.employer_profile.company:
        user_data['company_name'] = user.employer_profile.company.name
    return jsonify(user_data), 200
