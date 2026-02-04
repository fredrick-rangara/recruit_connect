from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.job import Job
from app.models.user import User

jobs_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")
