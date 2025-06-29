# investors/urls.py

from django.urls import path
# Assuming you will create an InvestorProfileView in investors/views.py
from .views import InvestorProfileView 

urlpatterns = [
    path('profile/', InvestorProfileView.as_view(), name='investor_profile'),
    # You might add other investor-specific URLs here later
]