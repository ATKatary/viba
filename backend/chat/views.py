""" 
Chat views
"""
import os
import asyncio
from chat.models import *
from rest_framework import status
from django.shortcuts import render
from django.core.files.base import File
from webpush import send_user_notification
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.files.images import ImageFile
from chat.graphql.mutations import ChatMutations
from utils import is_subset, report, get_or_create
from django.views.decorators.csrf import csrf_exempt

FILE = "[chat][views]"
@api_view(['POST'])
def send_attachments(request, *args, **kwargs) -> Response:
    """
    Sends an attachment message to user

    :param request: <HttpRequest> containing 

    :return data: {id of the user and pfp to be uploaded}
    :return status:
    """
    data = {}
    required_fields = ["id", "uid", "text", "attachment_0"]

    response_status = is_subset(required_fields, request.data.keys())
    if response_status == status.HTTP_200_OK:
        id = request.data['id']
        uid = request.data['uid']
        text = request.data['text']
        
        chat = Chat.objects.get(id=id)
        user = CustomUser.objects.get(id=uid)

        message = Message.objects.create(chat=chat, sender=user, text=text)
        message.reciepts.add(user)
    
        i = 0
        while True:
            key = f'attachment_{i}'
            if key not in request.data: break

            data = request.data[key]
            ext = data.name.split(".")[-1]
            report(ext)
            file_path = f"{id}.{ext}"
            attachment = Attachment.objects.create(message=message)
            
            if ext in ["gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "avif", "webp"]:
                attachment.image.save(file_path, ImageFile(data))
            else:
                attachment.file.save(file_path, File(data))
            attachment.save()

            i += 1
        
        message.save()

    return Response(data=data, status = response_status)

@api_view(['POST'])
def send_push(request):
    data = {}
    required_fields = ["text", "uid"]

    response_status = is_subset(required_fields, request.data.keys())
    if response_status == status.HTTP_200_OK:
        uid = request.data['uid']
        user = CustomUser.objects.get(id=uid)

        send_user_notification(user=user, payload=request.data, ttl=1000)
    return Response(data=data, status=response_status)