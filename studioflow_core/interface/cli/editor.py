import threading

from dotenv import load_dotenv
from werkzeug.serving import make_server

from studioflow_core.cloud_api import connect_tunnel
from studioflow_core.controllers.execution_consumer import ExecutionConsumer
from studioflow_core.controllers.main import MainController
from studioflow_core.controllers.service.roles.client import RoleClientController
from studioflow_core.environment import HOST
from studioflow_core.fs_watcher import run_watcher
from studioflow_core.interface.cli.messages import serve_message
from studioflow_core.logger import StudioFlowLogger
from studioflow_core.repositories.consumer import EditorConsumer
from studioflow_core.repositories.factory import get_editor_repositories
from studioflow_core.repositories.producer import LocalProducerRepository
from studioflow_core.resources_watcher import resources_polling_loop
from studioflow_core.server.apps import get_local_app
from studioflow_core.settings import Settings
from studioflow_core.stdio_patcher import StdioPatcher
from studioflow_core.utils.browser import browser_open_editor
from studioflow_core.version import check_latest_version


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
        name="file_watcher",
        target=run_watcher,
    ).start()


def start_resources_watcher():
    threading.Thread(
        daemon=True,
        name="resources_watcher",
        target=resources_polling_loop,
    ).start()


def editor(headless: bool):
    load_dotenv(Settings.root_path / ".env")
    serve_message()
    check_latest_version()
    StudioFlowLogger.init("local")

    controller = MainController(repositories=get_editor_repositories())
    controller.reset_repositories()
    StdioPatcher.apply(controller)

    start_file_watcher()
    start_resources_watcher()
    start_consumer(controller)

    role_client_controller = RoleClientController(controller.repositories)
    role_client_controller.loop_sync_connection_pool()

    app = get_local_app(controller)
    server = make_server(host=HOST, port=Settings.server_port, threaded=True, app=app)

    if not headless:
        browser_open_editor()

    connect_tunnel(
        on_public_url_update=role_client_controller.safe_sync_connection_pool
    )

    server.serve_forever()
