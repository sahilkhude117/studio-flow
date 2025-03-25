from colorama import Fore, Style

from studioflow_core.environment import HOST
from studioflow_core.settings import Settings

def serve_message():
    print(
        Fore.MAGENTA
        + Style.BRIGHT
        + f"\n\nStudio-Flow Editor is RUNNING : http://{HOST}:{Settings.server_port}/_editor\n\n"
        + Style.RESET_ALL
    )