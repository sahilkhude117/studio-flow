import flask

from studioflow_core.usage import editor_usage
from studioflow_core.server.utils import send_from_dist

def __get_api_bp():
    bp = flask.Blueprint("editor_api", __name__)


def get_editor_bp():
    bp = flask.Blueprint("editor", __name__)

    @bp.get("/")
    def _test():
        return "print"
    # def _spa_index():
    #     return send_from_dist('editor.html', 'editor.html')

    return bp