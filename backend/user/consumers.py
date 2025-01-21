import uuid
from chat.models import *
from datetime import datetime
from rest_framework import status
from user.models import CustomUser
from asgiref.sync import sync_to_async
from utils import report, get_or_create, is_subset
from channels.generic.websocket import AsyncJsonWebsocketConsumer

FILE = "[user][consumers]"

class UserConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        params =  self.scope['url_route']['kwargs']
        uid = params['uid'].replace("_", "-")
        self.user = await sync_to_async(get_or_create)(CustomUser, id=uid)
    
        if self.user is not None:
            report(f"{FILE}[UserConsumer][receive] >> {self.user} is conntected...")
            await self.channel_layer.group_add(self.user.id, self.channel_name)

        else: return await self.disconnect()

        try: await self.accept()
        except: report(f"{FILE}[UserConsumer][receive] >> Exception raised while connecting to chat")

    async def disconnect(self , close_code):
        report(f"{FILE}[UserConsumer][receive] (close_code) >> {close_code}")
    
    async def receive_json(self, content):
        report(f"{FILE}[UserConsumer][receive] >> {self.user} recieved {content}")
        if type(content) != dict:
            return report(f"{FILE}[UserConsumer][receive] >> Recieved invalid text data")
        
        required_fields = ["message", "uid", "chat"]
        response_status = is_subset(required_fields, content.keys())

        if response_status == status.HTTP_200_OK:
            uid = content['uid']
            chat = content['chat']
            message = content['message']
            
        else: 
            report(f"{FILE}[UserConsumer][receive] >> Failed to log text.")

    async def notify(self, event):
        required_fields = ["mid", "sender", "text", "timeSent"]
        response_status = is_subset(required_fields, event.keys())

        if response_status == status.HTTP_200_OK:
            uid = event['sender']['uid']
            mid = uuid.UUID(event['mid'])
            # if uid == self.user.id: return 

            message = await sync_to_async(get_or_create)(Message, id=mid)
            # await message.reciepts.aadd(self.user)

            report(f"{FILE}[UserConsumer][notify] >> Notifying {self.user} of {event}")
            await self.send_json(event)