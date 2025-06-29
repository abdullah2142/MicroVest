# investors/serializers.py

from rest_framework import serializers
from .models import InvestorProfile, Industry
from users.models import CustomUser # Import CustomUser if needed for nested data

class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id', 'name']

class InvestorProfileSerializer(serializers.ModelSerializer):
    # These are properties on your InvestorProfile model
    total_investments_count = serializers.IntegerField(read_only=True)
    total_money_invested = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    investment_focus = IndustrySerializer(many=True, read_only=True) # Serialize the ManyToMany relationship

    class Meta:
        model = InvestorProfile
        fields = '__all__' # Or specify fields you want to expose, e.g., ['bio', 'investment_focus', 'min_investment', 'max_investment', 'total_investments_count', 'total_money_invested', ...]