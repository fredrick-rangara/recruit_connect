from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "User already exists"}), 400

    new_user = User(
    full_name=data['full_name'],
    email=data['email'],
    role=data.get('role', 'seeker') # This picks up the selection from the dropdown
)
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        # Create a token that includes the user identity and role
        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        return jsonify(access_token=access_token, role=user.role), 200
    
    return jsonify({"msg": "Bad email or password"}), 401