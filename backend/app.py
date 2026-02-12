from flask import Flask, jsonify # Add jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, Job # Import Job model here
import os
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

from auth import auth_bp

# load env vars
load_dotenv()


app = Flask(__name__)
# setup a bcrypt instance
bcrypt = Bcrypt(app)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")

jwt = JWTManager(app)
# instatiate Migrate class
migrate = Migrate(app=app, db=db)

db.init_app(app) 

# register blueprints
app.register_blueprint(auth_bp)

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