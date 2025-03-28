import abc
import typing

import requests

from studioflow_core.credentials import resolve_headers
from studioflow_core.environment import SIDECAR_HEADERS


class TablesApiHttpClient(abc.ABC):
    execute_url: str

    def __init__(self, base_url: str) -> None:
        self.execute_url = f"{base_url}/tables/execute"

    def execute(self, query: str, params: typing.List) -> requests.Response:
        raise NotImplementedError()
    

class ProductionTablesApiHttpClient(TablesApiHttpClient):
    def execute(self, query: str, params: typing.List) -> requests.Response:
        body = {"query": query, "params": params}
        return requests.post(self.execute_url, headers=SIDECAR_HEADERS, json=body)


class LocalTablesApiHttpClient(TablesApiHttpClient):
    def execute(self, query: str, params: typing.List) -> requests.Response:
        body = {"query": query, "params": params}
        headers = resolve_headers()
        if headers is None:
            raise Exception("You must be logged in to execute a table query")
        return requests.post(self.execute_url, headers=headers, json=body)