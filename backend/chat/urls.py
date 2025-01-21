"""
Chat urls
"""
from . import views, consumers
from django.urls import path, re_path


urlpatterns = [
    path('send_push', views.send_push, name="send_push"),
    path("send_attachments", views.send_attachments, name="send_attachments"),
]

websocket_urlpatterns = [
    re_path(r'ws/viba/chat/(?P<uid>\w+)/(?P<cid>\w+)$', consumers.ChatConsumer.as_asgi(), name="chat_consumer")
]