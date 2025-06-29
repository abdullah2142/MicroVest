# blossomvest_backend/users/urls.py

from django.urls import path
from .views import UserRegisterView, UserLoginView, UserProfileUpdateView, UserProfilePictureUploadView, UserProfileView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'), 
    path('login/', UserLoginView.as_view(), name='login'),         
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/upload-picture/', UserProfilePictureUploadView.as_view(), name='profile-picture-upload'),
]