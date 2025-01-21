import os
import json
from pathlib import Path
from datetime import datetime
from utils import report, ERROR
from user.models import CustomUser
from firebase_admin import credentials, initialize_app, firestore, auth

FILE = "[API][Firebase]"
BASE_DIR = Path(__file__).resolve().parent.parent.parent
cred = credentials.Certificate(f"{BASE_DIR}/.creds/firebase-creds.json")
app = initialize_app(cred)

db = firestore.client()

def create_user(email: str, password: str, date_of_birth: datetime):
    try:
        firebase_user = auth.create_user(email=email, password=password, date_of_birth=date_of_birth)
        django_user = CustomUser.objects.create(email=email, password=password, id=firebase_user.uid, date_of_birth=date_of_birth)
        django_user.save()
        return django_user
    except:
        return

def delete_user(uid: str):
    try:
        auth.delete_user(uid)
        CustomUser.objects.get(id=uid).delete()
        return True
    except Exception as error:
        return False
