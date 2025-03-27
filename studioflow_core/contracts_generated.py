
import typing
from dataclasses import dataclass

CommonRoleDescription = str

CloudApiCliRoleUpdateRequestDescription = CommonRoleDescription


@dataclass
class CloudApiCliRoleUpdateRequest:
    description: CloudApiCliRoleUpdateRequestDescription

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "description": self.description,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "CloudApiCliRoleUpdateRequest":
        return CloudApiCliRoleUpdateRequest(
            description=str(data["description"]),
        )


CommonRoleId = str

CommonRoleName = str

CommonRoleProjectId = str

CommonRoleCreatedAt = str


@dataclass
class CommonRole:
    id: CommonRoleId
    name: CommonRoleName
    description: typing.Optional[CommonRoleDescription]
    project_id: CommonRoleProjectId
    created_at: CommonRoleCreatedAt

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "projectId": self.project_id,
            "createdAt": self.created_at,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "CommonRole":
        return CommonRole(
            id=str(data["id"]),
            name=str(data["name"]),
            description=str(data.get("description")),
            project_id=str(data["projectId"]),
            created_at=str(data["createdAt"]),
        )


CloudApiCliRoleUpdateResponse = CommonRole

CloudApiCliRoleListQueryOffset = int

CloudApiCliRoleListQueryLimit = int


@dataclass
class CloudApiCliRoleListQuery:
    offset: typing.Optional[CloudApiCliRoleListQueryOffset]
    limit: typing.Optional[CloudApiCliRoleListQueryLimit]

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "offset": self.offset,
            "limit": self.limit,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "CloudApiCliRoleListQuery":
        return CloudApiCliRoleListQuery(
            offset=int(data.get("offset", 0)),
            limit=int(data.get("limit", 10)),
        )


CloudApiCliRoleListResponseItem = CommonRole

CloudApiCliRoleListResponse = typing.List[CloudApiCliRoleListResponseItem]

CloudApiCliRoleCreateRequestName = CommonRoleName

CloudApiCliRoleCreateRequestDescription = CommonRoleDescription


@dataclass
class CloudApiCliRoleCreateRequest:
    name: CloudApiCliRoleCreateRequestName
    description: typing.Optional[CloudApiCliRoleCreateRequestDescription]

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "name": self.name,
            "description": self.description,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "CloudApiCliRoleCreateRequest":
        return CloudApiCliRoleCreateRequest(
            name=str(data["name"]),
            description=str(data.get("description")),
        )


CloudApiCliRoleCreateResponse = CommonRole

CommonUserId = str

CommonUserEmail = str

CommonUserRolesItem = str

CommonUserRoles = typing.List[CommonUserRolesItem]

CommonUserProjectId = str

CommonUserCreatedAt = str


@dataclass
class CommonUser:
    id: CommonUserId
    email: CommonUserEmail
    roles: CommonUserRoles
    project_id: CommonUserProjectId
    created_at: CommonUserCreatedAt

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "id": self.id,
            "email": self.email,
            "roles": self.roles,
            "projectId": self.project_id,
            "createdAt": self.created_at,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "CommonUser":
        return CommonUser(
            id=str(data["id"]),
            email=str(data["email"]),
            roles=[str(item) for item in data["roles"]],
            project_id=str(data["projectId"]),
            created_at=str(data["createdAt"]),
        )


CloudApiCliUserGetResponse = CommonUser

CloudApiCliBuildCreateResponseUrl = str

CloudApiCliBuildCreateResponseBuildId = str


@dataclass
class CloudApiCliBuildCreateResponse:
    url: CloudApiCliBuildCreateResponseUrl
    build_id: CloudApiCliBuildCreateResponseBuildId

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "url": self.url,
            "buildId": self.build_id,
        }

    @staticmethod
    def from_dict(
        data: typing.Dict[str, typing.Any],
    ) -> "CloudApiCliBuildCreateResponse":
        return CloudApiCliBuildCreateResponse(
            url=str(data["url"]),
            build_id=str(data["buildId"]),
        )


CloudApiCliApiKeyInfoResponseAuthorId = str

CloudApiCliApiKeyInfoResponseProjectId = str

CloudApiCliApiKeyInfoResponseEmail = str

CloudApiCliApiKeyInfoResponseIntercomHash = str


@dataclass
class CloudApiCliApiKeyInfoResponse:
    author_id: CloudApiCliApiKeyInfoResponseAuthorId
    project_id: CloudApiCliApiKeyInfoResponseProjectId
    email: CloudApiCliApiKeyInfoResponseEmail
    intercom_hash: CloudApiCliApiKeyInfoResponseIntercomHash

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "authorId": self.author_id,
            "projectId": self.project_id,
            "email": self.email,
            "intercomHash": self.intercom_hash,
        }

    @staticmethod
    def from_dict(
        data: typing.Dict[str, typing.Any],
    ) -> "CloudApiCliApiKeyInfoResponse":
        return CloudApiCliApiKeyInfoResponse(
            author_id=str(data["authorId"]),
            project_id=str(data["projectId"]),
            email=str(data["email"]),
            intercom_hash=str(data["intercomHash"]),
        )


StudioFlowApiStageCardContentKey = str

StudioFlowApiStageCardContentValue = typing.Dict[str, typing.Any]

StudioFlowApiStageCardContentType = str


@dataclass
class StudioFlowApiStageCardContent:
    key: StudioFlowApiStageCardContentKey
    value: StudioFlowApiStageCardContentValue
    type: StudioFlowApiStageCardContentType

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "key": self.key,
            "value": self.value,
            "type": self.type,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiStageCardContent":
        return StudioFlowApiStageCardContent(
            key=str(data["key"]),
            value=dict(**data["value"]),
            type=str(data["type"]),
        )


StudioFlowApiStageCardContentsItem = StudioFlowApiStageCardContent

StudioFlowApiStageCardContents = typing.List[StudioFlowApiStageCardContentsItem]

StudioFlowApiStageRunId = str

StudioFlowApiStageRunStage = str

StudioFlowApiStageRunData = typing.Dict[str, typing.Any]

StudioFlowApiStageRunStatus = typing.Union[
    typing.Literal["waiting"],
    typing.Literal["running"],
    typing.Literal["processing"],
    typing.Literal["finished"],
    typing.Literal["failed"],
    typing.Literal["abandoned"],
]

StudioFlowApiStageRunStatusValues: typing.List[StudioFlowApiStageRunStatus] = [
    "waiting",
    "running",
    "processing",
    "finished",
    "failed",
    "abandoned",
]

StudioFlowApiStageRunCreatedAt = str

StudioFlowApiStageRunUpdatedAt = str

StudioFlowApiStageRunParentId = str

StudioFlowApiStageRunExecutionId = str


@dataclass
class StudioFlowApiStageRun:
    id: StudioFlowApiStageRunId
    stage: StudioFlowApiStageRunStage
    data: StudioFlowApiStageRunData
    status: StudioFlowApiStageRunStatus
    created_at: StudioFlowApiStageRunCreatedAt
    updated_at: StudioFlowApiStageRunUpdatedAt
    parent_id: typing.Optional[StudioFlowApiStageRunParentId]
    execution_id: typing.Optional[StudioFlowApiStageRunExecutionId]

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "id": self.id,
            "stage": self.stage,
            "data": self.data,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "parent_id": self.parent_id,
            "execution_id": self.execution_id,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiStageRun":
        return StudioFlowApiStageRun(
            id=str(data["id"]),
            stage=str(data["stage"]),
            data=dict(**data["data"]),
            status=data["status"],
            created_at=str(data["created_at"]),
            updated_at=str(data["updated_at"]),
            parent_id=str(data.get("parent_id")),
            execution_id=str(data.get("execution_id")),
        )


StudioFlowApiStageRunCardId = str

StudioFlowApiStageRunCardCreatedAt = str

