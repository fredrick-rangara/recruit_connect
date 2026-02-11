import requests
import os

BASE_URL = "http://localhost:5000/api"

def test_upload():
    print("Testing File Upload...")
    
    # Create a dummy PDF file
    with open("test_cv.pdf", "wb") as f:
        f.write(b"%PDF-1.4 dummy content")
        
    files = {'file': open('test_cv.pdf', 'rb')}
    r = requests.post(f"{BASE_URL}/upload/", files=files)
    print(f"Upload Status: {r.status_code}")
    if r.status_code == 201:
        print(f"File URL: {r.json()['url']}")
        
        # Verify file is accessible
        filename = r.json()['url'].split('/')[-1]
        r_file = requests.get(f"{BASE_URL}/upload/{filename}")
        print(f"File Access Status: {r_file.status_code}")
    else:
        print(r.text)
        
    os.remove("test_cv.pdf")

if __name__ == "__main__":
    try:
        test_upload()
    except Exception as e:
        print(f"Error: {e}")
