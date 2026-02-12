from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models import User

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Ensure JWT is valid
            verify_jwt_in_request()
            
            # Get user identity from token
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({"msg": "User not found"}), 404
            
            # Check if user has the required role
            if user.role != role:
                return jsonify({"msg": "Access forbidden: Insufficient permissions"}), 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator
