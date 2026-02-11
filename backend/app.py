from flask import Flask, jsonify # Add jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db, Job # Import Job model here

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///job_hunter'
app.config['JWT_SECRET_KEY'] = 'your-super-secret-key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app) 
jwt = JWTManager(app)

# --- ADD THIS ROUTE ---
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        jobs = Job.query.all()
        return jsonify([{
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "salary": j.salary,
            "description": j.description
        } for j in jobs]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ----------------------

@app.route('/')
def index():
    return {"message": "RecruitConnect API is running"}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)