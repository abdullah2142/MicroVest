# investors/admin.py

from django.contrib import admin
from .models import Industry, InvestorProfile

# Register Industry model
admin.site.register(Industry)

# Admin configuration for InvestorProfile
@admin.register(InvestorProfile)
class InvestorProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'min_investment',       # Corrected field name
        'max_investment',       # Corrected field name
        'risk_tolerance',
        'accredited_investor_status',
        'get_investment_focus_names',
    )
    search_fields = ('user__username', 'user__email', 'bio')
    list_filter = (
        'risk_tolerance',
        'accredited_investor_status',
        'investment_focus',
    )
    # Corrected field name for filter_horizontal
    filter_horizontal = ('investment_focus',)

    fieldsets = (
        (None, {
            'fields': ('user', 'bio')
        }),
        ('Investment Details', {
            'fields': ('min_investment', 'max_investment', 'investment_focus', 'risk_tolerance', 'accredited_investor_status')
        }),
        ('Contact & Social', {
            'fields': ('website', 'linkedin_profile')
        }),
    )