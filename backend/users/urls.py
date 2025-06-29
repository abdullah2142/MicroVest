# blossomvest_backend/users/urls.py

from django.urls import path
from .views import UserRegisterView, UserLoginView, UserProfileUpdateView, UserProfilePictureUploadView, UserProfileView
from .views import AddFundView, DeleteAccountView, UserDetailView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'), 
    path('login/', UserLoginView.as_view(), name='login'),         
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile-update'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/upload-picture/', UserProfilePictureUploadView.as_view(), name='profile-picture-upload'),
    path('add_fund/', AddFundView.as_view(), name='add_fund'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
]