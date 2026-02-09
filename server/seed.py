from app import app
from models import db, User, Job
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def seed_database():
    with app.app_context():
        # Ensure tables exist before trying to delete/insert
        print("Ensuring tables are created...")
        db.create_all()

        print("Emptying database...")
        Job.query.delete()
        User.query.delete()

        print("Creating users...")
        # Password for both: 'password123'
        hashed_pw = bcrypt.generate_password_hash('password123').decode('utf-8')

        # Changed 'password' to 'password_hash' to match your Model
        employer = User(
            full_name="TechCorp Solutions",
            email="hr@techcorp.com",
            password_hash=hashed_pw, 
            role="employer"
        )

        seeker = User(
            full_name="Freddy Dev",
            email="freddy@test.com",
            password_hash=hashed_pw, 
            role="seeker"
        )

        db.session.add_all([employer, seeker])
        db.session.commit()

        print("Creating job listings...")
        # Now that employer is committed, we have employer.id
        jobs = [
            Job(
                title="Senior React Developer",
                company_name="TechCorp Solutions",
                location="Remote",
                salary_range="$80k - $120k",
                description="Looking for a React expert to build modern UIs.",
                employer_id=employer.id
            ),
            Job(
                title="UI/UX Designer",
                company_name="Designly",
                location="Nairobi, KE",
                salary_range="$50k - $70k",
                description="Help us design the next generation of mobile apps.",
                employer_id=employer.id
            ),
            Job(
                title="Backend Engineer (Python)",
                company_name="DataStream",
                location="Hybrid",
                salary_range="$90k - $130k",
                description="Expertise in Flask or Django required.",
                employer_id=employer.id
            )
        ]

        db.session.add_all(jobs)
        db.session.commit()

        print("Seeding complete! Log in with: hr@techcorp.com / password123")

if __name__ == '__main__':
    seed_database()