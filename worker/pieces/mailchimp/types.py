# types.py
from typing import Dict, Any, TypedDict, Optional

class MailchimpMergeFields(TypedDict, total=False):
    EMAIL: str
    FNAME: str
    LNAME: str
    INTERESTS: str
    # Add other potential merge fields

class MailchimpSubscribeData(TypedDict):
    id: str
    list_id: str
    email: str
    email_type: str
    ip_opt: str
    ip_signup: str
    merges: MailchimpMergeFields

class MailchimpSubscribeWebhookRequest(TypedDict):
    type: str
    fired_at: str
    data: MailchimpSubscribeData

class WebhookData(TypedDict):
    id: str
    listId: str