import sys

from studioflow_core.controllers.execution_stdio import StdioController
from studioflow_core.controllers.main import MainController
from studioflow_core.environment import DISABLE_STDIO_PATCH


class StdioPatcher:
    original_sys_stdout_write = sys.stdout.write
    original_sys_stderr_write = sys.stderr.write

    @classmethod
    def apply(cls, main_controller: MainController):
        if DISABLE_STDIO_PATCH:
            return

        stdio_controller = StdioController(
            sys_stderr_write=cls.original_sys_stderr_write,
            sys_stdout_write=cls.original_sys_stdout_write,
            main_controller=main_controller,
        )

        sys.stdout.write = stdio_controller.patched_stdout_write
        sys.stderr.write = stdio_controller.patched_stderr_write

    @classmethod
    def reset(cls):
        sys.stdout.write = cls.original_sys_stdout_write
        sys.stderr.write = cls.original_sys_stderr_write
