from app import create_app
from models import Job, Company, User

app = create_app()

with app.app_context():
    job_count = Job.query.count()
    print(f"Total Jobs: {job_count}")
    if job_count > 0:
        print("Sample Job:", Job.query.first().title)
