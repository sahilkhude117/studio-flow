from studioflow_core.controllers.sdk_context import SDKContextStore


def get_execution_id() -> str:
    return SDKContextStore.get_execution().id
