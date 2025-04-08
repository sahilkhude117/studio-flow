from typing import Dict, Any, List, Optional
from ..auth import MailchimpAuth
from ..common import MailchimpCommon
from ..types import MailchimpSubscribeWebhookRequest, WebhookData

WEBHOOK_DATA_STORE_KEY = 'mail_chimp_webhook_data'

class MailchimpSubscribeTrigger:
    """Trigger for when a member subscribes to a Mailchimp audiece"""

    name = 'subscribe'
    display_name = 'Member Subscribed to Audience'
    description = 'Runs when an Audience subscriber is added.'
    trigger_type = 'webhook'

    @classmethod
    def get_props_definition(cls) -> Dict[str, Any]:
        """Define properties required for this trigger"""
        return {
            "list_id": {
                "type": "dropdown",
                "displayName": "Audience",
                "required": True,
                "refreshers": [],
                "options": {
                    "async": True,
                    "function": cls.get_lists_options
                }
            }
        }
    

    @staticmethod
    async def get_lists_options(auth: Dict[str, Any]) -> List[Dict[str, str]]:
        """Get MailChimp audience lists for dropdown"""
        access_token = MailchimpAuth.get_access_token(auth)
        server = await MailchimpCommon.get_mailchimp_server_prefix(access_token)
        
        lists = await MailchimpCommon.get_lists(access_token, server)
        return [{"label": lst["name"], "value": lst["id"]} for lst in lists]
    
    @staticmethod
    async def on_enable(context: Dict[str, Any]) -> None:
        """Called when trigger is enabled"""
        access_token = MailchimpAuth.get_access_token(context.get("auth"))
        
        server = await MailchimpCommon.get_mailchimp_server_prefix(access_token)
        
        list_id = context.get("props", {}).get("list_id")
        webhook_url = context.get("webhookUrl")
        
        if not list_id or not webhook_url:
            raise ValueError("Missing list_id or webhook_url")
        
        webhook_id = await MailchimpCommon.enable_webhook_request({
            "server": server,
            "listId": list_id,
            "token": access_token,
            "webhookUrl": webhook_url,
            "events": {"subscribe": True}
        })
        
        # Store webhook data for later use
        store = context.get("store")
        if store:
            await store.put(WEBHOOK_DATA_STORE_KEY, {
                "id": webhook_id,
                "listId": list_id
            })

    @staticmethod
    async def on_disable(context: Dict[str, Any]) -> None:
        """Called when trigger is disabled"""
        store = context.get("store")
        if not store:
            return
            
        webhook_data = await store.get(WEBHOOK_DATA_STORE_KEY)
        if not webhook_data:
            return
            
        access_token = MailchimpAuth.get_access_token(context.get("auth"))
        server = await MailchimpCommon.get_mailchimp_server_prefix(access_token)
        
        await MailchimpCommon.disable_webhook_request({
            "server": server,
            "token": access_token,
            "listId": webhook_data["listId"],
            "webhookId": webhook_data["id"]
        })

    @staticmethod
    async def run(context: Dict[str, Any]) -> List[Any]:
        """Process incoming webhook data"""
        request = context.get("payload", {}).get("body")
        
        if not request:
            return []
            
        return [request]
    
    @staticmethod
    def get_sample_data() -> Dict[str, Any]:
        """Return sample data for the UI"""
        return {
            "type": "subscribe",
            "fired_at": "2009-03-26 21:35:57",
            "data": {
                "id": "8a25ff1d98",
                "list_id": "a6b5da1054",
                "email": "api@mailchimp.com",
                "email_type": "html",
                "ip_opt": "10.20.10.30",
                "ip_signup": "10.20.10.30",
                "merges": {
                    "EMAIL": "api@mailchimp.com",
                    "FNAME": "Mailchimp",
                    "LNAME": "API",
                    "INTERESTS": "Group1,Group2"
                }
            }
        }
