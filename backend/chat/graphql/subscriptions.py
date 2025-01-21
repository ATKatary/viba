import json
import asyncio
from chat.models import Chat 
from user.models import CustomUser
from asgiref.sync import sync_to_async
from user.graphql.queries import get_user
from user.graphql.queues import users_queue
from utils import report, ERROR, update_queues
from chat.graphql.queues import chats_queue, calls

FILE = "[chat][subscriptions]"
class ChatSubscriptions: 
    async def watch(*_, id, uid):
        report(f"{FILE}[watch_chat] >> user {uid} watching chat {id}")
        chat = await Chat.objects.aget(id=id)
        user = await CustomUser.objects.aget(id=uid)

        await chat.aread_all(user)
        await update_queues(users_queue, user.id, await get_user(id=user.id))
        
        queue = asyncio.Queue()
        if (id, uid) in chats_queue: 
            chats_queue[(id, uid)].append(queue)
        else:  
            chats_queue[(id, uid)] = [queue]
        try:
            while True:
                chat = await queue.get()
                queue.task_done()
                yield chat
        except asyncio.CancelledError:
            chats_queue[(id, uid)].pop()
            if len(chats_queue[(id, uid)]) == 0: del chats_queue[(id, uid)]
            report(f"{FILE}[watch_chat] >> Error occured while user {uid} watching chat {id}", mode=ERROR, debug=True)

    async def watch_call(*_, uid):
        report(f"{FILE}[watch_call] >> user {uid} watching for calls")
        queue = asyncio.Queue()
        
        calls[uid] = [queue]
        try:
            while True:
                json = await queue.get()
                queue.task_done()
                yield json
        except asyncio.CancelledError:
            calls[uid].pop()
            if len(calls[uid]) == 0: del calls[uid]
            report(f"{FILE}[watch_call] >> Error occured while user {uid} watching calls", mode=ERROR, debug=True)

    async def resolve_chat(message, info, id, uid):
        return message

    async def resolve_call(message, info, uid):
        return message