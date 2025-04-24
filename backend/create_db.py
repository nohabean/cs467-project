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
        print("Successfully connected to PostgreSQL on Cloud SQL!")
        conn.close()
    except OperationalError as e:
        print("Connection failed:")
        print(e)

def create_database():
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        conn.autocommit = True
        cursor = conn.cursor()

        print("Connected to PostgreSQL on Cloud SQL!")

        # Create tables

        # Users Table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            username VARCHAR(50) PRIMARY KEY NOT NULL UNIQUE,
            email VARCHAR(100) UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        ''')
        print("Users table created successfully!")

        # Tags Table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS tags (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        ''')
        print("Tags table created successfully!")

        # Listing Table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS listing (
            id SERIAL PRIMARY KEY NOT NULL,
            active_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (active_status IN ('active', 'inactive')),
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            seller VARCHAR(50) NOT NULL,
            price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
            created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            expiration_datetime TIMESTAMP,
            FOREIGN KEY (seller) REFERENCES users(username)
        );
        ''')
        print("Listing table created successfully!")

        # Images Table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS images (
            id SERIAL PRIMARY KEY NOT NULL,
            filename VARCHAR(255) NOT NULL,
            listing_id INTEGER NOT NULL,
            is_primary BOOLEAN NOT NULL DEFAULT false,
            created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (listing_id) REFERENCES listing(id)
        );
        ''')
        print("Images table created successfully!")

        # Listing_tag Table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS listing_tag (
            listing_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (listing_id, tag_id),
            FOREIGN KEY (listing_id) REFERENCES listing(id),
            FOREIGN KEY (tag_id) REFERENCES tags(id)
        );
        ''')
        print("Listing_tag table created successfully!")

        # Listing_image Table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS listing_image (
            listing_id INTEGER NOT NULL,
            image_id INTEGER NOT NULL,
            created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (listing_id, image_id),
            FOREIGN KEY (listing_id) REFERENCES listing(id),
            FOREIGN KEY (image_id) REFERENCES images(id)
        );
        ''')
        print("Listing_image table created successfully!")

        # Messages Table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY NOT NULL,
            sender VARCHAR(50) NOT NULL,
            receiver VARCHAR(50) NOT NULL,
            sent_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            message_body TEXT NOT NULL,
            FOREIGN KEY (sender) REFERENCES users(username),
            FOREIGN KEY (receiver) REFERENCES users(username)
        );
        ''')
        print("Messages table created successfully!")

        print("All tables created successfully!")

        cursor.close()
        conn.close()

    except OperationalError as e:
        print("Connection failed:")
        print(e)
    except Exception as e:
        print("Error creating tables:")
        print(e)

def drop__and_create_tables():
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        conn.autocommit = True
        cursor = conn.cursor()

        print("Connected to PostgreSQL on Cloud SQL!")

        # Drop tables in the correct order to respect foreign key constraints
        cursor.execute('''
        DROP TABLE IF EXISTS messages CASCADE;
        DROP TABLE IF EXISTS listing_image CASCADE;
        DROP TABLE IF EXISTS listing_tag CASCADE;
        DROP TABLE IF EXISTS images CASCADE;
        DROP TABLE IF EXISTS listing CASCADE;
        DROP TABLE IF EXISTS tags CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        ''')

        print("All tables dropped successfully!")

        cursor.close()
        conn.close()

        # Call create_database to recreate all tables
        print("Recreating all tables...")
        create_database()

    except OperationalError as e:
        print("Connection failed:")
        print(e)
    except Exception as e:
        print("Error dropping tables:")
        print(e)

if __name__ == "__main__":
    # Uncomment the line below to drop all tables and recreate them
    # drop_all_tables()
    create_database()
