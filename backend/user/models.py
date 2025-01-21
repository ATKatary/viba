"""
User models
"""
import uuid
from django.db import models
from asgiref.sync import sync_to_async
from user.managers import CustomUserManager
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

##### Global Constants #####
alphabet_size = 26

##### Classes #####
class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    AF(first_name, last_name, date_of_birth, email) = user first_name last_name born on date_of_birth reachable at email
    
    Represnetation Invariant
        - inherits from AbstractBaseUser

    Representation Exposure
        - inherits from AbstractBaseUser
        - access is allowed to all fields but they are all immutable
    """
    
    ##### Representation #####
    date_of_birth     = models.DateField()
    is_active         = models.BooleanField(default  = True)
    first_name        = models.CharField(max_length  = alphabet_size)
    last_name         = models.CharField(max_length  = 2*alphabet_size)
    email             = models.EmailField(max_length = 9*alphabet_size, unique = True)
    profile_pic       = models.ImageField(upload_to="profile_pics/", default="profile_pics/stock_1.png")
    
    is_superuser      = models.BooleanField(default  = False)
    is_admin          = models.BooleanField(default  = False)
    is_staff          = models.BooleanField(default  = False)
    verified          = models.BooleanField(default  = False)

    id                = models.CharField(primary_key = True, unique = True, max_length = 2*alphabet_size)
    
    USERNAME_FIELD    = 'email'
    REQUIRED_FIELDS   = ['id', 'first_name', 'last_name', 'date_of_birth']

    objects           = CustomUserManager()

    def has_permission(self, permission, obj = None) -> bool:
        """
        Checks if the user has the given permission on an obj
        
        Inputs
            :param permission: <str> referencing the functionailty in question
            :param obj: <object> with the permission
        
        Outputs
            :returns: <bool> True if has the given permission on the obj, False otherwise
        """
        raise NotImplementedError

    def json(self):
        pfp = ""
        if self.profile_pic: pfp = f"https://fabhous.com/{self.profile_pic.url}"

        return {
            "pfp": pfp,
            "id": self.id,
            "email": self.email,
            "date_of_birth": self.date_of_birth,
            "name": f"{self.first_name} {self.last_name}",
        }
    
    async def ajson(self):
        return await sync_to_async(self.json)()
    
    def __str__(self) -> str:
        """ Override AbstractBaseUser.__str__() """
        return f"{self.first_name} {self.last_name}: {self.id}"
