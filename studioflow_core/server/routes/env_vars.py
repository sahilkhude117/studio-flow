import flask

from studioflow_core.controllers.env_vars import PatchClientEnvVarBody
from studioflow_core.controllers.main import MainController
from studioflow_core.services.env_vars import EnvVarsRepository
from studioflow_core.usage import editor_usage


def get_editor_bp(main_controller: MainController):
    bp = flask.Blueprint("editor_env_vars", __name__)

    # 1s pooling in this route
    @bp.get("/")
    def _get_env_vars():
        return [env_var.to_dict() for env_var in EnvVarsRepository.list()]

    @bp.patch("/")
    @editor_usage
    def _change_env_vars():
        if flask.request.json is None:
            flask.abort(400)

        body = PatchClientEnvVarBody.from_dict(flask.request.json)
        for change in body.changes:
            if change.change == "create" or change.change == "update":
                EnvVarsRepository.set(name=change.name, value=change.value)
            elif change.change == "delete":
                EnvVarsRepository.unset(name=change.name)

        return {"status": "ok"}

    return bp
