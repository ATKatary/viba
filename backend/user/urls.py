"""
User url patterns
"""
from . import views, consumers
from django.urls import path, re_path

urlpatterns = [
    path("upload_pfp", views.upload_pfp, name="upload_pfp"),
]

websocket_urlpatterns = [
    re_path(r'ws/viba/user/(?P<uid>\w+)$', consumers.UserConsumer.as_asgi(), name="user_consumer")
]