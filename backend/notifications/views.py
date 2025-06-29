# backend/notifications/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.views import APIView

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.all()

    def post(self, request, *args, **kwargs):
        # Mark all unread notifications as read
        self.get_queryset().filter(read=False).update(read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)

class ClearNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Mark all notifications as read
        request.user.notifications.all().update(read=True)
        return Response({"message": "All notifications marked as read."}, status=status.HTTP_200_OK)

    def delete(self, request):
        # Delete all notifications
        request.user.notifications.all().delete()
        return Response({"message": "All notifications deleted."}, status=status.HTTP_200_OK)