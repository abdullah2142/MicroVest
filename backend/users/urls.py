# MicroVest/users/urls.py
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('profile/', views.profile, name='profile'),

    path('profile/edit/', views.edit_profile, name='edit_profile'),

    path('friend-requests/', views.friend_requests, name='friend_requests'),
    path('send-friend-request/<int:to_user_id>/', views.send_friend_request, name='send_friend_request'),
    path('accept-friend-request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('reject-friend-request/<int:request_id>/', views.reject_friend_request, name='reject_friend_request'),

     # --- Messaging URLs ---
    path('messages/', views.messages_list, name='messages_list'),
    path('messages/<int:friend_id>/', views.messaging_with_user, name='messaging_with'),
    path('send-message/<int:receiver_id>/', views.send_message, name='send_message'),
]