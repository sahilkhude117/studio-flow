import pathlib

from studioflow_core.settings import Settings


def get_project_url() -> str:
    return f'http://localhost:{Settings.server_port}'

STUDIOFLOW_LOGO_URL = (
    "https://abstra-cloud-assets.s3.us-east-1.amazonaws.com/logo-small-256px.png"
)