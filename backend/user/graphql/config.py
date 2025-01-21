from ariadne import load_schema_from_path
from user.graphql import mutations, queries, subscriptions
from src.graphql.types import query, mutation, subscription

type_defs = [
    load_schema_from_path("user/graphql/base.graphql")
]

# queries
query.set_field("user", queries.get_user)

# subscriptions
subscription.set_source("watchUser", subscriptions.UserSubscriptions.watch)
subscription.set_field("watchUser", subscriptions.UserSubscriptions.resolve)


