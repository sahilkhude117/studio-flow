import flask

from studioflow_core.controllers.execution import ExecutionController
from studioflow_core.controllers.execution_client_hook import HookClient
from studioflow_core.controllers.main import MainController
from studioflow_core.entities.execution_context import (
    HookContext,
    Response,
    extract_flask_request,
)
from studioflow_core.repositories.project.project import HookStage
from studioflow_core.usage import editor_usage
from studioflow_core.utils import is_it_true


def get_editor_bp(controller: MainController):
    bp = flask.Blueprint("editor_hooks", __name__)

    @bp.route("/<path:id>", methods=["GET"])
    @editor_usage
    def _get_hook(id: str):
        hook = controller.get_hook(id)
        if not hook:
            flask.abort(404)
        return hook.editor_dto

    @bp.route("/", methods=["GET"])
    @editor_usage
    def _get_hooks():
        return [f.editor_dto for f in controller.get_hooks()]

    @bp.route("/", methods=["POST"])
    @editor_usage
    def _create_hook():
        data = flask.request.json
        if not data:
            flask.abort(400)
        title = data.get("title")
        file = data.get("file")
        if not title or not file:
            flask.abort(400)
        workflow_position = data.get("position", (0, 0))
        hook = controller.create_hook(title, file, workflow_position)
        return hook.editor_dto

    @bp.route("/<path:id>", methods=["PUT"])
    @editor_usage
    def _update_hook(id: str):
        changes = flask.request.json
        if not changes:
            flask.abort(400)

        hook = controller.update_stage(id, changes)
        if isinstance(hook, HookStage):
            return hook.editor_dto
        else:
            return None

    @bp.route("/<path:id>", methods=["DELETE"])
    @editor_usage
    def _delete_hook(id: str):
        remove_file = flask.request.args.get(
            "remove_file", default=False, type=is_it_true
        )
        controller.delete_hook(id, remove_file)
        return {"success": True}

    @bp.route("/<path:id>/run", methods=["POST", "GET", "PUT", "DELETE", "PATCH"])
    @editor_usage
    def _run_hook(id: str):
        hook = controller.get_hook(id)
        if not hook:
            flask.abort(404)

        context = HookContext(
            request=extract_flask_request(flask.request),
            response=Response(
                body="",
                headers={},
                status=200,
            ),
        )

        client = HookClient(context=context)

        ExecutionController(
            repositories=controller.repositories,
        ).run(
            stage=hook,
            client=client,
            context=context,
        )

        if context.response is None or client.context.response is None:
            flask.abort(500)

        return {
            "body": client.context.response.body,
            "status": context.response.status,
            "headers": context.response.headers,
        }

    return bp
