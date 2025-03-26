import inspect
from functools import wraps
from pathlib import Path
from typing import Any, Callable, Dict, Literal, Optional, Tuple

import flask
import requests

from studioflow_core.threaded import threaded
from studioflow_core.credentials import get_credentials
from studioflow_core.environment import CLOUD_API_CLI_URL
from studioflow_core.utils import get_local_python_version, get_local_user_id
from studioflow_core.utils.env import is_dev_env, is_test_env

#EDITOR
@threaded
def send_editor_usage(payload: Dict):
    if is_test_env() or is_dev_env():
        return

    data = {
        "payload": payload,
        "userId": get_local_user_id(),
        "pythonVersion": get_local_python_version(),
        "studioflowVersion": "studioflow-0.0.0"
    }

    headers = {"apiKey": get_credentials()}
    api_url = f"{CLOUD_API_CLI_URL}/editor/usage"
    requests.post(api_url, json=data, headers=headers)


def editor_usage(func: Callable[..., Any]) -> Callable[..., Any]:

    @wraps(func)
    def wrapper(*args: Tuple[Any], **kwargs: Any) -> Any:
        arg_names = inspect.getfullargspec(func).args
        arg_values = dict(zip(arg_names, args))

        send_editor_usage({**arg_values, **kwargs, **{"event": func.__name__}})
        return func(*args, **kwargs)

    return wrapper


def editor_manual_usage(*, event: str, payload: Dict):
    send_editor_usage({**payload, "event": event})
