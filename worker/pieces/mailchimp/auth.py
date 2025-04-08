from django.conf import settings
from typing import Dict, Any


class MailchimpAuth:
    """Handles authentication for Mailchimp API"""

    AUTH_TYPE = 'oauth2'

    @classmethod
    def get_auth_config(cls) -> Dict[str, Any]:
        """Returns authentication configuration"""
        return {
            "type": cls.AUTH_TYPE,
            "required": True,
            "authUrl": "https://login.mailchimp.com/oauth2/authorize",
            "tokenUrl": "https://login.mailchimp.com/oauth2/token",
            "scope": [],
            "pkce": True,
            "clientId": settings.MAILCHIMP_CLIENT_ID,
            "clientSecret": settings.MAILCHIMP_CLIENT_SECRET,
        }
    
    @classmethod
    def get_access_token(cls, auth_data):
        """Extracts access token from auth data"""
        if not auth_data or "access_token" not in auth_data:
            raise ValueError("Missing access token")
        return auth_data["access_token"]