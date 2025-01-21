import re
import json 
from datetime import datetime
from asgiref.sync import sync_to_async
from user.graphql.queries import get_user
from webpush import send_user_notification
from chat.models import Chat, Message, Reaction
from chat.graphql.queues import chats_queue, calls
from utils import report, ERROR, update_queues, to_snake_case

from user.models import CustomUser
from user.graphql.queues import users_queue

FILE = "[chat][mutations]"
class ChatMutations:
    async def create(*_, admin_uids, member_uids=[], title=None):
        chat = await Chat.objects.acreate()

        if title is not None: chat.title = title
        for uid in admin_uids: await chat.admins.aadd(uid)
        for uid in member_uids: await chat.members.aadd(uid)

        await chat.asave()
        return await chat.ajson() 

    async def update(*_, id, uid, title=None):
        chat = await Chat.objects.aget(id=id)
        user = await CustomUser.objects.aget(id=uid)

        chat_json = await chat.ajson(user)
        await update_queues(chats_queue, (id, uid), chat_json)
        return chat_json
        
    async def send_message(*_, id, uid, text):
        chat = await Chat.objects.aget(id=id)
        user = await CustomUser.objects.aget(id=uid)

        message = await Message.objects.acreate(chat=chat, sender=user, text=text)
        await message.reciepts.aadd(user)
        await message.asave()
    
        await ChatMutations.notify_all(id, text)
    
    async def react_message(*_, id, uid, reaction):
        message = await Message.objects.aget(id=id)
        user = await CustomUser.objects.aget(id=uid)

        reaction = await Reaction.objects.acreate(message=message, user=user, emoji=reaction)
        await reaction.asave()
    
        await ChatMutations.notify_all(await sync_to_async(lambda: message.chat.id.hex)(), f"{user.first_name} reacted with \"{reaction}\"")

    async def edit_message(*_, id, text):
        message = await Message.objects.aget(id=id)

        message.text = text
        await message.asave()
    
        await ChatMutations.notify_all(await sync_to_async(lambda: message.chat.id.hex)(), text)
    
    async def delete_message(*_, id):
        message = await Message.objects.aget(id=id)
        await message.adelete()
    
        await ChatMutations.notify_all(await sync_to_async(lambda: message.chat.id.hex)(),)
    
    async def read_all(*_, id, uid):
        chat = await Chat.objects.aget(id=id)
        user = await CustomUser.objects.aget(id=uid)

        unread = await (await chat.aget_unread(user)).acount()
        if unread > 0:
            await chat.aread_all(user)
            await ChatMutations.notify_all(id)

    async def notify_all(id: str, text: str = None):
        chat = await Chat.objects.aget(id=id)
        chat_admins = await sync_to_async(lambda: list(chat.admins.all()))()
        chat_members = await sync_to_async(lambda: list(chat.members.all()))()

        for user in [*chat_admins, *chat_members]:
            if (id, user.id) in chats_queue:
                await ChatMutations.update(id=id, uid=user.id)
            elif text:
                await sync_to_async(send_user_notification)(
                    user=user, 
                    payload={
                        "cid": id, 
                        "uid": user.id, 
                        "title": await chat.aget_title(user),
                        "text": text
                    }, 
                    ttl=1000
                )
            await update_queues(users_queue, user.id, await get_user(id=user.id))

    async def broadcast(*_, id, uid, message):
        if uid not in calls: return

        chat = await Chat.objects.aget(id=id)
        chat_admins = await sync_to_async(lambda: list(chat.admins.all()))()
        chat_members = await sync_to_async(lambda: list(chat.members.all()))()

        for user in [*chat_admins, *chat_members]:
            if user.id == uid: continue
            await update_queues(calls, user.id, {"cid": id, "uid": uid, "data": message})
    
            