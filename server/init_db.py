"""
Database initialization script for Recruit Connect
Run this script to create/update the database tables
"""

from app import create_app
from models import db

def init_database():
    """Initialize the database"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully!")
        
        # Print table info
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"\nTables created: {', '.join(tables)}")

if __name__ == '__main__':
    init_database()

