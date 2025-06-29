# backend/notifications/urls.py
from django.urls import path
from .views import NotificationListView, ClearNotificationsView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('clear/', ClearNotificationsView.as_view(), name='clear-notifications'),
]