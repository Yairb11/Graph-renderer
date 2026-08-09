"""Route definitions for the graph renderer pages."""

from flask import Blueprint, render_template

graph_bp = Blueprint("graph", __name__)


@graph_bp.route("/")
@graph_bp.route("/graph")
def render_graph_page():
    """Render the graph renderer page.

    Returns:
        str: The rendered graph.html template.
    """
    return render_template("graph.html")
