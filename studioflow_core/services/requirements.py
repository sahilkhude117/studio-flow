import ast
import importlib.util
import os
import subprocess
import sys
import threading
from dataclasses import dataclass
from pathlib import Path
from shutil import move
from tempfile import mkdtemp
from typing import Dict, List, Literal, Mapping, Optional, Set

from importlib_metadata import packages_distributions
from pip._internal.cli.main import main as pip_main
from pkg_resources import get_distribution, working_set

from studioflow_core.repositories.project.project import ProjectRepository
from studioflow_core.settings import Settings
from studioflow_core.utils.format import pip_name

install_lock = threading.Lock()


def stream_output(cmd: List[str]):
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
    )
    if process.stdout is None:
        return
    for line in iter(process.stdout.readline, ""):
        yield line
    code = process.wait()
    if code != 0:
        yield "__Studioflow_STREAM_ERROR__"


def check_package(package_name) -> Literal["builtin", "installed", "unknown"]:
    if package_name in sys.builtin_module_names:
        return "builtin"

    spec = importlib.util.find_spec(package_name)
    if spec is not None and spec.origin is not None:
        if "site-packages" in spec.origin:
            return "installed"
        return "builtin"

    return "unknown"


@dataclass
class Requirement:
    name: str
    version: Optional[str] = None

    def to_text(self):
        if self.version is None:
            return self.name
        else:
            return f"{self.name}=={self.version}"

    @staticmethod
    def from_text(text: str):
        try:
            if "==" in text:
                name, version = text.split("==")
                return Requirement(name=name, version=version)
            else:
                return Requirement(name=text)
        except ValueError:
            return None

    def to_dict(self):
        return {
            "name": self.name,
            "version": self.version,
            "installed_version": self.installed_version(),
        }

    @staticmethod
    def from_dict(data: dict):
        return Requirement(name=data["name"], version=data["version"])

    def __hash__(self) -> int:
        return hash(f"{self.name}/{self.version}")

    def installed_version(self):
        try:
            return get_distribution(self.name).version
        except Exception:
            return None

    def uninstall(self):
        if not self.installed_version():
            return

        if os.getenv("__STANDALONE_MODE__"):
            yield from self.__uninstall_from_standalone()
        else:
            yield from self.__uninstall_from_lib()

        working_set.by_key.pop(self.name, None)  # dirty hack

    def __uninstall_from_standalone(self):
        cmd = [
            "uninstall",
            "-y",
            self.to_text(),
            "--target",
            os.environ["__STANDALONE_PACKAGES_FOLDER__"],
        ]

        if pip_main(cmd) != 0:
            yield f"Failed to uninstall {self.to_text()} from standalone\n"
        else:
            yield "Uninstallation finished successfully\n\n"

    def __uninstall_from_lib(self):
        yield from stream_output(
            [sys.executable, "-m", "pip", "uninstall", "-y", self.name]
        )


@dataclass
class RequirementRecommendation:
    requirement: Requirement
    reason_file: Path
    reason_line: int
    reason_code: str

    def to_dict(self):
        return {
            **self.requirement.to_dict(),
            "reason_file": str(self.reason_file),
            "reason_line": self.reason_line,
            "reason_code": self.reason_code,
        }

    def __hash__(self) -> int:
        return hash(
            f"{self.requirement.to_text()}/{self.reason_file}/{self.reason_line}"
        )


