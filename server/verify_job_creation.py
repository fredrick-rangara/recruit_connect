import requests
import time

BASE_URL = "http://localhost:5000/api"

def verify_job_Listings():
    print("Verifying Job Creation & Listing Visibility...")

    # 1. Login as Employer
    employer_creds = {"email": "employer@example.com", "password": "password123"}
    resp = requests.post(f"{BASE_URL}/auth/login", json=employer_creds)
    if resp.status_code != 200:
        print(f"Employer Login Failed: {resp.text}")
        return
    
    token = resp.json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create Job
    job_payload = {
        "title": f"Test Job {int(time.time())}",
        "description": "This is a test job description for verification.",
        "category": "Engineering",
        "location": "Remote",
        "salary_range": "$100k - $120k",
        "experience_level": "Senior",
        "benefits": "Remote work, Health insurance",
        "company_name": "Test Company"
    }
    
    create_resp = requests.post(f"{BASE_URL}/jobs", json=job_payload, headers=headers)
    if create_resp.status_code != 201:
        print(f"Job Creation Failed: {create_resp.text}")
        return
        
    print(f"Job Created: {job_payload['title']}")
    
    # 3. Fetch Listings (Public Endpoint)
    listings_resp = requests.get(f"{BASE_URL}/jobs")
    if listings_resp.status_code != 200:
        print(f"Fetch Listing Failed: {listings_resp.text}")
        return
        
    jobs = listings_resp.json()
    found = any(job['title'] == job_payload['title'] for job in jobs)
    
    if found:
        print("SUCCESS: Job appears in listings!")
    else:
        print("FAILURE: Job NOT found in listings.")

if __name__ == "__main__":
    verify_job_Listings()
