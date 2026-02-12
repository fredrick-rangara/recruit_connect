from app import create_app
from models import db, Company, Job, User, EmployerProfile, Application

app = create_app()

with app.app_context():
    print("Seeding database...")
    
    # Clear existing data
    db.drop_all()
    db.create_all()
    
    # Create companies
    c1 = Company(name="TechCorp", description="Leading tech solutions.", location="Nairobi", website="https://techcorp.com", size="51-200", industry="Technology", culture_description="Fast-paced and innovative.")
    c2 = Company(name="InnoSoft", description="Innovative software factory.", location="Mombasa", website="https://innosoft.io", size="11-50", industry="Software", culture_description="Collaborative and remote-friendly.")
    db.session.add_all([c1, c2])
    db.session.commit()
    
    # Create jobs
    jobs = [
        Job(title="Frontend Developer", description="React specialist needed for a fast-paced environment.", category="Engineering", location="Remote", salary_range="100k - 150k", experience_level="Mid-Senior", company_id=c1.id, benefits="Health insurance, Remote work"),
        Job(title="Backend Engineer", description="Flask and PostgreSQL expert to build robust APIs.", category="Engineering", location="Nairobi", salary_range="120k - 180k", experience_level="Mid-Senior", company_id=c1.id, benefits="Stock options, Paid leave"),
        Job(title="Product Designer", description="UI/UX design for cutting-edge mobile apps.", category="Design", location="Mombasa", salary_range="80k - 120k", experience_level="Junior", company_id=c2.id, benefits="Learning budget"),
        Job(title="Marketing Manager", description="Scale our user base globally.", category="Marketing", location="Nairobi", salary_range="90k - 130k", experience_level="Director", company_id=c2.id, benefits="Bonuses"),
        Job(title="QA Engineer", description="Ensure high quality software delivery.", category="Engineering", location="Remote", salary_range="70k - 110k", experience_level="Junior", company_id=c1.id, benefits="Flexible hours")
    ]
    db.session.add_all(jobs)
    
    # Create seekers
    seekers = [
        User(username="alice_dev", email="alice@dev.com", role="seeker", interests="Engineering, Cloud", biography="Full-stack developer with 5 years of experience in React and Node.js."),
        User(username="bob_design", email="bob@design.com", role="seeker", interests="Design, UI/UX", biography="Creative designer focused on minimalist and accessible interfaces."),
        User(username="charlie_data", email="charlie@data.com", role="seeker", interests="Data Science, AI", biography="Masters in Statistics, exploring the world of Machine Learning."),
        User(username="diana_hr", email="diana@hr.com", role="seeker", interests="HR, Operations", biography="Passionate about building inclusive and high-performing cultures."),
        User(username="evan_qa", email="evan@qa.com", role="seeker", interests="Engineering, QA", biography="Expert in automated testing and continuous integration."),
        User(username="fiona_marketer", email="fiona@marketing.com", role="seeker", interests="Marketing, SEO", biography="Digital marketer specialized in organic growth and content strategy."),
        User(username="george_backend", email="george@server.com", role="seeker", interests="Engineering, DevOps", biography="Python enthusiast with a focus on scalable microservices."),
        User(username="hannah_mobile", email="hannah@mobile.com", role="seeker", interests="Engineering, Mobile", biography="Swift and Kotlin developer building seamless mobile experiences."),
        User(username="ian_product", email="ian@product.com", role="seeker", interests="Product, Strategy", biography="Bridging the gap between business goals and technical execution."),
        User(username="jenny_sales", email="jenny@sales.com", role="seeker", interests="Sales, Business", biography="Results-driven sales executive with a background in SaaS."),
        User(username="kevin_security", email="kevin@security.com", role="seeker", interests="Engineering, Security", biography="Cybersecurity specialist ensuring data protection and privacy."),
        User(username="laura_writer", email="laura@content.com", role="seeker", interests="Writing, Branding", biography="Storyteller crafting compelling brand narratives and copy."),
        User(username="mike_support", email="mike@support.com", role="seeker", interests="Customer Success, Support", biography="Dedicated support lead focused on customer satisfaction and retention."),
        User(username="nina_legal", email="nina@legal.com", role="seeker", interests="Legal, Compliance", biography="Legal counsel with expertise in tech law and data regulations."),
        User(username="oscar_pm", email="oscar@pm.com", role="seeker", interests="Product, Management", biography="Driven PM with a track record of delivering successful software products."),
        User(username="seeker1", email="seeker@example.com", role="seeker", interests="Engineering, Design", biography="Passionate software engineer.")
    ]
    for s in seekers: s.set_password("password123")
    
    employer = User(username="employer1", email="employer@example.com", role="employer", biography="HR at TechCorp.")
    employer.set_password("password123")
    
    db.session.add_all(seekers + [employer])
    db.session.commit()

    # Create employer profile link
    ep = EmployerProfile(user_id=employer.id, company_id=c1.id, job_title="Senior Recruiter")
    db.session.add(ep)
    
    # Create sample applications
    a1 = Application(user_id=seekers[0].id, job_id=jobs[0].id, resume_url="https://drive.com/resume-alice", cover_letter="I am very interested in the Frontend role.", status="applied")
    a2 = Application(user_id=seekers[1].id, job_id=jobs[0].id, resume_url="https://drive.com/resume-bob", cover_letter="I have great UI/UX skills.", status="screening")
    a3 = Application(user_id=seekers[2].id, job_id=jobs[1].id, resume_url="https://drive.com/resume-charlie", cover_letter="Python developer ready for Backend challenges.", status="interview")
    db.session.add_all([a1, a2, a3])
    
    db.session.commit()
    print("Seed complete.")
