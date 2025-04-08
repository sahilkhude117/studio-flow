# common.py
import requests
from typing import Dict, Any

class MailchimpCommon:
    @staticmethod
    async def get_mailchimp_server_prefix(access_token: str) -> str:
        """Get the MailChimp server prefix for a user's account"""
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get("https://login.mailchimp.com/oauth2/metadata", headers=headers)
        if response.status_code != 200:
            raise Exception(f"Failed to get MailChimp metadata: {response.text}")
        
        data = response.json()
        dc = data.get("dc", "")
        if not dc:
            raise Exception("Failed to extract datacenter from MailChimp metadata")
        
        return dc
    
    @staticmethod
    async def get_lists(access_token: str, server: str) -> list:
        """Get all audience lists from MailChimp"""
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"https://{server}.api.mailchimp.com/3.0/lists", headers=headers)
        if response.status_code != 200:
            raise Exception(f"Failed to get MailChimp lists: {response.text}")
        
        return response.json().get("lists", [])
    
    @staticmethod
    async def enable_webhook_request(params: Dict[str, Any]) -> str:
        """Enable a webhook for a specific list"""
        headers = {
            "Authorization": f"Bearer {params['token']}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "url": params["webhookUrl"],
            "events": params["events"],
            "sources": {
                "user": True,
                "admin": True,
                "api": True
            }
        }
        
        response = requests.post(
            f"https://{params['server']}.api.mailchimp.com/3.0/lists/{params['listId']}/webhooks",
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            raise Exception(f"Failed to create MailChimp webhook: {response.text}")
        
        return response.json()["id"]
    
    @staticmethod
    async def disable_webhook_request(params: Dict[str, Any]) -> None:
        """Disable a webhook for a specific list"""
        headers = {
            "Authorization": f"Bearer {params['token']}",
            "Content-Type": "application/json"
        }
        
        response = requests.delete(
            f"https://{params['server']}.api.mailchimp.com/3.0/lists/{params['listId']}/webhooks/{params['webhookId']}",
            headers=headers
        )
        
        if response.status_code != 204:
            raise Exception(f"Failed to delete MailChimp webhook: {response.text}")