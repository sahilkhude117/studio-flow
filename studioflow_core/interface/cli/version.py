from studioflow_core.utils import packages as pkg_utils


def version() -> None:
    print(pkg_utils.get_local_package_version())
