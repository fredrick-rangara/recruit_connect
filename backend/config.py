import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    _db_url = os.environ.get('DATABASE_URL') or 'sqlite:///recruitconnect.db'
    # Railway provides postgres:// but SQLAlchemy 1.4+ requires postgresql://
    if _db_url.startswith('postgres://'):
        _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
