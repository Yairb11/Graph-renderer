"""Application configuration for the graph renderer server."""


class Config:
    """Static configuration values shared by the Flask application.

    Attributes:
        TEMPLATE_DIR (str): Directory holding the Jinja2 templates.
        STATIC_DIR (str): Directory holding the static assets.
        HOST (str): Interface the development server binds to.
        PORT (int): Port the development server listens on.
        DEBUG (bool): Whether Flask runs with the reloader and debugger.
    """

    TEMPLATE_DIR = "templates"
    STATIC_DIR = "static"
    HOST = "127.0.0.1"
    PORT = 5000
    DEBUG = True
