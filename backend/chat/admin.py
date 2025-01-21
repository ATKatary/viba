"""
Chat admin
"""
from chat.models import *
from django.contrib import admin

admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(Reaction)
admin.site.register(Attachment)

