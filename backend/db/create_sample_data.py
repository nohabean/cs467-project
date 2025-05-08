import platform
import os
if platform.system() == "Windows":
    os.add_dll_directory(r"C:\Program Files\PostgreSQL\17\bin")
import psycopg2
from psycopg2 import OperationalError
from connection_auth import DB_PASSWORD


DB_HOST = "35.224.8.223"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres"

def create_sample_data():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        conn.autocommit = True
        cursor = conn.cursor()

        # Insert sample users
        cursor.execute("""
            INSERT INTO users (username, password_hash) VALUES
            ('test_user_1', 'dummy_hash_123'),
            ('test_user_2', 'dummy_hash_123'),
            ('test_user_3', 'dummy_hash_123')
            ON CONFLICT (username) DO NOTHING;
        """)
        print("Sample users inserted.")

        # Insert sample tags
        cursor.execute("""
            INSERT INTO tags (name) VALUES
            ('electronics'),
            ('furniture'),
            ('artwork')
            ON CONFLICT DO NOTHING;
        """)
        print("Sample tags inserted.")

        # Insert sample listings and get their IDs
        cursor.execute("""
            INSERT INTO listing (title, description, seller, price) VALUES
            ('ASUS Laptop', '3 years old but it works', 'test_user_1', 500.00),
            ('Painting - Abstract', 'Local artist, price negotiable', 'test_user_2', 750.00)
            RETURNING id, title;
        """)
        listing_rows = cursor.fetchall()
        listing_map = { title: id for id, title in listing_rows }
        print(f"Sample listings inserted with IDs: {listing_map}")

        # Insert listing_tag relationships using listing IDs and tag names
        for title, tag in [('ASUS Laptop', 'electronics'), ('Painting - Abstract', 'artwork')]:
            listing_id = listing_map.get(title)
            if listing_id:
                cursor.execute("""
                    INSERT INTO listing_tag (listing_id, tag_id)
                    SELECT %s, t.id
                    FROM tags t
                    WHERE t.name = %s
                    ON CONFLICT DO NOTHING;
                """, (listing_id, tag))
        print("Sample listing_tag relationships inserted.")

        cursor.close()
        conn.close()

    except OperationalError as e:
        print("Connection failed:")
        print(e)
    except Exception as e:
        print("Error inserting sample data:")
        print(e)

if __name__ == "__main__":
    create_sample_data()
