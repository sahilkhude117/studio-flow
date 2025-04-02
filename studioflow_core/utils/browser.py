import threading
import webbrowser

from studioflow_core.environment import HOST
from studioflow_core.settings import Settings


def browser_open_editor():
    threading.Timer(
        1, lambda: webbrowser.open(f"http://{HOST}:{Settings.server_port}/_editor")
    ).start()