StudioFlowApiStageRunCardUpdatedAt = str

StudioFlowApiStageRunCardAssignee = str

StudioFlowApiStageRunCardStatus = StudioFlowApiStageRunStatus

StudioFlowApiStageRunCardContent = StudioFlowApiStageCardContents

StudioFlowApiStageRunCardStage = str


@dataclass
class StudioFlowApiStageRunCard:
    id: StudioFlowApiStageRunCardId
    created_at: StudioFlowApiStageRunCardCreatedAt
    updated_at: typing.Optional[StudioFlowApiStageRunCardUpdatedAt]
    assignee: typing.Optional[StudioFlowApiStageRunCardAssignee]
    status: StudioFlowApiStageRunCardStatus
    content: StudioFlowApiStageRunCardContent
    stage: typing.Optional[StudioFlowApiStageRunCardStage]

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "id": self.id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "assignee": self.assignee,
            "status": self.status,
            "content": self.content,
            "stage": self.stage,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiStageRunCard":
        return StudioFlowApiStageRunCard(
            id=str(data["id"]),
            created_at=str(data["created_at"]),
            updated_at=str(data.get("updated_at")),
            assignee=str(data.get("assignee")),
            status=data["status"],
            content=[
                StudioFlowApiStageCardContent.from_dict(item) for item in data["content"]
            ],
            stage=str(data.get("stage")),
        )


StudioFlowApiStageRunCardsItem = StudioFlowApiStageRunCard

StudioFlowApiStageRunCards = typing.List[StudioFlowApiStageRunCardsItem]

StudioFlowApiStageId = str

StudioFlowApiStageType = typing.Union[
    typing.Literal["form"],
    typing.Literal["hook"],
    typing.Literal["job"],
    typing.Literal["script"],
    typing.Literal["agents"],
    typing.Literal["clients"],
]

StudioFlowApiStageTypeValues: typing.List[StudioFlowApiStageType] = [
    "form",
    "hook",
    "job",
    "script",
    "agents",
    "clients",
]

StudioFlowApiStageTitle = str

StudioFlowApiStagePath = str

StudioFlowApiStageCanBeStarted = bool


@dataclass
class StudioFlowApiStage:
    id: StudioFlowApiStageId
    type: StudioFlowApiStageType
    title: StudioFlowApiStageTitle
    path: typing.Optional[StudioFlowApiStagePath]
    can_be_started: StudioFlowApiStageCanBeStarted

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "id": self.id,
            "type": self.type,
            "title": self.title,
            "path": self.path,
            "can_be_started": self.can_be_started,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiStage":
        return StudioFlowApiStage(
            id=str(data["id"]),
            type=data["type"],
            title=str(data["title"]),
            path=str(data.get("path")),
            can_be_started=bool(data["can_be_started"]),
        )


StudioFlowApiKanbanColumnSelectedStage = StudioFlowApiStage

StudioFlowApiKanbanColumnStageRunCards = StudioFlowApiStageRunCards

StudioFlowApiKanbanColumnTotalCount = int

StudioFlowApiKanbanColumnLoading = bool


@dataclass
class StudioFlowApiKanbanColumn:
    selected_stage: StudioFlowApiKanbanColumnSelectedStage
    stage_run_cards: StudioFlowApiKanbanColumnStageRunCards
    total_count: StudioFlowApiKanbanColumnTotalCount
    loading: typing.Optional[StudioFlowApiKanbanColumnLoading]

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "selected_stage": self.selected_stage,
            "stage_run_cards": self.stage_run_cards,
            "total_count": self.total_count,
            "loading": self.loading,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiKanbanColumn":
        return StudioFlowApiKanbanColumn(
            selected_stage=StudioFlowApiStage.from_dict(data["selected_stage"]),
            stage_run_cards=[
                StudioFlowApiStageRunCard.from_dict(item)
                for item in data["stage_run_cards"]
            ],
            total_count=int(data["total_count"]),
            loading=bool(data.get("loading")),
        )


