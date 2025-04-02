import flask
import flask_sock

from studioflow_core.controllers.execution_stdio import StdioController
from studioflow_core.logger import StudioFlowLogger


def get_editor_bp(_):
    bp = flask.Blueprint("editor_stdio", __name__)
    sock = flask_sock.Sock(bp)

    @sock.route("/listen")
    def _websocket(ws: flask_sock.Server):
        try:
            StdioController.register(ws)
            ws.event.wait()
        except Exception as e:
            StudioFlowLogger.capture_exception(e)
        finally:
            StdioController.unregister(ws)

    return bp
