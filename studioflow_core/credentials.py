import os

from studioflow_core.settings import Settings
from studioflow_core.utils.dot_studioflow import CREDENTIALS_FILE

def get_credentials():
    if os.getenv("SF_API_TOKEN"):
        return os.getenv("SF_API_TOKEN")

    credentials_path = Settings.root_path.joinpath(CREDENTIALS_FILE)
    if not credentials_path.exists():
        return None

    return credentials_path.read_text(encoding="utf-8").strip()
