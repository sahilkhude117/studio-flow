import datetime
import pkgutil
import webbrowser
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import flask

from studioflow_core.repositories.factory import Repositories
from studioflow_core.repositories.keyvalue import KVRepository
from studioflow_core.repositories.jwt_signer import EditorJWTRepository, JWTRepository
from studioflow_core.repositories.email import EmailRepository
from studioflow_core.repositories.tasks import TasksRepository
from studioflow_core.repositories.users import UsersRepository
from studioflow_core.repositories.roles import RolesRepository
from studioflow_core.repositories.producer import ProducerRepository
from studioflow_core.repositories.execution import ExecutionRepository
from studioflow_core.repositories.execution_logs import ExecutionLogsRepository
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

        

  