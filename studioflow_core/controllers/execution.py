from typing import Optional, Union

from studioflow_core.controllers.execution_client import (
    ExecutionClient,
    HeadlessClient
)
from studioflow_core.controllers.execution_target import ExecutionTarget
from studioflow_core.entities.execution import Execution, PreExecution
from studioflow_core.entities.execution_context import (
    ClientContext,
    JobContext,
    ScriptContext
)
from studioflow_core.repositories.factory import Repositories
from studioflow_core.repositories.project.project import Stage, StageWithFile


class NotStartedException(Exception):
    pass

class ExecutionController:
    def __init__(
        self,
        *,
        repositories: Repositories,
    ) -> None:
        self.repositories = repositories

    def submit(
        self,
        stage: Stage,
        context: Union[ScriptContext, JobContext],
    ):
        return self.repositories.producer.submit(
            PreExecution(
                context=context,
                stage_id=stage.id,
            )
        )

    def run(
        self,
        *,
        stage: StageWithFile,
        client: Optional[ExecutionClient] = None,
        context: Optional[ClientContext] = None,
    ):
        if not client:
            client = HeadlessClient()

        execution = Execution.create(
            context=context,
            stage_id=stage.id,
        )

        ExecutionTarget(
            stage=stage,
            client=client,
            execution=execution,
            repositories=self.repositories,
        )
