from rest_framework import serializers
from decimal import Decimal
from .models import Log, ProfitDistribution

class ProfitDistributionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.SerializerMethodField()
    formatted_amount = serializers.CharField(read_only=True)
    
    class Meta:
        model = ProfitDistribution
        fields = [
            'id', 'user', 'user_name', 'user_full_name', 'amount_distributed', 
            'formatted_amount', 'distribution_percentage', 'distributed_at'
        ]
        read_only_fields = ['distributed_at']
    
    def get_user_full_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.username

class LogSerializer(serializers.ModelSerializer):
    business_title = serializers.CharField(source='business.title', read_only=True)
    entrepreneur_name = serializers.CharField(source='business.entrepreneur_name', read_only=True)
    formatted_profit_generated = serializers.CharField(read_only=True)
    formatted_profit_distributed = serializers.CharField(read_only=True)
    formatted_profit_retained = serializers.CharField(read_only=True)
    formatted_total_revenue = serializers.CharField(read_only=True)
    formatted_total_expense = serializers.CharField(read_only=True)
    profit_distributions = ProfitDistributionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Log
        fields = [
            'id', 'business', 'business_title', 'entrepreneur_name', 'title', 'content',
            'fund_usage', 'progress_update', 'achievements', 'challenges', 'next_steps',
            'financial_update',
            'month', 'year',
            'total_revenue', 'formatted_total_revenue',
            'total_expense', 'formatted_total_expense',
            'profit_generated', 'formatted_profit_generated',
            'profit_distributed', 'formatted_profit_distributed', 'profit_retained',
            'formatted_profit_retained', 'profit_distribution_date', 'profit_notes',
            'profit_distributions', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'profit_generated', 'formatted_profit_generated', 'formatted_total_revenue', 'formatted_total_expense']

class LogListSerializer(serializers.ModelSerializer):
    business_title = serializers.CharField(source='business.title', read_only=True)
    entrepreneur_name = serializers.CharField(source='business.entrepreneur_name', read_only=True)
    formatted_profit_generated = serializers.CharField(read_only=True)
    formatted_total_revenue = serializers.CharField(read_only=True)
    formatted_total_expense = serializers.CharField(read_only=True)
    
    class Meta:
        model = Log
        fields = [
            'id', 'business_title', 'entrepreneur_name', 'title', 'month', 'year',
            'total_revenue', 'formatted_total_revenue',
            'total_expense', 'formatted_total_expense',
            'profit_generated', 'formatted_profit_generated', 'created_at'
        ] 