import flask

from studioflow_core.usage import editor_usage
from studioflow_core.server.utils import send_from_dist

from studioflow_core.controllers.main import MainController
from studioflow_core.server.routes import workflows as workflows_router

def __get_api_bp(controller: MainController):
    bp = flask.Blueprint("editor_api", __name__)

    workflows_bp = workflows_router.get_editor_bp(controller)
    bp.register_blueprint(workflows_bp, url_prefix='/workflows')

    return bp


def get_editor_bp(controller: MainController):
    bp = flask.Blueprint("editor", __name__)

    api_bp = __get_api_bp(controller)
    bp.register_blueprint(api_bp, url_prefix="/api")

    @bp.get("/")
    def _spa_index():
        return send_from_dist('editor.html', 'editor.html')

    return bp