from django.urls import path
from . import views

urlpatterns = [
    path('', views.log_list, name='log_list'),
    path('<int:pk>/', views.log_detail, name='log_detail'),
    path('business/<int:business_id>/', views.business_logs, name='business_logs'),
    path('<int:log_id>/distribute-profit/', views.distribute_profit, name='distribute_profit'),
    path('profit-distributions/dashboard/', views.profit_distributions_dashboard, name='profit_distributions_dashboard'),
    path('recent/', views.recent_logs, name='recent_logs'),
    path('my-businesses/', views.my_businesses_logs, name='my_businesses_logs'),
    path('next-month-year/', views.next_month_year, name='next-month-year'),
    path('create/', views.create_log, name='create-log'),
] 