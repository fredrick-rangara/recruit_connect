import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db, bcrypt
from auth import auth_bp
from routes import main_bp

app = Flask(__name__)
CORS(app) # Crucial for React to talk to Flask!

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/recruitconnect'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-this' # Change for production!

# Initialize Extensions
db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(main_bp, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Generates tables if they don't exist
    app.run(debug=True, port=5000)