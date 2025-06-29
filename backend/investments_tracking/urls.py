from django.urls import path
from .views import InvestmentCreateView, UserInvestmentsListView, BusinessInvestmentsListView, BusinessInvestmentStatsView, recent_investments, investor_recent_investments, entrepreneur_investors

urlpatterns = [
    path('create/', InvestmentCreateView.as_view(), name='investment-create'),
    path('my-investments/', UserInvestmentsListView.as_view(), name='user-investments'),
    path('business/<int:business_id>/investments/', BusinessInvestmentsListView.as_view(), name='business-investments'),
    path('business/<int:business_id>/stats/', BusinessInvestmentStatsView.as_view(), name='business-investment-stats'),
    path('recent/', recent_investments, name='recent-investments'),
    path('investor-recent/', investor_recent_investments, name='investor-recent-investments'),
    path('entrepreneur-investors/', entrepreneur_investors, name='entrepreneur-investors'),
] 