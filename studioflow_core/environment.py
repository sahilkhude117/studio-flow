import os

DEFAULT_LOGLEVEL = "WARNING"
LOGLEVEL = lambda: os.getenv("STUDIOFLOW_LOGLEVEL", DEFAULT_LOGLEVEL) 
NOISY_LOGLEVEL = lambda: os.getenv("STUDIOFLOW_NOISY_LOGLEVEL", DEFAULT_LOGLEVEL)  # noqa: E731

PROCESS_LOGFORMAT = "[%(asctime)s][%(levelname)s][%(name)s][%(process)d]%(message)s"
DEFAULT_LOGFORMAT = "[%(asctime)s][%(levelname)s][%(name)s] %(message)s"
LOGFORMAT = lambda: os.getenv("ABSTRA_LOGFORMAT", DEFAULT_LOGFORMAT) 

HOST = os.getenv("STUDIOFLOW_HOST", "localhost")
DEFAULT_PORT = os.getenv("PORT") or os.getenv("STUDIOFLOW_SERVER_PORT")

BUILD_ID = os.getenv("STUDIOFLOW_BUILD_ID") or "dev"
PROJECT_ID = os.getenv("STUDIOFLOW_PROJECT_ID") or "dev-project-id"
PROJECT_URL = os.getenv("STUDIOFLOW_PROJECT_URL")

CLOUD_API_ENDPOINT = os.getenv("CLOUD_API_ENDPOINT") or "https://cloud-api.abstra.cloud"
CLOUD_API_CLI_URL = f"{CLOUD_API_ENDPOINT}/cli"

PUBLIC_KEY = os.getenv("ABSTRA_JWT_PUBLIC_KEY_PEM")

SIDECAR_SHARED_TOKEN = os.getenv("STUDIOFLOW_SIDECAR_SHARED_TOKEN", "shared")
SIDECAR_HEADERS = {"shared-token": SIDECAR_SHARED_TOKEN}
SIDECAR_URL = os.getenv("STUDIOFLOW_SIDECAR_URL")