import json
import os
import pathlib
import shutil

studioflowignore = (pathlib.Path(__file__).parent / "studioflowignore").read_text(
    encoding="utf-8"
)
gitignore = (pathlib.Path(__file__).parent / "gitignore").read_text(encoding="utf-8")
new_form_code = (pathlib.Path(__file__).parent / "new_form.py").read_text(
    encoding="utf-8"
)
new_hook_code = (pathlib.Path(__file__).parent / "new_hook.py").read_text(
    encoding="utf-8"
)
new_job_code = (pathlib.Path(__file__).parent / "new_job.py").read_text(
    encoding="utf-8"
)
new_script_code = (pathlib.Path(__file__).parent / "new_script.py").read_text(
    encoding="utf-8"
)
vscode_launch_json = json.load(
    (pathlib.Path(__file__).parent / "vscode_launch.json").open()
)
studioflow_logo = (pathlib.Path(__file__).parent / "studioflow_logo.png").read_bytes()
studioflow_favicon = (pathlib.Path(__file__).parent / "studioflow_favicon.ico").read_bytes()


def ensure_studioflowignore(dir: pathlib.Path):
    path = dir / ".studioflowignore"
    if not path.exists():
        path.write_text(studioflowignore, encoding="utf-8")


def ensure_gitignore(dir: pathlib.Path):
    path = dir / ".gitignore"
    if not path.exists():
        path.write_text(gitignore, encoding="utf-8")


def generate_getting_started_project(dir: pathlib.Path):
    source_dir = pathlib.Path(__file__).parent / "getting-started-project"

    for file_name in os.listdir(source_dir):
        source = os.path.join(source_dir, file_name)
        target = os.path.join(dir, file_name)
        if os.path.isdir(source):
            shutil.copytree(source, target)
        else:
            shutil.copy2(source, target)
