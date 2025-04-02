from typing import Optional

import fire

from studioflow_core.interface.cli.agents import add_agent
from studioflow_core.interface.cli.deploy import deploy
from studioflow_core.interface.cli.dir import select_dir
from studioflow_core.interface.cli.editor import editor
from studioflow_core.interface.cli.start import start
from studioflow_core.interface.cli.tables import dump, restore
from studioflow_core.interface.cli.version import version
from studioflow_core.settings import SettingsController


class CLI(object):
    """
    A CLI to manage your Abstra Cloud project environment.

    usage: abstra <command> <resource> [<argument> ...] [parameters]
    """

    def version(self):
        version()

    def deploy(self, root_dir: Optional[str] = None):
        SettingsController.set_root_path(root_dir or select_dir())
        deploy()

    def editor(self, root_dir: Optional[str] = None, port: int = 3000, headless=False):
        SettingsController.set_root_path(root_dir or select_dir())
        SettingsController.set_server_port(port)
        editor(headless=headless)

    def serve(self, root_dir: Optional[str] = None, port: int = 3000, headless=False):
        print("This command is deprecated. Please use 'abstra editor' instead.")
        self.editor(root_dir=root_dir, port=port, headless=headless)

    def dump(self, root_dir: str = "."):
        SettingsController.set_root_path(root_dir)
        dump()

    def restore(self, root_dir: str = "."):
        SettingsController.set_root_path(root_dir)
        restore()

    def add_agent(self, agent_id: str, agent_name: str, root_dir: Optional[str] = None):
        SettingsController.set_root_path(root_dir or select_dir())
        add_agent(agent_project_id=agent_id, agent_title=agent_name)

    def start(self, root_dir: Optional[str] = None, token: Optional[str] = None):
        SettingsController.set_root_path(root_dir or select_dir())
        start(token)


def _SeparateFlagArgs(args):
    try:
        index = args.index("--help")
        args = args[:index]
        return args, ["--help"]
    except ValueError:
        return args, []


def main():
    fire.core.parser.SeparateFlagArgs = _SeparateFlagArgs  # type: ignore
    fire.Fire(CLI)


if __name__ == "__main__":
    main()
