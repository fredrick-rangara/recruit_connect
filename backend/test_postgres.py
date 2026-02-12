import psycopg2
import sys

DB_NAME = "recruit_connect"
HOST = "localhost"
PORT = "5432"

ATTEMPTS = [
    {"user": "postgres", "password": "", "desc": "No password"},
    {"user": "postgres", "password": "password", "desc": "Password: 'password'"},
    {"user": "postgres", "password": "postgres", "desc": "Password: 'postgres'"},
    {"user": "user", "password": "password", "desc": "User: 'user', Password: 'password'"}
]

def test_connection():
    print(f"Testing connection to database '{DB_NAME}' on {HOST}:{PORT}...")
    
    for attempt in ATTEMPTS:
        try:
            print(f"Trying: {attempt['desc']}...")
            conn = psycopg2.connect(
                dbname=DB_NAME,
                user=attempt['user'],
                password=attempt['password'],
                host=HOST,
                port=PORT
            )
            conn.close()
            print(f"\nSUCCESS! Connected with:")
            print(f"User: {attempt['user']}")
            print(f"Password: {'(none)' if not attempt['password'] else attempt['password']}")
            
            # Construct URI
            if attempt['password']:
                uri = f"postgresql://{attempt['user']}:{attempt['password']}@{HOST}:{PORT}/{DB_NAME}"
            else:
                uri = f"postgresql://{attempt['user']}@{HOST}:{PORT}/{DB_NAME}"
            print(f"URI: {uri}")
            return True
        except psycopg2.OperationalError as e:
            print(f"Failed: {str(e).strip()}")
        except Exception as e:
            print(f"Error: {str(e).strip()}")
            
    print("\nCould not connect with common default credentials.")
    return False

if __name__ == "__main__":
    test_connection()
