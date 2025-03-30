import datetime
import pkgutil
import webbrowser
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import flask

from studioflow_core.controllers.linters import check_linters
from studioflow_core.interface.cli.deploy import deploy
from studioflow_core.settings import Settings
from studioflow_core.credentials import (
    delete_credentials,
    get_credentials,
    resolve_headers,
    set_credentials,
)
from studioflow_core.repositories.execution import ExecutionFilter, ExecutionRepository
from studioflow_core.cloud_api import get_api_key_info, get_project_info
from studioflow_core.utils.dot_studioflow import TEST_DATA_FILE
from studioflow_core.repositories.factory import Repositories
from studioflow_core.repositories.keyvalue import KVRepository
from studioflow_core.repositories.jwt_signer import EditorJWTRepository, JWTRepository
from studioflow_core.repositories.email import EmailRepository
from studioflow_core.repositories.tasks import TasksRepository, ExecutionTasksResponse
from studioflow_core.repositories.users import UsersRepository
from studioflow_core.repositories.roles import RolesRepository
from studioflow_core.repositories.producer import ProducerRepository
from studioflow_core.repositories.execution_logs import ExecutionLogsRepository, LogEntry
from studioflow_core.services.requirements import RequirementsRepository
from studioflow_core.utils.file import files_from_directory, module2path, path2module
from studioflow_core.utils.validate import validate_json
from studioflow_core.entities.execution_context import ScriptContext
from studioflow_core.repositories.project.project import (
    FormStage,
    HookStage,
    JobStage,
    ProjectRepository,
    ScriptStage,
    Stage,
    StageWithFile,
    StyleSettingsWithSidebar
)
from studioflow_core.templates import (
    new_form_code,
    new_hook_code,
    new_job_code,
    new_script_code,
)

class UnknownNodeTypeError(Exception):
    def __init__(self, node_type: str):
        self.node_type = node_type

    def __str__(self):
        return f'Unknown Node type {self.node_type}'

