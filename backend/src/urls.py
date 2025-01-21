"""
Viba URL Configuration
"""
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

prefix = 'api/viba/'
urlpatterns = [
    path(prefix + 'admin/', admin.site.urls),
    path(prefix + 'chat/', include('chat.urls')),
    path(prefix + 'user/', include('user.urls')),
    path(prefix + 'webpush/', include('webpush.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
