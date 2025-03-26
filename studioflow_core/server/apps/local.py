import threading

import flask
import flask_cors

from studioflow_core.server.blueprints.editor import get_editor_bp

def get_local_app() -> flask.Flask:
    app = flask.Flask(__name__)
    app.config["SOCK_SERVER_OPTIONS"] = {"subprotocols": ["default"]}
    app.url_map.strict_slashes = False
    flask_cors.CORS(app)

    editor = get_editor_bp()
    app.register_blueprint(editor, url_prefix="/_editor")

    @app.before_request
    def rename_thread():
        curr = threading.current_thread()
        curr.name = flask.request.path

    return app