from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.job import Job
from app.models.user import User

jobs_bp = Blueprint("jobs", __name__, url_prefix="/api/jobs")


# CREATE JOB (EMPLOYER ONLY)
@jobs_bp.route("", methods=["POST"])
@jwt_required()
def create_job():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != "employer":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    job = Job(
        employer_id=user.id,
        title=data["title"],
        description=data["description"],
        location=data.get("location"),
        category=data.get("category"),
        employment_type=data.get("employment_type"),
        experience_level=data.get("experience_level"),
        salary_min=data.get("salary_min"),
        salary_max=data.get("salary_max"),
        is_remote=data.get("is_remote", False)
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({"message": "Job created", "job_id": job.id}), 201


# GET SINGLE JOB (PUBLIC)
@jobs_bp.route("/<int:job_id>", methods=["GET"])
def get_job(job_id):
    job = Job.query.filter_by(id=job_id, status="active").first_or_404()

    return jsonify({
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "location": job.location,
        "category": job.category,
        "employment_type": job.employment_type,
        "experience_level": job.experience_level,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "is_remote": job.is_remote
    })


# SEARCH + FILTER + PAGINATION
@jobs_bp.route("/search", methods=["GET"])
def search_jobs():
    query = Job.query.filter(Job.status == "active")

    keyword = request.args.get("q")
    location = request.args.get("location")
    category = request.args.get("category")
    experience = request.args.get("experience_level")
    min_salary = request.args.get("min_salary", type=int)
    max_salary = request.args.get("max_salary", type=int)

    if keyword:
        query = query.filter(
            Job.title.ilike(f"%{keyword}%") |
            Job.description.ilike(f"%{keyword}%")
        )

    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))

    if category:
        query = query.filter(Job.category == category)

    if experience:
        query = query.filter(Job.experience_level == experience)

    if min_salary is not None:
        query = query.filter(Job.salary_min >= min_salary)

    if max_salary is not None:
        query = query.filter(Job.salary_max <= max_salary)

    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)

    pagination = query.order_by(Job.created_at.desc()).paginate(
        page=page,
        per_page=limit,
        error_out=False
    )

    return jsonify({
        "results": [
            {
                "id": job.id,
                "title": job.title,
                "location": job.location,
                "category": job.category,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max
            }
            for job in pagination.items
        ],
        "total": pagination.total,
        "page": page,
        "pages": pagination.pages
    })
