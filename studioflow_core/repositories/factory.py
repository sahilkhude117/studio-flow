from dataclasses import dataclass

from studioflow_core.environment import (
    CLOUD_API_CLI_URL,
    RABBITMQ_CONNECTION_URI,
    SIDECAR_URL,
    EDITOR_MODE
)
from studioflow_core.repositories.agents import (
    AgentsRepository,
    LocalAgentsRepository,
    ProductionAgentsRepository,
)
from studioflow_core.repositories.ai import (
    AiApiHttpClient,
    LocalAiApiHttpClient,
    ProductionAiApiHttpClient
)
from studioflow_core.repositories.connectors import (
    ConnectorsRepository,
    LocalConnectorsRepository,
    ProductionConnectorsRepository
)
from studioflow_core.repositories.email import (
    EmailRepository,
    LocalEmailRepository,
    ProductionEmailRepository
)
from studioflow_core.repositories.execution import (
    ExecutionRepository,
    LocalExecutionRepository,
    ProductionExecutionRepository
)
from studioflow_core.repositories.execution_logs import (
    ExecutionLogsRepository,
    LocalExecutionLogsRepository,
    ProductionExecutionLogsRepository
)
from studioflow_core.repositories.jwt_signer import (
    EditorJWTRepository,
    JWTRepository,
    LocalJWTRepository,
    ProductionJWTRepository,
    get_editor_jwt_repository
)
from studioflow_core.repositories.keyvalue import (
    KVRepository,
    LocalKVRepository,
    ProductionKVRepository
)
from studioflow_core.repositories.multiprocessing import (
    ForkserverContextRepository,
    MPContextReposity,
    SpawnContextReposity
)
from studioflow_core.repositories.producer import (
    LocalProducerRepository,
    ProducerRepository,
    ProductionProducerRepository
)
from studioflow_core.repositories.roles import (
    LocalRolesRepository,
    ProductionRolesRepository,
    RolesRepository
)
from studioflow_core.repositories.services import (
    LocalRoleAgentRepository,
    LocalRoleClientRepository,
    ProductionRoleAgentRepository,
    ProductionRoleClientRepository
)
from studioflow_core.repositories.services.roles.agent import RoleAgentRepository
from studioflow_core.repositories.services.roles.client import RoleClientRepository
from studioflow_core.repositories.tables import (
    LocalTablesApiHttpClient,
    ProductionTablesApiHttpClient,
    TablesApiHttpClient
)
from studioflow_core.repositories.tasks import (
    LocalTasksRepository,
    ProductionTasksRepository,
    TasksRepository
)
from studioflow_core.repositories.users import (
    LocalUsersRepository,
    ProductionUsersRepository,
    UsersRepository
)


@dataclass
class Repositories:
    execution_logs: ExecutionLogsRepository
    connectors: ConnectorsRepository
    execution: ExecutionRepository
    mp_context: MPContextReposity
    producer: ProducerRepository
    tables: TablesApiHttpClient
    email: EmailRepository
    users: UsersRepository
    roles: RolesRepository
    ai: AiApiHttpClient
    jwt: JWTRepository
    kv: KVRepository
    roles: RolesRepository
    tasks: TasksRepository
    tables: TablesApiHttpClient
    users: UsersRepository
    editor_jwt: EditorJWTRepository
    role_agents: RoleAgentRepository
    role_clients: RoleClientRepository
    agents: AgentsRepository


def get_editor_repositories():
    mp_context = SpawnContextReposity()

    return Repositories(
        execution=LocalExecutionRepository(mp_context.get_context()),
        producer=LocalProducerRepository(mp_context.get_context()),
        connectors=LocalConnectorsRepository(CLOUD_API_CLI_URL),
        tasks=LocalTasksRepository(mp_context.get_context()),
        tables=LocalTablesApiHttpClient(CLOUD_API_CLI_URL),
        email=LocalEmailRepository(CLOUD_API_CLI_URL),
        roles=LocalRolesRepository(CLOUD_API_CLI_URL),
        ai=LocalAiApiHttpClient(CLOUD_API_CLI_URL),
        execution_logs=LocalExecutionLogsRepository(),
        users=LocalUsersRepository(),
        jwt=LocalJWTRepository(),
        kv=LocalKVRepository(),
        role_agents=LocalRoleAgentRepository(CLOUD_API_CLI_URL),
        role_clients=LocalRoleClientRepository(CLOUD_API_CLI_URL),
        editor_jwt=get_editor_jwt_repository(EDITOR_MODE),
        mp_context=mp_context,
        agents=LocalAgentsRepository(CLOUD_API_CLI_URL),
    )

def get_prodution_app_repositories():
    if SIDECAR_URL is None or RABBITMQ_CONNECTION_URI is None:
        raise Exception("Production urls are not set")

    return Repositories(
        producer=ProductionProducerRepository(RABBITMQ_CONNECTION_URI),
        execution_logs=ProductionExecutionLogsRepository(SIDECAR_URL),
        connectors=ProductionConnectorsRepository(SIDECAR_URL),
        execution=ProductionExecutionRepository(SIDECAR_URL),
        tables=ProductionTablesApiHttpClient(SIDECAR_URL),
        email=ProductionEmailRepository(SIDECAR_URL),
        roles=ProductionRolesRepository(SIDECAR_URL),
        users=ProductionUsersRepository(SIDECAR_URL),
        tasks=ProductionTasksRepository(SIDECAR_URL),
        ai=ProductionAiApiHttpClient(SIDECAR_URL),
        jwt=ProductionJWTRepository(SIDECAR_URL),
        kv=ProductionKVRepository(SIDECAR_URL),
        role_agents=ProductionRoleAgentRepository(SIDECAR_URL),
        role_clients=ProductionRoleClientRepository(SIDECAR_URL),
        editor_jwt=get_editor_jwt_repository(EDITOR_MODE),
        mp_context=ForkserverContextRepository(),
        agents=ProductionAgentsRepository(SIDECAR_URL),
    )


