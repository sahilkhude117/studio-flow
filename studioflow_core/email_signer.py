import hashlib

import jwt

from studioflow_core.environment import EMAIL_JWT_AUDIENCE, PUBLIC_KEY
from studioflow_core.logger import StudioFlowLogger


def decode_email_jwt_header(jwt_header: str):
    try:
        if PUBLIC_KEY:
            return jwt.decode(
                jwt_header,
                key=PUBLIC_KEY,
                algorithms=["RS256"],
                audience=EMAIL_JWT_AUDIENCE,
            )
        return jwt.decode(
            jwt_header, options={"verify_signature": False}, audience=EMAIL_JWT_AUDIENCE
        )

    except jwt.ExpiredSignatureError:
        return None
    except Exception as e:
        StudioFlowLogger.capture_exception(e)
        return None
    

def verify_email(*, jwt_header: str, content: str) -> bool:
    calculated_hash = hashlib.sha256(content.encode()).hexdigest()

    data = decode_email_jwt_header(jwt_header)
    if not data:
        return False

    return calculated_hash == data.get("hash")


__all__ = ["verify_email"]

