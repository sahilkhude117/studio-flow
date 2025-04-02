import flask

from studioflow_core.controllers.main import MainController
from studioflow_core.server.utils import send_from_dist
from studioflow_core.settings import Settings


def get_editor_bp(controller: MainController):
    bp = flask.Blueprint("editor_assets", __name__)

    @bp.get("/<path:path>")
    def _asset(path):
        return send_from_dist(path, dist_folder=Settings.root_path)

    return bp
