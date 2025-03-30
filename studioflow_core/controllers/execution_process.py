from typing import Optional

from studioflow_core.controllers.execution import ExecutionController
from studioflow_core.controllers.main import MainController
from studioflow_core.entities.execution import ClientContext
from studioflow_core.environment import set_SERVER_UUID, set_WORKER_UUID
from studioflow_core.logger import StudioFlowLogger, Environment
from studioflow_core.repositories.project.project import StageWithFile
from studioflow_core.settings import Settings
from studioflow_core.stdio_patcher import StdioPatcher


# runs in subprocess - all arguments must be picklable/multiprocessable
def ExecutionProcess(
    *,
    root_path: str,
    server_port: int,
    worker_uuid: str,
    arbiter_uuid: str,
    stage: StageWithFile,
    controller: MainController,
    environment: Optional[Environment],
    request: Optional[ClientContext] = None,
):
    Settings.set_root_path(root_path)
    Settings.set_server_port(server_port, force=True)
    StudioFlowLogger.init(environment)

    set_WORKER_UUID(worker_uuid)
    set_SERVER_UUID(arbiter_uuid)
    StdioPatcher.apply(controller)

    head_id = worker_uuid.split("-")[0]

    StudioFlowLogger.debug(f"[{head_id}] WORKER INIT")

    try:
        ExecutionController(
            repositories=controller.repositories,
        ).run(
            stage=stage,
            context=request,
        )
    except Exception as e:
        StudioFlowLogger.error(f"[{head_id}] WORKER ERROR: {e}")
        StudioFlowLogger.capture_exception(e)
    finally:
        StudioFlowLogger.debug(f"[{head_id}] WORKER EXIT")
