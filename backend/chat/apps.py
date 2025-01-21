"""
Chat apps
"""
from django.apps import AppConfig

FILE = "[chat][apps]"
class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat'

    # def ready(self):
        # from chat.models import Attachment
        # for a in list(Attachment.objects.all()):
        #     a.delete()
        # TODO: here I can add stuff to do once add is ready
        
        