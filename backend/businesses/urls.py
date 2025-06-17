# MicroVest/backend/businesses/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('browse/', views.browse_businesses, name='browse_businesses'),
    # You'll add more URLs here later, e.g., path('<int:pk>/', views.business_detail, name='business_detail'),
]