class MainController:
    kv_repository: KVRepository
    jwt_repository: JWTRepository
    email_repository: EmailRepository
    tasks_repository: TasksRepository
    users_repository: UsersRepository
    roles_repository: RolesRepository
    producer_repository: ProducerRepository
    execution_repository: ExecutionRepository
    web_editor_repository: EditorJWTRepository
    execution_logs_repository: ExecutionLogsRepository

    def __init__(self, repositories: Repositories):
        ProjectRepository.initialize_or_migrate()

        RequirementsRepository.ensure('studioflow')

        self.repositories = repositories

        self.kv_repository = repositories.kv
        self.jwt_repository = repositories.jwt
        self.email_repository = repositories.email
        self.users_repository = repositories.users
        self.roles_repository = repositories.roles
        self.tasks_repository = repositories.tasks
        self.producer_repository = repositories.producer
        self.execution_repository = repositories.execution
        self.web_editor_repository = repositories.editor_jwt
        self.execution_logs_repository = repositories.execution_logs

    def deploy(self):
        rules = check_linters()

        issues = []
        for rule in rules:
            if rule.type in ["error", "security", "bug"]:
                issues += rule.issues

        if len(issues) > 0:
            raise Exception(
                "Please fix all linter issues before deploying your project."
            )
        
        deploy()

    def reset_repositories(self):
        self.execution_repository.clear()
        self.tasks_repository.clear()

    def get_workspace(self) -> StyleSettingsWithSidebar:
        project = ProjectRepository.load()
        return project.get_workspace()

    def get_stage(self, id: str) -> Optional[Stage]:
        project = ProjectRepository.load()
        return project.get_stage(id)

    def get_action(self, id: str) -> Optional[Stage]:
        project = ProjectRepository.load()
        return project.get_action(id)

    def get_async_stage_ids(self):
        project = ProjectRepository.load()
        job_ids = [stage.id for stage in project.jobs]
        script_ids = [stage.id for stage in project.scripts]
        return job_ids + script_ids
    
    def __ensure_case(self, path: str):
        file_dirs = [p for p in Settings.root_path.iterdir()]
        if path in file_dirs:
            return

        conflicting_paths = [p for p in file_dirs if p.name.lower() == path.lower()]
        if len(conflicting_paths) == 1:
            conflicting_paths[0].rename(Settings.root_path.joinpath(path))
            return

        raise Exception(
            f"File {path} already exists with different casing. Conflict with files ({', '.join(p.name for p in conflicting_paths)})"
        )

  
    def init_code_file(self, path: str, code: str):
        if Settings.root_path.joinpath(path).is_file():
            self.__ensure_case(path)
            return
        Settings.root_path.joinpath(path).write_text(code, encoding="utf-8")

    def open_file(self, file_path: str, mode: str, create_if_not_exists: bool = False):
        if mode == "module" or mode == "package":
            file_path = str(module2path(file_path, mode == "package"))
        complete_file_path = Settings.root_path.joinpath(file_path)

        if create_if_not_exists and not complete_file_path.is_file():
            complete_file_path.touch()

        webbrowser.open(complete_file_path.absolute().as_uri())

    def read_file(self, file: str):
        file_path = Settings.root_path.joinpath(file)
        if not file_path.is_file():
            return None
        return Settings.root_path.joinpath(file).read_text(encoding="utf-8")

    def check_file(self, file_path: str):
        return Settings.root_path.joinpath(file_path).is_file()

    def list_files(self, path: str = ".", mode: str = "file"):
        parent_path = Settings.root_path.joinpath(path)
        if mode in ["file", "image", "python-file"]:
            if mode == "image":
                allowed_suffixes = [
                    ".png",
                    ".jpg",
                    ".jpeg",
                    ".gif",
                    ".svg",
                    ".webp",
                    ".jfif",
                    ".pjp",
                    ".pjpeg",
                ]
            elif mode == "python-file":
                allowed_suffixes = [".py"]
            else:
                allowed_suffixes = None

            return [
                dict(
                    name=str(file.relative_to(parent_path)),
                    path=str(file.relative_to(Settings.root_path)),
                    type="file" if file.is_file() else "dir",
                )
                for file in files_from_directory(parent_path)
                if file.is_dir()
                or not allowed_suffixes
                or file.suffix in allowed_suffixes
            ]

        elif mode == "module":
            return [
                dict(
                    name=name,
                    path=path2module(Path(path).joinpath(name)),
                    type="package" if ispkg else "module",
                )
                for module_finder, name, ispkg in pkgutil.iter_modules(
                    [str(parent_path)]
                )
            ]

    def update_workspace(self, changes: Dict[str, Any]):
        project = ProjectRepository.load()
        project.workspace.update(changes)
        ProjectRepository.save(project)
        return project.workspace

    def is_initial(self, id: str):
        project = ProjectRepository.load()
        stage = project.get_action(id)
        if not stage:
            raise Exception(f"Stage {id} not found")
        return project.is_initial(stage)

    def create_script(
        self, title: str, file: str, workflow_position: Tuple[int, int] = (0, 0)
    ) -> ScriptStage:
        project = ProjectRepository.load()
        script = ScriptStage.create(title, file, workflow_position=workflow_position)
        self.init_code_file(script.file, new_script_code)
        project.add_stage(script)
        ProjectRepository.save(project)

        return script
    
    def get_scripts(self) -> List[ScriptStage]:
        project = ProjectRepository.load()
        return project.scripts
    
    def get_script(self, id: str) -> Optional[ScriptStage]:
        project = ProjectRepository.load()
        return project.get_script(id)
    
    def delete_script(self, id: str, remove_file: bool = False):
        project = ProjectRepository.load()
        project.delete_stage(id, remove_file)
        ProjectRepository.save(project)

    def create_form(
        self, title: str, file: str, workflow_position: Tuple[int, int] = (0, 0)
    ) -> FormStage:
        project = ProjectRepository.load()
        form = FormStage.create(title, file, workflow_position=workflow_position)
        self.init_code_file(form.file, new_form_code)
        project.add_stage(form)
        ProjectRepository.save(project)
        return form
    
    def get_forms(self) -> List[FormStage]:
        project = ProjectRepository.load()
        return project.forms
    
    def get_form(self, id: str) -> Optional[FormStage]:
        project = ProjectRepository.load()
        return project.get_form(id)
    
    def get_form_by_path(self, path: str) -> Optional[FormStage]:
        project = ProjectRepository.load()
        return project.get_form_by_path(path)

    def write_test_data(self, data: str) -> None:
        if not validate_json(data):
            raise Exception("Invalid JSON")
        test_file = Settings.root_path / TEST_DATA_FILE
        test_file.write_text(data, encoding="utf-8")

    def read_test_data(self) -> str:
        test_file = Settings.root_path / TEST_DATA_FILE
        if not test_file.is_file():
            return "{}"
        return test_file.read_text(encoding="utf-8")

    def delete_form(self, id: str, remove_file: bool = False):
        project = ProjectRepository.load()
        project.delete_stage(id, remove_file)
        ProjectRepository.save(project)

    def create_hook(
        self, title: str, file: str, workflow_position: Tuple[int, int] = (0, 0)
    ) -> HookStage:
        project = ProjectRepository.load()
        hook = HookStage.create(title, file, workflow_position=workflow_position)
        self.init_code_file(hook.file, new_hook_code)
        project.add_stage(hook)
        ProjectRepository.save(project)
        return hook

    def get_hook(self, id: str) -> Optional[HookStage]:
        project = ProjectRepository.load()
        return project.get_hook(id)

    def get_hooks(self) -> List[HookStage]:
        project = ProjectRepository.load()
        return project.hooks

    def get_hook_by_path(self, path: str) -> Optional[HookStage]:
        project = ProjectRepository.load()
        return project.get_hook_by_path(path)

    def delete_hook(self, id: str, remove_file: bool = False) -> None:
        project = ProjectRepository.load()
        project.delete_stage(id, remove_file)
        ProjectRepository.save(project)

    def get_jobs(self) -> List[JobStage]:
        project = ProjectRepository.load()
        return project.jobs

    def get_job(self, id: str) -> Optional[JobStage]:
        project = ProjectRepository.load()
        stage = project.get_stage(id)

        if isinstance(stage, JobStage):
            return stage

        return None

    def create_job(
        self, title: str, file: str, workflow_position: Tuple[int, int] = (0, 0)
    ) -> JobStage:
        project = ProjectRepository.load()
        job = JobStage.create(title, file, workflow_position=workflow_position)
        self.init_code_file(job.file, new_job_code)
        project.add_stage(job)
        ProjectRepository.save(project)
        return job

    def update_stage(self, id: str, changes: Dict[str, Any]) -> Stage:
        project = ProjectRepository.load()
        stage = project.get_action(id)

        if not stage:
            raise Exception(f"Stage with id {id} not found")

        if isinstance(stage, StageWithFile) and (
            code_content := changes.pop("code_content", None)
        ):
            Settings.root_path.joinpath(stage.file_path).write_text(
                code_content, encoding="utf-8"
            )

        if test_data := changes.pop("test_data", None):
            self.write_test_data(test_data)

        stage = project.update_stage(stage, changes)
        ProjectRepository.save(project)
        return stage

    def delete_job(self, id: str, remove_file: bool = False):
        project = ProjectRepository.load()
        project.delete_stage(id, remove_file)
        ProjectRepository.save(project)

    def get_stages(self) -> List[Stage]:
        project = ProjectRepository.load()
        return project.workflow_stages

    def get_credentials(self):
        return get_credentials()
    
    def get_login(self):
        headers = resolve_headers()
        if not headers:
            return {"logged": False, "reason": "NO_API_TOKEN"}
        return get_api_key_info(headers)
    
    def create_login(self, token):
        set_credentials(token)
        return self.get_login()

    def delete_login(self):
        delete_credentials()
        return self.get_login()
    
    # Project
    def get_project_info(self):
        headers = resolve_headers()
        if headers is None:
            flask.abort(401)
        return get_project_info(headers)

    # access_control
    def list_access_controls(self):
        project = ProjectRepository.load()
        return [s.to_access_dto() for s in project.secured_stages]

    def update_access_controls(self, changes: List[Dict[str, Any]]):
        project = ProjectRepository.load()
        response = project.update_access_controls(changes)
        ProjectRepository.save(project)
        return response
    
    def get_access_control_by_stage_id(self, id):
        project = ProjectRepository.load()
        return project.get_access_control_by_stage_id(id)

    # logs
    def get_executions(self, filter: ExecutionFilter):
        return self.execution_repository.list(filter)

    def get_logs(self, id: str):
        return self.execution_logs_repository.get(id)

    def get_execution_tasks(self, execution_id: str) -> ExecutionTasksResponse:
        execution = self.execution_repository.get(execution_id)

        trigger_task = None
        if isinstance(execution.context, ScriptContext):
            trigger_task = self.tasks_repository.get_by_id(execution.context.task_id)

        sent_tasks = self.tasks_repository.get_execution_sent_tasks(execution_id)

        return ExecutionTasksResponse(
            trigger_task=trigger_task,
            sent_tasks=sent_tasks,
        )

    # Worker lifecycle

    def child_exit(self, *, app_id: str, worker_id: str, err_msg: str):
        killed_executions = self.execution_repository.find_by_worker(
            worker_id=worker_id,
            status="running",
            app_id=app_id,
        )

        # update executions
        for execution in killed_executions:
            # Add log entry
            err_log = LogEntry(
                execution_id=execution.id,
                created_at=datetime.datetime.now(),
                payload={"text": err_msg},
                sequence=999999,
                event="stderr",
            )
            self.execution_logs_repository.save(err_log)

            # Update execution status
            self.execution_repository.set_failure_by_id(execution_id=execution.id)

            self.tasks_repository.set_locked_tasks_to_pending(execution.id)

    def self_exit(self, *, app_id: str, err_msg: str):
        exited_execs = self.execution_repository.find_by_app(
            status="running",
            app_id=app_id,
        )

        # update executions
        for execution in exited_execs:
            # Add log entry
            err_log = LogEntry(
                execution_id=execution.id,
                created_at=datetime.datetime.now(),
                payload={"text": err_msg},
                sequence=999999,
                event="stderr",
            )
            self.execution_logs_repository.save(err_log)

            # Update execution status
            self.execution_repository.set_failure_by_id(execution_id=execution.id)

            self.tasks_repository.set_locked_tasks_to_pending(execution.id)
