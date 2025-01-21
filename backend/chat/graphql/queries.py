import uuid
from utils import report
from chat.models import *
from asgiref.sync import sync_to_async

FILE = "[chat][queries]"
class ChatQueries:
    async def get(*_, id, uid):
        user = await CustomUser.objects.aget(id=uid)
        chat_json = await (await Chat.objects.aget(id=id)).ajson(user)
        
        return chat_json
    
