import flask

from studioflow_core.controllers.main import MainController
from studioflow_core.controllers.workflows import WorkflowController
from studioflow_core.environment import IS_PRODUCTION
from studioflow_core.logger import StudioFlowLogger
from studioflow_core.server.guards.role_guard import Guard, StageIdSelector
from studioflow_core.usage import editor_usage


def get_editor_bp(main_controller: MainController):
    bp = flask.Blueprint("editor_workflows", __name__)
    controller = WorkflowController(main_controller.repositories)

    # 1s pooling in this route
    @bp.get("/")
    def _load_workflow():
        try:
            return controller.get_workflow()
        except Exception as e:
            StudioFlowLogger.capture_exception(e)
            return str(e), 500

    @bp.put("/")
    @editor_usage
    def _update_workflow():
        try:
            payload = flask.request.json
            if payload is None:
                raise Exception("No payload found")
            new_state = controller.update_workflow(payload)

            return new_state
        except Exception as e:
            StudioFlowLogger.capture_exception(e)
            return str(e), 500

    return bp


def get_player_bp(main_controller: MainController):
    controller = WorkflowController(main_controller.repositories)
    guard = Guard(main_controller.users_repository, enabled=IS_PRODUCTION)

    bp = flask.Blueprint("player_workflow", __name__)

    # 1s pooling in this route
    @bp.get("/")
    @guard.by(StageIdSelector("kanban"))
    def _load_workflow():
        try:
            return controller.get_workflow()
        except Exception as e:
            StudioFlowLogger.capture_exception(e)
            return str(e), 500

    return bp
