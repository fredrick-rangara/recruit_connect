from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Company, User
from utils.auth_utils import role_required

companies_bp = Blueprint('companies', __name__)

@companies_bp.route('', methods=['GET'])
def get_companies():
    companies = Company.query.all()
    return jsonify([c.to_dict(rules=('-jobs',)) for c in companies]), 200

@companies_bp.route('/<int:id>', methods=['GET'])
def get_company(id):
    company = Company.query.get_or_404(id)
    return jsonify(company.to_dict()), 200

@companies_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
@role_required('employer')
def update_company(id):
    # In a production app, we'd verify the employer is associated with this company
    company = Company.query.get_or_404(id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(company, key):
            setattr(company, key, value)
            
    db.session.commit()
    return jsonify(company.to_dict()), 200
