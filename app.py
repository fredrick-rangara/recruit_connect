import sys
import os

# Force Python to see the 'server' directory
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

from server import create_app, db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True)