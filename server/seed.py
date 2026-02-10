import sys
import os

# Ensure the root directory is in the path so we can find the 'server' package
sys.path.append(os.getcwd())

from server import create_app
from server.models import db, User, Job

app = create_app()

def seed_database():
    with app.app_context():
        print("🚀 Starting database seed...")

        # 1. Clean existing data (Order matters because of Foreign Keys)
        print("Emptying existing tables...")
        Job.query.delete()
        User.query.delete()
        db.session.commit()

        # 2. Create Users
        print("Creating users...")
        
        # Employer User
        employer = User(
            full_name="Jane HR Manager",
            email="employer@recruit.com",
            role="employer"
        )
        employer.set_password("admin123") # We'll use this for testing login

        # Job Seeker User
        seeker = User(
            full_name="Alex Seeker",
            email="seeker@recruit.com",
            role="job-seeker"
        )
        seeker.set_password("seeker123")

        db.session.add_all([employer, seeker])
        db.session.commit() # Commit to generate IDs for the Job foreign keys

       # 3. Create Jobs
        print("Creating sample job listings...")
        
        jobs = [
            Job(
                title="Senior Product Designer",
                company="Apple",
                location="Remote",
                salary="$120k - $150k",
                job_type="Full Time",    # Changed from type to job_type
                experience="5+ Years",
                description="Lead the design of next-gen consumer products.",
                user_id=employer.id      # Ensure this matches the FK name in your model
            ),
            Job(
                title="Frontend Engineer (React)",
                company="Slack",
                location="San Francisco, CA",
                salary="$100k - $130k",
                job_type="Full Time",    # Changed from type to job_type
                experience="3+ Years",
                description="Work with React features and Tailwind CSS.",
                user_id=employer.id
            )
        ]

        db.session.add_all(jobs)
        db.session.commit()

        print("✅ Database seeded successfully!")

if __name__ == "__main__":
    seed_database()