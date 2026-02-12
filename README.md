# RecruitConnect

A modern, full-stack job board platform connecting job seekers with top employers. Built with React (Vite) and Flask.

## Features

### For Job Seekers
-   **Job Search**: Filter jobs by title, location, category, and more.
-   **User Dashboard**: "Welcome Back" dashboard with application tracking and profile stats.
-   **Profile Management**: Edit profile details (Bio, Interests) and upload CVs (PDF/DOCX).
-   **Job Actions**: Save interesting jobs and apply with a resume/cover letter.

### For Employers
-   **Recruitment Hub**: Dedicated dashboard for managing active listings and pipelines.
-   **Job Posting**: Create and edit job listings with detailed descriptions.
-   **Applicant Tracking**: View applicants for each job, review resumes, and move candidates through hiring stages (Screening -> Interview -> Offer).

## Tech Stack

-   **Frontend**: React, Redux Toolkit, React Router, Tailwind-like CSS, React Hot Toast.
-   **Backend**: Flask, SQLAlchemy, Flask-JWT-Extended, Flask-Migrate.
-   **Database**: SQLite (Development) / PostgreSQL (Production ready).

## Setup Instructions

### Backend (Flask)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run database migrations:
    ```bash
    flask db upgrade
    ```
4.  Start the server:
    ```bash
    python app.py
    ```
    The API will run at `http://localhost:5000`.

### Frontend (React)

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will run at `http://localhost:5173`.

## API Overview

### Authentication
-   `POST /auth/signup`: Register a new user (seeker/employer).
-   `POST /auth/login`: Authenticate and receive JWT.
-   `PATCH /auth/me`: Update profile details.

### Jobs
-   `GET /jobs`: Fetch all jobs (public).
-   `POST /jobs`: Create a new job (Employer only).
-   `GET /jobs/:id`: Get job details.
-   `POST /jobs/save`: Save a job (Seeker only).

### Applications
-   `POST /applications`: Apply for a job.
-   `GET /applications/me`: Get my applications (Seeker).
-   `GET /applications/employer`: Get applications for my jobs (Employer).
-   `PATCH /applications/:id`: Update application status (Employer only).

### File Upload
-   `POST /upload`: Upload resume/CV.

## Demo Accounts

All seeded accounts use the password: **`password123`**

### Employer Account
| Username | Email | Role |
|----------|-------|------|
| employer1 | employer@example.com | employer |

### Job Seeker Accounts
| Username | Email | Interests |
|----------|-------|-----------|
| seeker1 | seeker@example.com | Engineering, Design |
| alice_dev | alice@dev.com | Engineering, Cloud |
| bob_design | bob@design.com | Design, UI/UX |
| charlie_data | charlie@data.com | Data Science, AI |
| diana_hr | diana@hr.com | HR, Operations |
| evan_qa | evan@qa.com | Engineering, QA |
| fiona_marketer | fiona@marketing.com | Marketing, SEO |
| george_backend | george@server.com | Engineering, DevOps |
| hannah_mobile | hannah@mobile.com | Engineering, Mobile |
| ian_product | ian@product.com | Product, Strategy |
| jenny_sales | jenny@sales.com | Sales, Business |

### Seeded Data
- **2 Companies**: TechCorp (Nairobi), InnoSoft (Mombasa)
- **5 Jobs**: Frontend Developer, Backend Engineer, Product Designer, Marketing Manager, QA Engineer
- **3 Applications**: alice → Frontend Dev (applied), bob → Frontend Dev (screening), charlie → Backend Eng (interview)

## Deployment

Deployed on **Railway** (backend + PostgreSQL) and **Netlify** (frontend).

### Backend (Railway)
- **Platform**: Railway with Nixpacks
- **Database**: Railway PostgreSQL plugin
- **Environment Variables**: `DATABASE_URL` (auto-set by Postgres plugin), `JWT_SECRET_KEY`
- **Start Command**: `cd backend && python create_tables.py && gunicorn wsgi:app --bind 0.0.0.0:$PORT`

### Frontend (Netlify)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Base Directory**: `client`
- **Environment Variables**: `VITE_API_URL` = `https://<your-railway-url>/api`

