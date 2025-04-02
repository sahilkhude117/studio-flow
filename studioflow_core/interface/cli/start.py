from typing import Optional

from studioflow_core.credentials import set_credentials
from studioflow_core.repositories.project.project import ProjectRepository
from studioflow_core.usage import editor_manual_usage


def start(credential_token: Optional[str] = None):
    if ProjectRepository.exists():
        print("This directory already has an Abstra project.")
        print("\nRun 'abstra editor' in the directory to start the editor.")
        editor_manual_usage(
            event="run_abstra_start_on_existing_project",
            payload=dict(),
        )
        return

    ProjectRepository.generate_getting_started_project()

    if credential_token:
        set_credentials(credential_token)

    editor_manual_usage(
        event="run_abstra_start_successfully",
        payload=dict(),
    )

    print("Project initialized successfully.")
    print("\nRun 'abstra editor' in the directory to start the editor.")
