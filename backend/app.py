# Import Flask core and extensions for migration, CORS, and JWT authentication
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db, bcrypt
from config import Config

# App factory function to create and configure the Flask application
def create_app():
    app = Flask(__name__)
    # Load configuration settings (database URI, secrets, etc.)
    app.config.from_object(Config)
    
    # Initialize extensions with the app instance
    db.init_app(app)
    bcrypt.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)
    CORS(app) # Enable Cross-Origin Resource Sharing for the frontend
    
    with app.app_context():
        # Import and register blueprints to organize routes into logical groups
        from routes.auth import auth_bp
        from routes.jobs import jobs_bp
        from routes.applications import applications_bp
        from routes.companies import companies_bp
        from routes.notifications import notifications_bp
        from routes.users import users_bp
        from routes.upload import upload_bp
        
        # Define URL prefix for each blueprint
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
        app.register_blueprint(applications_bp, url_prefix='/api/applications')
        app.register_blueprint(companies_bp, url_prefix='/api/companies')
        app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
        app.register_blueprint(users_bp, url_prefix='/api/users')
        app.register_blueprint(upload_bp, url_prefix='/api/upload')
        
        # Create upload folder if it doesn't exist
        import os
        upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
    return app

if __name__ == '__main__':
    import sys
    app = create_app()
    port = 5000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    app.run(host='0.0.0.0', port=port, debug=True)

