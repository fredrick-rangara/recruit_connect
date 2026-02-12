# Fix Errors in RecruitConnect

## Errors Identified:
1. Missing API Configuration (`api.js` file doesn't exist)
2. Inconsistent API URLs across frontend components
3. Missing Authorization Headers for JWT
4. Route Mismatch between frontend and backend
5. Invalid Syntax in Signup.jsx

## Fixes to Implement:

### 1. Create API Configuration
- [x] Create `frontend/src/api.js` with axios instance and JWT interceptors

### 2. Fix EmployerDashboard.jsx
- [x] Update to use proper API endpoints
- [x] Fix dashboard endpoint to `/api/dashboard`
- [x] Fix application status update endpoint to `/api/applications/:id`
- [x] Add proper error handling

### 3. Fix Login.jsx
- [x] Update endpoint to `/api/auth/login`
- [x] Add proper JWT token storage
- [x] Fix navigation logic based on user role

### 4. Fix Signup.jsx
- [x] Fix invalid `throws` keyword
- [x] Fix invalid `aria-placeholder` attribute
- [x] Update endpoint to `/api/auth/register`
- [x] Add proper form field names matching backend

### 5. Fix Backend Routes
- [x] Create proper dashboard blueprint in routes.py
- [x] Register dashboard blueprint in app.py
- [x] Remove duplicate dashboard code from app.py

## Follow-up Steps:
- [ ] Run `npm install` in frontend to verify dependencies
- [ ] Run backend server to test API endpoints
- [ ] Test login/signup flow

