import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    print("Attempting to connect to PostgreSQL...")
    try:
        # Connect to default 'postgres' database to create new db
        # Trying passwordless first, then 'postgres', then 'password'
        try:
            conn = psycopg2.connect(dbname='postgres', user='postgres', host='localhost')
        except:
             try:
                conn = psycopg2.connect(dbname='postgres', user='postgres', password='password', host='localhost')
             except:
                print("Could not connect to PostgreSQL. Is it running?")
                return False

        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if db exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'recruit_connect'")
        exists = cur.fetchone()
        
        if not exists:
            print("Creating database 'recruit_connect'...")
            cur.execute('CREATE DATABASE recruit_connect')
            print("Database created!")
        else:
            print("Database 'recruit_connect' already exists.")
            
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if create_database():
        print("SUCCESS")
    else:
        print("FAILURE")
