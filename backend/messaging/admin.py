from django.contrib import admin
from .models import FriendRequest, Conversation, Message

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['from_user', 'to_user', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = ['from_user__username', 'to_user__username', 'from_user__email', 'to_user__email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'participants_display', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['participants__username', 'participants__email']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['participants']
    ordering = ['-updated_at']

    def participants_display(self, obj):
        return ', '.join([user.username for user in obj.participants.all()])
    participants_display.short_description = 'Participants'

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'conversation', 'content_preview', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at', 'conversation']
    search_fields = ['sender__username', 'sender__email', 'content', 'conversation__participants__username']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'
