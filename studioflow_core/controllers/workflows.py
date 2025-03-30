from typing import Dict, List, Optional, TypedDict

from studioflow_core.controllers.main import UnknownNodeTypeError
from studioflow_core.repositories.factory import Repositories
from studioflow_core.repositories.project.project import (
    AgentStage,
    ClientStage,
    FormStage,
    HookStage,
    JobStage,
    NotificationTrigger,
    Project,
    ProjectRepository,
    ScriptStage,
    Stage,
    WorkflowTransition
)

class StageDTO(TypedDict):
    id: str
    type: str
    title: str
    position: Dict[str, float]
    props: Dict[str, Optional[str]]

class WorkflowController:
    def __init__(self, repos: Repositories):
        self.repos = repos

    def get_workflow(self):
        project = ProjectRepository.load()
        return self._make_workflow_dto(project)
    
    def make_stage_dto(self, stage: Stage) -> StageDTO:
        filename = None
        props = {}
        if isinstance(stage, (HookStage, ScriptStage, FormStage, JobStage)):
            filename = stage.file
            props["filename"] = filename
        path = None
        if isinstance(stage, (FormStage, HookStage)):
            path = stage.path
            props["path"] = path
        project_id = None
        if isinstance(stage, AgentStage):
            project_id = stage.project_id
            props["projectId"] = project_id
            props["clientStageId"] = stage.client_stage_id
        return StageDTO(
            id=stage.id,
            type=stage.type_name + "s",
            title=stage.title,
            position=dict(
                x=stage.workflow_position[0],
                y=stage.workflow_position[1],
            ),
            props=props,
        )

    
    def _make_workflow_dto(self, project: Project):
        stages = []
        for stage in project.workflow_stages:
            stage_dto = self.make_stage_dto(stage)

            if (
                isinstance(stage, FormStage)
                or isinstance(stage, ScriptStage)
                or isinstance(stage, HookStage)
                or isinstance(stage, JobStage)
            ):
                stage_dto["props"]["filename"] = stage.file

            if isinstance(stage, FormStage) or isinstance(stage, HookStage):
                stage_dto["props"]["path"] = stage.path

            if isinstance(stage, AgentStage):
                stage_dto["props"]["projectId"] = stage.project_id
                stage_dto["props"]["clientStageId"] = stage.client_stage_id

            stages.append(stage_dto)

        transitions = []
        for stage in project.workflow_stages:
            for transition in stage.workflow_transitions:
                props: dict = {"taskType": None}

                if transition.task_type is not None:
                    props["taskType"] = transition.task_type

                transitions.append(
                    dict(
                        id=transition.id,
                        sourceStageId=stage.id,
                        targetStageId=transition.target_id,
                        type=transition.type,
                        props=props,
                    )
                )

        return dict(
            stages=stages,
            transitions=transitions,
        )
