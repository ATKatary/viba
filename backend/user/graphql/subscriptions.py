import asyncio
from utils import report, ERROR, update_queues
from user.graphql.queues import users_queue, notifications_queue

FILE = "[user][subscriptions]"
class UserSubscriptions:
    async def watch(*_, id):
        queue = asyncio.Queue()
        if id in users_queue: 
            users_queue[id].append(queue)
        else: 
            users_queue[id] = [queue]
        report(f"{FILE}[watch_user] >> watching user {id}")
        try:
            while True:
                user = await queue.get()
                queue.task_done()
                yield user
        except asyncio.CancelledError:
            users_queue[id].pop()
            if len(users_queue[id]) == 0: del users_queue[id]
            report(f"{FILE}[watch_user] >> Error occured while watching user {id}", mode=ERROR, debug=True)

    async def resolve(message, info, id):
        return message

