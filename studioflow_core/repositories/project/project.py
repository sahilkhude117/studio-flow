import json
import os
import shutil
import sys
import tempfile
import uuid

from abc import ABC, abstractmethod
from dataclasses import field
from pathlib import Path
from typing import Any, Dict, Generator, List, Literal, Optional, Tuple, Union

from pydantic.dataclasses import dataclass

from studioflow_core.settings import Settings


class ProjectRepository:
    @classmethod
    def get_file_path(cls):
        return Settings.root_path / "studioflow.json"
    
    @classmethod
    def initialize(cls):
        if not cls.exists():
            cls.save(Project.create())
            cls.add_assets()

    @classmethod
    def add_assets(cls):
        logo_path = Settings.root_path / "logo.png"
        if not logo_path.exists():
            logo_path.write_bytes(studioflow_logo)

        favicon_path = Settings.root_path / "favicon.ico"
        if not favicon_path.exists():
            favicon_path.write_bytes(studioflow_favicon)

    @classmethod
    def exists(cls):
        return cls.get_file_path().exists()
    
    @classmethod
    def save(cls, project: Project):
        temp_file = Path(tempfile.mkdtemp()) / "studioflow.json"

        project_data = project.as_dict

        project_data["version"] = json_migrations.get_latest_version()

        with temp_file.open('w') as f:
            json.dump(project_data, f, indent=2)

        shutil.move(str(temp_file), cls.get_file_path())
        Path.rmdir(temp_file.parent)

    @classmethod
    def migrate_config_file(cls, verbose=True):
        if not cls.exists():
            return
        data = json.loads(cls.get_file_path().read_text(encoding='utf-8'))
        initial_version = data.get('version')

        migrated_data = json_migrations.migrate(
            data,
            Settings.root_path,
            verbose=verbose
        )

        if migrated_data["version"] != initial_version:
            cls.save(Project.from_dict(migrated_data))

    @classmethod
    def load(cls) -> Project:
        data = json.loads(cls.get_file_path().read_text(encoding='utf-8'))

        return Project.from_dict(data)

    @classmethod
    def initialize_or_migrate(cls, verbose=True):
        if not cls.exists():
            cls.initialize()
        else:
            cls.migrate_config_file(verbose=verbose)

    @classmethod
    def generate_getting_started_project(cls):
        generate_getting_started_project(Settings.root_path)
    