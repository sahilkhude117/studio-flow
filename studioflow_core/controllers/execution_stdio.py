import sys
from typing import Callable, List, Literal, Union

import flask_sock

from studioflow_core.controllers.main import MainController
from studioflow_core.utils import serialize

class StdioController:
    listeners: List[flask_sock.Server] = []

    @classmethod
    def register(cls, listener: flask_sock.Server):
        cls.listeners.append(listener)

    @classmethod
    def unregister(cls, listener: flask_sock.Server):
        cls.listeners.remove(listener)

    @classmethod
    def broadcast(
        cls,
        *,
        type: Literal["stdout", "stderr"],
        execution_id: str,
        stage_id: str,
        log: str,
    ):
        msg = serialize(
            dict(type=type, log=log, execution_id=execution_id, stage_id=stage_id)
        )
        for listener in cls.listeners:
            try:
                listener.send(msg)
            except Exception:
                pass
