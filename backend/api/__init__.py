from flask import Flask

def create_app():
    app = Flask(__name__)

    # Import and register blueprints
    from api.routes.listings import listings_bp
    app.register_blueprint(listings_bp)

    return app
