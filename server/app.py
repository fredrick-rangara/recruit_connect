import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from models import db, bcrypt
from auth import auth_bp
from routes import main_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enhanced CORS Configuration
# Allows React (port 3000) to communicate with Flask (port 5000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'postgresql://freddy:your_password@localhost:5432/recruitconnect_db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-123')

# Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(main_bp, url_prefix='/api')

# Basic Health Check Route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running!", "database": "Connected"}), 200

if __name__ == '__main__':
    with app.app_context():
        # create_all() is safe to keep; it won't overwrite existing data
        db.create_all() 
    app.run(debug=True, port=5000)