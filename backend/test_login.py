import requests

BASE_URL = "http://localhost:5000/api"

def test_login():
    print("Testing Login...")
    
    # Test with known seeded user
    payload = {
        "email": "seeker@example.com",
        "password": "password123"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=payload)
        print(f"Login Status: {r.status_code}")
        if r.status_code == 200:
            print("Login Successful!")
            print(f"Token: {r.json().get('access_token')[:20]}...")
        else:
            print(f"Login Failed: {r.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
