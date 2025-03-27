import flask

from studioflow_core.logger import StudioFlowLogger

def get_editor_bp():
    bp = flask.Blueprint("editor_workflows",__name__)

    @bp.get('/')
    def _load_workflow():
        try:
            return "hello from editor bp"
        except Exception as e:
            StudioFlowLogger.capture_exception(e)
            return str(e), 500
        
    return bp