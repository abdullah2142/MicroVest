from django.urls import path
from .views import BusinessListView, BusinessDetailView, BusinessCreateView,BusinessDeleteView, InvestAPIView

urlpatterns = [
    path('businesses/', BusinessListView.as_view(), name='business-list'),
    path('businesses/<int:id>/', BusinessDetailView.as_view(), name='business-detail'),
    path('businesses/pitch/', BusinessCreateView.as_view(), name='business-pitch'),
    path('businesses/<int:id>/delete/', BusinessDeleteView.as_view(), name='business-delete'),
    path('invest/', InvestAPIView.as_view(), name='invest'),
]