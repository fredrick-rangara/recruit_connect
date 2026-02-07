from config import app, db, bcrypt
from models import User, Job, Application

def run_seed():
    with app.app_context():
        print("🚀 Starting seed process...")

        try:
            print("🗑️ Deleting existing data...")
            # Delete in order of dependency
            Application.query.delete()
            Job.query.delete()
            User.query.delete()
            db.session.commit()

            print("👤 Creating users...")
            pw_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
            
            # Default users for testing
            employer = User(username="Jane Recruiter", email="jane@techcorp.com", password_hash=pw_hash, role="employer")
            seeker = User(username="John Doe", email="john@moringa.com", password_hash=pw_hash, role="job_seeker")
            
            db.session.add_all([employer, seeker])
            db.session.commit() # Commit to get IDs for foreign keys

            print("💼 Creating Figma-style jobs...")
            jobs_data = [
                {
                    "title": "Junior Software Developer",
                    "company": "Bausch, Schuppe and Schmit Co",
                    "location": "New York, USA",
                    "category": "Technology",
                    "salary_max": 60000,
                    "description": "Work on cutting-edge systems for guest management."
                },
                {
                    "title": "Social Media Manager",
                    "company": "Knoeck - Becker Co",
                    "location": "Los Angeles, USA",
                    "category": "Marketing",
                    "salary_max": 52000,
                    "description": "Drive engagement and manage digital presence."
                },
                {
                    "title": "Internal Integration Planner",
                    "company": "Hirst, Quigley and Feest Inc",
                    "location": "Texas, USA",
                    "category": "Design",
                    "salary_max": 150000,
                    "description": "Oversee large-scale infrastructure integration."
                },
                {
                    "title": "District Intranet Director",
                    "company": "VonRueden - Weber Co",
                    "location": "Florida, USA",
                    "category": "Technology",
                    "salary_max": 140000,
                    "description": "Lead digital communication strategies."
                }
            ]

            created_jobs = []
            for data in jobs_data:
                job = Job(
                    title=data["title"],
                    company=data["company"],
                    location=data["location"],
                    category=data["category"],
                    salary_max=data["salary_max"],
                    description=data["description"],
                    employer_id=employer.id
                )
                db.session.add(job)
                created_jobs.append(job)
            
            db.session.commit()

            print("📝 Creating sample applications...")
            # Let's have John Doe apply to the first job
            sample_app = Application(
                job_id=created_jobs[0].id,
                seeker_id=seeker.id,
                status="Interviewing",
                resume_url="https://example.com/john_doe_cv.pdf"
            )
            db.session.add(sample_app)
            db.session.commit()

            print("✨ Seeding complete! Login info:")
            print("   Employer: jane@techcorp.com | password123")
            print("   Seeker:   john@moringa.com | password123")
            
        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            db.session.rollback()

if __name__ == '__main__':
    run_seed()