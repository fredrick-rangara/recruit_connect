from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, User
from utils.auth_utils import role_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/talent', methods=['GET'])
def get_talent():
    query = User.query.filter_by(role='seeker')
    
    search = request.args.get('search') or request.args.get('query')
    
    if search:
        query = query.filter(db.or_(
            User.username.ilike(f"%{search}%"),
            User.biography.ilike(f"%{search}%"),
            User.interests.ilike(f"%{search}%")
        ))
        
    talent = query.all()
    return jsonify([t.to_dict(only=('id', 'username', 'email', 'biography', 'interests')) for t in talent]), 200
