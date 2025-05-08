from flask import Blueprint, request, jsonify
from api.utils.db import get_db_connection
import traceback


listings_bp = Blueprint('listings', __name__, url_prefix='/v1')


@listings_bp.route('/Listings', methods=['GET'])
def get_listings():
    """Get a list of listings, sorted by creation date (newest first)"""
    try:
        # Get the two parameters from the API for listing (page, page_size)
        page = request.args.get('page', default=1, type=int)
        page_size = request.args.get('page_size', default=100, type=int)

        # Calculate offset
        offset = (page - 1) * page_size

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get total count for pagination metadata
        cursor.execute("SELECT COUNT(*) FROM listing WHERE active_status = 'active'")
        total_count = cursor.fetchone()[0]

        # Get listings
        cursor.execute("""
            SELECT id, title, price, seller, created_datetime 
            FROM listing
            WHERE active_status = 'active'
            ORDER BY created_datetime DESC
            LIMIT %s OFFSET %s
        """, (page_size, offset))

        # Fetch results
        rows = cursor.fetchall()

        # Build response data
        listings = []
        for row in rows:
            listings.append({
                'id': row[0],
                'title': row[1],
                'price': float(row[2]),
                'seller': row[3],
                'created_datetime': row[4].isoformat() if row[4] else None
            })

        # Calculate pagination metadata
        total_pages = (total_count + page_size - 1) // page_size

        cursor.close()
        conn.close()

        # Return response
        return jsonify({
            'listings': listings,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_count': total_count,
                'total_pages': total_pages
            }
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Error retrieving listings: {str(e)}"}), 500