StudioFlowApiKanbanColumnsItem = StudioFlowApiKanbanColumn

StudioFlowApiKanbanColumns = typing.List[StudioFlowApiKanbanColumnsItem]

StudioFlowApiKanbanDataColumns = StudioFlowApiKanbanColumns


@dataclass
class StudioFlowApiKanbanData:
    columns: StudioFlowApiKanbanDataColumns

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "columns": self.columns,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiKanbanData":
        return StudioFlowApiKanbanData(
            columns=[
                StudioFlowApiKanbanColumn.from_dict(item) for item in data["columns"]
            ],
        )


StudioFlowApiThreadsStageRunCards = StudioFlowApiStageRunCards

StudioFlowApiThreadsNotFoundStagesItem = str

StudioFlowApiThreadsNotFoundStages = typing.List[StudioFlowApiThreadsNotFoundStagesItem]

StudioFlowApiThreadsTotalCount = int


@dataclass
class StudioFlowApiThreads:
    stage_run_cards: StudioFlowApiThreadsStageRunCards
    not_found_stages: StudioFlowApiThreadsNotFoundStages
    total_count: StudioFlowApiThreadsTotalCount

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "stage_run_cards": self.stage_run_cards,
            "not_found_stages": self.not_found_stages,
            "total_count": self.total_count,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiThreads":
        return StudioFlowApiThreads(
            stage_run_cards=[
                StudioFlowApiStageRunCard.from_dict(item)
                for item in data["stage_run_cards"]
            ],
            not_found_stages=[str(item) for item in data["not_found_stages"]],
            total_count=int(data["total_count"]),
        )


StudioFlowApiStagesItem = StudioFlowApiStage

StudioFlowApiStages = typing.List[StudioFlowApiStagesItem]

StudioFlowApiEditorLintersRuleName = str

StudioFlowApiEditorLintersRuleLabel = str

StudioFlowApiEditorLintersRuleType = typing.Literal["bug"]

StudioFlowApiEditorLintersRuleTypeValues: typing.List[
    StudioFlowApiEditorLintersRuleType
] = ["bug"]

StudioFlowApiEditorLintersIssueLabel = str

StudioFlowApiEditorLintersFixName = str

StudioFlowApiEditorLintersFixLabel = str


@dataclass
class StudioFlowApiEditorLintersFix:
    name: StudioFlowApiEditorLintersFixName
    label: StudioFlowApiEditorLintersFixLabel

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "name": self.name,
            "label": self.label,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiEditorLintersFix":
        return StudioFlowApiEditorLintersFix(
            name=str(data["name"]),
            label=str(data["label"]),
        )


StudioFlowApiEditorLintersIssueFixesItem = StudioFlowApiEditorLintersFix

StudioFlowApiEditorLintersIssueFixes = typing.List[
    StudioFlowApiEditorLintersIssueFixesItem
]


@dataclass
class StudioFlowApiEditorLintersIssue:
    label: StudioFlowApiEditorLintersIssueLabel
    fixes: StudioFlowApiEditorLintersIssueFixes

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "label": self.label,
            "fixes": self.fixes,
        }

    @staticmethod
    def from_dict(
        data: typing.Dict[str, typing.Any],
    ) -> "StudioFlowApiEditorLintersIssue":
        return StudioFlowApiEditorLintersIssue(
            label=str(data["label"]),
            fixes=[
                StudioFlowApiEditorLintersFix.from_dict(item) for item in data["fixes"]
            ],
        )


StudioFlowApiEditorLintersRuleIssuesItem = StudioFlowApiEditorLintersIssue

StudioFlowApiEditorLintersRuleIssues = typing.List[
    StudioFlowApiEditorLintersRuleIssuesItem
]


