import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv # New Import
from models import db, bcrypt
from auth import auth_bp
from routes import main_bp

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
# It will look for DATABASE_URL in .env, otherwise use your local postgres setup
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://freddy:your_password@localhost:5432/recruitconnect_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key-change-this')

# Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(main_bp, url_prefix='/api')

if __name__ == '__main__':
    # Note: With Flask-Migrate, we usually rely on migrations 
    # but create_all() is fine for a quick first run.
    with app.app_context():
        db.create_all() 
    app.run(debug=True, port=5000)