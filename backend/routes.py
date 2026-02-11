@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_identity = get_jwt_identity()
    user_id = user_identity['id']
    role = user_identity['role']

    if role == 'seeker':
        # Get all jobs this seeker applied for
        apps = Application.query.filter_by(user_id=user_id).all()
        data = [{
            "job_title": app.job.title,
            "company": app.job.company,
            "status": app.status,
            "applied_at": app.applied_at.strftime("%Y-%m-%d")
        } for app in apps]
        return jsonify({"role": "seeker", "applications": data}), 200

    else:
        # Employer: Get all jobs they posted and the applicants for each
        my_jobs = Job.query.filter_by(employer_id=user_id).all()
        data = []
        for job in my_jobs:
            applicants = [{
                "app_id": app.id,
                "candidate_name": app.user.full_name,
                "email": app.user.email,
                "status": app.status
            } for app in job.applications] # Assumes 'applications' relationship in Job model
            
            data.append({
                "job_id": job.id,
                "title": job.title,
                "applicant_count": len(applicants),
                "applicants": applicants
            })
        return jsonify({"role": "employer", "postings": data}), 200