import base64
import random
import re
import socket
import sys
import typing as t 
from contextlib import closing
from uuid import uuid4

import jsonpath_ng as jp
import simplejson

def generate_n_digit_code(n: int) -> str:
    return str(random.randint(10 ** (n - 1), 10**n - 1))


def hash_string(value):
    import hashlib

    sha256_hash = hashlib.sha256()
    sha256_hash.update(value.encode("utf-8"))
    hashed_string = sha256_hash.hexdigest()

    return hashed_string


def get_local_user_id():
    import uuid

    id = str(uuid.getnode())

    return hash_string(id)

def serialize(obj, **kwargs):
    return simplejson.dumps(obj, ignore_nan=True, **kwargs)


def get_free_port(default_port: int) -> int:

    range_start = default_port
    range_end = default_port + 100

    for port in range(range_start, range_end):
        with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            port_is_available = sock.connect_ex(("localhost", port)) != 0
            if port_is_available:
                return port
    
    raise Exception(
        f"Could not find a free port in the range {range_start}-{range_end}"
    )


def get_local_python_version():
    return f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
