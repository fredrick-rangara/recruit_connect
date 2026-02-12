from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from models import db
import os
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI") or "sqlite:///recruitconnect.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY") or "super-secret-key"

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app=app, db=db)

db.init_app(app)

from routes import jobs_bp, applications_bp, auth_bp, companies_bp, users_bp, notifications_bp, upload_bp, dashboard_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
app.register_blueprint(applications_bp, url_prefix='/api/applications')
app.register_blueprint(companies_bp, url_prefix='/api/companies')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(upload_bp, url_prefix='/api/upload')
app.register_blueprint(dashboard_bp, url_prefix='/api')

@app.route('/')
def index():
    return {"message": "RecruitConnect API is running"}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)

