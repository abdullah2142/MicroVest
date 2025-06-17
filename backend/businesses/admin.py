from django.contrib import admin
from .models import Business

# Option 1: Simple Registration
# admin.site.register(Business)

# Option 2: Enhanced Registration with ModelAdmin (Recommended for better usability)
@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = (
        'business_name',
        'entrepreneur',
        'industry_category',
        'funding_goal',
        'current_funding',
        'business_status',
        'created_at',
    )
    list_filter = (
        'business_structure',
        'industry_category',
        'business_status',
        'country',
    )
    search_fields = (
        'business_name',
        'business_description',
        'address',
        'city',
        'country',
    )
    # Allows editing fields directly from the list display for some fields
    list_editable = (
        'funding_goal',
        'current_funding',
        'business_status',
    )
    raw_id_fields = ('entrepreneur',) # Improves FK widget for large user bases
    date_hierarchy = 'created_at' # Adds date drill-down navigation