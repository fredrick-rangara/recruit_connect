import os
from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)

# 1. Database Configuration
# This ensures we use the same DB file throughout the project
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///recruitconnect.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# 2. Security & JWT Configuration
app.secret_key = os.environ.get('SECRET_KEY') or b'\x17\x02\xad\xee\xdd\xbf\xce\xf1\x18\xe4\x8e\x19'
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY') or "super-secret-moringa-key" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

# 3. Initialize Extensions
# The naming_convention is great for avoiding migration errors later!
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize everything ONCE
db = SQLAlchemy(app, metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)