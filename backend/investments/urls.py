from django.urls import path
from .views import (
    BusinessListView, BusinessDetailView, BusinessCreateView, BusinessUpdateView, 
    BusinessDeleteView, UserBusinessListView, InvestAPIView, calendar_events, create_calendar_event
)

urlpatterns = [
    path('businesses/', BusinessListView.as_view(), name='business-list'),
    path('businesses/<int:id>/', BusinessDetailView.as_view(), name='business-detail'),
    path('businesses/create/', BusinessCreateView.as_view(), name='business-create'),
    path('businesses/pitch/', BusinessCreateView.as_view(), name='business-pitch'),
    path('businesses/<int:id>/update/', BusinessUpdateView.as_view(), name='business-update'),
    path('businesses/<int:id>/delete/', BusinessDeleteView.as_view(), name='business-delete'),
    path('my-businesses/', UserBusinessListView.as_view(), name='user-business-list'),
    path('invest/', InvestAPIView.as_view(), name='invest'),
    path('calendar/events/', calendar_events, name='calendar-events'),
    path('calendar/events/create/', create_calendar_event, name='create-calendar-event'),
]