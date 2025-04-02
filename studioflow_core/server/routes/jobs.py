import flask

from studioflow_core.controllers.execution import ExecutionController
from studioflow_core.controllers.main import MainController
from studioflow_core.entities.execution_context import JobContext
from studioflow_core.repositories.project.project import JobStage
from studioflow_core.usage import editor_usage
from studioflow_core.utils import is_it_true


def get_editor_bp(controller: MainController):
    bp = flask.Blueprint("editor_jobs", __name__)

    @bp.get("/<path:id>")
    @editor_usage
    def _get_job(id: str):
        job = controller.get_job(id)
        if not job:
            flask.abort(404)
        return job.editor_dto

    @bp.get("/")
    @editor_usage
    def _get_jobs():
        return [f.editor_dto for f in controller.get_jobs()]

    @bp.post("/")
    @editor_usage
    def _create_job():
        data = flask.request.json
        if not data:
            flask.abort(400)
        title = data.get("title")
        file = data.get("file")
        if not title or not file:
            flask.abort(400)
        workflow_position = data.get("position", (0, 0))
        job = controller.create_job(title, file, workflow_position)
        return job.editor_dto

    @bp.put("/<path:id>")
    @editor_usage
    def _update_stage(id: str):
        data = flask.request.json
        if not data:
            flask.abort(400)

        job = controller.update_stage(id, data)
        if isinstance(job, JobStage):
            return job.editor_dto
        else:
            return None

    @bp.delete("/<path:id>")
    @editor_usage
    def _delete_job(id: str):
        remove_file = flask.request.args.get(
            "remove_file", default=False, type=is_it_true
        )
        controller.delete_job(id, remove_file)
        return {"success": True}

    @bp.post("/<path:id>/run")
    @editor_usage
    def _run_job(id: str):
        job = controller.get_job(id)
        if not job:
            flask.abort(404)

        ExecutionController(
            repositories=controller.repositories,
        ).run(
            stage=job,
            context=JobContext(),
        )

        return {"ok": True}

    return bp
