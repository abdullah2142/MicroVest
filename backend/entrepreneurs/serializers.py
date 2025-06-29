from rest_framework import serializers
from .models import EntrepreneurProfile

class EntrepreneurProfileMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntrepreneurProfile
        fields = [
            'total_businesses_created',
            'total_funding_raised',
            'total_investors',
            'total_profit_generated',
            'success_rate',
            'average_investment_size',
            'annual_revenue',
            'total_assets',
        ] 