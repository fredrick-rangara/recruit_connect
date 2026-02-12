"""
Create database tables for RecruitConnect.
This script is used by Railway deployment to initialize the database.
"""
from app import create_app
from models import db

def create_tables():
    app = create_app()
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    create_tables()