@dataclass
class StudioFlowApiEditorLintersRule:
    name: StudioFlowApiEditorLintersRuleName
    label: StudioFlowApiEditorLintersRuleLabel
    type: StudioFlowApiEditorLintersRuleType
    issues: StudioFlowApiEditorLintersRuleIssues

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "name": self.name,
            "label": self.label,
            "type": self.type,
            "issues": self.issues,
        }

    @staticmethod
    def from_dict(
        data: typing.Dict[str, typing.Any],
    ) -> "StudioFlowApiEditorLintersRule":
        return StudioFlowApiEditorLintersRule(
            name=str(data["name"]),
            label=str(data["label"]),
            type=data["type"],
            issues=[
                StudioFlowApiEditorLintersIssue.from_dict(item)
                for item in data["issues"]
            ],
        )


StudioFlowApiEditorLintersFixResponseSuccess = bool


@dataclass
class StudioFlowApiEditorLintersFixResponse:
    success: StudioFlowApiEditorLintersFixResponseSuccess

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "success": self.success,
        }

    @staticmethod
    def from_dict(
        data: typing.Dict[str, typing.Any],
    ) -> "StudioFlowApiEditorLintersFixResponse":
        return StudioFlowApiEditorLintersFixResponse(
            success=bool(data["success"]),
        )


StudioFlowApiEditorLintersCheckResponseItem = StudioFlowApiEditorLintersRule

StudioFlowApiEditorLintersCheckResponse = typing.List[
    StudioFlowApiEditorLintersCheckResponseItem
]

StudioFlowApiEditorEnvVarsModelName = str

StudioFlowApiEditorEnvVarsModelValue = str


@dataclass
class StudioFlowApiEditorEnvVarsModel:
    name: StudioFlowApiEditorEnvVarsModelName
    value: StudioFlowApiEditorEnvVarsModelValue

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "name": self.name,
            "value": self.value,
        }

    @staticmethod
    def from_dict(
        data: typing.Dict[str, typing.Any],
    ) -> "StudioFlowApiEditorEnvVarsModel":
        return StudioFlowApiEditorEnvVarsModel(
            name=str(data["name"]),
            value=str(data["value"]),
        )


StudioFlowApiEditorEnvVarsListResponseItem = StudioFlowApiEditorEnvVarsModel

StudioFlowApiEditorEnvVarsListResponse = typing.List[
    StudioFlowApiEditorEnvVarsListResponseItem
]

StudioFlowApiEditorEnvVarsCreateRequest = StudioFlowApiEditorEnvVarsModel

StudioFlowApiEditorEnvVarsCreateResponse = StudioFlowApiEditorEnvVarsModel

StudioFlowApiPlayerUserSignupEmail = CommonUserEmail


@dataclass
class StudioFlowApiPlayerUserSignup:
    email: StudioFlowApiPlayerUserSignupEmail

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "email": self.email,
        }

    @staticmethod
    def from_dict(data: typing.Dict[str, typing.Any]) -> "StudioFlowApiPlayerUserSignup":
        return StudioFlowApiPlayerUserSignup(
            email=str(data["email"]),
        )


StudioFlowApiPlayerUserNavigationGuardStatus = typing.Union[
    typing.Literal["ALLOWED"],
    typing.Literal["UNAUTHORIZED"],
    typing.Literal["FORBIDEN"],
    typing.Literal["NOT_FOUND"],
]

StudioFlowApiPlayerUserNavigationGuardStatusValues: typing.List[
    StudioFlowApiPlayerUserNavigationGuardStatus
] = ["ALLOWED", "UNAUTHORIZED", "FORBIDEN", "NOT_FOUND"]


@dataclass
class StudioFlowApiPlayerUserNavigationGuard:
    status: StudioFlowApiPlayerUserNavigationGuardStatus

    def to_dict(self) -> typing.Dict[str, typing.Any]:
        return {
            "status": self.status,
        }

    @staticmethod
    def from_dict(
        data: typing.Dict[str, typing.Any],
    ) -> "StudioFlowApiPlayerUserNavigationGuard":
        return StudioFlowApiPlayerUserNavigationGuard(
            status=data["status"],
        )
