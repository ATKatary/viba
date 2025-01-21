import uuid
from chat.models import *
from datetime import datetime
from rest_framework import status
from user.models import CustomUser
from asgiref.sync import sync_to_async
from utils import report, get_or_create, is_subset
from channels.generic.websocket import AsyncJsonWebsocketConsumer

FILE = "[chat][consumers]"

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        params =  self.scope['url_route']['kwargs']
        uid = params['uid']
        cid = params['cid']

        self.chat = await sync_to_async(get_or_create)(Chat, id=uuid.UUID(cid))
        self.user = await sync_to_async(get_or_create)(CustomUser, id=uid)
        
        if self.chat is not None and self.user is not None:
            report(f"{FILE}[ChatConsumer][connect] >> {self.user} has conntected to {self.chat}...")
            await sync_to_async(self.chat.read_all)(self.user)   
            await self.channel_layer.group_add(self.chat.id.hex, self.channel_name)

        else: return await self.disconnect()

        try: await self.accept()
        except: report(f"{FILE}[ChatConsumer][connect] >> Exception raised while connecting to chat")

    async def disconnect(self , close_code):
        report(f"{FILE}[ChatConsumer][disconnect] (close_code) >> {close_code}")
    
    async def receive_json(self, content):
        report(f"{FILE}[ChatConsumer][receive] >> {self.user} recieved {content}")
        if type(content) != dict:
            return report(f"{FILE}[ChatConsumer][receive] >> Recieved invalid text data")
        
        required_fields = ["uid", "text", "timeSent"]
        response_status = is_subset(required_fields, content.keys())

        if response_status == status.HTTP_200_OK:
            uid = content['uid']
            text = content['text']
            time_sent = datetime.fromisoformat(content['timeSent'])
            
            message = await Message.objects.acreate(chat=self.chat, sender=self.user, text=text, time_sent=time_sent)
            await message.asave()

            await message.reciepts.aadd(self.user)
    
            event = {
                "type": "notify", 
                "sender": {
                    "uid": uid,
                    "name": f"{self.user.first_name} {self.user.last_name}"
                },
                "text": text,
                "timeSent": content['timeSent'],
                "mid": message.id.hex,
                "cid": self.chat.id.hex
            }
            await self.notify_all_members(event)
            await self.notify_all_admins(event)
        else: 
            report(f"{FILE}[ChatConsumer][receive] >> Failed to log text.")

    async def notify_all_members(self, event):
        members = await sync_to_async(lambda: list(self.chat.members.all()))()
        # report(f"{FILE}[ChatConsumer][notify_all_members] (members) >> {members}")

        for member in members:
            await self.channel_layer.group_send(member.id, event)
    
    async def notify_all_admins(self, event):
        admins = await sync_to_async(lambda: list(self.chat.admins.all()))()
        # report(f"{FILE}[ChatConsumer][notify_all_admins] (admins) >> {admins}")

        for member in admins:
            await self.channel_layer.group_send(member.id, event)