from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "User already exists"}), 400
    
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        role=data.get('role', 'seeker') # default to seeker
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
        # We store the role in the token so the frontend knows which dashboard to show
        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        return jsonify(access_token=access_token, role=user.role, name=user.full_name), 200
    
    return jsonify({"msg": "Invalid credentials"}), 401