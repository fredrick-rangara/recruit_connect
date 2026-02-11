# backend/seed.py
from app import app
from models import db, User, Job # Import everything from models.py

def seed_database():
    with app.app_context():
        print("Blueprints found:", db.metadata.tables.keys())
        
        print("Cleaning out old data...")
        db.drop_all()
        db.create_all()
        
        print("Creating an admin employer...")
        admin = User(
            full_name="Admin Employer",
            email="employer@test.com",
            role="employer"
        )
        admin.set_password("password123")
        db.session.add(admin)
        db.session.commit() # We commit here to get the admin.id

        print("Creating mock jobs...")
        sample_jobs = [
            Job(
                title="Senior Full Stack Developer",
                company="TechVanguard",
                location="Remote",
                salary="$140k - $180k",
                description="React and Python expert needed.",
                employer_id=admin.id # Linked to our new user
            ),
            Job(
                title="UI/UX Designer",
                company="Creative Pulse",
                location="New York, NY",
                salary="$95k - $120k",
                description="Build beautiful interfaces.",
                employer_id=admin.id
            )
        ]

        db.session.bulk_save_objects(sample_jobs)
        db.session.commit()
        print("Successfully seeded database with 1 user and 2 jobs!")

if __name__ == "__main__":
    seed_database()