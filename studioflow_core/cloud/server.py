from studioflow_core.cloud.server_application import CustomApplication
from studioflow_core.cloud.server_hooks import GunicornOptionsBuilder
from studioflow_core.controllers.main import MainController
from studioflow_core.controllers.service.roles.client import RoleClientController
from studioflow_core.environment import DEFAULT_PORT
from studioflow_core.logger import StudioFlowLogger
from studioflow_core.repositories.factory import get_prodution_app_repositories
from studioflow_core.server.apps import get_cloud_app
from studioflow_core.settings import SettingsController
from studioflow_core.stdio_patcher import StdioPatcher


def run():
    StudioFlowLogger.init("cloud")
    SettingsController.set_root_path(".")
    SettingsController.set_server_port(DEFAULT_PORT)

    controller = MainController(repositories=get_prodution_app_repositories())
    StdioPatcher.apply(controller)

    role_client_controller = RoleClientController(controller.repositories)
    role_client_controller.safe_sync_connection_pool()
    role_client_controller.loop_sync_connection_pool()

    options = GunicornOptionsBuilder(controller).build()
    app = get_cloud_app(controller)

    CustomApplication(app, options).run()


if __name__ == "__main__":
    run()
