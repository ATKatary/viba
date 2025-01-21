"""
Chat models
"""
import json
import uuid
from django.db import models
from django.utils import timezone
from user.models import CustomUser
from asgiref.sync import sync_to_async

alphabet_len = 26
class Chat(models.Model):
    title = models.CharField(max_length=1000, blank=True)
    admins = models.ManyToManyField(CustomUser, related_name="admins")
    members = models.ManyToManyField(CustomUser, related_name="member")
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def read_all(self, user: CustomUser) -> None:
        for message in Message.objects.filter(chat=self):
            message.read(user)
    
    async def aread_all(self, user: CustomUser):
        return await sync_to_async(self.read_all)(user)
    
    def get_unread(self, user: CustomUser | None) -> 'models.QuerySet[Message]': 
        if user is None: return 0
        return Message.objects.filter(chat=self).exclude(reciepts__id=user.id)

    async def aget_unread(self, user: CustomUser | None):
        return await sync_to_async(self.get_unread)(user)

    def get_title(self, user = None):
        title = self.title
        if not title:
            title = ""
            for i, admin in enumerate(self.admins.all()):
                if admin == user: continue
                if i > 0: title += ", "
                title += f"{admin.first_name} {admin.last_name}"
            if title != "" and i > 1: title += ", "

            for i, member in enumerate(self.members.all()):
                if member == user: continue
                if i > 0: title += ", "
                title += f"{member.first_name} {member.last_name}"

        return title 
    
    def aget_title(self, user = None):
        return sync_to_async(self.get_title)(user)
    
    def json(self, user = None) -> json:
        unread_count = 0
        if user is not None:
            unread_count = self.get_unread(user).count()
        
        return {
            "title": self.get_title(user),
            "id": self.id.hex, 
            "unread_count": unread_count,

            "admins": [admin.json() for admin in list(self.admins.all())],
            "members": [member.json() for member in list(self.members.all())],

            "messages": [message.json() for message in Message.objects.filter(chat=self)]
        }
    
    async def ajson(self, user=None):
        return await sync_to_async(self.json)(user)
 
class Message(models.Model):
    text = models.CharField(max_length=1000)
    time_sent = models.DateTimeField(default=timezone.now)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    reciepts = models.ManyToManyField(CustomUser, related_name="reciept")
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sender", null=True, blank=True)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # reactions 

    def read(self, user: CustomUser):
        self.reciepts.add(user)
    
    def json(self) -> json:
        return {
           "id": self.id.hex,
           "sender": self.sender.json(),

           "text": self.text,
           "time_sent": self.time_sent,
           "reactions":[reaction.json() for reaction in Reaction.objects.filter(message=self)],
           "attachments": [attachment.json() for attachment in Attachment.objects.filter(message=self)]
        #    "status": 
        }

    async def ajson(self):
        return await sync_to_async(self.json)()

class Reaction(models.Model):
    emoji = models.CharField(max_length=1000)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def json(self) -> json:
        return {
            "id": self.id.hex,
            "emoji": self.emoji,
            "user": self.user.json(),
        }
    
    async def ajson(self):
        return await sync_to_async(self.json)()
 
class Attachment(models.Model):
    image = models.ImageField(upload_to="attachments/images/", null=True)
    file = models.FileField(upload_to="attachments/files/", null=True)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name="message")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def json(self) -> json:
        image_url = None 
        if self.image:
            image_url = f"https://fabhous.com{self.image.url}"

        file_url = None 
        if self.file:
            file_url = f"https://fabhous.com{self.file.url}"

        return {
           "id": self.id.hex,
           "image_url": image_url,
           "file_url": file_url
        }

    async def ajson(self):
        return await sync_to_async(self.json)()
