from multiprocessing.forkserver import set_forkserver_preload

from studioflow_core.controllers import execution_process
from studioflow_core.controllers.execution_consumer import ExecutionConsumer
from studioflow_core.controllers.main import MainController
from studioflow_core.environment import DEFAULT_PORT, RABBITMQ_CONNECTION_URI
from studioflow_core.logger import StudioFlowLogger
from studioflow_core.repositories.consumer import RabbitConsumer
from studioflow_core.repositories.factory import get_prodution_app_repositories
from studioflow_core.settings import SettingsController
from studioflow_core.signals import SignalHandlers


def run():
    SignalHandlers.init()
    StudioFlowLogger.init("cloud")
    SettingsController.set_root_path(".")
    SettingsController.set_server_port(DEFAULT_PORT)

    if not RABBITMQ_CONNECTION_URI:
        raise Exception("RABBITMQ_CONNECTION_URI not found")

    set_forkserver_preload([execution_process.__name__])
    controller = MainController(repositories=get_prodution_app_repositories())
    with RabbitConsumer(RABBITMQ_CONNECTION_URI) as consumer:
        SignalHandlers.register_sigterm_callback(consumer.stop)
        ExecutionConsumer(consumer, controller)


if __name__ == "__main__":
    run()
