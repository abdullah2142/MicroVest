# MicroVest/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, FriendRequest, Message

class CustomUserAdmin(UserAdmin):
    # This remains the same: defines what columns appear in the list view
    list_display = (
        'username', 'email', 'name', 'phone_number', 'user_type',
        'is_staff', 'is_active',
    )

    # --- EDIT THIS SECTION FOR THE 'CHANGE USER' FORM (editing existing users) ---
    fieldsets = (
        # Default AbstractUser fields:
        (None, {'fields': ('username', 'password')}),
        ('Personal information', {'fields': ('first_name', 'last_name', 'email')}),
        # Your custom fields in a new group:
        ('Custom User Information', {'fields': (
            'name',          # full name field
            'dob',
            'phone_number',
            'user_type',
            'address',
            'designation',
            'id_document_url',
        )}),
        # Default AbstractUser fields related to permissions and dates:
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # --- EDIT THIS SECTION FOR THE 'ADD USER' FORM (creating new users) ---
    # This is slightly different because it usually doesn't show last_login or date_joined
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password', 'password2'), # password and password2 are required for new users
        }),
        ('Personal Info', {'fields': (
            'name',
            'dob',
            'phone_number',
            'user_type',
            'address',
            'designation',
            'id_document_url',
        )}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # Optional: filters on the right sidebar for list view
    list_filter = UserAdmin.list_filter + ('user_type',)

    # Optional: fields for searching
    search_fields = ('username', 'email', 'name', 'phone_number')

    # Optional: order of users in the list view
    ordering = ('email',)


# Register your CustomUser model with your CustomUserAdmin class
admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'status', 'timestamp')
    list_filter = ('status',)
    search_fields = ('from_user__username', 'to_user__username')
    raw_id_fields = ('from_user', 'to_user')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'timestamp', 'is_read')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('sender__username', 'receiver__username', 'content')
    raw_id_fields = ('sender', 'receiver') # Useful for selecting users easily
    readonly_fields = ('timestamp',) # Timestamp is auto_now_add