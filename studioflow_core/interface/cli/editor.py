import threading

from dotenv import load_dotenv
from werkzeug.serving import make_server

from studioflow_core.controllers.main import MainController
from studioflow_core.environment import HOST
from studioflow_core.cloud_api import connect_tunnel
from studioflow_core.controllers.execution_consumer import ExecutionConsumer
from studioflow_core.logger import StudioFlowLogger
from studioflow_core.settings import Settings
from studioflow_core.interface.cli.messages import serve_message
from studioflow_core.utils.browser import browser_open_editor
from studioflow_core.server.apps import get_local_app
from studioflow_core.repositories.factory import get_editor_repositories
from studioflow_core.stdio_patcher import StdioPatcher
from studioflow_core.fs_watcher import run_watcher
from studioflow_core.resources_watcher import resources_polling_loop
from studioflow_core.repositories.producer import LocalProducerRepository
from studioflow_core.repositories.consumer import EditorConsumer

def start_consumer(controller: MainController):
    if not isinstance(controller.producer_repository, LocalProducerRepository):
        raise ValueError("Invalid producer repository")
    
    consumer = EditorConsumer(controller.producer_repository.queue)

    th = threading.Thread(
        daemon=True,
        name="execution_consumer",
        target=ExecutionConsumer,
        kwargs=dict(controller=controller, consumer=consumer),
    )

    th.start()

    return consumer, th

def start_file_watcher():
    threading.Thread(
        daemon=True,
        name='file_watcher',
        target=run_watcher
    ).start()

def start_resources_watcher():
    threading.Thread(
        daemon=True,
        name="resources_watcher",
        target=resources_polling_loop
    ).start()
    
def editor(headless: bool):
    load_dotenv(Settings.root_path / '.env')
    serve_message()
    StudioFlowLogger.init("local")

    controller = MainController(repositories=get_editor_repositories())
    controller.reset_repositories()
    StdioPatcher.apply(controller)

    start_file_watcher()
    start_resources_watcher()
    start_consumer(controller)

    app = get_local_app(controller)   #returns flask app
    server = make_server(host=HOST, port=Settings.server_port, threaded=True, app=app)      # creates server

    if not headless:
        browser_open_editor()

    server.serve_forever()
