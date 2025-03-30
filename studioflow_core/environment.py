import os

DEFAULT_LOGLEVEL = "WARNING"
LOGLEVEL = lambda: os.getenv("STUDIOFLOW_LOGLEVEL", DEFAULT_LOGLEVEL)  # noqa: E731
NOISY_LOGLEVEL = lambda: os.getenv("STUDIOFLOW_NOISY_LOGLEVEL", DEFAULT_LOGLEVEL)  # noqa: E731

PROCESS_LOGFORMAT = "[%(asctime)s][%(levelname)s][%(name)s][%(process)d]%(message)s"
DEFAULT_LOGFORMAT = "[%(asctime)s][%(levelname)s][%(name)s] %(message)s"
LOGFORMAT = lambda: os.getenv("STUDIOFLOW_LOGFORMAT", DEFAULT_LOGFORMAT)  # noqa: E731

WORKERS = os.getenv("STUDIOFLOW_WORKERS", 2)
THREADS = os.getenv("STUDIOFLOW_THREADS", 20)
WORKER_TEMP_DIR = os.getenv("STUDIOFLOW_WORKER_TEMP_DIR")
WORKER_CLASS = os.getenv("STUDIOFLOW_WORKER_CLASS", "gthread")

HOST = os.getenv("STUDIOFLOW_HOST", "localhost")
DEFAULT_PORT = os.getenv("PORT") or os.getenv("STUDIOFLOW_SERVER_PORT")

BUILD_ID = os.getenv("STUDIOFLOW_BUILD_ID") or "dev"
PROJECT_ID = os.getenv("STUDIOFLOW_PROJECT_ID") or "dev-project-id"
PROJECT_URL = os.getenv("STUDIOFLOW_PROJECT_URL")

EMAIL_JWT_AUDIENCE = f"studioflow:email:{PROJECT_ID}"

IS_PRODUCTION = os.getenv("STUDIOFLOW_ENVIRONMENT") == "production"
SHOW_WATERMARK = os.getenv("STUDIOFLOW_SHOW_WATERMARK", "false") == "true"

DISABLE_STDIO_PATCH = os.getenv("STUDIOFLOW_DISABLE_STDIO_PATCH", "false") == "true"

CLOUD_API_ENDPOINT = os.getenv("CLOUD_API_ENDPOINT") or "https://cloud-api.studioflow.cloud"
CLOUD_API_CLI_URL = f"{CLOUD_API_ENDPOINT}/cli"

PUBLIC_KEY = os.getenv("STUDIOFLOW_JWT_PUBLIC_KEY_PEM")
FILES_FOLDER = os.getenv("STUDIOFLOW_FILES_FOLDER")

SIDECAR_SHARED_TOKEN = os.getenv("STUDIOFLOW_SIDECAR_SHARED_TOKEN", "shared")
SIDECAR_HEADERS = {"shared-token": SIDECAR_SHARED_TOKEN}
SIDECAR_URL = os.getenv("STUDIOFLOW_SIDECAR_URL")

EDITOR_MODE = os.getenv("STUDIOFLOW_EDITOR_MODE") or "local"

RABBITMQ_EXECUTION_QUEUE = os.getenv("STUDIOFLOW_RABBITMQ_EXECUTION_QUEUE", "executions")
RABBITMQ_DEFAUT_EXCHANGE = os.getenv("STUDIOFLOW_RABBITMQ_DEFAUT_EXCHANGE", "")
RABBITMQ_CONNECTION_URI = os.getenv("STUDIOFLOW_RABBITMQ_CONNECTION_URI")
QUEUE_CONCURRENCY = int(os.getenv("STUDIOFLOW_QUEUE_CONCURRENCY", 2))

OIDC_CLIENT_ID = lambda: os.getenv("STUDIOFLOW_OIDC_CLIENT_ID")  # noqa: E731
OIDC_AUTHORITY = lambda: os.getenv("STUDIOFLOW_OIDC_AUTHORITY")  # noqa: E731

__WORKER_UUID_ENV__ = "STUDIOFLOW_WORKER_UUID"
WORKER_UUID = lambda: os.getenv(__WORKER_UUID_ENV__)  # noqa: E731


def set_WORKER_UUID(worker_uuid: str):
    os.environ[__WORKER_UUID_ENV__] = worker_uuid


__SERVER_UUID_ENV__ = "STUDIOFLOW_SERVER_UUID"
SERVER_UUID = lambda: os.getenv(__SERVER_UUID_ENV__)  # noqa: E731


def set_SERVER_UUID(server_uuid: str):
    os.environ[__SERVER_UUID_ENV__] = server_uuid
