"""Flask application factory for the graph renderer."""

from flask import Flask

from config import Config
from routes import graph_bp


def create_app():
    """Build the Flask application with its configuration and routes.

    Returns:
        Flask: The configured application instance.
    """
    application = Flask(
        __name__,
        template_folder=Config.TEMPLATE_DIR,
        static_folder=Config.STATIC_DIR,
    )
    application.config.from_object(Config)
    application.register_blueprint(graph_bp)
    return application
