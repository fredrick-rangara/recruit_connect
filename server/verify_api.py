import requests
import sys

BASE_URL = "http://localhost:5000/api"

def test_flow():
    print("Starting API verification...")
    
    # 1. Signup Seekers and Employers
    seeker_data = {
        "username": "seeker_test",
        "email": "seeker_test@example.com",
        "password": "password123",
        "role": "seeker"
    }
    employer_data = {
        "username": "employer_test",
        "email": "employer_test@example.com",
        "password": "password123",
        "role": "employer"
    }
    
    print("\n[1] Testing Signup...")
    r = requests.post(f"{BASE_URL}/auth/signup", json=seeker_data)
    print(f"Seeker Signup: {r.status_code}")
    if r.status_code != 201:
        print(r.text)
    seeker_token = r.json().get('access_token')
    
    r = requests.post(f"{BASE_URL}/auth/signup", json=employer_data)
    print(f"Employer Signup: {r.status_code}")
    if r.status_code != 201:
        print(r.text)
    employer_token = r.json().get('access_token')
    
    # 2. Job Creation (Employer only)
    print("\n[2] Testing Job Management...")
    job_payload = {
        "title": "Backend Test Job",
        "description": "Verification of job creation",
        "category": "Engineering",
        "location": "Remote",
        "salary_range": "100k - 120k",
        "experience_level": "Mid",
        "company_name": "Test Company"
    }
    
    headers_employer = {"Authorization": f"Bearer {employer_token}"}
    headers_seeker = {"Authorization": f"Bearer {seeker_token}"}
    
    r = requests.post(f"{BASE_URL}/jobs", json=job_payload, headers=headers_employer)
    print(f"Employer create job: {r.status_code}")
    if r.status_code != 201:
        print(r.text)
    try:
        job_id = r.json().get('id')
    except:
        job_id = None
    
    r = requests.post(f"{BASE_URL}/jobs", json=job_payload, headers=headers_seeker)
    print(f"Seeker create job (should be 403): {r.status_code}")
    
    # 3. Profile Management
    print("\n[3] Testing Profile Management...")
    profile_payload = {
        "interests": "Engineering, QA",
        "biography": "Senior Test Seeker"
    }
    r = requests.patch(f"{BASE_URL}/auth/me", json=profile_payload, headers=headers_seeker)
    print(f"Update Seeker Profile: {r.status_code}")
    if r.status_code != 200:
        print(r.text)
    
    # 4. Advanced Search
    print("\n[4] Testing Advanced Search...")
    params = {"company_size": "51-200"}
    r = requests.get(f"{BASE_URL}/jobs", params=params)
    print(f"Filter by company size: {r.status_code}")
    print(f"Jobs found: {len(r.json())}")
    
    # 5. Recommendations
    print("\n[5] Testing Recommendations...")
    r = requests.get(f"{BASE_URL}/jobs/recommendations", headers=headers_seeker)
    print(f"Get Recommendations: {r.status_code}")
    if r.status_code != 200:
        print(r.text)
    try:
        print(f"Recommended Count: {len(r.json())}")
    except:
        pass
    
    # 6. Application & Notifications
    print("\n[6] Testing Notifications...")
    app_payload = {
        "job_id": job_id,
        "resume_url": "http://resume.com/test",
        "cover_letter": "I love testing."
    }
    r = requests.post(f"{BASE_URL}/applications", json=app_payload, headers=headers_seeker)
    try:
        application_id = r.json().get('id')
    except:
        application_id = None
    
    # Update status to trigger notification
    if application_id:
        requests.patch(f"{BASE_URL}/applications/{application_id}", json={"status": "accepted"}, headers=headers_employer)
    
    # Check notifications
    r = requests.get(f"{BASE_URL}/notifications", headers=headers_seeker)
    print(f"Get Notifications: {r.status_code}")
    if r.status_code != 200:
        print(r.text)
    if r.status_code == 200 and len(r.json()) > 0:
        print(f"Latest Notification: {r.json()[0]['message']}")
    
    # 7. Company Profiles
    print("\n[7] Testing Company Profiles...")
    r = requests.get(f"{BASE_URL}/companies")
    print(f"List Companies: {r.status_code}")
    if len(r.json()) > 0:
        cid = r.json()[0]['id']
        r = requests.get(f"{BASE_URL}/companies/{cid}")
        print(f"Get Company Detail: {r.status_code}")
        print(f"Company Info: {r.json().get('culture_description')}")
    
    print("\nRedesign Verification complete.")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"Error during verification: {e}")
        sys.exit(1)
