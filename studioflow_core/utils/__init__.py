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