@dataclass
class Requirements:
    libraries: List[Requirement]

    def to_text(self):
        return "\n".join([lib.to_text() for lib in self.libraries])

    @staticmethod
    def from_text(text: str):
        libraries = []
        for line in text.splitlines():
            if line.startswith("#"):
                continue

            if line.strip() == "":
                continue

            requirement = Requirement.from_text(line)
            if requirement is None:
                continue

            libraries.append(requirement)
        return Requirements(libraries=libraries)

    def to_dict(self):
        return [lib.to_dict() for lib in self.libraries]

    @staticmethod
    def from_dict(data: list):
        return Requirements(libraries=[Requirement.from_dict(lib) for lib in data])

    def add(self, name: str, version: Optional[str] = None):
        if self.has(name, version):
            return
        self.libraries.append(Requirement(name=name, version=version))

    def update(self, name: str, version: str):
        self.libraries = [
            lib if lib.name != name else Requirement(name=name, version=version)
            for lib in self.libraries
        ]

    def delete(self, name: str):
        self.libraries = [lib for lib in self.libraries if lib.name != name]

    def delete_duplicates(self, name: str, version: Optional[str]):
        self.libraries = [
            lib for lib in self.libraries if lib.name != name or lib.version != version
        ]

    def has(self, lib_name: str, version: Optional[str] = None):
        for lib in self.libraries:
            if lib.name == lib_name and (lib.version == version or version is None):
                return True
        return False

    def ensure(self, lib_name: str, version: Optional[str] = None):
        if (
            self.has(lib_name)
            and version is not None
            and not self.has(lib_name, version)
        ):
            self.update(lib_name, version)
        elif not self.has(lib_name):
            self.add(lib_name, version)

    def get(self, lib_name: str):
        for lib in self.libraries:
            if lib.name == lib_name:
                return lib.version
        return None

    def get_duplicates(self) -> Dict[str, List[Requirement]]:
        duplicates = {}
        for lib in self.libraries:
            if not isinstance(duplicates.get(lib.name), list):
                duplicates[lib.name] = [lib]
            else:
                duplicates[lib.name].append(lib)
        return {k: v for k, v in duplicates.items() if len(v) > 1}

    def __install_from_lib(self):
        cmd = [sys.executable, "-m", "pip", "install"]

        for lib in self.libraries:
            if lib.name == "abstra":
                continue

            cmd.append(lib.to_text())

        yield from stream_output(cmd)

    def __install_from_standalone(self):
        # pip is not thread safe, but we can use a lock to avoid conflicts
        print("Installing from standalone")
        with install_lock:
            for lib in self.libraries:
                if lib.name == "abstra":
                    continue

                cmd = [
                    "install",
                    lib.to_text(),
                    "--target",
                    os.environ["__STANDALONE_PACKAGES_FOLDER__"],
                ]

                yield f"Installing {lib.to_text()} in abstra standalone...\n"

                res = pip_main(cmd)
                if res != 0:
                    yield f"Failed to install {lib.name}=={lib.version}\n"
                else:
                    yield "Installation finished successfully\n\n"

    def install(self):
        if os.getenv("__STANDALONE_MODE__"):
            yield from self.__install_from_standalone()
        else:
            yield from self.__install_from_lib()


@dataclass
class RequirementsRepository:
    @classmethod
    def get_file_path(cls):
        return Settings.root_path / "requirements.txt"

    # TODO: refactor this method -> TA ORIVEL
    @classmethod
    def get_recommendation(cls) -> List[RequirementRecommendation]:
        imported_modules: Set[RequirementRecommendation] = set()

        project = ProjectRepository.load()
        package_dist = packages_distributions()
        visited_set = set()

        for python_file in project.project_files:
            try:
                if not python_file.exists():
                    continue
                code = python_file.read_text(encoding="utf-8")
                parsed = ast.parse(code)
                for node in parsed.body:
                    pkg_names = []

                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            pkg_names.append(alias.name.split(".")[0])

                    if isinstance(node, ast.ImportFrom):
                        if node.module is None:
                            continue

                        pkg_names.append(node.module.split(".")[0])

                    for pkg_name in pkg_names:
                        for lib in find_installed_libs(
                            pkg_name, visited_set, package_dist
                        ):
                            imported_modules.add(
                                RequirementRecommendation(
                                    requirement=Requirement(
                                        name=lib["name"],
                                        version=lib["version"],
                                    ),
                                    reason_file=python_file,
                                    reason_line=node.lineno,
                                    reason_code=python_file.read_text(
                                        encoding="utf-8"
                                    ).splitlines()[node.lineno - 1],
                                )
                            )

            except SyntaxError:
                continue

        already_added = set([pip_name(lib.name) for lib in cls.load().libraries])

        return [
            module
            for module in imported_modules
            if pip_name(module.requirement.name) not in already_added
        ]

    @classmethod
    def save(cls, requirements: Requirements):
        temp_file = Path(mkdtemp()) / "requirements.txt"

        with temp_file.open("w") as f:
            f.write(requirements.to_text())
        move(str(temp_file), cls.get_file_path())

    @classmethod
    def load(cls) -> Requirements:
        file = cls.get_file_path()
        if file.exists():
            requirements_content = file.read_text(encoding="utf-8")
            return Requirements.from_text(requirements_content)
        else:
            return Requirements(libraries=[])

    @classmethod
    def ensure(cls, lib_name: str):
        requirements = cls.load()
        requirements.ensure(lib_name, get_distribution(lib_name).version)
        cls.save(requirements)


def find_installed_libs(
    pkg_name: str, visited_set: set, package_dist: Mapping[str, List[str]]
) -> List[dict]:
    if pkg_name in visited_set:
        return []

    visited_set.add(pkg_name)
    kind = check_package(pkg_name)
    if kind != "installed":
        return []

    lib_name = package_dist.get(pkg_name)
    if lib_name is None:
        return []  # this should not happen

    return [
        dict(
            name=lib,
            version=get_distribution(lib).version,
        )
        for lib in lib_name
    ]
