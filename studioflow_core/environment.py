import os

HOST = os.getenv("STUDIOFLOW_HOST", "localhost")
DEFAULT_PORT = os.getenv("PORT") or os.getenv("STUDIOFLOW_SERVER_PORT")

