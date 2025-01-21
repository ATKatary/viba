from user.models import *
from user.graphql.queues import users_queue
from utils import report, ERROR, update_queues

FILE = "[user][mutations]"
class UserMutations:
    pass 