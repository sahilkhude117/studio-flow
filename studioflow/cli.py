from typing import Optional

import fire

from studioflow_core.interface.cli.dir import select_dir
from studioflow_core.settings import SettingsController
from studioflow_core.interface.cli.editor import editor

class CLI(object):

    def editor(self, root_dir: Optional[str] = None, port: int = 3000, headless=False):
        SettingsController.set_root_path(root_dir or select_dir())
        SettingsController.set_server_port(port)
        editor(headless=headless)

def _SeparateFlagArgs(args):
    try:
        index = args.index("--help")
        args = args[:index]
        return args, ["--help"]
    except ValueError:
        return args, []
    
def main():
    fire.core.parser.SeparateFlagArgs = _SeparateFlagArgs
    fire.Fire(CLI)

if __name__ == "__main__":
    main()