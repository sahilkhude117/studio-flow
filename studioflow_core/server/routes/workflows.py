import flask

from studioflow_core.logger import StudioFlowLogger
from studioflow_core.controllers.main import MainController
from studioflow_core.controllers.workflows import WorkflowController

def get_editor_bp(main_controller: MainController):
    bp = flask.Blueprint("editor_workflows",__name__)
    controller = WorkflowController(main_controller.repositories)

    @bp.get('/')
    def _load_workflow():
        try:
            return controller.get_workflow()
        except Exception as e:
            StudioFlowLogger.capture_exception(e)
            return str(e), 500
        
    return bp