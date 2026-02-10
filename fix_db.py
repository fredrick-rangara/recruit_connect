import sys
import os

# Get the path to the 'server' folder
server_path = os.path.join(os.getcwd(), 'server')
sys.path.append(server_path)

try:
    from __init__ import create_app
    from models import db
    from flask_migrate import upgrade, migrate, init
    
    app = create_app()

    with app.app_context():
        print("🚀 Initializing database...")
        if not os.path.exists('migrations'):
            init()
        
        # This will create the version file
        migrate(message="Initial migration")
        # This will create the tables in Postgres
        upgrade()
        print("✅ Success! Check your VS Code Postgres extension.")

except Exception as e:
    print(f"❌ Error: {e}")