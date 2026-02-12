import sys
from app import create_app
from models import db

app = create_app()
with app.app_context():
    db.create_all()
    print("All tables created successfully")
    # List tables to verify
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Tables in database: {tables}")
