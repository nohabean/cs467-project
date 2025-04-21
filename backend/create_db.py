import os
# point Python at your local Postgres DLLs
os.add_dll_directory(r"C:\Program Files\PostgreSQL\17\bin")

import psycopg2
from psycopg2 import OperationalError
from connection_auth import DB_PASSWORD

# Fill in your credentials
DB_HOST = "35.224.8.223"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres"

# Note: You need to whitelist your IP

def connection_test():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        print("✅ Successfully connected to PostgreSQL on Cloud SQL!")
        conn.close()
    except OperationalError as e:
        print("❌ Connection failed:")
        print(e)

if __name__ == "__main__":
    connection_test()
