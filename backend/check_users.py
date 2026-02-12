from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    users = User.query.all()
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f"ID: {u.id} | User: {u.username} | Email: {u.email} | Role: {u.role}")
