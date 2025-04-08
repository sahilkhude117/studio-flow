# __init__.py
from .auth import MailchimpAuth
from .triggers.subscribe import MailchimpSubscribeTrigger

class MailchimpPiece:
    """MailChimp integration piece"""
    
    name = "mailchimp"
    display_name = "MailChimp"
    description = "Email marketing automation platform"
    logo_url = "https://cdn.example.com/logos/mailchimp.png"
    
    auth = MailchimpAuth
    
    triggers = [
        MailchimpSubscribeTrigger
    ]
    
    actions = []  # No actions implemented yet