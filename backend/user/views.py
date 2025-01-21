"""
user views
"""
import os
from user.models import CustomUser
from rest_framework import status
from utils import is_subset, report
from django.http import HttpResponse
from rest_framework.response import Response
from django.core.files.images import ImageFile
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

FILE = "[user][views]"
@api_view(['POST'])
def upload_pfp(request, *args, **kwargs) -> Response:
    """
    Uploads a user's pfp

    :param request: <HttpRequest> containing 

    :return data: {id of the user and pfp to be uploaded}
    :return status:
    """
    data = {}
    required_fields = ["id", "pfp"]

    response_status = is_subset(required_fields, request.data.keys())
    if response_status == status.HTTP_200_OK:
        pass
        id =  request.data['id']
        pfp =  request.data['pfp']
        
        ext = pfp.name.split(".")[-1]

        pfp_path = f"{id}_pfp.{ext}"
        if os.path.isfile(pfp_path): os.remove(pfp_path)
        user = CustomUser.objects.get(id=id)

        user.profile_pic.save(pfp_path, ImageFile(pfp))
        user.save()

    return Response(data=data, status = response_status)