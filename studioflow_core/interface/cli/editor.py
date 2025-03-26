import threading

from dotenv import load_dotenv
from werkzeug.serving import make_server

from studioflow_core.environment import HOST
from studioflow_core.logger import StudioFlowLogger
from studioflow_core.settings import Settings
from studioflow_core.interface.cli.messages import serve_message
from studioflow_core.utils.browser import browser_open_editor
from studioflow_core.server.apps import get_local_app

def editor(headless: bool):
    load_dotenv(Settings.root_path / '.env')
    serve_message()
    StudioFlowLogger.init("local")

    app = get_local_app()   #returns flask app
    server = make_server(host=HOST, port=Settings.server_port, threaded=True, app=app)      # creates server

    if not headless:
        browser_open_editor()

    server.serve_forever()
