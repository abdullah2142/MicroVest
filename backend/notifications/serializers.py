from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    business_id = serializers.IntegerField(source='business.id', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'message', 'read', 'created_at', 'business', 'business_id']