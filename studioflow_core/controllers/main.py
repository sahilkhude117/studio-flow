import datetime
import pkgutil
import webbrowser
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import flask

from studioflow_core.repositories.keyvalue import KVRepository
from studioflow_core.repositories.jwt_signer import EditorJWTRepository, JWTRepository
from studioflow_core.repositories.email import EmailRepository
from studioflow_core.repositories.tasks import TasksRepository
from studioflow_core.repositories.users import UsersRepository

class MainController:
    kv_repository: KVRepository
    jwt_repository: JWTRepository
    email_repository: EmailRepository
    tasks_repository: TasksRepository
    users_repository: UsersRepository

  