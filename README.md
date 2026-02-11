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

## Deployment

The application is configured to be deployment-ready on platforms like Render, Heroku, or others.

1.  **Environment Variables**: set `DATABASE_URL` in your deployment environment to your PostgreSQL connection string (e.g., `postgresql://user:password@host:port/dbname`).
2.  **Procfile**: A `Procfile` is included in the `server` directory to launch the app using `gunicorn`.
3.  **Build Command**: `pip install -r requirements.txt` for backend, `npm install && npm run build` for frontend.
4.  **Start Command**: `gunicorn "app:create_app()"`

