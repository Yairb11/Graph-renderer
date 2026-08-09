"""Entry point that starts the graph renderer development server."""

from app import create_app
from config import Config

app = create_app()


if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
