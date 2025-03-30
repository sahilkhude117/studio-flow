import threading
from typing import Dict

from studioflow_core.controllers.execution_client import ExecutionClient
from studioflow_core.controllers.execution_client_form import FormClient
from studioflow_core.controllers.execution_client_hook import HookClient
from studioflow_core.repositories.factory import Repositories
from studioflow_core.interface.sdk.user_exceptions import ExecutionNotFound
from studioflow_core.entities.execution import Execution
from studioflow_core.controllers.sdk_ai import AiSDKController
from studioflow_core.controllers.sdk_tasks import TasksSDKController
from studioflow_core.controllers.sdk_forms import FormSDKController
from studioflow_core.controllers.sdk_hooks import HookSDKController

class SDKContext:
    def __init__(
            self,
            execution: Execution,
            client: ExecutionClient,
            repositories: Repositories,
    ):
        self.repositories = repositories
        self.execution = execution
        self.client = client

        self.ai_sdk = AiSDKController(self.repositories.ai)

        self.task_sdk = TasksSDKController(self.repositories, self.execution)

        if isinstance(self.client, FormClient):
            self.form_sdk = FormSDKController(self.client, self.repositories.users)

        if isinstance(self.client, HookClient):
            self.hook_sdk = HookSDKController(self.client)

    def __enter__(self):
        SDKContextStore.register(self)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        SDKContextStore.clear(self)


class SDKContextStore:
    rlock = threading.RLock()
    store: Dict[int, SDKContext] = {}

    @classmethod
    def clear(cls, context: SDKContext):
        with cls.rlock:
            for key, value in cls.store.items():
                if value is context:
                    del cls.store[key]
                    break

    @classmethod
    def register(cls, context: SDKContext):
        with cls.rlock:
            cls.store[threading.get_ident()] = context

    @classmethod
    def get_by_thread(cls) -> SDKContext:
        with cls.rlock:
            try:
                return cls.store[threading.get_ident()]
            except KeyError:
                raise ExecutionNotFound()

    @classmethod
    def get_by_execution_id(cls, execution_id: str) -> SDKContext:
        with cls.rlock:
            for data in cls.store.values():
                if data.execution.id == execution_id:
                    return data
            raise ExecutionNotFound()

    @classmethod
    def get_execution(cls) -> Execution:
        return cls.get_by_thread().execution
