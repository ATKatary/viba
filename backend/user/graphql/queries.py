import uuid
from utils import report
from user.models import *
from chat.models import Chat
from django.db.models import Q

FILE = "[users][queries]"
async def get_user(*_, id):
    report(f"{FILE}[get_user] >> fetching user: {id}")
    user = []
    
    user = await CustomUser.objects.aget(id=id)
    user_json = await user.ajson()
    
    chats = await sync_to_async(lambda: set(Chat.objects.filter(
        Q(admins__id=user.id) | 
        Q(members__id=user.id)
    )))()

    chats_json = []
    report(chats)

    for chat in chats:
        chat_json = await chat.ajson(user)
        chats_json.append(chat_json)
    
    return {
        **user_json,
        "chats": chats_json
    }

