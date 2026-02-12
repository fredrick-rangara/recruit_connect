import os
from app import create_app
from models import db

app = create_app()
with app.app_context():
    # Debug: show which database we're connecting to
    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', 'NOT SET')
    # Mask password for logging
    if '@' in db_uri:
        masked = db_uri.split('@')[0][:20] + '***@' + db_uri.split('@')[1]
    else:
        masked = db_uri
    print(f"Connecting to: {masked}")
    
    db.create_all()
    print("All tables created successfully")
    
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"Tables in database: {tables}")
