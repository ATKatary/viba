from ariadne import load_schema_from_path
from chat.graphql import mutations, queries, subscriptions
from src.graphql.types import query, mutation, subscription

type_defs = [
    load_schema_from_path("chat/graphql/base.graphql")
]

# queries
query.set_field("chat", queries.ChatQueries.get)

# mutations
mutation.set_field("readChat", mutations.ChatMutations.read_all)
mutation.set_field("createChat", mutations.ChatMutations.create)
mutation.set_field("updateChat", mutations.ChatMutations.update)
mutation.set_field("broadcastChat", mutations.ChatMutations.broadcast)

mutation.set_field("sendMessage", mutations.ChatMutations.send_message)
mutation.set_field("editMessage", mutations.ChatMutations.edit_message)
mutation.set_field("reactMessage", mutations.ChatMutations.react_message)
mutation.set_field("deleteMessage", mutations.ChatMutations.delete_message)


# subscription watchers
subscription.set_source("watchChat", subscriptions.ChatSubscriptions.watch)
subscription.set_source("watchCall", subscriptions.ChatSubscriptions.watch_call)

# subscription resolvers
subscription.set_field("watchCall", subscriptions.ChatSubscriptions.resolve_call)
subscription.set_field("watchChat", subscriptions.ChatSubscriptions.resolve_chat)

