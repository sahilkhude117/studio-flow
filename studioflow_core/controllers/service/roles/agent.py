from typing import List, Optional, Tuple

from studioflow_core.controllers.common.task_executors import TaskExecutor
from studioflow_core.controllers.service.roles.common import RoleCommonController
from studioflow_core.entities.execution import Execution
from studioflow_core.logger import StudioFlowLogger
from studioflow_core.repositories.project.project import (
    Project,
    ProjectRepository,
    Stage,
)
from studioflow_core.repositories.tasks import TaskPayload


class RoleAgentController(RoleCommonController):
    def _get_task_targets(
        self,
        current_stage: Stage,
        type: str,
        task_payload: TaskPayload,
        project: Project,
        show_warning: bool = True,
    ) -> List[Tuple[Stage, dict]]:
        targets = []

        possible_transitions = list(
            filter(
                lambda t: True if not t.task_type else type == t.task_type,
                current_stage.workflow_transitions,
            )
        )

        for transition in possible_transitions:
            target_stage = project.get_stage(transition.target_id)
            if not target_stage:
                continue

            targets.append((target_stage, task_payload))

        if len(targets) == 0 and show_warning:
            StudioFlowLogger.warning(
                f"Task with payload {task_payload} was deleted, no transitions were satisfied with the type: {type}"
            )

        return targets

    def create_foreign_task(
        self,
        task_type: str,
        task_payload: dict,
        target_stage_id: str,
        execution: Optional[Execution] = None,
    ):
        executor = TaskExecutor(self.repos)
        project = ProjectRepository.load()
        executor.send_task(
            type=task_type,
            current_stage=project.get_stage_raises(target_stage_id),
            payload=task_payload,
            execution=execution,
        )
