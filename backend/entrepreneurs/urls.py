from django.urls import path
from .views import EntrepreneurProfileMetricsView, EntrepreneurProfileUpdateView

urlpatterns = [
    path('api/entrepreneur/metrics/', EntrepreneurProfileMetricsView.as_view(), name='entrepreneur-metrics'),
    path('api/entrepreneur/update/', EntrepreneurProfileUpdateView.as_view(), name='entrepreneur-update'),
] 