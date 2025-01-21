"""
User admin 
"""
from user.models import *
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
        model = CustomUser
        ordering = ('email',)
        list_filter = ('email',)
        list_display = ('email',)
        search_fields = ('email',)
        fieldsets = (
        (None, {'fields': ('id', 'email', 'profile_pic', 'date_of_birth', 'first_name', 'last_name', 'is_active', 'is_superuser', 'is_admin', 'is_staff', 'verified')}),
        )
        add_fieldsets = (
                (None, {'fields': ('id', 'email', 'profile_pic', 'date_of_birth', 'first_name', 'last_name', 'is_active', 'is_superuser', 'is_admin', 'is_staff', 'verified')}),
        )