from django.contrib import admin
from .models import EntrepreneurProfile

@admin.register(EntrepreneurProfile)
class EntrepreneurProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'company_name', 'industry', 'total_businesses_created', 
        'total_funding_raised', 'total_investors', 'is_verified', 'created_at'
    ]
    list_filter = [
        'is_verified', 'industry', 'years_of_experience', 'created_at'
    ]
    search_fields = [
        'user__username', 'user__first_name', 'user__last_name', 
        'user__email', 'company_name', 'industry'
    ]
    readonly_fields = [
        'created_at', 'updated_at', 'total_businesses_created', 
        'total_funding_raised', 'total_investors', 'total_profit_generated'
    ]
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'phone_number', 'date_of_birth', 'profile_picture')
        }),
        ('Business Information', {
            'fields': ('company_name', 'business_website', 'industry', 'years_of_experience')
        }),
        ('Financial Information', {
            'fields': ('annual_revenue', 'total_assets', 'credit_score')
        }),
        ('Business Metrics', {
            'fields': ('total_businesses_created', 'total_funding_raised', 'total_investors', 'total_profit_generated')
        }),
        ('Performance Metrics', {
            'fields': ('success_rate', 'average_investment_size')
        }),
        ('Verification', {
            'fields': ('is_verified', 'verification_date')
        }),
        ('Social Media', {
            'fields': ('linkedin_profile', 'twitter_handle')
        }),
        ('Preferences', {
            'fields': ('preferred_investment_range', 'preferred_industries')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
